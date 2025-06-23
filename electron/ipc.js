import { ipcMain } from "electron";
import { createTables, getChannels, getMessages } from "./database/dbOperations.js";

createTables();


ipcMain.handle("get-channels", async () => {
    return await getChannels();
})


ipcMain.handle("get-messages", async (e, channelId) => {
    return await getMessages(channelId);
})

