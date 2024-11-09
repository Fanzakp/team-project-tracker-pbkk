// [express/models/task.js](express/models/task.js)
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      // Task milik sebuah project
      this.belongsTo(models.Project, { foreignKey: "projectId" });

      // Task memiliki banyak komentar
      this.hasMany(models.Comment, { foreignKey: "taskId" });

      // Task memiliki banyak file
      this.hasMany(models.File, { foreignKey: "taskId" });

      // Task memiliki banyak user yang ditugaskan (many-to-many)
      this.belongsToMany(models.User, {
        through: "UserTasks",
        foreignKey: "taskId",
      });
    }
  }

  Task.init(
    {
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      description: DataTypes.TEXT,
      taskCreated: DataTypes.DATE,
      taskDue: DataTypes.DATE,
      projectId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Task",
    }
  );

  return Task;
};
