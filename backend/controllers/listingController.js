//controllers/listingController.js
const { Listing } = require("../models");

const getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll();
    res.json(listings);
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

module.exports = { getListings, createListing, updateListing };
