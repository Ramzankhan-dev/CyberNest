const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================================
// REGISTER (ORG + SUPER ADMIN)
// ================================
exports.register = async (req, res) => {
  const { name, email, password, organization_name } = req.body;

  try {
    // ❗ validation
    if (!name || !email || !password || !organization_name) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    // ❗ check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    // 1️⃣ CREATE ORGANIZATION
    const orgResult = await pool.query(
      "INSERT INTO organizations (name) VALUES ($1) RETURNING *",
      [organization_name]
    );

    const orgId = orgResult.rows[0].id;

    // 2️⃣ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ CREATE SUPER ADMIN
    const userResult = await pool.query(
      `INSERT INTO users 
      (name, email, password, role, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, organization_id`,
      [name, email, hashedPassword, "super_admin", orgId]
    );

    const user = userResult.rows[0];

    // 4️⃣ GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        organization_id: user.organization_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Organization + Super Admin created",
      user,
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================================
// LOGIN
// ================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const user = result.rows[0];

    // password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid password",
      });
    }

    // JWT with org + role
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        organization_id: user.organization_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================================
// GET CURRENT USER
// ================================
exports.getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, organization_id FROM users WHERE id=$1",
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};