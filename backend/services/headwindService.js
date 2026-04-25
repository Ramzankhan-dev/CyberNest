const axios = require("axios");

// ✅ Base URL
const HEADWIND_URL = "https://app.h-mdm.com/rest/plugins/devicereset/private/lock";

// ✅ ENV se cookie lo
const COOKIE = process.env.HEADWIND_COOKIE;

exports.sendCommand = async (deviceId, command) => {
  try {
    let payload = {
      deviceId: parseInt(deviceId),
      message: "Command from CyberNest",
    };

    // ============================
    // COMMAND MAPPING
    // ============================
    if (command === "lock") {
      payload.lock = true;
    }

    // (future commands ready)
    if (command === "reboot") {
      payload.reboot = true;
    }

    if (command === "wipe") {
      payload.wipe = true;
    }

    console.log("🚀 Sending to Headwind...");
    console.log("Payload:", payload);

    const response = await axios.put(HEADWIND_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": COOKIE,
      },
    });

    console.log("✅ Headwind SUCCESS");

    return response.data;

  } catch (error) {
    console.error("❌ Headwind ERROR");

    console.error("Message:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    // ❗ IMPORTANT: null return karo (taake fallback chale)
    return null;
  }
};