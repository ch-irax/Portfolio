/**
 * API Routes - Portfolio Backend
 * Handles contact form submissions and contact retrieval
 */

import express from 'express';
import Contact from './models/Contact.js';
import { connectDB } from './database.js';

const router = express.Router();

/**
 * POST /api/contact
 * Submit a new contact form message
 * 
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "message": "Your message here"
 * }
 * 
 * Response: { success: true, message: "...", contact: {...} }
 */
router.post('/contact', async (req, res) => {
  console.log('📧 [Contact] New submission received');

  try {
    // Ensure database is connected
    const connected = await connectDB();
    if (!connected) {
      return res.status(503).json({ 
        error: 'Database connection failed. Please try again later.'
      });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanMessage = message.trim();

    // Save to database
    const contact = await Contact.createSubmission(cleanName, cleanEmail, cleanMessage);
    console.log(`✅ [Contact] Saved: ID ${contact._id} from ${cleanEmail}`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      contact,
    });
  } catch (error) {
    console.error('❌ [Contact] Error:', error.message || error);
    res.status(500).json({ 
      error: error.message || 'Failed to save message' 
    });
  }
});
/**
 * GET /api/contacts
 * Retrieve all contact form submissions
 * ⚠️ WARNING: In production, add authentication to protect this endpoint
 * 
 * Response: { count: 10, contacts: [...] }
 */
router.get('/contacts', async (req, res) => {
  console.log('📑 [Contacts] Retrieving all submissions');
  
  try {
    // Ensure database is connected
    const connected = await connectDB();
    if (!connected) {
      return res.status(503).json({ 
        error: 'Database connection failed. Please try again later.'
      });
    }

    const contacts = await Contact.getAll();
    console.log(`✅ [Contacts] Retrieved ${contacts.length} submissions`);
    res.json({
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error('❌ [Contacts] Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch contacts' });
  }
});

export default router;
