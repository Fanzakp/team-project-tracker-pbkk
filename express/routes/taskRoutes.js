const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

router.post("/task", verifyToken, isAdmin, taskController.createTask);
router.get("/task", verifyToken, taskController.getAllTasks);
router.get("/:id", verifyToken, taskController.getTaskById);
router.put("/:id", verifyToken, isAdmin, taskController.updateTask);
router.delete("/:id", verifyToken, isAdmin, taskController.deleteTask);

module.exports = router;
