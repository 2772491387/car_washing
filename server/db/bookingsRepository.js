const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const dataDir = path.resolve(__dirname, "..", "data");
const dbPath = process.env.DB_PATH || path.join(dataDir, "bookings.sqlite");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    car TEXT,
    service TEXT,
    date TEXT,
    time TEXT,
    note TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const insertBooking = db.prepare(`
  INSERT INTO bookings (name, phone, car, service, date, time, note)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const findBooking = db.prepare(`
  SELECT
    id,
    name,
    phone,
    car,
    service,
    date,
    time,
    note,
    created_at AS createdAt
  FROM bookings
  WHERE id = ?
`);

const listBookings = db.prepare(`
  SELECT
    id,
    name,
    phone,
    car,
    service,
    date,
    time,
    note,
    created_at AS createdAt
  FROM bookings
  ORDER BY id DESC
  LIMIT ?
`);

function createBooking(booking) {
  const result = insertBooking.run(
    booking.name,
    booking.phone,
    booking.car,
    booking.service,
    booking.date,
    booking.time,
    booking.note
  );

  return findBooking.get(result.lastInsertRowid);
}

function getRecentBookings(limit = 50) {
  return listBookings.all(limit);
}

module.exports = {
  createBooking,
  getRecentBookings,
  dbPath
};
