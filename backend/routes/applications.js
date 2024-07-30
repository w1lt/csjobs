const express = require("express");
const {
  getApplications,
  applyOrUpdateApplication,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getApplications);
router.post("/apply-or-update", protect, applyOrUpdateApplication);
router.delete("/", protect, deleteApplication); // No URL parameter

module.exports = router;
