const express = require("express");
const Order = require("../models/Order");
const { protect,admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private

router.get("/my-orders", protect, async (req, res) => {
  try {
    // Find orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    }); // sort by most recent orders
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/orders/returns
// @desc Get all return requests
// @access Admin

router.get("/returns", protect,admin, async (req, res) => {
  try {
    // optional: admin middleware later add cheyyam
    const orders = await Order.find({
      "orderItems.returnRequested": true,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// @route POST /api/orders/:orderId/return
// @desc Request return for a product
// @access Private

router.post("/:orderId/return", protect, async (req, res) => {
  const { productId, reason, comment } = req.body;
  const allowedReasons = [
  "Damaged",
  "Wrong Size",
  "Wrong Product",
  "Quality Issue",
  "Other",
];

if (!allowedReasons.includes(reason)) {
  return res.status(400).json({ message: "Invalid return reason" });
}


  if (!productId || !reason) {
    return res.status(400).json({ message: "Product and reason required" });
  }

  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Only owner can return
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Delivered check
    if (order.status !== "Delivered" || !order.deliveredAt) {
      return res
        .status(400)
        .json({ message: "Order not delivered yet" });
    }

    // ⏱️ 7 day rule
    const diffDays =
      (Date.now() - new Date(order.deliveredAt)) /
      (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      return res
        .status(400)
        .json({ message: "Return window expired" });
    }

    const item = order.orderItems.find(
  (i) => i.productId.toString() === productId.toString()
);


    if (!item) {
      return res.status(404).json({ message: "Product not in order" });
    }

    if (item.returnRequested) {
      return res
        .status(400)
        .json({ message: "Return already requested" });
    }

    // ✅ Mark return
    item.returnRequested = true;
    item.returnReason = reason;
    item.returnComment = comment || "";
    item.returnRequestedAt = new Date();

    await order.save();

    res.json({ message: "Return request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/orders/:orderId/return/:productId
// @desc Approve or reject return
// @access Admin

router.put("/:orderId/return/:productId", protect, admin, async (req, res) => {
  const { action } = req.body; // approved | rejected

  if (!["approved", "rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid return action" });
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const item = order.orderItems.find(
    (i) => i.productId.toString() === req.params.productId
  );

  if (!item || !item.returnRequested) {
    return res.status(400).json({ message: "No return request" });
  }

  if (item.returnStatus !== "pending") {
    return res.status(400).json({ message: "Return already processed" });
  }

  item.returnStatus = action;
  await order.save();

  res.json({ message: `Return ${action}` });
});


// @route GET /api/orders/:id
// @route Get order details by ID
// @access Private

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the full order details
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});





module.exports = router;
