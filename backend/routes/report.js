const express = require("express");
const { createReport, getReports } = require("../controllers/reportController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createReport);
router.get("/", protect, admin, getReports);

module.exports = router;
