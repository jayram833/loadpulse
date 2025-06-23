import { ipcMain } from "electron";
import { createTables, insertData, getChannels, getMessages } from "./database/dbOperations.js";

createTables();

// insertData();



ipcMain.handle("get-channels", async () => {
    return await getChannels();
})


ipcMain.handle("get-messages", async (e, channelId) => {
    return await getMessages(channelId);
})

