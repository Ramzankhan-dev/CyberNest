// const admin = require("firebase-admin");

// const serviceAccount = require("../config/serviceAccountKey.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const sendPushNotification = async (token, data) => {
//   const message = {
//     token: token,
//     data: data,
//   };

//   try {
//     //for console debuging
//     console.log("Sending FCM...");
//     console.log("Token:", token);
//     console.log("Data:", data);

//     await admin.messaging().send(message);
//     console.log("Notification sent");
//   } catch (error) {
//     console.error("FCM Error:", error);
//   }
// };

// module.exports = { sendPushNotification };

// const admin = require("firebase-admin");

// let firebaseInitialized = false;

// try {
//   // 🔥 Try to load service account (if exists)
//   const serviceAccount = require("../config/serviceAccountKey.json");

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });

//   firebaseInitialized = true;
//   console.log("Firebase initialized ✅");
// } catch (err) {
//   console.log("Firebase not initialized (serviceAccount missing) ⚠️");
// }

// // ✅ Function (safe)
// const sendPushNotification = async (token, data) => {
//   if (!firebaseInitialized) {
//     console.log("FCM skipped (Firebase not configured)");
//     return;
//   }

//   const message = {
//     token: token,
//     data: data,
//   };

//   try {
//     console.log("Sending FCM...");
//     console.log("Token:", token);
//     console.log("Data:", data);

//     await admin.messaging().send(message);
//     console.log("Notification sent ✅");
//   } catch (error) {
//     console.error("FCM Error:", error);
//   }
// };

// module.exports = { sendPushNotification };

const admin = require("firebase-admin");

let firebaseInitialized = false;

try {
  const serviceAccount = require("../config/serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  firebaseInitialized = true;
  console.log("Firebase initialized ✅");
} catch (err) {
  console.log("Firebase not initialized ⚠️");
}

const sendPushNotification = async (token, data) => {
  if (!firebaseInitialized) {
    console.log("FCM skipped");
    return;
  }

  const message = {
    token,
    data,
  };

  try {
    await admin.messaging().send(message);
    console.log("Notification sent ✅");
  } catch (error) {
    console.error("FCM Error:", error);
  }
};

module.exports = { sendPushNotification };