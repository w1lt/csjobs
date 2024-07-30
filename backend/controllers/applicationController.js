const { Application, Listing } = require("../models");

const getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.id },
      include: [Listing],
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const applyToListing = async (req, res) => {
  const { listingId, status } = req.body;
  const { id: userId } = req.user;

  try {
    let application = await Application.findOne({
      where: { userId, listingId },
    });
    if (application) {
      application.status = status;
      await application.save();
    } else {
      application = await Application.create({ userId, listingId, status });
    }
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getApplications,
  applyToListing,
  updateApplicationStatus,
  deleteApplication,
};
