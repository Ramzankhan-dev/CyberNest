const pool = require("../config/db");

// CREATE POLICY
exports.createPolicy = async (req, res) => {
  const { camera, app_install, location } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO policies (camera, app_install, location) VALUES ($1, $2, $3) RETURNING *",
      [camera, app_install, location]
    );

    res.json({ message: "Policy created", policy: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL POLICIES
exports.getPolicies = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM policies");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};