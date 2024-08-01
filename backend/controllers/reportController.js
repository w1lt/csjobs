// controllers/reportController.js
const { Report, Listing, User } = require("../models");

const createReport = async (req, res) => {
  const { listingId, reason, message } = req.body;
  console.log("Request body:", req.body); // Log the request body
  try {
    const report = await Report.create({
      listingId,
      reason,
      message,
      status: "pending",
    });
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating report:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message }); // Include error message in response
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      include: [
        { model: Listing, as: "listing" },
        { model: User, as: "user" },
      ],
    });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error); // Log the error
    res.status(500).json({ message: "Server error", error: error.message }); // Include error message in response
  }
};

module.exports = { createReport, getReports };
