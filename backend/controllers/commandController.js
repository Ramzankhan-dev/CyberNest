const pool = require("../config/db");
const { sendPushNotification } = require("../services/fcmService");
const headwindService = require("../services/headwindService");

// SEND COMMAND
exports.sendCommand = async (req, res) => {
  console.log("🔥 API HIT HOI HAI");

  const { device_id, command } = req.body;

  if (!device_id || !command) {
    return res.status(400).json({ error: "device_id and command required" });
  }

  try {
    // ✅ FIX: pehle declare karo
    const userId = req.user?.id || null;

    console.log("👤 Using User ID:", userId);

    // ✅ dynamic query
    let query = "SELECT fcm_token, headwind_device_id FROM devices WHERE device_id=$1";
    let params = [device_id];

    if (userId) {
      query += " AND user_id=$2";
      params.push(userId);
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const token = result.rows[0].fcm_token;
    const headwindId = result.rows[0].headwind_device_id;

    console.log("📌 Command:", command);
    console.log("📌 Headwind ID:", headwindId);

    // ============================
    // HEADWIND CALL
    // ============================
    let headwindResponse = null;

    if (headwindId) {
      try {
        headwindResponse = await headwindService.sendCommand(headwindId, command);

        if (headwindResponse) {
          console.log("✅ Headwind Success");
        } else {
          console.log("⚠️ Headwind returned null");
        }

      } catch (err) {
        console.log("❌ Headwind Failed:", err.message);
      }
    } else {
      console.log("⚠️ No Headwind ID found");
    }

    // ============================
    // FCM FALLBACK
    // ============================
    if (!headwindResponse && token) {
      console.log("📡 Sending via FCM fallback...");
      await sendPushNotification(token, { command });
    }

    // ============================
    // SAVE COMMAND
    // ============================
    await pool.query(
      "INSERT INTO commands (device_id, command_type, status) VALUES ($1, $2, $3)",
      [
        device_id,
        command,
        headwindResponse ? "sent_headwind" : "sent_fcm",
      ]
    );

    // ============================
    // RESPONSE
    // ============================
    res.json({
      success: true,
      message: "Command processed",
      via: headwindResponse ? "headwind" : "fcm",
      device: device_id,
      command: command,
    });

  } catch (err) {
    console.error("❌ Controller Error:", err.message);

    res.status(500).json({
      error: "Internal Server Error",
      details: err.message,
    });
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