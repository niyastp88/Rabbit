const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/adminController");

const router = express.Router();

//Get all users (Admin only)

router.get("/", protect, admin, getAllUsers);

// Add a new user(admin only)
router.post("/", protect, admin, createUser);

// Updae user info(admin only)
router.put("/:id", protect, admin, updateUser);

// Delete a user
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
