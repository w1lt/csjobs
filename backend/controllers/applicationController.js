// controllers/applicationController.js
const { Application, Listing } = require("../models");

const getApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { UserId: req.user.id },
      include: [Listing],
    });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const applyOrUpdateApplication = async (req, res) => {
  const { listingId, status } = req.body;
  const { id: userId } = req.user;

  if (!listingId || !status) {
    return res
      .status(400)
      .json({ message: "ListingId and status are required" });
  }

  try {
    let application = await Application.findOne({
      where: { UserId: userId, ListingId: listingId },
    });

    if (status === "reset") {
      if (application) {
        await application.destroy();
        return res.status(200).json({ message: "Application reset" });
      } else {
        return res.status(404).json({ message: "Application not found" });
      }
    }

    if (application) {
      application.status = status;
      await application.save();
    } else {
      // Create a new application if it doesn't exist
      application = await Application.create({
        UserId: userId,
        ListingId: listingId,
        status,
      });
    }
    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying or updating application:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getApplications,
  applyOrUpdateApplication,
};
