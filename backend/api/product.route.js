import express from "express";
import {
  featuredProduct,
  getProducts,
  createProduct,
  deleteProduct,
  recommendedProducts
} from "../controllers/products.controller.js";
import { adminRoute, protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getProducts); // Protect, admin only, get all products with admin previliges
router.get("/featured", featuredProduct);
router.get("/recommended-product", recommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
