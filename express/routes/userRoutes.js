const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.put("/:id/role", verifyToken, isAdmin, userController.updateUserRole);

module.exports = router;
