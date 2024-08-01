//routes/auth.js
const express = require("express");
const {
  registerUser,
  authUser,
  validateUserToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/validate-token", validateUserToken); // New route for token validation

module.exports = router;
