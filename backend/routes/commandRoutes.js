const express = require("express");
const router = express.Router();
const { sendCommand } = require("../controllers/commandController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send-command", verifyToken, sendCommand);

module.exports = router;