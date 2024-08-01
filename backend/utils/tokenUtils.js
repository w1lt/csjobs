// utils/tokenUtils.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");

dotenv.config();

const validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (user) {
      return {
        valid: true,
        user: {
          id: user.id,
          username: user.username,
        },
      };
    } else {
      return { valid: false, message: "User not found" };
    }
  } catch (error) {
    return { valid: false, message: "Invalid token" };
  }
};

module.exports = { validateToken };
