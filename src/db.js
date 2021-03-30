const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const SETUP = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    super_admin INTEGER NOT NULL,
    password TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`;

let db;

/**
 * Connects to the database and creates the database tables, if they don't
 * already exist.
 *
 * @returns Database object.
 */
async function connect() {
  db = await open({
    driver: sqlite3.Database,
    filename: "database.db",
  });
  await db.exec(SETUP);
}

/**
 * Special middleware factory function that adds a `db` field to each incoming
 * Express request.
 *
 * @returns Middleware function.
 */
function database() {
  return function databaseMiddleware(req, res, next) {
    if (!db) {
      throw new Error("connect() never called!");
    }
    req.db = db;
    next();
  };
}

module.exports = {
  connect,
  database,
};
