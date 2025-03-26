import express from "express";
import {
  featuredProduct,
  getProducts,
  createProduct,
  deleteProduct,
  recommendedProducts,
  getProductsByCategory,
  toggleFeaturedProduct
} from "../controllers/products.controller.js";
import { adminRoute, protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getProducts); // Protect, admin only, get all products with admin previliges
router.get("/featured", featuredProduct);
router.get("/category/:category", getProductsByCategory);
router.get("/recommended-product", recommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
