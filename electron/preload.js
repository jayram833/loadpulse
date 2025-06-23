const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api', {
    getChannels: () => ipcRenderer.invoke("get-channels"),
    getMessagesForChannel: (channelId) => ipcRenderer.invoke("get-messages", channelId),
    onNewMessage: (callback) => ipcRenderer.on('new-message', (_, msg) => callback(msg)),
});

