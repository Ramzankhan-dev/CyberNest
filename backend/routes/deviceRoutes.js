const express = require("express");
const router = express.Router();
const { registerDevice, getDevices } = require("../controllers/deviceController");
const { verifyToken } = require("../middleware/authMiddleware");

// Protected routes
router.post("/register-device", verifyToken, registerDevice);
router.get("/devices", verifyToken, getDevices);

module.exports = router;