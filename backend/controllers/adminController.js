const { Listing, User, Report } = require("../models");
const axios = require("axios");

const updateUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update(req.body);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const fetchReports = async (req, res) => {
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

const fetchUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "isAdmin"],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const scrapeAndAddListings = async (req, res) => {
  try {
    const [simplifyData, ouckahData] = await Promise.all([
      axios.get(
        "https://raw.githubusercontent.com/SimplifyJobs/Summer2025-Internships/dev/.github/scripts/listings.json"
      ),
      axios.get(
        "https://raw.githubusercontent.com/Ouckah/Summer2025-Internships/dev/.github/scripts/listings.json"
      ),
    ]);

    const simplifyListings = simplifyData.data
      .filter((item) => !item.url.includes("simplify.jobs")) // Exclude listings with simplify.jobs links
      .sort((a, b) => b.date_posted - a.date_posted) // Sort by date_posted, most recent first
      .slice(0, 30) // Get the first 30 listings
      .map((item) => ({
        title: item.title,
        company: item.company_name,
        location: item.locations,
        date: new Date(item.date_posted * 1000), // Convert timestamp to date
        link: item.url.split("?")[0], // Remove query parameters from URL
        tags: item.terms,
      }));

    const ouckahListings = ouckahData.data
      .filter((item) => item.season === "Summer") // Filter for summer listings
      .sort((a, b) => b.date_posted - a.date_posted) // Sort by date_posted, most recent first
      .slice(0, 30) // Get the first 30 listings
      .map((item) => ({
        title: item.title,
        company: item.company_name,
        location: item.locations,
        date: new Date(item.date_posted * 1000), // Convert timestamp to date
        link: item.url.split("?")[0], // Remove query parameters from URL
        tags: [item.season],
      }));

    const listings = [...simplifyListings, ...ouckahListings];

    const createdListings = await Promise.all(
      listings.map(async (listing) => {
        try {
          const newListing = await Listing.create(listing);
          return newListing;
        } catch (error) {
          console.error(`Failed to create listing: ${listing.title}`, error);
          return null;
        }
      })
    );

    res.status(201).json({ createdListings: createdListings.filter(Boolean) });
  } catch (error) {
    console.error("Error fetching and adding listings", error);
    res.status(500).json({ message: "Server error" });
  }
};

const ping = (req, res) => {
  res.status(200).json({ message: "pong" });
};

module.exports = {
  updateUser,
  fetchReports,
  fetchUsers,
  deleteUser,
  scrapeAndAddListings,
  ping,
};
