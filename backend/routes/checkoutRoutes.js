const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  createCheckout,
  markCheckoutPaid,
  finalizeCheckout,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controller/checkoutController");

const router = express.Router();

// Create a new checkout session

router.post("/", protect, createCheckout);

//update checkout to mark as after successful payment
router.put("/:id/pay", protect, markCheckoutPaid);

// Finalize checkout, create order, reduce stock
router.post("/:id/finalize", protect, finalizeCheckout);

// Create Razorpay Order

router.post("/:id/razorpay", protect, createRazorpayOrder);

// Verify Razorpay Payment

router.post("/:id/verify", protect, verifyRazorpayPayment);

module.exports = router;
