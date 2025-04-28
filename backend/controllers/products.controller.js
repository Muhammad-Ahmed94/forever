import { redis } from "../lib/redis.js";
import productModel from "../model/product.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find(); // get all products
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
    }

    const featuredProduct = await productModel
      .find({ isFeatured: true })
      .lean();
    if (!featuredProduct.length) {
      return res.status(400).json({ message: "No featured product found" });
    }

    await redis.set("featured_product", JSON.stringify(featuredProduct));

    return res.json(featuredProduct);
  } catch (error) {
    console.log(`error getting featured products`);
    res.status(400).json({ message: "Error fetching products" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, isFeatured } = req.body;

    let cloudinaryResponse = null;

    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "product_images" });
      // store to "product_image" folder in cloudinary
    }

    const product = await productModel.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
      isFeatured,
    });
    console.log(`Product created successfully`);
    return res.status(201).json(product);
  } catch (error) {
    console.error(`Error creating the product`, error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productById = await productModel.findById(req.params.id);

    if (!productById) {
      return res.status(400).json({ message: "Product not found" });
    }

    if (productById.image) {
      const publicId = productById.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`/products/${publicId}`);
        /* if above not work try then simply write (publicId) in parenthesis */
      } catch (error) {
        console.error(`error deleting the image from cloudinary`, error.message);
      }
    }
    // now delete from DB
    await productModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    console.error(`Error deleting the Product`, error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const recommendedProducts = async (req, res) => {
  try {
    const products = await productModel.aggregate(
      [
        { $sample: { size: 3 }},
        { $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        }}
      ]
    );
    return res.json(products);
  } catch (error) {
    console.error(`Could not load recommended products`);
    res.status(500).json({ message: "Could not load recommended products" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const products = await productModel.find({ category });
    res.json({ products });
  } catch (error) {
    console.error(`Error getting products by category`, error.message);
    res.status(500).json({ message: `server error `, error: error.message })
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if(product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'product not found' });
    }
  } catch (error) {
    console.error(`error in toggle featured product controller`, error.message);
    res.sendStatus(500);
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await productModel.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts))
  } catch (error) {
    console.error(`error in update cache function`);
  }
}