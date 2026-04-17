const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const locationRoutes = require("./routes/locationRoutes");
const commandRoutes = require("./routes/commandRoutes");
const policyRoutes = require("./routes/policyRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/command", commandRoutes);
app.use("/api/policy", policyRoutes);

//get api to test backend is running
app.get("/", (req, res) => {
  res.send("CyberNest Backend Running ");
});

//get testing api for db connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "DB Connected ✅",
      time: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get user detail api
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;