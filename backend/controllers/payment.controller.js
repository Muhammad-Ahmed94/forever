import { stripe } from "../lib/stripe.js";
import couponModel from "../model/coupon.model.js";
import orderModel from "../model/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    console.log(`Creating checkout session - Coupon Code: ${couponCode}`);

    // check if we get products array from frontend checkout session req
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid or products array does not exist" });
    }

    /* 
    1- Maps product array to create stripe friendly line-items
    2- Converts product-price to cents
    3- Calculate total amount
    */
    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // dollar => cent for stripe
      totalAmount += amount * product.quantity; // total amount in cents

      return {
        // return stripe friendly line-items
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity,
      };
    });

    let coupon = null;
    /* 
    1- Check if user has valid coupon
    2- If coupon-valid, apply coupon discount
    */
    if (couponCode) {
      coupon = await couponModel.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (!coupon) {
        return res
          .status(400)
          .json({ message: "Invalid or expired coupon code." });
      }
    }

    // environment URL
    const getClientUrl = () => {
      if (process.env.NODE_ENV === "production") {
        return process.env.CLIENT_URL || "https://forever-frontend-je1a.onrender.com/";
      } else {
        // For development, use localhost
        return "http://localhost:5173";
      }
    };

    const clientUrl = getClientUrl();
    /* 
    1- create stripe payment session
    2- if coupon exists, then apply the coupon discounts
    3- Metadata for record keeping
    */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${clientUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discount) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
      // reduce analytics req
      expand: ["payment_intent"],
    });

    console.log(`Checkout session created: ${session.id}`);
    console.log(`Success URL: ${session.success_url}`);

    if (totalAmount >= 20000) {
      // if order exceeds $200, reward user with new coupon gift
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error(
      "Could not complete the order payment. Checkout session failed",
      error.message,
    );
    res.status(500).json({ message: "Server Error. Payment failed." });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      console.log("ERROR: No session ID provided");
      return res.status(400).json({ message: "Session ID is required" });
    }

    // First check if an order with this sessionId already exists
    const existingOrder = await orderModel.findOne({
      stripeSessionId: sessionId,
    });
    
    if (existingOrder) {
      console.log("Order already exists for this session:", existingOrder._id);
      return res.status(200).json({
        success: true,
        message: "Order was already processed",
        orderId: existingOrder._id,
      });
    }

    // Retrieve session from Stripe
    console.log("Retrieving session from Stripe...");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("Stripe session payment status:", session.payment_status);
    console.log("Stripe session metadata:", session.metadata);

    if (session.payment_status !== "paid") {
      console.log("ERROR: Payment not completed, status:", session.payment_status);
      return res.status(400).json({
        message: "Payment not completed yet. Please proceed to pay first.",
      });
    }

    // Use a transaction to ensure atomicity
    const mongoose = await import('mongoose');
    const sessionObj = await mongoose.default.startSession();
    
    try {
      let newOrderId = null;
      
      await sessionObj.withTransaction(async () => {
        // Double-check if order exists within the transaction
        const orderExists = await orderModel.findOne({
          stripeSessionId: sessionId,
        }).session(sessionObj);
        
        if (orderExists) {
          throw new Error("ORDER_ALREADY_EXISTS");
        }

        // Deactivate coupon if used
        if (session.metadata.couponCode) {
          console.log("Deactivating coupon:", session.metadata.couponCode);
          await couponModel.findOneAndUpdate(
            {
              code: session.metadata.couponCode,
              userId: session.metadata.userId,
            },
            { isActive: false },
            { session: sessionObj }
          );
        }

        // Create order record
        const products = JSON.parse(session.metadata.products);
        
        const newOrder = new orderModel({
          user: session.metadata.userId,
          products: products.map((p) => ({
            product: p.id,
            quantity: p.quantity,
            price: p.price,
          })),
          totalAmount: session.amount_total / 100,
          stripeSessionId: sessionId,
        });

        const savedOrder = await newOrder.save({ session: sessionObj });
        newOrderId = savedOrder._id;
        console.log("Order created successfully:", newOrderId);
      });

      // Create reward coupon if applicable (outside transaction)
      if (session.amount_total / 100 >= 200) {
        try {
          const newCoupon = await createNewCoupon(session.metadata.userId);
        } catch (couponError) {
          console.error("Failed to create reward coupon:", couponError.message);
          // Don't fail the order if coupon creation fails
        }
      }

      console.log("=== CHECKOUT SUCCESS COMPLETED ===");
      res.status(200).json({
        success: true,
        message: "Payment successful, order created and coupon deactivated if used",
        orderId: newOrderId,
      });

    } catch (transactionError) {
      if (transactionError.message === "ORDER_ALREADY_EXISTS") {
        const existingOrder = await orderModel.findOne({
          stripeSessionId: sessionId,
        });
        return res.status(200).json({
          success: true,
          message: "Order was already processed",
          orderId: existingOrder._id,
        });
      }
      throw transactionError;
    } finally {
      await sessionObj.endSession();
    }

  } catch (error) {
    console.error("=== CHECKOUT SUCCESS ERROR ===");
    console.error("Error processing successful checkout:", error);
    
    // duplicate key error
    if (error.code === 11000 && error.keyPattern?.stripeSessionId) {
      console.log("Duplicate session ID detected, checking existing order");
      try {
        const existingOrder = await orderModel.findOne({
          stripeSessionId: req.body.sessionId,
        });
        if (existingOrder) {
          return res.status(200).json({
            success: true,
            message: "Order was already processed",
            orderId: existingOrder._id,
          });
        }
      } catch (findError) {
        console.error("Error finding existing order:", findError.message);
      }
    }
    
    res.status(500).json({ message: "Error processing successful checkout" });
  }
};

async function createStripeCoupon(discount) {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discount,
      duration: "once",
    });
    return coupon.id;
  } catch (error) {
    console.error("Stripe coupon creation failed", error.message);
    throw new Error("Stripe coupon creation failed");
  }
}

// Create reward coupon function
async function createNewCoupon(userId) {
  try {
    await couponModel.findOneAndDelete({ userId });

    const newCoupon = new couponModel({
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      discount: 10, // 10% dis
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days from now
      userId: userId,
      isActive: true,
    });
    const savedCoupon = await newCoupon.save();

    return savedCoupon;
  } catch (error) {
    console.error("Error creating reward coupon", error.message);
    // Return null instead of letting the error propagate
    return null;
  }
}