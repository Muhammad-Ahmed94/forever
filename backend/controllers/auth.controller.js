import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import userModel from "../model/user.model.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: "15m", // Increased from 5m to 15m
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESHTOKEN_SECRET, {
    expiresIn: "7d", // Increased from 10m to 7 days
  });

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  await redis.set(`refresh_Token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days in seconds
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: "strict", // Fixed: was "true", should be "strict"
    secure: process.env.NODE_ENV === "production",
  });
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userFound = await userModel.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: "user already exists" }); // check if user exist
    }

    const user = await userModel.create({ name, email, password }); // create user, when no user found

    // Auth
    const { accessToken, refreshToken } = generateTokens(user._id);

    // save refresh token to redis
    await saveRefreshToken(user._id, refreshToken);

    // create token-cookies
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "user created successfully",
    });
  } catch (error) {
    console.error(`signup error`, error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password require to login" });

    const user = await userModel.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await saveRefreshToken(user._id, refreshToken);

      setCookies(res, accessToken, refreshToken);

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "user logged in successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(`Login error:`, error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
      await redis.del(`refresh_Token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "logout success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Internal server error`, error: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: "no refresh token found" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESHTOKEN_SECRET);
    const storedToken = await redis.get(`refresh_Token:${decoded.userId}`);

    if (storedToken !== refreshToken)
      return res.status(401).json({ message: "refresh token compromised" });
    
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESSTOKEN_SECRET,
      { expiresIn: "15m" }, // Updated to match new duration
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "access token refresh successfully" });
  } catch (error) {
    console.log(`error refreshing accesstoken:`, error.message);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Get logged in user
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};