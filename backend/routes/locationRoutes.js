const express = require("express");
const router = express.Router();
const { sendLocation, getLocations } = require("../controllers/locationController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/send", verifyToken, sendLocation);
router.get("/:device_id", verifyToken, getLocations);

module.exports = router;