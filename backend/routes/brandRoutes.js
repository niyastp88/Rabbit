const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createBrand,
  getBrands,
  deleteBrand,
} = require("../controller/brandController");

const router = express.Router();

// @desc Create new Brand

router.post("/", protect, admin, createBrand);

// @desc Get all Brands

router.get("/", getBrands);

// Delete a Brand by ID

router.delete("/:id", protect, admin, deleteBrand);

module.exports = router;
