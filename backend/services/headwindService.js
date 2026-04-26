const axios = require("axios");

//  Headwind endpoint
const HEADWIND_URL = "https://app.h-mdm.com/rest/plugins/devicereset/private/lock";

// Cookie from env
const COOKIE = process.env.HEADWIND_COOKIE;

exports.sendCommand = async (deviceId, command) => {
  try {
    //  safety: ensure integer
    const parsedId = parseInt(deviceId);

    if (!parsedId) {
      console.log(" Invalid deviceId:", deviceId);
      return null;
    }

    let payload = {
      deviceId: parsedId,
      message: "Command from CyberNest",
    };

    // ============================
    // COMMAND MAPPING
    // ============================
    switch (command) {
  case "lock":
    payload.lock = true;
    break;

  case "unlock":
    console.log(" Unlock not supported");
    return null;

  case "reboot":
    console.log(" Reboot not supported in this endpoint");
    return null;

  case "wipe":
    payload.wipe = true;
    break;

  default:
    console.log(" Unknown command:", command);
    return null;
}

    console.log(" Sending to Headwind...");
    console.log(" Payload:", payload);
    console.log(" Cookie:", COOKIE ? "Present" : "Missing");

    const response = await axios.put(HEADWIND_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": COOKIE,
      },
      timeout: 10000, //  avoid hanging
    });

    //  ensure success
    if (response.status === 200) {
      console.log(" Headwind SUCCESS");
      return response.data;
    } else {
      console.log(" Unexpected status:", response.status);
      return null;
    }

  } catch (error) {
    console.error(" Headwind ERROR");

    console.error("Message:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }

    return null; // fallback trigger
  }
};