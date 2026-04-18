const pool = require("../config/db");
const { sendPushNotification } = require("../services/fcmService");

//SEND COMMANDS TO DEVICE
exports.sendCommand = async (req, res) => {
  const { device_id, command } = req.body;

  try {
    const result = await pool.query("SELECT fcm_token FROM devices WHERE device_id=$1 AND user_id=$2",
    [device_id, req.user.id]);

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

// GET COMMANDS FOR DEVICE
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