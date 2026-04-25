const express = require("express");
const router = express.Router();
const { registerDevice, getDevices } = require("../controllers/deviceController");
const { verifyToken } = require("../middleware/authMiddleware");

// REGISTER DEVICE
router.post("/register", verifyToken, registerDevice);

// GET DEVICES
router.get("/list", verifyToken, getDevices);

module.exports = router;