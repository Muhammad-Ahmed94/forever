import { redis } from "../lib/redis.js";
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

export const featuredProduct = async (req, res) => {
  try {
    /* CODE LOGIC
    - first get from redis
    - fetch from MongoDB, if not exist in redis
    - if not exist in both environments
    - write it in redis under the key of "featured_product"
    */
    const product = await redis.get("featured_product");
    if (product) {
      return res.json(JSON.parse(product));
    } else {
      const featuredProduct = await productModel.find({ isFeatured: true }).lean();
      if (!featuredProduct.length) {
        return res.status(400).json({ message: "No featured product found" });
      } else {
        await redis.set("featured_product", JSON.stringify(featuredProduct));
      }
      return res.json(featuredProduct);
    }
  } catch (error) {
    console.log(`error getting featured products`);
    res.status(400).json({ message: "Error fetching products" });
  }
};
