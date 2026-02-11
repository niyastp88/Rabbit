const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controller/uploadController");

const router = express.Router();

require("dotenv").config();

// Multer setup using memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image Upload

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
