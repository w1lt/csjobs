const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Report = sequelize.define("Report", {
  listingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

module.exports = Report;
