const { Listing } = require("../models");

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      limit: 150, // Limit the result to 150 listings
      order: [["date", "DESC"]], // Order by the `date` field in descending order
    });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getListingDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

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

const deleteListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    await listing.destroy();
    res.json({ message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const disableListing = async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    await listing.update({ disabled: true });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getListings,
  createListing,
  updateListing,
  getListingDetails,
  deleteListing,
  disableListing,
};
