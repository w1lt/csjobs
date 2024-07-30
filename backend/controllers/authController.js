const { User } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ user: { id } }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.create({ username, password });

    res.status(201).json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid user data" });
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

module.exports = { registerUser, authUser };
