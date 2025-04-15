import express from "express";
import {
  getProfile,
  login,
  logout,
  refreshAccessToken,
  signup,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/product.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/profile", protectRoute, getProfile)

export default router;
