import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import installExtension from "electron-devtools-installer";
import WebSocket from 'ws';
import { insertMessage } from "./database/dbOperations.js";


import "./ipc.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function setupWebSocket(win) {
    const socket = new WebSocket('wss://loadpulse.onrender.com');

    socket.on('open', () => {
        console.log('🔌 Connected to WebSocket server');
    });

    socket.on('message', (data) => {
        const message = JSON.parse(data);
        console.log('📩 Message received:', message);


        insertMessage(message.content);

        win.webContents.send('new-message', message);
    });

    socket.on('error', console.error);
}


const createWindow = function () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    })

    mainWindow.loadURL("http://localhost:5173");

    setupWebSocket(mainWindow);



    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
        .then((ext) => console.log(`Added Extension: ${ext.name}`))
        .catch((err) => console.log("Error installing extension:", err));

    // open devtools
    mainWindow.webContents.openDevTools();

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

