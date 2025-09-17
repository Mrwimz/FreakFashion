const Database = require("better-sqlite3");

// Create or open the database
const db = new Database("./db/database.sqlite");

// Create tables if they don’t exist
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT,
    description TEXT,
    price REAL NOT NULL,
    publish_date TEXT,
    sku TEXT UNIQUE,
    image TEXT,
    slug TEXT UNIQUE,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin INTEGER DEFAULT 0,
    liked_products TEXT
  );
`);

module.exports = db;
