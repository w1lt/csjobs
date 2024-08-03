const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const bcrypt = require("bcryptjs");
const Resume = require("./Resume");

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  resumeId: {
    type: DataTypes.INTEGER,
    references: {
      model: Resume,
      key: "id",
    },
  },
});

User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

User.associate = (models) => {
  User.hasMany(models.Report, { foreignKey: "userId", as: "reports" });
  User.hasOne(models.Resume, { as: "resume", foreignKey: "resumeId" }); // Update association
};

module.exports = User;
