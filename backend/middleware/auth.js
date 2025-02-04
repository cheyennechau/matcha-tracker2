import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Main authentication middleware (for access tokens)
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    // If refreshToken is null, the user is logged out and should not be able to access protected routes
    if (!user || !user.refreshToken) {
      return res.status(401).json({ message: "Unauthorized. Please log in again." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Middleware for verifying refresh tokens
export const refreshTokenMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Refresh token required." });
    }

    // Verify with refresh token secret
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Refresh Token Verification Error:", err);
    return res.status(401).json({ error: "Invalid refresh token." });
  }
};

// Middleware for Admin-Only Routes
export const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied. Admins only." });
  }
  next();
};
