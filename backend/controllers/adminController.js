// controllers/adminController.js
const { Listing, User, Report } = require("../models");

const createListing = async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    await listing.update(req.body);
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = isAdmin;
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const fetchReports = async (res) => {
  console.log("Fetching reports");
  try {
    const reports = await Report.findAll({
      include: [
        { model: Listing, attributes: ["id", "title", "company"] },
        { model: User, attributes: ["id", "username"] },
      ],
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createListing, updateListing, updateUserRole, fetchReports };
