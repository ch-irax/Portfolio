/**
 * Vercel Serverless Function Entry Point
 * MongoDB-based Express app for Vercel
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from '../routes.js';

const app = express();

// 🛡️ Security headers with Helmet
app.use(helmet());

// 🌐 CORS - Allow requests from deployed frontend
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'https://portfolio-frontend.vercel.app',
      process.env.FRONTEND_URL || '*',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 🚦 Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many contact submissions. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health', // Skip rate limiting for health check
});

// 📦 Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL ? 'vercel' : 'local',
    database: process.env.MONGODB_URI ? 'mongodb' : 'not configured'
  });
});

// API routes with rate limiting
app.use('/api', contactLimiter, routes);

// 404 - Route not found
app.use((req, res) => {
  console.warn(`⚠️  404: ${req.method} ${req.path} not found`);
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message || err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

export default app;
