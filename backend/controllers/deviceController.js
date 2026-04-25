const pool = require("../config/db");

// ================================
// REGISTER DEVICE
// ================================
exports.registerDevice = async (req, res) => {
  const { device_id, headwind_device_id, fcm_token } = req.body;

  try {
    const userResult = await pool.query(
      "SELECT organization_id FROM users WHERE id=$1",
      [req.user.id]
    );

    const organization_id = userResult.rows[0].organization_id;
    const user_id = req.user.id;

    if (!organization_id) {
      return res.status(400).json({
        error: "User is not linked to any organization",
      });
    }

    const result = await pool.query(
      `INSERT INTO devices 
      (device_id, headwind_device_id, fcm_token, organization_id, user_id, status, last_seen) 
      VALUES ($1, $2, $3, $4, $5, 'online', NOW()) 
      RETURNING *`,
      [device_id, headwind_device_id, fcm_token, organization_id, user_id]
    );

    res.json({
      message: "Device registered successfully",
      device: result.rows[0],
    });

  } catch (err) {

    // 🔥 DUPLICATE ERROR HANDLE
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Device already registered with this Headwind ID",
      });
    }

    res.status(500).json({ error: err.message });
  }
};

// ================================
// GET DEVICES (ORG BASED)
// ================================
exports.getDevices = async (req, res) => {
  try {
    const userResult = await pool.query(
      "SELECT organization_id FROM users WHERE id=$1",
      [req.user.id]
    );

    const organization_id = userResult.rows[0].organization_id;

    const result = await pool.query(
      "SELECT * FROM devices WHERE organization_id=$1 ORDER BY id DESC",
      [organization_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};