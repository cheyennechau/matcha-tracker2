import express from "express";
import { 
  loginUser, 
  registerUser, 
  getUser,
  refreshToken,
  logoutUser,
} from "../controllers/authController.js";
import { verifyPasswordHashing } from "../utils/passwordVerification.js";
import { authMiddleware, refreshTokenMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware for log-out auth
const logoutAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token provided." });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

// Auth routes
router.post("/register", verifyPasswordHashing, registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUser);
router.post("/refresh", refreshTokenMiddleware, refreshToken);

// Use logout-specific middleware for logout route
router.post("/logout", logoutAuthMiddleware, logoutUser);

// Debug log for registered routes
router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`Route: ${r.route.path}`);
  }
});

export default router;
