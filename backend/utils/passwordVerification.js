import bcrypt from "bcryptjs";

// Utility to verify if a string is a valid bcrypt hash
export const isBcryptHash = (str) => {
  // BCrypt hashes always:
  // 1. Are 60 characters long
  // 2. Start with $2a$, $2b$ or $2y$ (version identifier)
  // 3. Have 22 characters of salt
  // 4. Have 31 characters of hash
  return /^\$2[aby]\$\d{2}\$[A-Za-z0-9./]{53}$/.test(str);
};

// Middleware to verify password hashing in registration
export const verifyPasswordHashing = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    // Generate a test hash
    const testHash = await bcrypt.hash(password, 10);
    
    console.log({
      originalPassword: password,
      generatedHash: testHash,
      isValidBcryptHash: isBcryptHash(testHash)
    });
    
    next();
  } catch (error) {
    console.error("Password verification error:", error);
    next(error);
  }
};

// Utility to check existing user passwords in database
export const verifyExistingPasswords = async (User) => {
  try {
    const users = await User.find({}, 'email password');
    
    const results = users.map(user => ({
      email: user.email,
      isValidHash: isBcryptHash(user.password),
      hashStart: user.password.substring(0, 7) // Show hash version
    }));
    
    console.log("Password Hash Verification Results:", results);
    
    return results;
  } catch (error) {
    console.error("Error verifying passwords:", error);
    throw error;
  }
};
