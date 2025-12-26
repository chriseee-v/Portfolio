# Quick Deployment Guide

## ✅ Fixed: Frontend Folder Issue
The `the-lab-interface` folder is now properly included in GitHub with all files visible.

## 🚀 Deploy to Vercel (Step-by-Step)

### 1. Deploy Portfolio Frontend

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import repository: **Chris-healthflex/Portfolio**
4. Configure:
   - **Root Directory**: `the-lab-interface` ⚠️ Important!
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

5. **Environment Variables**:
   - Add: `VITE_API_URL` = `https://your-api-url.railway.app` (you'll get this after deploying API)

6. Click **"Deploy"**

### 2. Deploy Admin Panel

1. Click **"Add New Project"** again
2. Import same repository: **Chris-healthflex/Portfolio**
3. Configure:
   - **Root Directory**: `portfolio-admin` ⚠️ Important!
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**:
   - Add: `VITE_API_URL` = `https://your-api-url.railway.app`

5. Click **"Deploy"**

### 3. Deploy Backend API (Railway)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"**
3. **Deploy from GitHub repo** → Select **Portfolio**
4. Configure:
   - **Root Directory**: `portfolio-api`
   - Railway will auto-detect Python

5. **Environment Variables** (Settings → Variables):
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_TOKEN=your-secure-admin-token
   OPENAI_API_KEY=your-openai-key (optional)
   CORS_ORIGINS=https://your-portfolio.vercel.app,https://your-admin.vercel.app
   ```

6. **Get your API URL** from Railway dashboard (e.g., `https://portfolio-api-production.up.railway.app`)

7. **Update Vercel projects** with the API URL:
   - Go back to Vercel
   - Update `VITE_API_URL` in both projects
   - Redeploy

## 📝 Important Notes

### Root Directories
- Portfolio: `the-lab-interface`
- Admin: `portfolio-admin`
- API: `portfolio-api`

### Environment Variables Needed

**Frontend & Admin:**
- `VITE_API_URL` = Your Railway API URL

**Backend API:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_TOKEN`
- `OPENAI_API_KEY` (optional)
- `CORS_ORIGINS` (comma-separated Vercel URLs)

## 🔗 After Deployment

You'll have:
- **Portfolio**: `https://your-portfolio.vercel.app`
- **Admin**: `https://your-admin.vercel.app`
- **API**: `https://your-api.railway.app`

## 🎯 Quick Checklist

- [ ] Deploy Portfolio to Vercel (root: `the-lab-interface`)
- [ ] Deploy Admin to Vercel (root: `portfolio-admin`)
- [ ] Deploy API to Railway (root: `portfolio-api`)
- [ ] Set environment variables in all three
- [ ] Update CORS in API with Vercel URLs
- [ ] Test portfolio loads data from API
- [ ] Test admin panel can login and manage content

## 🆘 Troubleshooting

**Frontend folder not showing in GitHub?**
- ✅ Fixed! All files are now properly committed

**Build fails?**
- Check root directory is set correctly
- Verify `package.json` exists in root directory
- Check build logs in Vercel dashboard

**API not connecting?**
- Verify `VITE_API_URL` is set correctly
- Check CORS settings in API
- Test API URL directly in browser

See `VERCEL_DEPLOYMENT.md` for detailed instructions.

