import productModel from "../model/product.model.js";

export const getAllCartProducts = async (req, res) => {
  try {
    const products = await productModel.find({
      _id: { $in: req.user.cartItems },
    });

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.error("error getting products", error.message);
    res.sendStatus(500);
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existing = user.cartItems.find((item) => item.id === productId); // Check

    if (existing) {
      // true then on adding to cart increment quantity by 1
      existing.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("error adding product to cart", error.message);
    res.sendStatus(500);
  }
};

export const deleteCartProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter(item => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.error("error deleting product from cart", error.message);
    res.sendStatus(500);
  }
};

export const updateCartProductQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existing = user.cartItems.find((item) => item.id === productId);

    if (existing) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existing.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("error updateing the product quantity", error.message);
    res.sendStatus(500);
  }
};
