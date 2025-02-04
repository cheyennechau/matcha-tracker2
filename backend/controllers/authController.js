import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Purchase from "../models/Purchase.js";


// Function to generate access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


// Register user
export const registerUser = async (req, res) => {
    try {
      const { email, password, role = "user" } = req.body;
  
      console.log("Registration attempt for email:", email);
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists:", email);
        return res.status(400).json({ error: "User already exists" });
      }
  
      // Create new user
      const newUser = new User({
        email,
        password, // Will be hashed by pre-save hook
        role,
      });
  
      await newUser.save();
      
      // Verify the user was saved by fetching it again
      const savedUser = await User.findOne({ email });
      console.log("User saved successfully:", {
        id: savedUser._id,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      });
  
      res.status(201).json({ 
        message: "User registered successfully!", 
        userId: newUser._id 
      });
  
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };




// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate both tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token to user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      message: "Login successful!", 
      accessToken,
      refreshToken,
      userId: user._id 
    });

  } catch (error) {
    console.error("\nERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.headers.authorization?.split(' ')[1];
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }

    // Verify refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
    
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

// Fetch authenticated user details
export const getUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. No user ID found." });
    }

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dynamically recalculate totalSpent
    const purchases = await Purchase.find({ user: req.user.id }); // ✅ Changed from userId
    const calculatedTotalSpent = purchases.reduce((sum, p) => sum + p.price, 0);

    if (user.totalSpent !== calculatedTotalSpent) {
      user.totalSpent = calculatedTotalSpent;
      await user.save();
    }

    res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      totalSpent: user.totalSpent || 0,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  console.log("\nLOGOUT DEBUG START -------------------");
  try {
    console.log("Request user:", req.user);
    console.log("Headers:", req.headers);

    if (!req.user?.id) {
      console.log("No user ID found in request");
      return res.status(401).json({ error: "No authenticated user found" });
    }

    // Log user before update
    const userBefore = await User.findById(req.user.id);
    console.log("📝 User before update:", {
      id: userBefore?._id,
      email: userBefore?.email,
      hasRefreshToken: !!userBefore?.refreshToken
    });

    // Perform update with modified query
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { refreshToken: null } },
      { new: true }
    ).lean(); // Use lean() to get plain JavaScript object

    console.log("Updated user:", {
      id: updatedUser?._id,
      email: updatedUser?.email,
      hasRefreshToken: !!updatedUser?.refreshToken
    });

    // Verify update with separate query
    const verifyUser = await User.findById(req.user.id);
    console.log("Verification query result:", {
      id: verifyUser?._id,
      email: verifyUser?.email,
      hasRefreshToken: !!verifyUser?.refreshToken
    });

    res.json({ 
      message: "Logged out successfully",
      success: !verifyUser?.refreshToken
    });

  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ error: "Logout failed" });
  }
  console.log("🔍 LOGOUT DEBUG END -------------------\n");
};
