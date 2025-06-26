const db = require('./db.cjs');



function createTables() {
  db.prepare(`
  CREATE TABLE IF NOT EXISTS channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `).run();

  db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    channel_id INTEGER NOT NULL,
    load_id TEXT,
    account_name TEXT,
    origin_city TEXT,
    origin_state TEXT,
    origin_country TEXT,
    destination_city TEXT,
    destination_state TEXT,
    destination_country TEXT,
    pickup_date TEXT,
    delivery_date TEXT,
    weight TEXT,
    make_bid INTEGER,
    bid_price TEXT,
    timestamp TEXT,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
  );
`).run();
}

function getChannels() {
  return db.prepare(`SELECT * FROM channels`).all();
}

function getMsgById(id) {
  return db.prepare(`SELECT * FROM messages WHERE id = ?`).all(id);
}

function insertMessage(message) {
  const { content, channel } = message;

  const insertStatement = db.prepare(`
    INSERT INTO messages (
      channel_id, load_id, account_name,
      origin_city, origin_state, origin_country,
      destination_city, destination_state, destination_country,
      pickup_date, delivery_date, weight, make_bid, bid_price,
      timestamp
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    );
  `);

  const { channel_id, load_id, account_name,
    origin_city, origin_state, origin_country,
    destination_city, destination_state, destination_country,
    pickup_date, delivery_date, weight, make_bid, bid_price,
    timestamp } = content;

  const { lastInsertRowid } = insertStatement.run(channel_id, load_id, account_name,
    origin_city, origin_state, origin_country,
    destination_city, destination_state, destination_country,
    pickup_date, delivery_date, weight, make_bid, bid_price,
    timestamp);
  return lastInsertRowid;
}



function getMessages(channelId) {
  return db.prepare(`SELECT * FROM messages WHERE channel_id = ? ORDER BY timestamp DESC`).all(channelId);
}

function addChannel(newChannel) {
  const { name, description } = newChannel;
  db.prepare(`
    INSERT INTO channels (name, description, created_at)
    VALUES (?, ?, datetime('now'));
  `).run(name, description);
  return getChannels();
}

// Testing purpose
// db.prepare(`DELETE FROM messages`).run();

// db.prepare(`DELETE FROM channels WHERE id=?`).run(7);


module.exports = {
  createTables,
  insertMessage,
  getChannels,
  getMessages,
  addChannel,
  getMsgById
};
