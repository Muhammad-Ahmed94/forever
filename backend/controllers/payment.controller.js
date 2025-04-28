import { stripe } from "../lib/stripe.js";
import couponModel from "../model/coupon.model.js";
import orderModel from "../model/order.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    console.log(`Coupon Code: ${couponCode}`);

    // check if we get products array from frontend checkout session req
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or products array does not exist" });
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
      console.log(`Total Amount: ${totalAmount}`);

      return { // return stripe friendly line-items
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity
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
        return res.status(400).json({ message: "Invalid or expired coupon code." });
      }
    }

    /* 
    1- create stripe payment session
    2- if coupon exists, then apply the coupon discounts
    3- Metadata for record keeping
    */
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel/`,
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
          }))
        ),
      },
      // reduce analytics req
      expand: ['payment_intent']
    });

    if (totalAmount >= 20000) { // if order exceeds $200, reward user with new coupon gift
      await createNewCoupon(req.user._id);
    }
    console.log("Created Stripe session:", session.id);
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

  } catch (error) {
    console.error("Could not complete the order payment. Checkout session failed", error.message);
    res.status(500).json({ message: "Server Error. Payment failed." });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
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
    };

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      res
        .status(400)
        .json({
          message: "Payment not completed yet. Please proceed to pay first.",
        });
    }

    if (session.payment_status === "paid") {
      // off the coupon if used already
      if (session.metadata.couponCode) {
        await couponModel.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }

      // create order record
      const products = JSON.parse(session.metadata.products);
      console.log("About to create order with sessionId:", sessionId);
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

        await newOrder.save();
      
      console.log("order created successfully:", newOrder);

      // New reward coupon if total amount exceed min threshhold of $200
      if (session.amount_total / 100 >= 200) {
        const newCoupon = await createNewCoupon(session.metadata.userId);
        console.log("New reward coupon created:", newCoupon);
      }

      res.status(200).json({
        success: true,
        message:
          "Payment successful, order created and coupon deactivated if used",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.error("Error processing successful checkout", error.message);
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
    return res.status(500).json({ message: "Stripe coupon creation failed." });
  }
}

// Create reward coupon -- fixed function
async function createNewCoupon(userId) {  
  try {
  await couponModel.findOneAndDelete({ userId });

    const newCoupon = new couponModel({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discount: 10, // 10% dis
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days from now
        userId: userId,
        isActive: true
    });
    const savedCoupon = await newCoupon.save();
    console.log(`Reward coupon generated for user:${userId}`, savedCoupon);

    return savedCoupon;
  } catch (error) {
    console.error("Error creating reward coupon", error.message);
    // Return null instead of letting the error propagate
    return null;
  }
}
