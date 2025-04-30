import express from "express";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";
import { protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);
router.post("/validateCoupon", protectRoute, validateCoupon);

export default router;
