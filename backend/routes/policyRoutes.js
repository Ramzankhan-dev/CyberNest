const express = require("express");
const router = express.Router();
const { createPolicy, getPolicies } = require("../controllers/policyController");
const { verifyToken } = require("../middleware/authMiddleware");
const { assignPolicy } = require("../controllers/policyController");
const { getDevicePolicy } = require("../controllers/policyController");

router.post("/create-policy", verifyToken, createPolicy);
router.get("/get-policies", verifyToken, getPolicies);
router.post("/assign-policy", verifyToken, assignPolicy);
router.get("/device-policy/:device_id", verifyToken, getDevicePolicy);

module.exports = router;