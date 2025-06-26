const { ipcMain } = require("electron");
const {
    createTables,
    getChannels,
    getMessages,
    addChannel,
    insertMessage,
    getMsgById
} = require("./database/dbOperations");


createTables();

ipcMain.handle("get-channels", async () => {
    return await getChannels();
})


ipcMain.handle("get-messages", async (e, channelId) => {
    return await getMessages(channelId);
})


ipcMain.handle("add-channel", async (e, newChannel) => {
    return await addChannel(newChannel);
})


ipcMain.handle("insert-message", async (e, newMsg) => {
    return await insertMessage(newMsg);
})

ipcMain.handle("get-msg-by-id", async (e, id) => {
    return await getMsgById(id)
})