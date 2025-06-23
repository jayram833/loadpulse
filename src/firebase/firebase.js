import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BAST7-Z_iExjA33SVPiYt6DuX216jZMyC0PpEJUc8rJyAbeLp5d0dMAVNYXFSVw3wMEbPLAXb7r2zphxC1Allh8"

const firebaseConfig = {
    apiKey: "AIzaSyAm3AH-wf5Nh7RywmdrtCR7EO8nAN_0cn8",
    authDomain: "loadpulse-36d61.firebaseapp.com",
    projectId: "loadpulse-36d61",
    storageBucket: "loadpulse-36d61.firebasestorage.app",
    messagingSenderId: "595176104513",
    appId: "1:595176104513:web:10fe00ea9e203995dedcc0",
    measurementId: "G-F2BDNY9Z1H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermissionAndGetToken = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.warn("Notification permission not granted.");
            return;
        }
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY
        });
        console.log("FCM Token:", token);
        return token;
    } catch (err) {
        console.error("FCM Token Error:", err);
    }
};

export const listenToMessages = (onReceive) => {
    onMessage(messaging, (payload) => {
        console.log("Received in foreground: ", payload);
        onReceive(payload.data); // Custom handler in your app
    });
};

export { messaging, app };