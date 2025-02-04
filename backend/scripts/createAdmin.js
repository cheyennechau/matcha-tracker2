import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists! Deleting and recreating...");
      await User.deleteOne({ email: "admin@example.com" });
    }

    // Create new admin user - let the model's pre-save hook handle password hashing
    const adminUser = new User({
      email: "admin@example.com",
      password: "adminpassword", // This will be hashed by the pre-save hook
      role: "admin"
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("Email: admin@example.com");
    console.log("Password: adminpassword");

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  })
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });