import { stripe } from "../lib/stripe";
import couponModel from "../model/coupon.model";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    console.log(`Products: ${products} \n Coupon Code: ${couponCode}`);

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
      },
    });

    if (totalAmount >= 20000) { // if order exceeds $200, reward user with new coupon gift
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });

  } catch (error) {
    console.error("Could not complete the order payment. Checkout session failed", error.message);
    res.status(500).json({ message: "Server Error. Payment failed." });
  }
};

export const checkoutSuccess = async (req, res) => {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if(session.payment_status === "paid") {

        if(session.metadata.couponCode) {
            await couponModel.findOneAndUpdate({
                code: session.metadata.couponCode,
                userId: session.metadata.userId
            }, {
                isActive: false
            })
        }
    }
}

async function createStripeCoupon(discount) {
  try {
    const coupon = await stripe.coupons.create({
      percent_off: discount,
      duration: "once",
    });
    return coupon.id;
  } catch (error) {
    console.error("Stripe coupon creation failed", error.message);
  }
}

// Create reward coupon
async function createNewCoupon(userId) {
  try {
    const newCoupon = new couponModel({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discount: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        userId: userId,
    });
    await newCoupon.save();
    console.log(`Reward coupon generated for user:${userId}`);
    return newCoupon
  } catch (error) {
    console.error("Error creating reward coupon", error.message);
  }
}
