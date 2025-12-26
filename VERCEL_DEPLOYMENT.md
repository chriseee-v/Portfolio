# Vercel Deployment Guide

This guide explains how to deploy your portfolio, admin panel, and API to Vercel and other platforms.

## Architecture Overview

You have three separate applications:
1. **Portfolio Frontend** (`the-lab-interface/`) - Main portfolio site
2. **Admin Panel** (`portfolio-admin/`) - Content management interface
3. **Backend API** (`portfolio-api/`) - FastAPI server (needs different hosting)

## Deployment Strategy

### Portfolio Frontend → Vercel ✅
### Admin Panel → Vercel ✅
### Backend API → Railway/Render/AWS (Not Vercel - Vercel doesn't support Python APIs well)

---

## Step 1: Deploy Portfolio Frontend to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your repository**: `Chris-healthflex/Portfolio`
4. **Configure the project**:
   - **Root Directory**: `the-lab-interface`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - `VITE_API_URL` = Your backend API URL (e.g., `https://your-api.railway.app`)

6. **Click "Deploy"**

### Option B: Via Vercel CLI

```bash
cd the-lab-interface
npm install -g vercel
vercel login
vercel
# Follow prompts:
# - Set root directory: ./
# - Override settings: No
# - Add environment variable VITE_API_URL
```

---

## Step 2: Deploy Admin Panel to Vercel

### Option A: Via Vercel Dashboard

1. **Click "Add New Project"** again
2. **Import the same repository**: `Chris-healthflex/Portfolio`
3. **Configure the project**:
   - **Root Directory**: `portfolio-admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - `VITE_API_URL` = Your backend API URL

5. **Click "Deploy"**

### Option B: Via Vercel CLI

```bash
cd portfolio-admin
vercel
# Follow prompts and add VITE_API_URL
```

---

## Step 3: Deploy Backend API (Railway/Render)

Vercel doesn't support Python/FastAPI well. Use Railway or Render instead.

### Option A: Railway (Recommended)

1. **Go to [railway.app](https://railway.app)** and sign in with GitHub
2. **Click "New Project"**
3. **Deploy from GitHub repo**: Select your Portfolio repository
4. **Configure**:
   - **Root Directory**: `portfolio-api`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables**:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_TOKEN=your-admin-token
   OPENAI_API_KEY=your-openai-key (optional)
   ```

6. **Get your API URL** from Railway (e.g., `https://your-app.railway.app`)

### Option B: Render

1. **Go to [render.com](https://render.com)** and sign in
2. **New → Web Service**
3. **Connect GitHub repository**
4. **Configure**:
   - **Name**: portfolio-api
   - **Root Directory**: portfolio-api
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables** (same as Railway)

---

## Step 4: Update Environment Variables

After deploying the API, update your frontend deployments:

1. **Go to Vercel Dashboard**
2. **Select your Portfolio project**
3. **Settings → Environment Variables**
4. **Update `VITE_API_URL`** to your Railway/Render API URL
5. **Redeploy**

Repeat for the Admin Panel project.

---

## Step 5: Configure CORS

Update your backend API to allow your Vercel domains:

In `portfolio-api/main.py`, update CORS:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-portfolio.vercel.app",
        "https://your-admin.vercel.app",
        "http://localhost:3000",  # For local dev
        "http://localhost:3001",  # For local admin
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Quick Deployment Checklist

### Portfolio Frontend
- [ ] Deploy to Vercel (root: `the-lab-interface`)
- [ ] Set `VITE_API_URL` environment variable
- [ ] Verify deployment works

### Admin Panel
- [ ] Deploy to Vercel (root: `portfolio-admin`)
- [ ] Set `VITE_API_URL` environment variable
- [ ] Verify login works

### Backend API
- [ ] Deploy to Railway/Render (root: `portfolio-api`)
- [ ] Set all environment variables
- [ ] Get API URL
- [ ] Update CORS settings
- [ ] Test API endpoints

---

## URLs After Deployment

- **Portfolio**: `https://your-portfolio.vercel.app`
- **Admin Panel**: `https://your-admin.vercel.app`
- **API**: `https://your-api.railway.app` (or render.com)

---

## Troubleshooting

### "Module not found" errors
- Make sure `node_modules` is in `.gitignore` (it is)
- Vercel will install dependencies automatically

### API connection errors
- Check `VITE_API_URL` is set correctly
- Verify CORS is configured
- Check API is running and accessible

### Build failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript errors

---

## Alternative: Monorepo Setup

If you want everything in one Vercel project, you can use Vercel's monorepo features, but separate deployments are recommended for:
- Better separation of concerns
- Independent scaling
- Different environment variables
- Easier management

---

## Next Steps

1. Deploy all three applications
2. Test the portfolio with live API
3. Test admin panel functionality
4. Set up custom domains (optional)
5. Enable automatic deployments from GitHub

