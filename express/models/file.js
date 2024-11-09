// [express/models/file.js](express/models/file.js)
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // File milik sebuah task
      this.belongsTo(models.Task, { foreignKey: "taskId" });
    }
  }

  File.init(
    {
      name: DataTypes.STRING,
      path: DataTypes.STRING,
      taskId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "File",
    }
  );

  return File;
};
