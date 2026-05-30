/**
 * Contact Model
 * Handles database operations for contact form submissions
 */

import { dbRun, dbAll, dbGet } from '../database.js';

class Contact {
  /**
   * Create a new contact submission
   * @param {string} name - Contact name
   * @param {string} email - Contact email
   * @param {string} message - Contact message
   * @returns {Promise<object>} - Created contact with ID and timestamp
   */
  static async create(name, email, message) {
    const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
    const result = await dbRun(sql, [name, email, message]);
    return {
      id: result.lastID,
      name,
      email,
      message,
      submitted_at: new Date().toISOString(),
    };
  }

  /**
   * Retrieve all contact submissions, ordered by most recent first
   * @returns {Promise<array>} - Array of all contacts
   */
  static async getAll() {
    const sql = 'SELECT * FROM contacts ORDER BY submitted_at DESC';
    return await dbAll(sql);
  }

  /**
   * Retrieve a single contact by ID
   * @param {number} id - Contact ID
   * @returns {Promise<object>} - Contact object or undefined if not found
   */
  static async getById(id) {
    const sql = 'SELECT * FROM contacts WHERE id = ?';
    return await dbGet(sql, [id]);
  }

  /**
   * Delete a contact by ID
   * @param {number} id - Contact ID
   * @returns {Promise<boolean>} - True if deleted, false if not found
   */
  static async delete(id) {
    const sql = 'DELETE FROM contacts WHERE id = ?';
    const result = await dbRun(sql, [id]);
    return result.changes > 0;
  }
}

export default Contact;
