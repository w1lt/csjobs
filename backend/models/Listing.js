const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Listing = sequelize.define("Listing", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  compensation: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
  },
  location: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define associations
Listing.associate = (models) => {
  Listing.hasMany(models.Report, { foreignKey: "listingId", as: "reports" });
};

module.exports = Listing;
