const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Listing = require("./Listing");

const Application = sequelize.define("Application", {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "not_applied",
  },
});

Application.belongsTo(User);
Application.belongsTo(Listing);

module.exports = Application;
