const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const Database = require("better-sqlite3");

const userDataPath = app.getPath("userData");
const dbDir = path.join(userDataPath, "database");
const dbPath = path.join(dbDir, "loadpulse.db");


if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const preloadedDb = path.join(process.resourcesPath, "loadpulse.db");
if (!fs.existsSync(dbPath) && fs.existsSync(preloadedDb)) {
    fs.copyFileSync(preloadedDb, dbPath);
}

const db = new Database(dbPath);
module.exports = db;
