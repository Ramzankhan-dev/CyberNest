const pool = require("../config/db");
const { sendPushNotification } = require("../services/fcmService");
const headwindService = require("../services/headwindService");

// SEND COMMANDS TO DEVICE
exports.sendCommand = async (req, res) => {
  console.log("🔥 API HIT HOI HAI");

  const { device_id, command } = req.body;

  try {
    const result = await pool.query(
      "SELECT fcm_token, headwind_device_id FROM devices WHERE device_id=$1 AND user_id=$2",
      [device_id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const token = result.rows[0].fcm_token;
    const headwindId = result.rows[0].headwind_device_id;

    console.log("Command:", command);
    console.log("Device token:", token);
    console.log("Headwind ID:", headwindId);

    // ============================
    // HEADWIND CALL
    // ============================
    let headwindResponse = null;

    try {
      if (headwindId) {
        headwindResponse = await headwindService.sendCommand(headwindId, command);
        console.log("✅ Headwind Response:", headwindResponse);
      } else {
        console.log("⚠️ No Headwind ID found, skipping Headwind");
      }
    } catch (err) {
      console.log("❌ Headwind Failed:");
      console.log("Error Message:", err.message);
      console.log("Error Response:", err.response?.data);
    }

    // ============================
    // FCM FALLBACK
    // ============================
    await sendPushNotification(token, {
      command: command,
    });

    // ============================
    // SAVE TO DATABASE
    // ============================
    await pool.query(
      "INSERT INTO commands (device_id, command_type, status) VALUES ($1, $2, $3)",
      [
        device_id,
        command,
        headwindResponse ? "sent_headwind" : "sent_fcm",
      ]
    );

    res.json({
      message: "Command processed",
      headwind: headwindResponse ? true : false,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COMMANDS
exports.getCommands = async (req, res) => {
  const { device_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM commands WHERE device_id = $1 ORDER BY created_at DESC",
      [device_id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};