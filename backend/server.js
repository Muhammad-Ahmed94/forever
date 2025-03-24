import express from "express";
import dotenv from "dotenv";
import authRoutes from "./api/auth.route.js";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from './api/product.route.js'

dotenv.config();

// * Port
const PORT = process.env.PORT || 5000;

const app = express();

// Middle-ware
app.use(express.json());
app.use(cookieParser());

//* Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  connectDB();
});
