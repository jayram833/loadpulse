import db from './db.js';

function createTables() {
  db.prepare(`
  CREATE TABLE IF NOT EXISTS channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `).run();

  db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
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
    type TEXT,
    title TEXT,
    timestamp TEXT,
    FOREIGN KEY (channel_id) REFERENCES channels(id) ON DELETE CASCADE
  );
`).run();
}


function insertMessage(message) {
  const { content, channel } = message;

  const insertStatement = db.prepare(`
  INSERT INTO messages (
    id, channel_id, load_id, account_name,
    origin_city, origin_state, origin_country,
    destination_city, destination_state, destination_country,
    pickup_date, delivery_date, weight, make_bid, bid_price,
    type, title, timestamp
  ) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
  );
`);

  const { id, channel_id, load_id, account_name,
    origin_city, origin_state, origin_country,
    destination_city, destination_state, destination_country,
    pickup_date, delivery_date, weight, make_bid, bid_price,
    type, title, timestamp } = content;

  insertStatement.run(id, channel_id, load_id, account_name,
    origin_city, origin_state, origin_country,
    destination_city, destination_state, destination_country,
    pickup_date, delivery_date, weight, make_bid, bid_price,
    type, title, timestamp);
}

function getChannels() {
  return db.prepare(`SELECT * FROM channels`).all();
}

function getMessages(channelId) {
  return db.prepare(`SELECT * FROM messages WHERE channel_id = ? ORDER BY timestamp DESC`).all(channelId);
}

function addChannel(newChannel) {
  const { id, name, description } = newChannel;
  db.prepare(`
    INSERT INTO channels (id, name, description, created_at)
    VALUES (?, ?, ?, datetime('now'));
  `).run(id, name, description);
  return getChannels();
}



export { createTables, insertMessage, getChannels, getMessages, addChannel }