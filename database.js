/**
 * SQLite Database Configuration
 * Handles database initialization, schema creation, and promisified query methods
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp for Vercel (ephemeral storage) or local db folder for development
const dbDir = process.env.VERCEL 
  ? '/tmp'
  : path.join(__dirname, 'db');

// Create db directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'portfolio.db');

// ============================================
// DATABASE CONNECTION
// ============================================

let db;
let dbReady = false;
let dbError = null;

try {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      dbError = err;
      dbReady = false;
    } else {
      console.log('✅ Connected to SQLite database');
      console.log(`   Location: ${dbPath}`);
      dbReady = true;
      
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
              dbError = err;
            } else {
              console.log('✅ Database table "contacts" ready');
            }
          }
        );
      });
    }
  });
} catch (err) {
  console.error('❌ Failed to initialize database:', err.message);
  dbError = err;
  dbReady = false;
}

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

export { db, dbReady, dbError, dbRun, dbAll, dbGet };
