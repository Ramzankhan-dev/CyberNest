const pool = require("../config/db");

// CREATE POLICY
exports.createPolicy = async (req, res) => {
  const { camera, app_install, location } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO policies (camera, app_install, location, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [camera, app_install, location, user_id]
    );

    res.json({ message: "Policy created", policy: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL POLICIES
exports.getPolicies = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM policies WHERE user_id = $1",[req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//ASSIGN POLICY TO DEVICE
exports.assignPolicy = async (req, res) => {
  const { device_id, policy_id } = req.body;

  try {
    const result = await pool.query(
      "UPDATE devices SET policy_id = $1 WHERE device_id = $2 RETURNING *",
      [policy_id, device_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json({
      message: "Policy assigned successfully",
      device: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//GET POLICY by device id
exports.getDevicePolicy = async (req, res) => {
  const { device_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.* FROM devices d
       JOIN policies p ON d.policy_id = p.policy_id
       WHERE d.device_id = $1`,
      [device_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No policy found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};