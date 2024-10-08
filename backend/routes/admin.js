// routes/adminRoutes.js
const express = require("express");
const {
  updateUser,
  fetchReports,
  fetchUsers,
  deleteUser,
  scrapeAndAddListings,
  ping,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.put("/users/:id", protect, admin, updateUser);
router.delete("/users/:id", protect, admin, deleteUser);

router.get("/reports", protect, admin, fetchReports);
router.get("/users", protect, admin, fetchUsers);
router.post("/scrape", protect, admin, scrapeAndAddListings);

router.get("/ping", ping); //ping server

module.exports = router;
