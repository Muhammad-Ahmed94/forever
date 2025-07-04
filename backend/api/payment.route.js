import express from "express";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";
import { protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", checkoutSuccess);

export default router;
