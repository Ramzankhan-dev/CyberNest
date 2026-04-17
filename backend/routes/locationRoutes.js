const express = require("express");
const router = express.Router();
const { sendLocation, getLocation } = require("../controllers/locationController");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected routes
router.post("/send-location", verifyToken, sendLocation);
router.get("/get-location/:device_id", verifyToken, getLocation);

module.exports = router;