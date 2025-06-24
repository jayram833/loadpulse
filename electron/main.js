import { app, BrowserWindow } from "electron";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import installExtension from "electron-devtools-installer";
import { setupWebSocket } from "./setupWebSocket.js";


const isDev = !app.isPackaged;
import "./ipc.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;


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


