const express = require("express");
const {
  createListing,
  updateListing,
  updateUserRole,
  fetchReports,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/listings", protect, admin, createListing);
router.put("/listings/:id", protect, admin, updateListing);
router.put("/users/:id/role", protect, admin, updateUserRole);
router.get("/reports", protect, admin, fetchReports);

module.exports = router;
