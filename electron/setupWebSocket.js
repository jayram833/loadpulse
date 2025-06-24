import WebSocket from "ws";
import { insertMessage } from "./database/dbOperations.js";

let reconnectInterval;
let reconnectStartTime;

export function setupWebSocket(win) {
    const socket = new WebSocket('wss://loadpulse.onrender.com');

    socket.on('open', () => {
        console.log('🔌 Connected to WebSocket server');
        clearInterval(reconnectInterval); // Stop retries
        reconnectStartTime = null;
    });

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        insertMessage(message.content);
        win.webContents.send('new-message', message.content);
    });

    socket.on("close", () => {
        console.warn('🔌 WebSocket closed');
        if (!reconnectStartTime) {
            reconnectStartTime = Date.now();
        }
        if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
                const elapsed = Date.now() - reconnectStartTime;
                if (elapsed >= 30000) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                    reconnectStartTime = null;
                    console.error('❌ Failed to reconnect after 30 seconds.');
                } else {
                    console.log('♻️ Reconnecting WebSocket...');
                    connectWebSocket();
                }
            }, 2000);
        }
    })

    socket.on('error', (err) => {
        console.error('❌ WebSocket error:', err.message);
        socket.close();
    });
}
