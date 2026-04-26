// const express = require("express");
// const router = express.Router();
// const { sendCommand, getCommands } = require("../controllers/commandController");
// const { verifyToken } = require("../middleware/authMiddleware");

// router.post("/send-command", verifyToken, sendCommand);
// router.get("/:device_id", getCommands);
// router.get("/test", (req, res) => {
//   console.log("✅ TEST ROUTE HIT");
//   res.send("Route working");
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const commandController = require("../controllers/commandController");

console.log("✅ commandRoutes loaded");

// TEMP: middleware hata do test ke liye
router.post("/send", commandController.sendCommand);

module.exports = router;