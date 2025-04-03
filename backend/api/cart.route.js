import express from "express";
import { addToCart, deleteCartProduct, getAllCartProducts, updateCartProductQuantity } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", getAllCartProducts);
router.post("/", addToCart);
router.delete("/", deleteCartProduct);
router.put("/:id", updateCartProductQuantity);

export default router;