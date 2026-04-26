const pool = require("../config/db");
const QRCode = require("qrcode");

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

    const organization_id = userResult.rows[0]?.organization_id;
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

    const organization_id = userResult.rows[0]?.organization_id;

    const result = await pool.query(
      "SELECT * FROM devices WHERE organization_id=$1 ORDER BY id DESC",
      [organization_id]
    );

    const devicesWithQR = await Promise.all(
      result.rows.map(async (device) => {
        return {
          ...device,
          qr_image: device.qr_url
            ? await QRCode.toDataURL(device.qr_url)
            : null,
        };
      })
    );

    res.json(devicesWithQR);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// GET DEVICE QR (SINGLE)
// ================================
exports.getDeviceQR = async (req, res) => {
  try {
    const { device_id } = req.params;

    const result = await pool.query(
      "SELECT qr_url FROM devices WHERE device_id=$1",
      [device_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Device not found" });
    }

    const qrUrl = result.rows[0].qr_url;

    const qrImage = qrUrl ? await QRCode.toDataURL(qrUrl) : null;

    res.json({
      device_id,
      qr_url: qrUrl,
      qr_image: qrImage,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================================
// GET DEVICE DETAILS (FIXED STATUS)
// ================================
exports.getDeviceDetails = async (req, res) => {
  try {
    const { device_id } = req.params;

    const result = await pool.query(
      `SELECT device_id, headwind_device_id, status, last_seen, fcm_token, organization_id
       FROM devices
       WHERE device_id = $1`,
      [device_id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: "Device not found" });
    }

   const device = result.rows[0];

const lastSeen = new Date(device.last_seen);
const now = new Date();

const diffMinutes = (now - lastSeen) / 60000;

// REAL STATUS
device.status = diffMinutes < 5 ? "online" : "offline";
    res.json(device);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



const axios = require("axios");

exports.headwindPing = async (req, res) => {
  try {
    const response = await axios.get(
      "https://app.h-mdm.com/rest/private/devices/search",
      {
        headers: {
  Cookie: `JSESSIONID=5EC643FA7AABC58E979C0CA761968B9D`
}
      }
    );

    console.log("✅ HEADWIND CONNECTED");

    res.json({
      status: "connected",
      devices: response.data.length,
    });

  } catch (err) {
    console.log("❌ HEADWIND NOT CONNECTED");

    res.status(500).json({
      status: "disconnected",
      error: err.message,
    });
  }
};