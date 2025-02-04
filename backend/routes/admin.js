import express from "express";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Admin dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // Add admin dashboard logic here (get all users' data, total purchases, etc)
    res.json({
      message: "Admin dashboard data",
      // Add data as needed
    });
  } catch (error) {
    console.error("Admin dashboard error:", error); // Debugging, log admin dashboard error
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
