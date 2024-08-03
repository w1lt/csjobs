const { sequelize } = require("../config/db");
const User = require("./User");
const Listing = require("./Listing");
const Application = require("./Application");
const Report = require("./Report");

const models = {
  User,
  Listing,
  Application,
  Report,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

const syncModels = async () => {
  await sequelize.sync({ alter: true });
};

module.exports = { ...models, syncModels, sequelize };
