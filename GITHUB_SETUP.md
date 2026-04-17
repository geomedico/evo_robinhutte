# Saving This Project to GitHub

## 📌 How to Save to GitHub (via Emergent)

Since you're using Emergent, the easiest way to save this project to GitHub is:

### Option 1: Use Emergent's "Save to GitHub" Feature (Recommended)

1. Look for the **"Save to GitHub"** button in your Emergent chat interface
2. Click it to authenticate with GitHub
3. Enter repository details:
   - **Repository name:** `evo-elternvereinigung-website` (or your choice)
   - **Description:** "Full-stack website for Elternvereinigung Oberglatt with React, Node.js, and MongoDB"
   - **Visibility:** Private (recommended) or Public
4. Click "Save" - Emergent will push everything automatically

---

## 📌 Manual Git Setup (Alternative)

If you prefer to set up git manually:

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `evo-elternvereinigung-website`
3. Description: "EVO website - React + Node.js + MongoDB"
4. Choose Private or Public
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Initialize and Push

```bash
# Navigate to project directory
cd /path/to/evo-project

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: EVO website with React, Node.js, and Wix migration guides"

# Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/evo-elternvereinigung-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🔒 Important: Protect Sensitive Data

Before pushing to GitHub, ensure these files are in `.gitignore`:

```
# Environment variables (NEVER commit these!)
.env
*.env
.env.local
.env.production

# Dependencies
node_modules/
yarn.lock (optional - some keep it)

# Build outputs
/frontend/build/
/backend_node/dist/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

**Check your `.gitignore`:** The project already has a `.gitignore` file. Verify it's correct before pushing.

---

## ✅ What Will Be Saved

When you push to GitHub, these important files will be included:

### Documentation
- ✅ `README.md` - Full technical documentation
- ✅ `START.md` - Quick start guide
- ✅ `MIGRATION_SUMMARY.md` - Migration notes
- ✅ `WIX_MIGRATION_GUIDE_ENGLISH.md` - Complete Wix guide
- ✅ `WIX_MIGRATION_GUIDE_UKRAINIAN.md` - Ukrainian translation
- ✅ `.gitignore` - Prevents sensitive files from being committed

### Source Code
- ✅ `/backend_node/` - Complete Node.js backend
- ✅ `/frontend/` - Complete React frontend
- ✅ All configuration files

### Supporting Files
- ✅ `/memory/` - PRD and test credentials
- ✅ `/test_reports/` - Testing results
- ✅ `package.json` files - Dependencies list

### What's Excluded (via .gitignore)
- ❌ `node_modules/` - Too large, can be reinstalled
- ❌ `.env` files - Contains secrets (NEVER commit!)
- ❌ Build outputs - Can be regenerated
- ❌ Logs and temporary files

---

## 📝 Recommended Commit Messages

Use clear, descriptive commit messages:

```bash
# Initial setup
git commit -m "Initial commit: EVO website with booking system"

# Features
git commit -m "feat: Add Robihütte booking calendar"
git commit -m "feat: Implement member vs external pricing"

# Fixes
git commit -m "fix: Resolve booking conflict detection"
git commit -m "fix: Update weekend holiday calculation"

# Documentation
git commit -m "docs: Add Wix migration guides in English and Ukrainian"
git commit -m "docs: Update README with deployment instructions"

# Refactoring
git commit -m "refactor: Extract booking logic to separate module"
```

---

## 🔄 After Pushing to GitHub

### Clone on Another Machine

```bash
git clone https://github.com/YOUR_USERNAME/evo-elternvereinigung-website.git
cd evo-elternvereinigung-website
```

### Set Up Environment

```bash
# Backend
cd backend_node
cp .env.example .env  # Create this file first
# Edit .env with your values
yarn install

# Frontend
cd ../frontend
cp .env.example .env  # Create this file first
# Edit .env with your values
yarn install
```

### Start Development

Follow instructions in `START.md`

---

## 🌿 Branching Strategy (Optional)

For team development:

```bash
# Main branch (production)
main

# Development branch
git checkout -b develop

# Feature branches
git checkout -b feature/wix-migration
git checkout -b feature/payment-integration

# Bug fix branches
git checkout -b fix/booking-conflict

# Merge back to develop
git checkout develop
git merge feature/wix-migration

# Merge develop to main when ready
git checkout main
git merge develop
```

---

## 🚀 GitHub Features to Enable

After creating your repository:

### 1. Branch Protection

Settings → Branches → Add rule for `main`:
- ✅ Require pull request reviews
- ✅ Require status checks to pass

### 2. Dependabot (Security Updates)

Settings → Code security and analysis:
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates

### 3. GitHub Actions (CI/CD) - Optional

Create `.github/workflows/test.yml`:

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend_node && yarn install
      - run: cd frontend && yarn install
      - run: cd frontend && yarn build
```

---

## 📊 Repository Settings Checklist

After creating your GitHub repo:

- [ ] Set repository description
- [ ] Add topics: `react`, `nodejs`, `mongodb`, `wix`, `booking-system`, `switzerland`
- [ ] Add README link in "About" section
- [ ] Enable Issues (for bug tracking)
- [ ] Enable Discussions (for questions)
- [ ] Set up branch protection
- [ ] Enable Dependabot
- [ ] Add collaborators (if team project)

---

## 🆘 Troubleshooting GitHub Push

### Problem: "Permission denied (publickey)"

**Solution:** Set up SSH key or use HTTPS with personal access token

```bash
# Use HTTPS instead
git remote set-url origin https://github.com/YOUR_USERNAME/evo-elternvereinigung-website.git

# Use personal access token as password
```

### Problem: ".env file committed by mistake"

**Solution:** Remove from git history

```bash
# Remove from current commit
git rm --cached .env
git commit -m "Remove .env from tracking"

# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

### Problem: "Repository too large"

**Solution:** Check for large files

```bash
# Find large files
find . -type f -size +10M

# Remove large files from git
git rm --cached path/to/large/file
```

---

## 📧 Next Steps After GitHub Setup

1. **Share with team:**
   - Send repository URL to collaborators
   - Add them in Settings → Collaborators

2. **Set up CI/CD** (optional):
   - Deploy automatically to Railway/Vercel on push
   - Run tests on every PR

3. **Documentation:**
   - Keep README updated
   - Document API changes
   - Update Wix guides if needed

4. **Backups:**
   - GitHub is your backup
   - Consider automated daily commits for critical changes

---

## ✅ Verification Checklist

After pushing to GitHub, verify:

- [ ] Repository is visible on GitHub
- [ ] All files are present (check frontend/ and backend_node/)
- [ ] `.env` files are NOT in repository
- [ ] README displays correctly
- [ ] Wix migration guides are accessible
- [ ] `node_modules/` is not committed
- [ ] License file is present (if applicable)

---

**You're all set! Your EVO project is now safely on GitHub.** 🎉

For questions, check:
- `START.md` - Running the project
- `README.md` - Full documentation
- GitHub Issues - Bug reports and questions
