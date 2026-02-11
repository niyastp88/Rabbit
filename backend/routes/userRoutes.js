const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Register a new user
router.post("/register", registerUser);

// Authenticate user
router.post("/login", loginUser);

//  Get logged-in user's profile (Protected Route)
router.get("/profile", protect, getUserProfile);

module.exports = router;
