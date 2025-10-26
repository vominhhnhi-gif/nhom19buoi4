# Backend Deployment Guide - Render

## ✅ Dependencies Fixed for Render Deployment

### Version Changes:
| Package | Old Version | New Version | Reason |
|---------|------------|------------|--------|
| `express` | ^5.1.0 | ^4.21.0 | Stable, widely tested |
| `mongodb` | ^6.20.0 | ^5.9.0 | Compatible with Mongoose 7 |
| `mongoose` | ^8.19.2 | ^7.7.0 | Stable LTS, resolves module issues |
| `nodemon` | - | ^3.1.10 | Moved to devDependencies (dev-only) |

### Key Improvements:
- ✅ Fixed `Cannot find module './explainable_cursor'` error
- ✅ MongoDB/Mongoose version compatibility
- ✅ Optimized dependencies for production
- ✅ Removed vulnerabilities

## 📝 Deployment Steps

### 1. Local Testing
```powershell
cd Backend
npm install
npm start
# Should start on http://localhost:3000
```

### 2. Push to GitHub
```powershell
git add .
git commit -m "fix: update dependencies for Render deployment"
git push origin main
```

### 3. Deploy on Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository: `nhom19buoi4`
4. Configuration:
   - **Name:** `nhom19buoi4-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter)

5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://phuquy:12345quy@groupdb.bosypil.mongodb.net/?retryWrites=true&w=majority&appName=groupDB
   JWT_SECRET=minhnhi
   CLOUDINARY_NAME=dthg3g7f0
   CLOUDINARY_API_KEY=511953973161765
   CLOUDINARY_API_SECRET=-Gk1xsIHOYwmy1AhSB4ZnwwUaHg
   SMTP_USER=nhi226542@student.nctu.edu.vn
   SMTP_PASS=zugq halr rxhs mhad
   SMTP_FROM="Group14 <nhi226542@student.nctu.edu.vn>"
   FRONTEND_ORIGIN=https://your-frontend-domain.com
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=3000
   ```

6. Click "Deploy"

### 4. Verify Deployment
```bash
# Test health endpoint
curl https://your-backend-url/health
# Response: {"ok":true}
```

## 🔍 Troubleshooting

### If deployment still fails:
1. Check build logs in Render dashboard
2. Verify all environment variables are set
3. Clear build cache and redeploy
4. Check MongoDB connection string

### To manually install locally with new versions:
```powershell
cd Backend
rm -r node_modules package-lock.json
npm install
npm start
```

## 📦 Configuration Files Added
- `.npmrc` - NPM configuration for clean installs
- `render.yaml` - Render deployment config (optional reference)
- `DEPLOYMENT_GUIDE.md` - This file

---
**Status:** Ready for Render deployment ✅
