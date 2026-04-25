const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const locationRoutes = require("./routes/locationRoutes");
const commandRoutes = require("./routes/commandRoutes");
const policyRoutes = require("./routes/policyRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ================================
// MIDDLEWARE
// ================================
app.use(cors());
app.use(express.json());

// ================================
// ROUTES
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/command", commandRoutes);
app.use("/api/policy", policyRoutes);
app.use("/api/admin", adminRoutes);

// ================================
// ROOT API (HEALTH CHECK)
// ================================
app.get("/", (req, res) => {
  res.send("🚀 CyberNest Backend Running...");
});

// ================================
// DB CONNECTION TEST
// ================================
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "DB Connected ✅",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: "Database connection failed",
      details: err.message,
    });
  }
});

// ================================
// DEBUG API (REMOVE LATER)
// ================================
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, organization_id FROM users"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================================
// 404 HANDLER
// ================================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ================================
// GLOBAL ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(500).json({
    error: "Something went wrong",
    details: err.message,
  });
});

module.exports = app;