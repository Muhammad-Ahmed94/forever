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
app.use(
  cors({
    origin: [
    "http://localhost:5173", 
    "https://localhost:4173",
    process.env.CLIENT_URL,
    /\.onrender\.com$/,
    /\.netlify\.app$/,
    // Add your actual frontend URLs
    "https://forever-frontend-je1a.onrender.com", // render frontend URL
  ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ["Set-Cookie"],
  optionsSuccessStatus: 200
  }),
);

// preflight reqs
app.options("*", cors());

app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Forever Backend',
    environment: process.env.NODE_ENV,
    port: PORT
  });
});

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  connectDB();
});
