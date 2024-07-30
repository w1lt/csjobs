const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received:", token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded); // Debug log
      if (!decoded.user || !decoded.user.id) {
        throw new Error("Invalid token payload");
      }
      req.user = await User.findByPk(decoded.user.id);
      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }
      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
