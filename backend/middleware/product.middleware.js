import jwt, { decode } from "jsonwebtoken";
import userModel from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    console.log(`Access token: ${accessToken}`);
    if (!accessToken)
      return res.status(401).json({ message: "Unauthorized - Access denied" });

    // Verify token
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET);
      console.log(`token verified: ${decoded}`);

      const user = await userModel.findById(decoded.userId).select("-password");
      console.log(`user: ${user.name}`);
      if(!user) return res.status(401).json({ message: "Unauthorized" });

      req.user = user;
    } catch (error) {
      if (error.name === "TokenExpiredError")
        return res.status(401).json({ message: "Token expired" });
    }

    next();
  } catch (error) {
    console.error(`Unauthorized - Access denied`);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const adminRoute = (req, res, next) => {
    if(req.user && req.user.role === 'admin') {
        console.log(`user role: ${req.user.role}`);
        next();
    } else {
        res.status(403).json({ message: "Access denied - Admin only" });
    }
}
