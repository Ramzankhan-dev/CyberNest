const pool = require("../config/db");
const bcrypt = require("bcrypt");

// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    // 🔒 Only super_admin allowed
    if (req.user.role !== "super_admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role, organization_id)
       VALUES ($1, $2, $3, 'admin', $4)
       RETURNING id, name, email, role, organization_id`,
      [name, email, hashedPassword, req.user.organization_id]
    );

    res.json({
      message: "Admin created successfully",
      admin: result.rows[0],
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ADMINS LIST
exports.getAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role 
       FROM users 
       WHERE organization_id = $1`,
      [req.user.organization_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};