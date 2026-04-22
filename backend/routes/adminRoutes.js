const express = require("express");
const router = express.Router();
const { createAdmin, getAdmins } = require("../controllers/adminController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, createAdmin);
router.get("/list", verifyToken, getAdmins);

module.exports = router;