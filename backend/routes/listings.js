const express = require("express");
const {
  getListings,
  createListing,
  updateListing,
} = require("../controllers/listingController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getListings);
router.post("/", protect, createListing);
router.put("/:id", protect, updateListing);

module.exports = router;
