const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
  googleAuth,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Register a new user
router.post("/register", registerUser);

router.post("/verify-otp", verifyEmailOTP);


// Authenticate user
router.post("/login", loginUser);

//  Get logged-in user's profile (Protected Route)
router.get("/profile", protect, getUserProfile);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/google", googleAuth);



module.exports = router;
