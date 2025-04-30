import express from "express";
import {
  addToCart,
  deleteCartProduct,
  getAllCartProducts,
  updateCartProductQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, deleteCartProduct);
router.put("/:id", protectRoute, updateCartProductQuantity);

export default router;
