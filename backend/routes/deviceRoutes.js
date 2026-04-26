const express = require("express");
const router = express.Router();

const { registerDevice, getDevices } = require("../controllers/deviceController");
const { verifyToken } = require("../middleware/authMiddleware");
const { getDeviceQR } = require("../controllers/deviceController");
const { getDeviceDetails } = require("../controllers/deviceController");
const { headwindPing } = require("../controllers/deviceController");

// ================================
// REGISTER DEVICE
// ================================
router.post("/register", verifyToken, registerDevice);

// ================================
// GET DEVICES
// ================================
router.get("/list", verifyToken, getDevices);

// ================================
// GENERATE QR
// ================================

router.get("/details/:device_id", verifyToken, getDeviceDetails);


router.get("/headwind/ping", headwindPing);



const { sendCommand } = require("../services/headwindService");

// TEST COMMAND ROUTE
router.post("/test-command", async (req, res) => {
  const { deviceId, command } = req.body;

  const result = await sendCommand(deviceId, command);

  res.json({
    success: true,
    result
  });
});

;

module.exports = router;