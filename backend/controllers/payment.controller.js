export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or products arrya does not exist" });
    }

    let totalAmount = 0;

    const lineItems = products.map(product => {
        const amount = product.price * 100; // to convert dollar to cent for stripe format
        totalAmount += amount * product.quantity;

        
    })
  } catch (error) {
    console.error(
      "Could not complete the order payment. Checkout session failed",
      error.message
    );
    res.status(500).json({ message: "Server Error. Payment failed." });
  }
};
