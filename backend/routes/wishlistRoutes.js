const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  toggleWishlist,
  getWishlist,
} = require("../controller/wishlistController");

const router = express.Router();

// Toggle product in wishlist

router.post("/", protect, toggleWishlist);

// Get logged in user's wishlist

router.get("/", protect, getWishlist);

// Remove product from wishlist

router.delete("/:productId", protect);

module.exports = router;
