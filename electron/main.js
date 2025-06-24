import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import installExtension from "electron-devtools-installer";
import WebSocket from "ws";
import { insertMessage } from "./database/dbOperations.js";


const isDev = !app.isPackaged;
import "./ipc.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;


let reconnectInterval;
let reconnectStartTime;

function setupWebSocket(mainWindow) {
    const socket = new WebSocket('wss://loadpulse.onrender.com');

    socket.on('open', () => {
        console.log('🔌 Connected to WebSocket server');
        clearInterval(reconnectInterval);
        reconnectStartTime = null;
    });

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        insertMessage(message.content);
        mainWindow.webContents.send('new-message', message.content);
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
                    setupWebSocket(mainWindow);
                }
            }, 2000);
        }
    })

    socket.on('error', (err) => {
        console.error('❌ WebSocket error:', err.message);
        socket.close();
    });
}
const createWindow = async function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, "../src/assets/icons/icon.icns"),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    })

    if (isDev) {
        mainWindow.loadURL("http://localhost:5173");
    } else {
        mainWindow.loadFile(path.join(__dirname, "../dist/index.html"))
        app.disableHardwareAcceleration();
    }

    setupWebSocket(mainWindow);

    if (isDev) {
        installExtension.default(installExtension.REACT_DEVELOPER_TOOLS).then((ext) => console.log(`Added Extension: ${ext.name}`)).catch((err) => console.log("Error installing extension:", err));

        // open devtools
        mainWindow.webContents.openDevTools();
    }


    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


