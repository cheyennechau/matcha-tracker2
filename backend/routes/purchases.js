// import mongoose from "mongoose";
import express from "express";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create a new purchase and update user's totalSpent
router.post("/", authMiddleware, async (req, res) => {
  const { location, drink, price, date, rating } = req.body;
  const user = req.user.id;

  // Validate request body
  if (!location || !drink || !price || !date || rating == null) {
    return res.status(400).json({ error: "All fields (including rating) are required" });
  }

  try {
    console.log("📝 Creating purchase for user:", user);

    // Create new purchase
    const newPurchase = new Purchase({
      user,
      location,
      drink,
      price,
      date,
      rating
    });

    await newPurchase.save();

    // Log user's totalSpent before update
    const beforeUpdate = await User.findById(user);
    console.log("💰 Before Update - totalSpent:", beforeUpdate.totalSpent);

    // Update user's totalSpent, increment by purchase price
    const updatedUser = await User.findByIdAndUpdate(
      user,
      { $inc: { totalSpent: price } },
      { new: true } // Return updated user
    );

    console.log("After Update - totalSpent:", updatedUser.totalSpent);

    res.status(201).json(newPurchase);
  } catch (error) {
    console.error("Error in /api/purchases:", error);  // Log full error details
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


// Get all purchases for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("🕵️ Fetching purchases for user:", req.user.id, " Type:", typeof req.user.id); // DEBUG

    // const user = mongoose.Types.ObjectId.createFromHexString(req.user.id); 

    // Find all purchases associated with user
    const purchases = await Purchase.find({ user: req.user.id });

    console.log("Purchases found:", purchases); // DEBUG

    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a purchase
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const purchase = await Purchase.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!purchase) {
      return res.status(404).json({ error: "Purchase not found" });
    }

    // Decrease user's totalSpent, decrement by deleted purchase price
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { totalSpent: -purchase.price } },
      { new: true }
    );

    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
