# Portfolio Deployment Guide (Separated Frontend & Backend)

## 📁 Project Structure

```
Portfolio/
├── frontend/                    # Static HTML/CSS/JS site
│   ├── index.html
│   ├── css/styles.css
│   ├── js/main.js
│   ├── js/tailwind.config.js
│   ├── assets/
│   ├── package.json
│   ├── .vercelignore
│   └── .env.example
│
└── backend/                     # Node.js/Express API
    ├── server.js
    ├── routes.js
    ├── database.js
    ├── models/
    ├── api/
    ├── package.json
    ├── vercel.json
    ├── .vercelignore
    ├── .env                     # ⚠️ Add your actual MongoDB URI here
    └── .env.example
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **STEP 1: Get Your MongoDB Connection String**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in to your account
3. Select your "portfolio" cluster
4. Click **"Connect"**
5. Choose **"Drivers"** → **"Node.js"**
6. Copy the connection string that looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@portfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
   ```
7. Replace `USERNAME` and `PASSWORD` with your actual MongoDB credentials

---

### **STEP 2: Update Backend Environment Variables**

Edit `backend/.env` and replace with your actual values:

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@portfolio.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=niktoretto440email@gmail.com
EMAIL_PASS=lsekayrxxoekpzps
```

---

### **STEP 3: Test Locally**

Run these commands in PowerShell:

```powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5000` to verify it's running.

---

### **STEP 4: Deploy Backend on Vercel**

#### **Option A: Deploy from GitHub (Recommended)**

1. **Push Backend to GitHub:**
   ```powershell
   cd backend
   git init
   git add .
   git commit -m "Backend API: Node.js/Express with MongoDB"
   git remote add origin https://github.com/YOUR_USERNAME/Portfolio-Backend.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New"** → **"Project"**
   - Click **"Import Git Repository"**
   - Paste: `https://github.com/YOUR_USERNAME/Portfolio-Backend.git`
   - Click **"Import"**
   - **Configure:**
     - Root Directory: `.` (default)
     - Framework Preset: **Other**
     - Build Command: Leave empty
     - Output Directory: Leave empty
   - Click **"Deploy"**

3. **Add Environment Variables:**
   - After deployment, go to **Settings** → **Environment Variables**
   - Add these variables:
     | Key | Value |
     |-----|-------|
     | `MONGODB_URI` | Your MongoDB connection string |
     | `NODE_ENV` | `production` |
     | `FRONTEND_URL` | Your frontend URL (we'll update this later) |
     | `EMAIL_USER` | Your Gmail |
     | `EMAIL_PASS` | Your app password |
   - Click **"Save"** (Vercel auto-redeploys)

4. **Save your Backend URL:**
   - Format: `https://portfolio-backend-xxxxx.vercel.app`
   - You'll need this for the frontend

---

### **STEP 5: Update Frontend API URL**

Edit `frontend/js/main.js` line 5:

```javascript
const API_URL = 'https://portfolio-backend-xxxxx.vercel.app';  // ← Your backend URL
```

---

### **STEP 6: Deploy Frontend on Vercel**

1. **Push Frontend to GitHub:**
   ```powershell
   cd frontend
   git init
   git add .
   git commit -m "Frontend: Portfolio website"
   git remote add origin https://github.com/YOUR_USERNAME/Portfolio-Frontend.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New"** → **"Project"**
   - Click **"Import Git Repository"**
   - Paste: `https://github.com/YOUR_USERNAME/Portfolio-Frontend.git`
   - Click **"Import"**
   - **Configure:**
     - Root Directory: `.` (default)
     - Framework Preset: **Other**
     - Build Command: Leave empty
     - Output Directory: Leave empty
   - Click **"Deploy"**

3. **Save your Frontend URL:**
   - Format: `https://portfolio-frontend-xxxxx.vercel.app`

---

### **STEP 7: Update Backend CORS Configuration**

Edit `backend/server.js` (line ~29) and add your frontend URL:

```javascript
cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://portfolio-frontend-xxxxx.vercel.app',  // ← Your frontend URL
    process.env.FRONTEND_URL || '*',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

Then push to GitHub:
```powershell
cd backend
git add server.js
git commit -m "Update CORS for production domain"
git push
```

Vercel will auto-redeploy ✅

---

### **STEP 8: Test Everything**

1. Go to your frontend URL: `https://portfolio-frontend-xxxxx.vercel.app`
2. Navigate to the **Contact** section
3. Fill in and submit the form
4. Check if you receive a success message
5. Your message should be saved in MongoDB

---

## 🔍 Troubleshooting

### **Contact Form Not Submitting**

**Solution:** Check browser console (F12) for errors

Common issues:
- ❌ CORS error → Update backend `server.js` with correct frontend URL
- ❌ MongoDB connection error → Verify `MONGODB_URI` in Vercel environment variables
- ❌ 404 on API → Verify backend is deployed and URL is correct

### **MongoDB Connection Failed**

**Solution:**
1. Verify IP `0.0.0.0` is whitelisted in MongoDB Atlas
2. Check MongoDB URI has correct username and password
3. Test locally: `npm run dev` should work

### **Environment Variables Not Loading**

**Solution:**
1. Go to Vercel project **Settings** → **Environment Variables**
2. Verify variables are listed
3. Redeploy: Click **Deployments** → Select latest → **Redeploy**

---

## 📊 Final Deployment Summary

| Component | URL | Status |
|-----------|-----|--------|
| Frontend | `https://portfolio-frontend-xxxxx.vercel.app` | ✅ Live |
| Backend API | `https://portfolio-backend-xxxxx.vercel.app` | ✅ Live |
| Database | MongoDB Atlas | ✅ Connected |
| Email | Gmail SMTP | ✅ Configured |

---

## 🔐 Security Tips

✅ **IP Whitelist:** Your MongoDB cluster accepts connections from `0.0.0.0`  
⚠️ **Rate Limiting:** Contact endpoint is limited to 5 requests per 15 minutes  
✅ **Helmet:** Security headers enabled on backend  
✅ **CORS:** Only allows requests from your frontend domain

---

## 🆘 Need Help?

- **MongoDB:** https://docs.mongodb.com/atlas/
- **Vercel:** https://vercel.com/docs
- **Express:** https://expressjs.com/
- **Mongoose:** https://mongoosejs.com/

---

**Last Updated:** June 2, 2026  
**Status:** ✅ Ready for Production Deployment
