const express = require("express");
const HomeContent = require("../models/HomeContent");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/* GET home page content (public) */
router.get("/", async (req, res) => {
  const content = await HomeContent.findOne();
  res.json(content);
});

/* UPDATE home page content (admin only) */
// routes/homeContentRoutes.js

router.put("/", protect, admin, async (req, res) => {
  try {
    let home = await HomeContent.findOne();

    if (!home) {
      // 🔥 first time create → validate all
      home = new HomeContent({
        heroImage: req.body.heroImage,
        menCollectionImage: req.body.menCollectionImage,
        womenCollectionImage: req.body.womenCollectionImage,
      });
    } else {
      // 🔥 UPDATE MODE – ignore empty strings
      if (req.body.heroImage && req.body.heroImage.trim() !== "") {
        home.heroImage = req.body.heroImage;
      }

      if (
        req.body.menCollectionImage &&
        req.body.menCollectionImage.trim() !== ""
      ) {
        home.menCollectionImage = req.body.menCollectionImage;
      }

      if (
        req.body.womenCollectionImage &&
        req.body.womenCollectionImage.trim() !== ""
      ) {
        home.womenCollectionImage = req.body.womenCollectionImage;
      }
    }

    await home.save();
    res.json(home);
  } catch (error) {
    console.error("HomeContent update error:", error);
    res.status(500).json({ message: "Update failed" });
  }
});


module.exports = router;
