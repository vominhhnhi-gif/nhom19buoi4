# Frontend Deployment Guide - Vercel

## ✅ Environment Configuration Ready

### Files Created:
- `.env` - Production environment variables (Vercel)
- `.env.local` - Local development environment variables
- `.env.example` - Template for environment variables

## 📝 Current Configuration

### Production (Vercel):
```env
VITE_API_BASE=https://nhom19-dh22tin04-backend.onrender.com
VITE_ENV=production
```

### Local Development:
```env
VITE_API_BASE=http://localhost:3000
VITE_ENV=development
```

## 🚀 Deployment Steps on Vercel

### 1. Connect Repository
- Go to https://vercel.com
- Click "New Project"
- Select "Import Git Repository"
- Choose: `vominhhnhi-gif/nhom19buoi4`
- Select "Framework Preset" → **React**

### 2. Project Settings
- **Project Name:** `nhom19buoi4-frontend` (or similar)
- **Root Directory:** `Frontend`
- **Build Command:** `npm run build` (or `pnpm run build`)
- **Output Directory:** `dist`
- **Install Command:** `npm install` (or `pnpm install`)

### 3. Environment Variables in Vercel Dashboard
Add these variables:
```
VITE_API_BASE = https://nhom19-dh22tin04-backend.onrender.com
VITE_ENV = production
```

### 4. Deploy
Click "Deploy" - Vercel will automatically:
- Install dependencies
- Build the project
- Deploy to production

## 🔍 Verification

### After deployment:
1. Check Vercel deployment logs - should show:
   ```
   ✓ Generated optimized build
   ✓ Deployed successfully
   ```

2. Visit your Vercel URL and verify:
   - Page loads without errors
   - Console shows API base: `https://nhom19-dh22tin04-backend.onrender.com`
   - Authentication works
   - Forms connect to backend

## 📦 Local Development

### Install dependencies:
```bash
cd Frontend
npm install
# or
pnpm install
```

### Run development server:
```bash
npm run dev
# Server runs on http://localhost:5173
```

### Build locally:
```bash
npm run build
# Output in Frontend/dist/
```

### Preview build:
```bash
npm run preview
```

## 🔗 API Integration

The frontend automatically uses the backend URL from environment variables:

**Local:** `http://localhost:3000` (from `.env.local`)  
**Production:** `https://nhom19-dh22tin04-backend.onrender.com` (from `.env`)

No hardcoding needed - just use `api` from `lib/api.js`:
```javascript
import api from '@/lib/api.js';

// Automatically uses correct backend URL
api.post('/auth/login', { email, password })
```

## ✅ Checklist Before Deployment

- [ ] Backend deployed on Render and working
- [ ] Backend URL in `.env`: `https://nhom19-dh22tin04-backend.onrender.com`
- [ ] All environment variables added to Vercel
- [ ] `.env` files added to `.gitignore`
- [ ] Changes committed and pushed to GitHub
- [ ] Vercel connected to GitHub repository

## 🆘 Troubleshooting

### API calls failing (CORS error):
- Verify `FRONTEND_ORIGIN` is set in Backend `.env`
- Check Backend CORS configuration in `server.js`
- Ensure Backend is running on Render

### Environment variables not loading:
- Check `.env` file syntax
- Ensure `VITE_` prefix (required by Vite)
- Clear browser cache
- Rebuild: `npm run build`

### Build fails:
- Check build logs in Vercel dashboard
- Run `npm run build` locally to debug
- Verify all imports are correct

---
**Status:** Ready for Vercel deployment ✅
