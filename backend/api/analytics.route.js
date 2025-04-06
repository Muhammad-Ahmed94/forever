import express from 'express';
import { adminRoute, protectRoute } from '../middleware/product.middleware.js';
import { salesAnalytics } from '../controllers/salesAnalytics.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, salesAnalytics)

export default router;