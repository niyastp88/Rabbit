const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const razorpay = require("../utils/razorpay");
const crypto = require("crypto");

const router = express.Router();


// @route POST /api/checkout
// @desc Create a new checkout session
// @access Private

router.post("/", protect, async (req, res) => {
  const { checkoutItems, shippingAddress, paymentMethod, totalPrice } =
    req.body;
  if (!checkoutItems) {
    return res.status(400).json({ message: "no items in checkout" });
  }
  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
    });

    console.log(`checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("Error Creating checkout session", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc update checkout to mark as after successful payment
// @access Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (paymentStatus === "paid") {
      (checkout.isPaid = true),
        (checkout.paymentStatus = paymentStatus),
        (checkout.paymentDetails = paymentDetails),
        (checkout.paidAt = Date.now()),
        await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid Payment Status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout, create order, reduce stock
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);
    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    // 🔒 Already finalized guard
    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    // 🔒 Payment not completed
    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    /* ================================
       1️⃣ STOCK VALIDATION & REDUCTION
    ================================= */
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} left.`,
        });
      }
    }

    // 🔥 Second loop → actual stock update
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);

      product.countInStock -= item.quantity;
      await product.save();
    }

    /* ================================
       2️⃣ CREATE FINAL ORDER
    ================================= */
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
    });

    /* ================================
       3️⃣ FINALIZE CHECKOUT
    ================================= */
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    /* ================================
       4️⃣ CLEAR USER CART
    ================================= */
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Finalize error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// inside checkoutRoutes.js (below create checkout route)



router.post("/:id/razorpay", protect, async (req, res) => {
  const checkout = await Checkout.findById(req.params.id);
  if (!checkout) {
    return res.status(404).json({ message: "Checkout not found" });
  }

  const options = {
    amount: checkout.totalPrice * 100, // ₹ → paise
    currency: "INR",
    receipt: `checkout_${checkout._id}`,
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

router.post("/:id/verify", protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // 🔥 REUSE EXISTING PAY LOGIC
  req.body = {
    paymentStatus: "paid",
    paymentDetails: req.body,
  };

  // call existing pay route logic
  const checkout = await Checkout.findById(req.params.id);
  checkout.isPaid = true;
  checkout.paymentStatus = "paid";
  checkout.paymentDetails = req.body;
  checkout.paidAt = Date.now();
  await checkout.save();

  res.json(checkout);
});



module.exports = router;
