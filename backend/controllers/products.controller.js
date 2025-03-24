import productModel from "../model/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find(); // get all products
    console.log(`products: ${products}`);
    res.json({ products });
  } catch (error) {
    console.error(`Error fetching products`, error.message);
    res.status(400).json({ message: "Error fetching products" });
  }
};

