const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getAllProductsAdmin } = require("../controller/productAdminController");

const router = express.Router();
// @desc Get all products (Admin only)

router.get("/", protect, admin, getAllProductsAdmin);

module.exports = router;
