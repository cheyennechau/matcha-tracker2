import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // Adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const adminUser = await User.findOne({ email: "admin@example.com" });

    if (!adminUser) {
      console.log("❌ No admin user found.");
    } else {
      console.log("✅ Admin user found:", adminUser);
    }

    mongoose.connection.close();
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
