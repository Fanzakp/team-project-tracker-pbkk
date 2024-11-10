const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { verifyToken } = require("../middleware/auth");
const { isAdmin } = require("../middleware/auth");

router.post("/", verifyToken, commentController.addComment);
router.get("/task/:taskId", verifyToken, commentController.getCommentsByTask);
router.put("/:id", verifyToken, commentController.updateComment);
router.delete("/:id", verifyToken, isAdmin, commentController.deleteComment);

module.exports = router;
