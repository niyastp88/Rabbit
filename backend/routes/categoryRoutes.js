const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controller/categoryController");

const router = express.Router();

//Create new category

router.post("/", protect, admin, createCategory);

// Get all categories

router.get("/", getCategories);

// Delete a category by ID

router.delete("/:id", protect, admin,deleteCategory);

module.exports = router;
