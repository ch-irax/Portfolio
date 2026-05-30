/**
 * Portfolio Backend Server
 * Clean and simple Node.js backend with Express
 * Serves contact form submissions to SQLite database
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('📋 Environment:', process.env.NODE_ENV || 'development');

// ============================================
// MIDDLEWARE SETUP
// ============================================

// 🛡️ Security headers with Helmet
app.use(helmet());
console.log('✅ Security middleware (Helmet) enabled');

// 🌐 CORS — FIXED (allows localhost dev servers)
app.use(
  cors({
    origin: [
      'http://localhost:3000',     // your frontend port
      'http://127.0.0.1:3000',      // your exact IP:port
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      process.env.FRONTEND_URL || '*',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
console.log('✅ CORS enabled (localhost dev servers)');
// 🚦 Rate limiting - Prevent abuse of contact endpoint
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many contact submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
console.log('✅ Rate limiting enabled (5 requests per 15 min)');

// 📦 Body parsing - Parse JSON and URL-encoded data
app.use(express.json({ limit: '10kb' })); // Limit payload size to 10KB
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// ====================== EMAIL CONFIG ======================
import { sendContactNotification } from './email.js';

// Log status once at startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  console.log('✅ Email notifications enabled (Gmail)');
} else {
  console.log('⚠️  Email notifications disabled. Set EMAIL_USER and EMAIL_PASS in .env');
}



// ============================================
// ROUTES
// ============================================

// Health check endpoint (useful for monitoring)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
console.log('✅ Route: GET /health (health check)');

// API routes with rate limiting
app.use('/api', contactLimiter, routes);
console.log('✅ Route: POST /api/contact (with rate limiting)');
console.log('✅ Route: GET /api/contacts (retrieve all)');

// ============================================
// ERROR HANDLING
// ============================================

// 404 - Route not found
app.use((req, res) => {
  console.warn(`⚠️  404: ${req.method} ${req.path} not found`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler - catches all errors from routes
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message || err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Portfolio Backend Server Started');
  console.log('='.repeat(60));
  console.log(`\n📍 Server URL: http://localhost:${PORT}`);
  console.log(`\n📧 Contact Endpoint:`);
  console.log(`   POST http://localhost:${PORT}/api/contact`);
  console.log(`\n💚 Health Check:`);
  console.log(`   GET http://localhost:${PORT}/health`);
  console.log(`\n📊 View Contacts (Admin):`);
  console.log(`   GET http://localhost:${PORT}/api/contacts`);
  console.log('\n' + '='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down server...');
  process.exit(0);
});
