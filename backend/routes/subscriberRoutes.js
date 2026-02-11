const express = require("express");
const { subscribeNewsletter } = require("../controller/subscriberController");
const router = express.Router();

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public

router.post("/subscribe", subscribeNewsletter);

module.exports = router;
