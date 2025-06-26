const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('api', {
    getConnectionStatus: (callback) => ipcRenderer.on("connection", callback),
    getChannels: () => ipcRenderer.invoke("get-channels"),
    getMessagesForChannel: (channelId) => ipcRenderer.invoke("get-messages", channelId),
    onNewMessage: (callback) => {
        ipcRenderer.on('new-message', callback);
        return () => ipcRenderer.removeListener('new-message', callback);
    },
    addChannel: (entry) => ipcRenderer.invoke("add-channel", entry),
    insertMessageToDB: (msg) => ipcRenderer.invoke("insert-message", msg),
    getMessageById: (id) => ipcRenderer.invoke("get-msg-by-id", id),
});



