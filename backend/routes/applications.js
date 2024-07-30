const express = require("express");
const {
  getApplications,
  applyOrUpdateApplication,
} = require("../controllers/applicationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, getApplications);
router.post("/apply-or-update", protect, applyOrUpdateApplication);
module.exports = router;
