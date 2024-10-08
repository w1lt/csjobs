const express = require("express");
const {
  getListings,
  createListing,
  updateListing,
  getListingDetails,
  deleteListing,
  disableListing,
} = require("../controllers/listingController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getListings);
router.post("/", protect, admin, createListing);
router.put("/:id", protect, admin, updateListing);
router.get("/:id", protect, getListingDetails);
router.delete("/:id", protect, admin, deleteListing);
router.patch("/:id/disable", protect, admin, disableListing);

module.exports = router;
