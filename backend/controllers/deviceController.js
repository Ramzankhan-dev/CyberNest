const pool = require("../config/db");

// REGISTER DEVICE
exports.registerDevice = async (req, res) => {
  const { device_id, fcm_token } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO devices (device_id, user_id, fcm_token, status, last_seen) VALUES ($1, $2, $3, 'online', NOW()) RETURNING *",
      [device_id, user_id, fcm_token]
    );

    res.json({ message: "Device registered", device: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET DEVICES
exports.getDevices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM devices WHERE user_id = $1",[req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};