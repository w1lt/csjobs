const { User, Resume } = require("../models");
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
      resume: user.resume, // Include resume information
    };

    res.status(201).json({
      token: generateToken(userInfo),
      user: userInfo,
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(400).json({ message: "Invalid user data" });
  }
};

const authUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({
    where: { username },
    include: { model: Resume, as: "resume" }, // Include the Resume model
  });

  if (user && (await user.matchPassword(password))) {
    const userInfo = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      resume: user.resume, // Include resume information
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
    const user = await User.findByPk(result.user.id, {
      include: { model: Resume, as: "resume" }, // Include the Resume model
    });

    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      resume: user.resume, // Include resume information
    });
  } else {
    res.status(401).json({ message: result.message });
  }
};

module.exports = { registerUser, authUser, validateUserToken };
