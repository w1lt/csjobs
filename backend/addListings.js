const { sequelize } = require("./config/db");
const Listing = require("./models/Listing");
const { listings } = require("./listings");

const convertToDate = (dateStr) => {
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };
  const [monthStr, day] = dateStr.split(" ");
  const month = months[monthStr];
  const year = new Date().getFullYear();
  return new Date(year, month, parseInt(day));
};

const addListingsToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    for (const listing of listings) {
      await Listing.create({
        title: listing.title,
        company: listing.company,
        compensation: listing.compensation,
        location: listing.location,
        date: convertToDate(listing.date),
        link: listing.link || "", // Ensure link is defined
        tags: listing.tags,
      });
    }

    console.log("Listings have been added successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};

addListingsToDatabase();
