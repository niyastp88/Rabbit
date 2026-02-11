const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  createMaterial,
  getMaterials,
  deleteMaterial,
} = require("../controller/materialController");

const router = express.Router();

// Create new material

router.post("/", protect, admin, createMaterial);

// @desc Get all materials

router.get("/", getMaterials);

// Delete a material by ID

router.delete("/:id", protect, admin, deleteMaterial);

module.exports = router;
