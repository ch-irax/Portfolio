# Vercel Deployment Guide

## Overview
Your portfolio has two parts:
- **Frontend**: Static HTML/CSS/JS (deploys to Vercel)
- **Backend**: Node.js/Express server (needs separate hosting)

---

## PART 1: Deploy Backend to Vercel

### Step 1: Create `vercel.json` config file
Create a new file in your project root:

**File: `vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Create `.vercelignore` file
**File: `.vercelignore`**
```
node_modules
.env.local
.git
.DS_Store
README.md
assets/
css/
js/
index.html
package-lock.json
```

### Step 3: Update `package.json` (if needed)
Make sure your `package.json` has a `start` script:
```json
"scripts": {
  "start": "node --env-file=.env server.js",
  "dev": "node --env-file=.env --watch server.js"
}
```

### Step 4: Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **New Repository**
3. Name it `Portfolio` (or any name)
4. Choose **Public** or **Private**
5. Click **Create Repository**

### Step 5: Push code to GitHub
Run these commands in your project folder:
```bash
git init
git add .
git commit -m "Initial commit: Portfolio backend and frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 6: Deploy Backend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in (use GitHub for easier setup)
3. Click **Add New...** → **Project**
4. Click **Import Git Repository**
5. Paste your repository URL or select from list
6. Click **Import**
7. **Configure Project:**
   - Root Directory: `.` (leave default)
   - Framework Preset: **Other**
   - Build Command: Leave empty (or `npm run build` if needed)
   - Output Directory: Leave empty
8. Click **Deploy**

### Step 7: Add Environment Variables to Vercel
1. After deployment, go to **Settings** → **Environment Variables**
2. If you want email notifications (optional):
   - Add `EMAIL_USER` = your Gmail
   - Add `EMAIL_PASS` = your app password
3. Click **Save**
4. Redeploy project: **Settings** → **Git** → **Redeploy**

**Your backend will get a URL like:** `https://portfolio-abc123.vercel.app`

---

## PART 2: Deploy Frontend to Vercel

### Step 1: Update API URLs
In `js/main.js`, change all API calls to use your Vercel backend URL:

**Before:**
```javascript
const response = await fetch('http://localhost:5001/api/contact', {
```

**After:**
```javascript
const response = await fetch('https://portfolio-abc123.vercel.app/api/contact', {
```

Replace `portfolio-abc123` with your actual Vercel domain.

### Step 2: Create Separate Frontend Folder (Optional but Recommended)
```
Portfolio/
├── backend/
│   ├── server.js
│   ├── routes.js
│   ├── database.js
│   ├── package.json
│   ├── vercel.json
│   └── ...
├── frontend/
│   ├── index.html
│   ├── js/
│   ├── css/
│   ├── assets/
│   └── vercel.json
```

### Step 3: Create `vercel.json` for Frontend
**File: `frontend/vercel.json`**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.html"
    }
  ]
}
```

### Step 4: Push Frontend to New Repository
Create a separate repo for frontend (or use same repo):

```bash
git add .
git commit -m "Update API URLs for Vercel deployment"
git push origin main
```

### Step 5: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New...** → **Project**
3. Select your frontend repository
4. **Configure:**
   - Root Directory: `frontend/` (if separated) or `.` (if combined)
   - Framework Preset: **Other**
   - Build Command: Leave empty
   - Output Directory: Leave empty
5. Click **Deploy**

**Your frontend will get a URL like:** `https://portfolio-frontend.vercel.app`

---

## PART 3: Connect Frontend to Backend

### Update `js/main.js` with Backend URL
Replace all localhost URLs with your Vercel backend:

```javascript
const BACKEND_URL = 'https://portfolio-abc123.vercel.app';

const response = await fetch(`${BACKEND_URL}/api/contact`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

---

## PART 4: Enable CORS for Frontend
Update `server.js` to allow requests from your frontend domain:

```javascript
app.use(
  cors({
    origin: [
      'https://portfolio-frontend.vercel.app',  // Add your frontend URL
      'http://localhost:3000',
      'http://127.0.0.1:3000',
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
```

---

## PART 5: Database Persistence (Important!)

**⚠️ WARNING:** SQLite database (`portfolio.db`) is **ephemeral** on Vercel - files disappear after deployment.

### Solution: Use MongoDB (Recommended)

1. **Create MongoDB Account:**
   - Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
   - Sign up and create free cluster
   - Copy connection string

2. **Update backend to use MongoDB:**
   - Install: `npm install mongoose`
   - Replace `database.js` with MongoDB connection
   - Update `models/Contact.js` to use Mongoose

3. **Add connection string to Vercel:**
   - Go to **Settings** → **Environment Variables**
   - Add `MONGODB_URI` with your connection string
   - Click **Save**

---

## Quick Checklist

- [ ] Create `vercel.json` in backend folder
- [ ] Create `.vercelignore` file
- [ ] Push code to GitHub
- [ ] Deploy backend to Vercel
- [ ] Get backend URL (e.g., `https://portfolio-abc123.vercel.app`)
- [ ] Update `js/main.js` with backend URL
- [ ] Add `FRONTEND_URL` to backend env variables
- [ ] Deploy frontend to Vercel
- [ ] Test contact form on live URL
- [ ] (Optional) Set up MongoDB for persistent database

---

## Testing After Deployment

1. Open your frontend URL: `https://portfolio-frontend.vercel.app`
2. Scroll to contact form
3. Fill in name, email, message
4. Click submit
5. Should see success message (no email needed now since we removed that feature)

---

## Troubleshooting

**Issue: "Failed to fetch" error**
- Check CORS settings in `server.js`
- Verify frontend URL is in `origin` array
- Check backend URL in `js/main.js`

**Issue: Database empty on Vercel**
- Expected! SQLite doesn't persist
- Solution: Switch to MongoDB

**Issue: 404 on backend routes**
- Check `vercel.json` routes configuration
- Ensure `server.js` exports correct routes

**Issue: Environment variables not working**
- Go to Vercel Settings → Environment Variables
- Verify variables are added
- Redeploy project after adding variables

---

## Next Steps

After successful deployment:
1. Add custom domain in Vercel Settings
2. Enable HTTPS (automatic with Vercel)
3. Set up monitoring/logs
4. Consider adding authentication for admin contact viewing
5. Migrate to database that persists (MongoDB)

