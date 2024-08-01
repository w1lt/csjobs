// controllers/authController.js
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { validateToken } = require("../utils/tokenUtils");

dotenv.config();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });

    const userInfo = {
      id: user.id,
      username: user.username,
    };

    res.status(201).json({
      token: generateToken(userInfo),
      user: userInfo,
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user && (await user.matchPassword(password))) {
    const userInfo = {
      id: user.id,
      username: user.username,
    };

    res.json({
      token: generateToken(userInfo),
      user: userInfo,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

const validateUserToken = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const result = await validateToken(token);
  if (result.valid) {
    res.json(result.user);
  } else {
    res.status(401).json({ message: result.message });
  }
};

module.exports = { registerUser, authUser, validateUserToken };
