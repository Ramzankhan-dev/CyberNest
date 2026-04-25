const express = require("express");
const router = express.Router();
const { sendCommand, getCommands } = require("../controllers/commandController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send-command", verifyToken, sendCommand);
router.get("/:device_id", getCommands);
router.get("/test", (req, res) => {
  console.log("✅ TEST ROUTE HIT");
  res.send("Route working");
});

module.exports = router;