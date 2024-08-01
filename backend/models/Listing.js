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
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Assuming compensation is an array of integers
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
});

// Define associations
Listing.associate = (models) => {
  Listing.hasMany(models.Report, { foreignKey: "listingId", as: "reports" });
};

module.exports = Listing;
