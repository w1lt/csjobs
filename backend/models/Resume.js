const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Resume = sequelize.define("Resume", {
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uniqueName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  fileId: {
    // Add fileId field
    type: DataTypes.STRING,
    allowNull: true,
  },
  parsedContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Resume.associate = (models) => {
  Resume.belongsTo(models.User, { foreignKey: "resumeId", as: "user" });
};

module.exports = Resume;
