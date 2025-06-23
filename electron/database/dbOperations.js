import db from './db.js';

function createTables() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subscribed INTEGER DEFAULT 1
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



function insertData() {

  // Insert sample channels
  const insertChannel = db.prepare(`
  INSERT OR IGNORE INTO channels (id, name) VALUES (?, ?);
`);

  insertChannel.run("load-bot", "Load Bot");
  insertChannel.run("east-coast", "East Coast Bids");

  // Insert sample messages
  const insertMessage = db.prepare(`
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
}


function insertMessage({ id, channel, content, timestamp }) {
  console.log(content)
  const stmt = db.prepare(`
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
  stmt.run(id, channel, JSON.stringify(content), timestamp);
}

function getChannels() {
  return db.prepare(`SELECT * FROM channels`).all();
}

function getMessages(channelId) {
  return db.prepare(`SELECT * FROM messages WHERE channel_id = ? ORDER BY timestamp DESC`).all(channelId);
}



export { createTables, insertMessage, getChannels, getMessages }