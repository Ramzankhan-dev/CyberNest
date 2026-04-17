const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendPushNotification = async (token, data) => {
  const message = {
    token: token,
    data: data,
  };

  try {
    await admin.messaging().send(message);
    console.log("Notification sent");
  } catch (error) {
    console.error("FCM Error:", error);
  }
};

module.exports = { sendPushNotification };