const express = require("express");
const {
  getApplications,
  applyToListing,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getApplications);
router.post("/apply", protect, applyToListing);
router.put("/update-status", protect, updateApplicationStatus);
router.delete("/delete", protect, deleteApplication);

module.exports = router;
