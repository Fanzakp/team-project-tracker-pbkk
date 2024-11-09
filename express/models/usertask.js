// [express/models/usertask.js](express/models/usertask.js)
"use strict";
module.exports = (sequelize, DataTypes) => {
  const UserTask = sequelize.define(
    "UserTask",
    {
      userId: DataTypes.INTEGER,
      taskId: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {}
  );
  return UserTask;
};
