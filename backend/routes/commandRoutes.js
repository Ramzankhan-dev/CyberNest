const express = require("express");
const router = express.Router();
const { sendCommand, getCommands } = require("../controllers/commandController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send-command", verifyToken, sendCommand);
router.get("/:device_id", getCommands);

module.exports = router;