import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESSTOKEN_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESHTOKEN_SECRET, {
    expiresIn: "5m",
  });

  return { accessToken, refreshToken };
};

const saveRefreshToken = async (userId, refreshToken) => {
  console.log("Saving to Redis...");
  await redis.set(`refreshToken:${userId}`, refreshToken, "EX", 5 * 60);
  console.log(`saved to redis`);
};

const setCookies = async (res, accesssToken, refreshToken) => {
  res.cookie("accessToken", accesssToken, {
    httpOnly: true,
    maxAge: 60 * 1000,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  console.log(`res cookie sent`);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    sameSite: true,
    secure: process.env.NODE_ENV === "production",
  });
  console.log(`refresh cookie sent`);
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!email)
    return res.status(400).json({ message: "Enter details to signup" });

  try {
    const userFound = await userModel.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: "user already exists" }); // check if user exist

    const user = await userModel.create({ name, email, password }); // create user, when no user found

    // Auth
    const { accessToken, refreshToken } = generateTokens(user._id);
    console.log(`accessTKN: ${accessToken}\nrefreshTKN: ${refreshToken}`);

    // save refresh token to redis
    await saveRefreshToken(user._id, refreshToken);

    // create token-cookies
    await setCookies(res, accessToken, refreshToken);

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
  res.send("login route");
};

export const logout = async (req, res) => {
  res.send("logout route");
};
