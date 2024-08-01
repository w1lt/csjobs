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

Report.associate = (models) => {
  Report.belongsTo(models.Listing, { foreignKey: "listingId", as: "listing" });
  Report.belongsTo(models.User, { foreignKey: "userId", as: "user" });
};

module.exports = Report;
