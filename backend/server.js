import express from "express";
import dotenv from "dotenv";
import authRoutes from "./api/auth.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./api/product.route.js";
import cartRoutes from "./api/cart.route.js";
import couponRoute from './api/coupon.route.js';

dotenv.config();

// * Port
const PORT = process.env.PORT || 5000;

const app = express();

// Middle-ware
app.use(express.json());
app.use(cookieParser());

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
