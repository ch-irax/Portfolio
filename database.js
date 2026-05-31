/**
 * MongoDB Database Configuration
 * Handles database connection and initialization
 */

import mongoose from 'mongoose';

let dbConnected = false;
let dbError = null;

/**
 * Connect to MongoDB
 * @returns {Promise<boolean>} - True if connected, false otherwise
 */
async function connectDB() {
  if (dbConnected) {
    return true;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    dbConnected = true;
    dbError = null;
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    dbConnected = false;
    dbError = error;
    return false;
  }
}

export { mongoose, connectDB, dbConnected, dbError };
