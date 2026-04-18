const pool = require("../config/db");

// SEND LOCATION (Android → Backend)
exports.sendLocation = async (req, res) => {
  const { device_id, latitude, longitude } = req.body;

  try {
    await pool.query(
      "INSERT INTO location_logs (device_id, latitude, longitude) VALUES ($1, $2, $3)",
      [device_id, latitude, longitude]
    );

    // update last_seen
    await pool.query(
      "UPDATE devices SET last_seen = NOW() WHERE device_id = $1",
      [device_id]
    );

    res.json({ message: "Location saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET LOCATION (Web → Backend)
exports.getLocations = async (req, res) => {
  const { device_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM location_logs WHERE device_id = $1 ORDER BY timestamp DESC",
      [device_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};