import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js"; // Ensure correct path

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    const user = await User.findOne({ email: "admin@example.com" });
    if (!user) {
      console.log("❌ Admin user not found");
      return mongoose.connection.close();
    }

    console.log("✅ Found admin user:", user);

    console.log("🔹 Raw Password Input:", `"${"adminpassword"}"`);
    console.log("🔹 Hashed Password from DB:", `"${user.password}"`);


    const isMatch = await bcrypt.compare("adminpassword", user.password);
    console.log("🔹 Passwords match?", isMatch);

    mongoose.connection.close();
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));
