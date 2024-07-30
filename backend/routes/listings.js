const express = require("express");
const {
  getListings,
  createListing,
} = require("../controllers/listingController.js");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getListings);
router.post("/", protect, createListing);

module.exports = router;
