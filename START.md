# 🚀 Quick Start Guide - EVO Elternvereinigung Oberglatt

**Version:** React + Node.js/Express + MongoDB  
**Last Updated:** December 2025  
**Status:** Production Ready ✅

---

## 📦 What's in This Project?

This repository contains a **complete full-stack web application** for the Elternvereinigung Oberglatt (EVO) parent association:

- ✅ **React Frontend** - Modern, responsive UI
- ✅ **Node.js/Express Backend** - RESTful API
- ✅ **MongoDB Database** - Data storage
- ✅ **Authentication** - JWT-based member system
- ✅ **Booking System** - Advanced Robihütte rental with calendar
- ✅ **Wix Migration Guides** - Complete instructions to transfer to Wix

---

## 🎯 Two Ways to Use This Project

### Option 1: Run the React + Node.js App (Recommended for Development)
Continue using the current stack for development, testing, or deployment to platforms like Heroku, Railway, or Vercel.

### Option 2: Migrate to Wix (Recommended for Production)
Follow the comprehensive migration guides to transfer everything to Wix (easier for non-technical updates).

---

## 🚀 Option 1: Running the React + Node.js App

### Prerequisites

Before you start, ensure you have:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **Yarn** package manager ([Install](https://yarnpkg.com/getting-started/install))
- **MongoDB** installed locally OR MongoDB Atlas account ([Get Started](https://www.mongodb.com/cloud/atlas))

**Check your installations:**

```bash
node --version   # Should show v18.x or higher
yarn --version   # Should show 1.22.x or higher
mongod --version # Should show MongoDB version
```

---

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd evo-elternvereinigung-website
```

---

### Step 2: Install Dependencies

**Install Backend Dependencies:**

```bash
cd backend_node
yarn install
```

**Install Frontend Dependencies:**

```bash
cd ../frontend
yarn install
```

---

### Step 3: Configure Environment Variables

#### **Backend Configuration**

Create or verify `/backend_node/.env`:

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=evo_database
JWT_SECRET=evo-secret-key-2026
PORT=8001
NODE_ENV=development
```

**For MongoDB Atlas (cloud database):**

Replace `MONGO_URL` with your Atlas connection string:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/
DB_NAME=evo_database
JWT_SECRET=your-secret-key-min-32-characters-long
PORT=8001
NODE_ENV=production
```

#### **Frontend Configuration**

Create or verify `/frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

**For production deployment:**

```env
REACT_APP_BACKEND_URL=https://your-backend-url.com
```

---

### Step 4: Start MongoDB

**Option A: Local MongoDB**

```bash
mongod --bind_ip_all
```

Leave this terminal running.

**Option B: MongoDB Atlas**

No action needed - it's already running in the cloud.

---

### Step 5: Start the Backend

Open a **new terminal** and run:

```bash
cd backend_node
node server.js
```

**Expected output:**

```
✅ Connected to MongoDB
🚀 EVO Backend (Node.js) running on http://0.0.0.0:8001
```

**Test the backend:**

Open http://localhost:8001/api/health in your browser. You should see:

```json
{"status":"healthy"}
```

---

### Step 6: Start the Frontend

Open **another terminal** and run:

```bash
cd frontend
yarn start
```

**Expected output:**

```
Compiled successfully!
You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

The app will automatically open in your browser at http://localhost:3000

---

### Step 7: Create Test User (Optional)

You can register through the UI, or create a test user manually:

**Using MongoDB Shell:**

```bash
mongosh
use evo_database

db.users.insertOne({
  name: "Max Muster",
  email: "max@test.ch",
  password: "$2a$10$rN8eU.vN5TfzLmV8qN8eU.vN5TfzLmV8qN8eU.vN5TfzLmV8qN8eU.",
  phone: "+41 79 123 45 67",
  address: "Teststrasse 1, 8154 Oberglatt",
  is_member: true,
  created_at: new Date()
})
```

**Credentials:**
- Email: `max@test.ch`
- Password: `test123`

---

### ✅ You're Ready!

The app is now running:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **Database:** MongoDB on localhost:27017

---

## 📖 Testing the Application

### Test the Homepage

1. Visit http://localhost:3000
2. You should see the EVO homepage with hero section

### Test Authentication

1. Click **"Anmelden"** (Login) in the top-right
2. Click **"Noch kein Konto? Mitglied werden"** (Register)
3. Fill in the registration form
4. You should be logged in automatically

### Test Booking System

1. Click **"Robihütte"** in navigation
2. View pricing information
3. Click **"Robihütte buchen"** button
4. Select a date on the calendar
5. Choose a time block (4h, 12h, or 24h)
6. Fill in booking details
7. Test the booking flow

**Note:** Payment is set to "pending" in development. For actual payments, you'll need to integrate Wix Payments or Stripe (see guides).

---

## 🛠️ Development Commands

### Backend

```bash
cd backend_node

# Start server
node server.js

# Start with auto-reload (if you install nodemon)
yarn add nodemon --dev
yarn dev
```

### Frontend

```bash
cd frontend

# Start development server
yarn start

# Build for production
yarn build

# Run tests (if added)
yarn test
```

---

## 📁 Project Structure

```
evo-elternvereinigung-website/
│
├── backend_node/              # Node.js/Express Backend
│   ├── server.js             # Main server file (ALL routes and logic)
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables (DO NOT COMMIT)
│   └── yarn.lock             # Dependency lock file
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── App.js            # Main React component (all pages)
│   │   ├── App.css           # Styles
│   │   ├── utils/
│   │   │   └── auth.js       # Auth utilities (sessionStorage)
│   │   └── components/
│   │       └── shared.jsx    # Reusable UI components
│   ├── public/               # Static assets
│   ├── package.json          # Dependencies
│   ├── .env                  # Environment variables
│   └── yarn.lock             # Dependency lock file
│
├── memory/                    # Configuration & credentials
│   ├── PRD.md                # Product requirements
│   └── test_credentials.md   # Test user credentials
│
├── test_reports/              # Testing results
│   └── iteration_*.json      # Test reports
│
├── WIX_MIGRATION_GUIDE_ENGLISH.md    # Complete Wix migration guide
├── WIX_MIGRATION_GUIDE_UKRAINIAN.md  # Ukrainian translation
├── MIGRATION_SUMMARY.md              # Python→Node.js migration notes
├── README.md                          # Full documentation
└── START.md                           # This file!
```

---

## 🌐 Deployment Options

### Option A: Deploy to Railway.app (Recommended - Free Tier)

1. Create account at [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select this repository
4. Add environment variables in Railway dashboard
5. Railway will auto-deploy on every push

**Backend Service:**
- Root Directory: `/backend_node`
- Build Command: `yarn install`
- Start Command: `node server.js`
- Port: `8001`

**Frontend Service:**
- Root Directory: `/frontend`
- Build Command: `yarn build`
- Start Command: `yarn start`

### Option B: Deploy to Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**

```bash
cd frontend
vercel
```

**Backend (Railway):** Same as Option A

### Option C: Deploy to Heroku

**Backend:**

```bash
cd backend_node
heroku create evo-backend
git subtree push --prefix backend_node heroku main
```

**Frontend:**

```bash
cd frontend
heroku create evo-frontend
git subtree push --prefix frontend heroku main
```

---

## 🎯 Option 2: Migrate to Wix

If you want to use Wix (recommended for easier content management), follow these guides:

### English Guide
📄 **`WIX_MIGRATION_GUIDE_ENGLISH.md`**

### Ukrainian Guide
📄 **`WIX_MIGRATION_GUIDE_UKRAINIAN.md`**

**These guides include:**
- ✅ Complete database setup (8 collections)
- ✅ Full backend code (booking logic, pricing, validation)
- ✅ Frontend/UI implementation
- ✅ Authentication system
- ✅ Booking calendar
- ✅ Payment integration (Wix Payments)
- ✅ Email notifications
- ✅ Testing & launch checklist

**Estimated time:** 7 days for complete migration

---

## 🔧 Troubleshooting

### Backend won't start

**Problem:** `Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solution:** MongoDB isn't running. Start it:

```bash
mongod --bind_ip_all
```

---

### Frontend can't connect to backend

**Problem:** API calls fail with CORS errors

**Solution:** Check `/frontend/.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Restart frontend after changing `.env`.

---

### "Module not found" errors

**Problem:** Dependencies not installed

**Solution:**

```bash
# Backend
cd backend_node
rm -rf node_modules
yarn install

# Frontend
cd frontend
rm -rf node_modules
yarn install
```

---

### Port already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::8001`

**Solution:** Kill the process using that port:

**On Mac/Linux:**
```bash
lsof -ti:8001 | xargs kill -9
```

**On Windows:**
```bash
netstat -ano | findstr :8001
taskkill /PID <PID> /F
```

---

## 📚 Additional Documentation

### Full Documentation
📄 **`README.md`** - Complete technical documentation

### API Documentation
All API endpoints are documented in `README.md` under "API Endpoints" section.

### Database Schema
See `README.md` under "Database Collections" for complete schema.

### Testing
Test reports are in `/test_reports/iteration_*.json`

---

## 🔐 Security Notes

### Before Production Deployment

1. **Change JWT Secret:**

```env
# Generate a strong secret (32+ characters)
JWT_SECRET=your-super-secret-key-min-32-chars-here
```

Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. **Use HTTPS:** Always use HTTPS in production (Railway/Vercel provide this automatically)

3. **Environment Variables:** Never commit `.env` files to GitHub

4. **MongoDB:** Use MongoDB Atlas with IP whitelist for production

---

## 🆘 Need Help?

### For React/Node.js Questions

- Check `README.md` for detailed documentation
- See `MIGRATION_SUMMARY.md` for architecture details
- Review test reports in `/test_reports/`

### For Wix Migration Questions

- Open `WIX_MIGRATION_GUIDE_ENGLISH.md` or `WIX_MIGRATION_GUIDE_UKRAINIAN.md`
- Follow step-by-step instructions
- Check troubleshooting sections

### Support Resources

- **Node.js Docs:** https://nodejs.org/docs
- **React Docs:** https://react.dev
- **Express Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com
- **Wix Velo Docs:** https://www.wix.com/velo/reference

---

## 📝 Quick Reference

### Test Credentials

See `/memory/test_credentials.md` for current test users.

**Default:**
- Email: `max@test.ch`
- Password: `test123`

### Key URLs (Development)

- Frontend: http://localhost:3000
- Backend: http://localhost:8001
- API Health: http://localhost:8001/api/health
- API Pricing: http://localhost:8001/api/pricing

### Key Pricing Rules

- 4h: CHF 80 (member) / CHF 120 (external)
- 12h weekday: CHF 120 / CHF 180
- 12h weekend: CHF 150 / CHF 270
- 24h weekday: CHF 150 / CHF 230
- 24h weekend: CHF 200 / CHF 350
- Cleaning: CHF 60
- Deposit: CHF 250 (cash at key handover)

### Booking Rules

- ✅ Bookings start from tomorrow
- ✅ Maximum 3 months in advance
- ✅ 1.5-hour buffer between bookings
- ✅ Weekend = Friday-Sunday + Swiss holidays

---

## 🎉 You're All Set!

Your EVO website is now ready to run. Choose your path:

**Path 1:** Continue developing with React + Node.js  
**Path 2:** Migrate to Wix using the comprehensive guides

**Questions?** Check the documentation files or open an issue on GitHub.

---

**Built with ❤️ for Elternvereinigung Oberglatt**

**Last Updated:** December 2025  
**Version:** 2.0 (Node.js Migration Complete)
