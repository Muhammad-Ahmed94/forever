import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import connectDB from "./lib/db.js";

import authRoutes from "./api/auth.route.js";
import cartRoutes from "./api/cart.route.js";
import couponRoute from "./api/coupon.route.js";
import paymentRoute from "./api/payment.route.js";
import productRoutes from "./api/product.route.js";

dotenv.config();

// * Port
const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middle-ware
app.use(compression());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());

//* Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoute);
app.use("/api/payment", paymentRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
