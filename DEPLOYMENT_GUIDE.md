# 🚀 SNPSU Nexus - Permanent Deployment Guide

This guide will help you deploy your SNPSU Nexus academic portal permanently so students can access it 24/7 without you manually starting the server.

## 🎯 Problem Solved
- ✅ No more manual server startup
- ✅ 24/7 availability for students
- ✅ Automatic deployments
- ✅ Professional hosting with custom domain
- ✅ File uploads and database persistence

## 📋 Prerequisites
- GitHub account
- Node.js installed locally
- Your project files ready

---

## 🌟 Option 1: Vercel Deployment (RECOMMENDED)

### Why Vercel?
- ✅ Free tier with generous limits
- ✅ Automatic deployments from GitHub
- ✅ Global CDN for fast loading
- ✅ Easy custom domain setup
- ✅ Perfect for Node.js apps

### Step-by-Step Deployment:

#### 1. Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit for deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/snpsu-nexus.git
git push -u origin main
```

#### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Node.js
6. Click "Deploy"

#### 3. Configure Environment Variables
In Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add: `NODE_ENV=production`

#### 4. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain (e.g., `snpsu-nexus.com`)
- Follow DNS setup instructions

### 🔧 Vercel-Specific Files Created:
- `vercel.json` - Deployment configuration
- `server-vercel.js` - Vercel-compatible server

---

## 🚂 Option 2: Railway Deployment

### Why Railway?
- ✅ Simple deployment
- ✅ Built-in database support
- ✅ Automatic HTTPS
- ✅ Good for full-stack apps

### Step-by-Step Deployment:

#### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

#### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will auto-deploy

#### 3. Configure Environment
In Railway dashboard:
- Go to Variables tab
- Add: `NODE_ENV=production`
- Add: `PORT=10000`

### 🔧 Railway-Specific Files Created:
- `railway.json` - Railway configuration

---

## 🎨 Option 3: Render Deployment

### Why Render?
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Good documentation
- ✅ Easy setup

### Step-by-Step Deployment:

#### 1. Prepare Repository
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### 2. Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: `Node`
6. Click "Create Web Service"

#### 3. Configure Environment Variables
In Render dashboard:
- Go to Environment tab
- Add: `NODE_ENV=production`

### 🔧 Render-Specific Files Created:
- `render.yaml` - Render configuration

---

## 🦸 Option 4: Heroku Deployment

### Why Heroku?
- ✅ Popular platform
- ✅ Good for learning
- ✅ Add-ons available

### Step-by-Step Deployment:

#### 1. Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
# Or use npm
npm install -g heroku
```

#### 2. Prepare Repository
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push origin main
```

#### 3. Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create snpsu-nexus-app

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open your app
heroku open
```

### 🔧 Heroku-Specific Files Created:
- `Procfile` - Heroku process configuration

---

## 🔄 Automated Deployment Setup

### GitHub Actions (Already Configured)
Your project now includes automated deployment workflows:

#### For Vercel:
- File: `.github/workflows/deploy.yml`
- Automatically deploys when you push to main branch

#### For Railway:
- File: `.github/workflows/railway-deploy.yml`
- Automatically deploys when you push to main branch

### Setup Secrets in GitHub:
1. Go to your GitHub repository
2. Click Settings → Secrets and variables → Actions
3. Add these secrets:

**For Vercel:**
- `VERCEL_TOKEN`: Get from Vercel dashboard → Settings → Tokens
- `ORG_ID`: Get from Vercel dashboard → Settings → General
- `PROJECT_ID`: Get from Vercel dashboard → Settings → General

**For Railway:**
- `RAILWAY_TOKEN`: Get from Railway dashboard → Account → Tokens
- `RAILWAY_SERVICE`: Your service name from Railway

---

## 📁 File Structure After Deployment Setup

```
your-project/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Vercel auto-deployment
│       └── railway-deploy.yml  # Railway auto-deployment
├── uploads/                    # Your uploaded files
├── academic_content.db        # Your database
├── vercel.json               # Vercel configuration
├── railway.json              # Railway configuration
├── render.yaml               # Render configuration
├── Procfile                  # Heroku configuration
├── server-vercel.js          # Vercel-compatible server
├── server.js                 # Original server
├── package.json              # Updated with build scripts
└── ... (other files)
```

---

## 🎯 Recommended Deployment Strategy

### For Production Use:
1. **Primary**: Use **Vercel** (best free tier, fastest)
2. **Backup**: Use **Railway** (good for database-heavy apps)
3. **Testing**: Use **Render** (good for testing)

### Deployment Steps:
1. Choose Vercel for main deployment
2. Set up custom domain
3. Configure GitHub Actions for auto-deployment
4. Test thoroughly
5. Share the live URL with students

---

## 🔧 Post-Deployment Checklist

### ✅ Verify Deployment:
- [ ] Website loads without errors
- [ ] Admin panel works
- [ ] File uploads work
- [ ] PDFs are accessible
- [ ] Database persists data
- [ ] Mobile responsive

### ✅ Performance Optimization:
- [ ] Enable compression
- [ ] Optimize images
- [ ] Set up CDN (if using Vercel)
- [ ] Monitor performance

### ✅ Security:
- [ ] Use HTTPS (automatic with these platforms)
- [ ] Set up proper CORS
- [ ] Validate file uploads
- [ ] Regular backups

---

## 🆘 Troubleshooting

### Common Issues:

#### 1. Database Not Persisting
**Problem**: SQLite database resets on deployment
**Solution**: Use external database (PostgreSQL) or file storage

#### 2. File Uploads Not Working
**Problem**: Files disappear after deployment
**Solution**: Use cloud storage (AWS S3, Cloudinary)

#### 3. CORS Errors
**Problem**: Frontend can't connect to backend
**Solution**: Check CORS configuration in server.js

#### 4. Environment Variables
**Problem**: App crashes in production
**Solution**: Set all required environment variables in hosting platform

---

## 📞 Support

If you encounter issues:
1. Check the hosting platform's logs
2. Verify environment variables
3. Test locally first
4. Check GitHub Actions logs (if using automated deployment)

---

## 🎉 Success!

Once deployed, your students can access:
- **Live URL**: `https://your-app-name.vercel.app`
- **Custom Domain**: `https://snpsu-nexus.com` (if configured)
- **24/7 Availability**: No more manual server startup needed!

Your SNPSU Nexus portal is now permanently hosted and ready for students worldwide! 🌍🎓
