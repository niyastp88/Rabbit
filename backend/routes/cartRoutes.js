const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartByUser,
  mergeGuestCart,
} = require("../controller/cartController");

const router = express.Router();

// Add a product to the cart for a guest or logged in user

router.post("/", addToCart);

// Update product quantity in the cart for a guest or logged-in user

router.put("/", updateCartItem);

// Remove a product from the cart

router.delete("/", removeFromCart);

//  Get logged-in user's or guest users's cart

router.get("/", getCartByUser);

//Merge guest cart into user cart on login

router.post("/merge", protect, mergeGuestCart);

module.exports = router;
