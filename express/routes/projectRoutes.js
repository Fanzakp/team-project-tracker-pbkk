const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

router.post("/", verifyToken, isAdmin, projectController.createProject);
router.get("/", verifyToken, isAdmin, projectController.getAllProjects);
router.get("/:id", verifyToken, projectController.getProjectById);
router.put("/:id", verifyToken, isAdmin, projectController.updateProject);
router.delete("/:id", verifyToken, isAdmin, projectController.deleteProject);

module.exports = router;
