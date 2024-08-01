// routes/adminRoutes.js
const express = require("express");
const {
  createListing,
  updateListing,
  updateUser,
  fetchReports,
  fetchUsers,
  deleteUser,
  scrapeAndAddListings,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.post("/listings", protect, admin, createListing);
router.put("/listings/:id", protect, admin, updateListing);
router.put("/users/:id", protect, admin, updateUser); // Updated route
router.delete("/users/:id", protect, admin, deleteUser); // Updated route

router.get("/reports", protect, admin, fetchReports);
router.get("/users", protect, admin, fetchUsers);
router.post("/scrape", protect, admin, scrapeAndAddListings); // New route

module.exports = router;
