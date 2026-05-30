
<<<<<<< HEAD
A clean, simple, and production-ready backend for your personal portfolio website. Handles contact form submissions with zero database configuration.

---

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

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

### 🚀 Features

- Beautiful hover animations & micro-interactions
- Smooth scroll navigation with mobile menu
- Contact form with rate limiting + email notifications
- Dark mode • Responsive design (mobile-first)
- Performance-optimized (lazy loading, optimized images)
- Admin view for viewing submissions (localhost only)

---

---

### 🛠️ Local Setup

#### 1. Frontend
```bash
cd frontend          # (if you split the repo)
npm install
npm run dev
cd backend
npm install
cp .env.example .env
# Fill in your EMAIL_USER and EMAIL_PASS
npm run dev
```


## 📧 Contact
Feel free to reach out via the form or find me on GitHub / LinkedIn. 
I respond to inquiries with the same care I put into the code.
=======
>>>>>>> origin/main
