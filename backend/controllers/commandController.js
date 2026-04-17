const pool = require("../config/db");
const { sendPushNotification } = require("../services/fcmService");

exports.sendCommand = async (req, res) => {
  const { device_id, command } = req.body;

  try {
    const result = await pool.query(
      "SELECT fcm_token FROM devices WHERE device_id=$1",
      [device_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Device not found" });
    }

    const token = result.rows[0].fcm_token;

    //for console debugging
    console.log("Command:", command);
    console.log("Device token:", token);

    await sendPushNotification(token, {
      command: command,
    });

    await pool.query(
      "INSERT INTO commands (device_id, command_type, status) VALUES ($1, $2, 'sent')",
      [device_id, command]
    );

    res.json({ message: "Command sent successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};