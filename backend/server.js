import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import authRoutes from "./api/auth.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./api/product.route.js";
import cartRoutes from "./api/cart.route.js";
import couponRoute from './api/coupon.route.js';
import paymentRoute from './api/payment.route.js';
import analyticRoutes from './api/analytics.route.js';

dotenv.config();

// * Port
const PORT = process.env.PORT || 5000;

const app = express();

// Middle-ware
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoute)
app.use("/api/payment", paymentRoute);
app.use("/analytics", analyticRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
