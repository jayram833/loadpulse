
const { app, BrowserWindow } = require("electron");
const path = require("path");
const WebSocket = require("ws");
const { insertMessage } = require("./database/dbOperations.js");
require("./ipc");

const isDev = !app.isPackaged;

let mainWindow;


let reconnectInterval;
let reconnectStartTime;
let socket;
// app.disableHardwareAcceleration();

function setupWebSocket(mainWindow) {
    console.log("connection started")
    socket = new WebSocket('wss://loadpulse.onrender.com');

    socket.on('open', () => {
        console.log('🔌 Connected to WebSocket server');
        mainWindow.webContents.send("connection", "🔌 Connected to WebSocket server")
        clearInterval(reconnectInterval);
        reconnectStartTime = null;
    });

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        insertMessage(message.content);
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('new-message', message.content);
        }
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
    }
    mainWindow.webContents.once("did-finish-load", () => {
        setupWebSocket(mainWindow);
    })

    if (isDev) {
        const installExtension = require("electron-devtools-installer");
        installExtension.default(installExtension.REACT_DEVELOPER_TOOLS).then((ext) => console.log(`Added Extension: ${ext.name}`)).catch((err) => console.log("Error installing extension:", err));
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

app.on("before-quit", () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("Closing WebSocket before app quit...");
        socket.close();
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});


