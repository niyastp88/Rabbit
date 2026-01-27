const express = require("express");
const Material = require("../models/Material");
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

    const materialExists = await Material.findOne({ name });

    if (materialExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const material = await Material.create({ name });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);

    // duplicate key safety
    if (error.code === 11000) {
      return res.status(400).json({ message: "Material already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// @route GET /api/categories
// @desc Get all categories
// @access Public

router.get("/", async (req, res) => {
  try {
    const materials = await Material.find().sort({ name: 1 });
    res.json(materials);
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
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        message: "Material not found",
      });
    }

    await material.deleteOne();

    res.json({
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;

