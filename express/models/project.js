// [express/models/project.js](express/models/project.js)
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      // Project dimiliki oleh seorang admin (user)
      this.belongsTo(models.User, { as: "admin", foreignKey: "adminId" });

      // Project memiliki banyak tugas
      this.hasMany(models.Task, { foreignKey: "projectId" });
    }
  }

  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      projectCreated: DataTypes.DATE,
      projectDue: DataTypes.DATE,
      adminId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );

  return Project;
};
