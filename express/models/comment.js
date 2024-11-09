// [express/models/comment.js](express/models/comment.js)
"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Comment milik seorang user
      this.belongsTo(models.User, { foreignKey: "userId" });

      // Comment milik sebuah task
      this.belongsTo(models.Task, { foreignKey: "taskId" });
    }
  }

  Comment.init(
    {
      commentText: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      taskId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );

  return Comment;
};
