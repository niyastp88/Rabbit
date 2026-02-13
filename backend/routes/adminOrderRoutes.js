const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/adminOrderController");

const router = express.Router();

// Get all order (Admin only)

router.get("/", protect, admin, getAllOrders);

// Update order status

router.put("/:id", protect, admin, updateOrderStatus);

// Delete an order

router.delete("/:id", protect, admin,deleteOrder);

module.exports = router;
