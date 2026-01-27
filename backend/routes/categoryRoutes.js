const express = require("express");
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();


// @route POST /api/categories
// @desc Create new category
// @access Private/Admin

router.post("/", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);

    // duplicate key safety
    if (error.code === 11000) {
      return res.status(400).json({ message: "Category already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/categories
// @desc Get all categories
// @access Public

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route DELETE /api/categories/:id
// @desc Delete a category by ID
// @access Private/Admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;

