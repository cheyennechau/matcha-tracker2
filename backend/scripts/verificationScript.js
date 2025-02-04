import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const verifyUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get all users
    const users = await User.find({}, '-password'); // Exclude password field
    
    console.log("\n📊 Current Users in Database:");
    users.forEach(user => {
      console.log(`
🔹 User Details:
  ID: ${user._id}
  Email: ${user.email}
  Role: ${user.role}
  Created: ${user.createdAt}
      `);
    });

    console.log(`\n📈 Total Users: ${users.length}`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("📡 Database connection closed");
  }
};

verifyUsers().catch(console.error);
