const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const Listing = require("./Listing");

const Application = sequelize.define("Application", {
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  ListingId: {
    type: DataTypes.INTEGER,
    references: {
      model: Listing,
      key: "id",
    },
  },
});

Application.belongsTo(User, { foreignKey: "UserId" });
Application.belongsTo(Listing, { foreignKey: "ListingId" });

User.hasMany(Application, { foreignKey: "UserId" });
Listing.hasMany(Application, { foreignKey: "ListingId" });

module.exports = Application;
