/**
 * SQLite Database Configuration
 * Handles database initialization, schema creation, and promisified query methods
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file path (stored in db/ folder)
const dbPath = path.join(__dirname, 'db', 'portfolio.db');

// ============================================
// DATABASE CONNECTION
// ============================================

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
  console.log(`   Location: ${dbPath}`);
});

// ============================================
// DATABASE SCHEMA INITIALIZATION
// ============================================

// Create tables if they don't exist
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error('❌ Failed to create contacts table:', err.message);
      } else {
        console.log('✅ Database table "contacts" ready');
      }
    }
  );
});

// ============================================
// PROMISIFY DATABASE METHODS
// ============================================
// These helper functions convert SQLite3 callbacks to Promises for async/await

/**
 * Execute INSERT, UPDATE, DELETE queries
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise} - Resolves with lastID and changes count
 */
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

/**
 * Execute SELECT queries that return multiple rows
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<array>} - Resolves with array of rows
 */
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

/**
 * Execute SELECT queries that return a single row
 * @param {string} sql - SQL query
 * @param {array} params - Query parameters
 * @returns {Promise<object>} - Resolves with single row or undefined
 */
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export { db, dbRun, dbAll, dbGet };
