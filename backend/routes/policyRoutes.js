const express = require("express");
const router = express.Router();
const { createPolicy, getPolicies } = require("../controllers/policyController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create-policy", verifyToken, createPolicy);
router.get("/get-policies", verifyToken, getPolicies);

module.exports = router;