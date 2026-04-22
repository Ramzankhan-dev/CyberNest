const axios = require("axios");

const HEADWIND_URL = "https://app.h-mdm.com/rest/plugins/devicereset/private/lock";

// ⚠️ YAHAN apni cookies paste karo (DevTools se)
const COOKIE = "7Ctrm%3D%28none%29; sbjs_first=typ%3Dtypein%7C%7C%7Csrc%3D%28direct%29%7C%7C%7Cmdm%3D%28none%29%7C%7C%7Ccmp%3D%28none%29%7C%7C%7Ccnt%3D%28none%29%7C%7C%7Ctrm%3D%28none%29; sbjs_udata=vst%3D1%7C%7C%7Cuip%3D%28none%29%7C%7C%7Cuag%3DMozilla%2F5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F147.0.0.0%20Safari%2F537.36; rebranding=%7B%22appName%22%3A%22Headwind%20MDM%22%2C%22vendorName%22%3A%22h-mdm.com%22%2C%22vendorLink%22%3A%22https%3A%2F%2Fh-mdm.com%22%2C%22signupLink%22%3A%22%22%2C%22termsLink%22%3A%22%22%7D; JSESSIONID=4C1CCC6C41A35E981331CA9ADB1195EC; user=%7B%22name%22%3A%22CyberNest333%22%2C%22id%22%3A4586%2C%22groups%22%3A%5B%5D%2C%22singleCustomer%22%3Afalse%2C%22allDevicesAvailable%22%3Atrue%2C%22email%22%3A%22testingprogram576%40gmail.com%22%2C%22customerId%22%3A4210%2C%22login%22%3A%22CyberNest333%22%2C%22userRole%22%3A%7B%22name%22%3A%22Admin%22%2C%22permissions%22%3A%5B%7B%22name%22%3A%22settings%22%7D%2C%7B%22name%22%3A%22configurations%22%7D%2C%7B%22name%22%3A%22edit_devices%22%7D%2C%7B%22name%22%3A%22applications%22%7D%2C%7B%22name%22%3A%22edit_device_desc%22%7D%2C%7B%22name%22%3A%22edit_applications%22%7D%2C%7B%22name%22%3A%22edit_device_app_settings%22%7D%2C%7B%22name%22%3A%22plugin_deviceinfo_access%22%7D%2C%7B%22name%22%3A%22edit_application_versions%22%7D%2C%7B%22name%22%3A%22plugins_customer_access_management%22%7D%2C%7B%22name%22%3A%22files%22%7D%2C%7B%22name%22%3A%22plugin_devicelocations_access%22%7D%2C%7B%22name%22%3A%22plugin_messaging_send%22%7D%2C%7B%22name%22%3A%22plugin_messaging_delete%22%7D%2C%7B%22name%22%3A%22plugin_audit_access%22%7D%2C%7B%22name%22%3A%22plugin_deviceexport_access%22%7D%2C%7B%22name%22%3A%22plugin_deviceimport_access%22%7D%2C%7B%22name%22%3A%22plugin_devicelocations_settings_access%22%7D%2C%7B%22name%22%3A%22plugin_devicelog_access%22%7D%2C%7B%22name%22%3A%22plugin_devicereset_access%22%7D%2C%7B%22name%22%3A%22plugin_licensing_access%22%7D%2C%7B%22name%22%3A%22plugin_photo_remove_photo%22%7D%2C%7B%22name%22%3A%22plugin_contacts_access%22%7D%2C%7B%22name%22%3A%22plugin_apuppet_access%22%7D%2C%7B%22name%22%3A%22plugin_knox_access%22%7D%2C%7B%22name%22%3A%22add_config%22%7D%2C%7B%22name%22%3A%22copy_config%22%7D%2C%7B%22name%22%3A%22plugin_openvpn_access%22%7D%2C%7B%22name%22%3A%22plugin_photo_access%22%7D%2C%7B%22name%22%3A%22push_api%22%7D%2C%7B%22name%22%3A%22plugin_push_send%22%7D%2C%7B%22name%22%3A%22plugin_push_delete%22%7D%2C%7B%22name%22%3A%22plugin_urlfilter_access%22%7D%2C%7B%22name%22%3A%22get_updates%22%7D%2C%7B%22name%22%3A%22edit_files%22%7D%2C%7B%22name%22%3A%22enroll_devices%22%7D%5D%2C%22id%22%3A2%2C%22superAdmin%22%3Afalse%7D%2C%22superAdmin%22%3Afalse%2C%22authToken%22%3A%22QFoE3rjYAhHBym2I4yeW%22%2C%22allConfigAvailable%22%3Atrue%2C%22passwordReset%22%3Afalse%2C%22masterCustomer%22%3Afalse%2C%22editable%22%3Afalse%2C%22configurations%22%3A%5B%5D%7D; deviceSearch=%7B%22searchParams%22%3A%7B%7D%2C%22paging%22%3A%7B%22pageNum%22%3A1%2C%22pageSize%22%3A50%2C%22totalItems%22%3A3%2C%22sortBy%22%3Anull%2C%22sortAsc%22%3Atrue%7D%2C%22additionalParams%22%3A%7B%22enabled%22%3Afalse%2C%22dateFrom%22%3Anull%2C%22dateTo%22%3Anull%2C%22launcherVersion%22%3A%22%22%2C%22installationStatus%22%3Anull%2C%22androidVersion%22%3A%22%22%2C%22onlineOrOffline%22%3Anull%2C%22onlineTimeSelect%22%3Anull%2C%22onlineTimeEnter%22%3A%2215%22%2C%22kioskMode%22%3Anull%2C%22mdmMode%22%3Anull%7D%2C%22selection%22%3A%7B%22all%22%3Afalse%2C%22groupId%22%3A-1%2C%22configurationId%22%3A-1%7D%7D";

exports.sendCommand = async (deviceId, command) => {
  try {
    let payload = {
      deviceId: parseInt(deviceId),
      message: "Command from CyberNest",
    };

    // COMMAND mapping
    if (command === "lock") {
      payload.lock = true;
    }

    const response = await axios.put(HEADWIND_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Cookie": COOKIE,
      },
    });

    return response.data;

  } catch (error) {
    console.error("Headwind Error:", error.response?.data || error.message);
    throw error;
  }
};