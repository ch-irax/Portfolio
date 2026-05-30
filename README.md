# Portfolio Backend - Node.js + Express + SQLite

A clean, simple, and production-ready backend for your personal portfolio website. Handles contact form submissions with zero database configuration.

## Features

- **Express.js** - Minimal HTTP server framework
- **SQLite** - Zero-config embedded database (single file, no setup)
- **Security** - CORS, Helmet security headers, rate limiting
- **Error Handling** - Graceful error management with detailed logging
- **Clean Code** - Well-commented, modular structure
- **No ORMs** - Direct SQLite queries for simplicity and speed

## Tech Stack

- **Node.js** 18+ with ES Modules
- **Express.js** 4.x
- **SQLite3** (pure `sqlite3` driver)
- **Helmet** (security headers)
- **CORS** (cross-origin requests)
- **Express Rate Limit** (request throttling)

## Project Structure

```
├── server.js                 # Main Express server entry point
├── database.js              # SQLite setup and query helpers
├── routes.js                # API endpoint handlers
├── models/
│   └── Contact.js           # Contact model with CRUD methods
├── db/
│   └── portfolio.db         # SQLite database (auto-created)
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server
- `sqlite3` - Database
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-rate-limit` - Request throttling

### 2. Start the Server

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

You should see:

```
✅ Security middleware (Helmet) enabled
✅ CORS enabled
✅ Rate limiting enabled (5 requests per 15 min)
✅ Connected to SQLite database
   Location: /path/to/db/portfolio.db
✅ Database table "contacts" ready

============================================================
🚀 Portfolio Backend Server Started
============================================================

📍 Server URL: http://localhost:5000

📧 Contact Endpoint:
   POST http://localhost:5000/api/contact

💚 Health Check:
   GET http://localhost:5000/health

📊 View Contacts (Admin):
   GET http://localhost:5000/api/contacts

============================================================
```

## API Endpoints

### Health Check

Verify the server is running:

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-30T10:47:00.000Z"
}
```

### Submit Contact Form

```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to work with you!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Thank you for your message! I will get back to you soon.",
  "contact": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I'd like to work with you!",
    "submitted_at": "2026-05-30T10:47:00.523Z"
  }
}
```

**Validation:**
- All fields (name, email, message) required
- Email must be valid format
- Message limited to 5000 characters
- Rate limited: 5 submissions per 15 minutes

### Get All Contacts (Admin)

⚠️ **In production, add authentication to protect this endpoint**

```http
GET /api/contacts
```

**Response:**
```json
{
  "count": 2,
  "contacts": [
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "message": "Great work!",
      "submitted_at": "2026-05-30 10:47:14"
    },
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "message": "I'd like to work with you!",
      "submitted_at": "2026-05-30 10:47:07"
    }
  ]
}
```

## Frontend Integration

Update your HTML contact form to submit to the backend:

```html
<form id="contactForm">
  <input type="text" id="name" placeholder="Your Name" required>
  <input type="email" id="email" placeholder="Your Email" required>
  <textarea id="message" placeholder="Your Message" required></textarea>
  <button type="submit">Send</button>
</form>

<script>
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const response = await fetch('http://localhost:5000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      message: document.getElementById('message').value
    })
  });

  const data = await response.json();

  if (data.success) {
    alert('Thank you! Your message has been sent.');
    document.getElementById('contactForm').reset();
  } else {
    alert('Error: ' + data.error);
  }
});
</script>
```

## Configuration

### Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Options:**
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend domain for CORS (default: allows all)
- `NODE_ENV` - Environment mode (default: development)

### Rate Limiting

Configured in `server.js`:
- **Window**: 15 minutes
- **Limit**: 5 submissions per IP per window
- **Message**: User-friendly error message

To adjust, edit `server.js`:

```javascript
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // Change this (in milliseconds)
  max: 5,                     // Change this (max requests)
  // ...
});
```

### Security Headers

Provided by **Helmet.js** - no configuration needed. Includes:
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Strict-Transport-Security (HSTS)

### CORS Settings

Default allowed origins in `server.js`:
```javascript
origin: [
  'http://localhost:3000',    // React dev
  'http://localhost:5173',    // Vite dev
  'http://localhost:8000',    // Common dev port
  process.env.FRONTEND_URL || '*',
]
```

## Database

### Schema

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Location

SQLite database file: `db/portfolio.db`

**Important:** Never commit `db/portfolio.db` to Git (already in `.gitignore`)

### Query Helpers

In `database.js`, three promisified methods available:

```javascript
// Insert, Update, Delete
const result = await dbRun('INSERT INTO contacts ...', params);

// Select multiple rows
const rows = await dbAll('SELECT * FROM contacts ...', params);

// Select single row
const row = await dbGet('SELECT * FROM contacts WHERE id = ?', [1]);
```

## Development

### Logs

The server outputs detailed logs with emojis for quick scanning:

```
✅ Success/Ready
❌ Error
⚠️  Warning
📧 Contact-related
📍 Server info
🚀 Startup
⏹️  Shutdown
```

### Watch Mode

For development with auto-reload:

```bash
npm run dev
```

Requires Node.js `--watch` flag (Node 18.11+)

### Testing Endpoints

Using PowerShell:

```powershell
# Test health check
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing

# Submit contact
$body = @{
  name = "Test User"
  email = "test@example.com"
  message = "Testing the API"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/contact" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body `
  -UseBasicParsing

# Get all contacts
Invoke-WebRequest -Uri "http://localhost:5000/api/contacts" -UseBasicParsing
```

## Production Deployment

### Security Checklist

- [ ] Add authentication to `/api/contacts` endpoint
- [ ] Set `NODE_ENV=production` in environment
- [ ] Configure `FRONTEND_URL` to your actual domain
- [ ] Update CORS origins to your domain only
- [ ] Back up `db/portfolio.db` regularly
- [ ] Use HTTPS (add reverse proxy like Nginx)
- [ ] Monitor logs for errors

### Hosting Options

1. **Heroku** - Easy deployment with Git
2. **Railway.app** - Modern Node.js hosting
3. **Render** - Free tier available
4. **DigitalOcean** - Virtual machine or App Platform
5. **AWS** - EC2 or Elastic Beanstalk

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process (Windows)
taskkill /PID <PID> /F
```

### Database Locked

If you get "database is locked" errors:
1. Restart the server
2. Check for multiple server instances running
3. Delete `db/portfolio.db` and restart (fresh database)

### CORS Errors

Add your frontend URL to the `origin` array in `server.js`:

```javascript
origin: [
  'http://localhost:3000',
  'https://myportfolio.com',  // Add this
  // ...
]
```

## License

MIT

## Questions?

See the inline comments in each file for detailed explanations.
