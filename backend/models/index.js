const { sequelize } = require("../config/db");
const User = require("./User");
const Listing = require("./Listing");
const Application = require("./Application");
const Report = require("./Report");
const Resume = require("./Resume"); // Make sure to import the Resume model

// Initialize models
const models = {
  User,
  Listing,
  Application,
  Report,
  Resume, // Add the Resume model to the models object
};

// Setup model associations
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Synchronize models with the database
const syncModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = { ...models, syncModels, sequelize };
