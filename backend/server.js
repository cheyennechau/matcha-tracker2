import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js"; // Authentication routes
import purchaseRoutes from "./routes/purchases.js"; // Purchase routes
import adminRoutes from "./routes/admin.js"; // Admin routes
import { authMiddleware } from "./middleware/auth.js"; // Ensure correct path
import { verifyExistingPasswords } from "./utils/passwordVerification.js"; // Utility for password hashing validation
import User from "./models/User.js";  // User model

dotenv.config(); // Load environment vars from .env

const app = express();
app.use(cors()); // Enable CORS, allow cross-origin requests
app.use(express.json()); // Enable JSON parsing for incoming requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas"); // Debugging

    return verifyExistingPasswords(User); // Verify existing password in db
  })
  // .then(results => {

  //   // Debugging for passwords
  //   const invalidPasswords = results.filter(r => !r.isValidHash);
  //   if (invalidPasswords.length > 0) {
  //     console.error("Found invalid password hashes:", invalidPasswords);
  //   } else {
  //     console.log("All existing passwords are valid bcrypt hashes");
  //   }
  // })
  .catch((err) => console.error("MongoDB Connection Error:", err));




// Authentication routes (public)
app.use("/api/auth", authRoutes);

// Debug, log registered routes
// console.log("\nRegistered Routes:");
// app._router.stack.forEach(middleware => {
//   if (middleware.route) {
//     // Routes registered directly on app
//     console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
//   } else if (middleware.name === 'router') {
//     // Router inside a router
//     middleware.handle.stack.forEach(handler => {
//       if (handler.route) {
//         console.log(`${Object.keys(handler.route.methods)} ${middleware.regexp} ${handler.route.path}`);
//       }
//     });
//   }
// });

// Protect API routes (require authentication)
app.use("/api/purchases", authMiddleware, purchaseRoutes);

// Example; Protected route (requires auth)
// app.get("/api/protected-route", authMiddleware, (req, res) => {
//   res.json({ message: "You have accessed a protected route!", user: req.user });
// });

// Backend status route (public)
app.get("/", (req, res) => {
  res.send("Backend is working!"); // debugging, confirms backend status
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Debugging, show active server port

// API test route (public)
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" }); // debugging, confirms API status
});

// Logout route (clears token)
app.post("/api/logout", (req, res) => {
  res.clearCookie("token"); // Clear authentication token
  res.status(200).json({ message: "Logged out successfully" });
});

// Admin routes (required admin role)
app.use("/api/admin", adminRoutes);
