const { Application, Listing } = require("../models");

const getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { UserId: req.user.id }, // Ensure correct casing
      include: [Listing],
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const applyToListing = async (req, res) => {
  const { listingId, status } = req.body;
  const { id: userId } = req.user;

  try {
    let application = await Application.findOne({
      where: { UserId: userId, ListingId: listingId }, // Ensure correct casing
    });
    if (application) {
      application.status = status;
      await application.save();
    } else {
      application = await Application.create({
        UserId: userId,
        ListingId: listingId,
        status,
      }); // Ensure correct casing
    }
    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying to listing:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;

  try {
    const application = await Application.findByPk(applicationId);
    if (application) {
      application.status = status;
      await application.save();
      res.status(200).json(application);
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteApplication = async (req, res) => {
  const { applicationId } = req.body;

  try {
    const application = await Application.findByPk(applicationId);
    if (application) {
      await application.destroy();
      res.status(200).json({ message: "Application deleted" });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getApplications,
  applyToListing,
  updateApplicationStatus,
  deleteApplication,
};
