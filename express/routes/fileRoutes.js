const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const { verifyToken } = require("../middleware/auth");

router.post("/upload", verifyToken, fileController.uploadFile);
router.get("/:id", verifyToken, fileController.getFileById);
router.delete("/:id", verifyToken, fileController.deleteFile);

module.exports = router;
