//models/index.js
const User = require("./User");
const Listing = require("./Listing");
const Application = require("./Application");
const Report = require("./Report");

const syncModels = async () => {
  await User.sync({ alter: true });
  await Listing.sync({ alter: true });
  await Application.sync({ alter: true });
  await Report.sync({ alter: true });
};

module.exports = { User, Listing, Application, Report, syncModels };
