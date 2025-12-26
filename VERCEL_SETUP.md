# Vercel Auto-Deployment Setup Guide

If auto-deployment is not working, follow these steps:

## 1. Check Vercel Project Connection

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project dashboard
3. Go to **Settings → Git**

### Verify:
- ✅ **Git Repository** is connected to `Chris-healthflex/Portfolio`
- ✅ **Production Branch** is set to `main`
- ✅ **Automatic deployments from Git** is **ENABLED**

## 2. Check Build Settings

Go to **Settings → General** and verify:

- **Framework Preset:** `Vite` (or `Other`)
- **Root Directory:** Leave **EMPTY** or set to `.` (since files are at root now)
- **Build Command:** `npm run build` (or leave empty for auto-detection)
- **Output Directory:** `dist`
- **Install Command:** `npm install` (or leave empty)

## 3. Check Deployment Settings

Go to **Settings → Git → Production Branch:**
- Should be: `main`

## 4. Reconnect Repository (if needed)

If auto-deploy still doesn't work:

1. Go to **Settings → Git**
2. Click **Disconnect** (if connected)
3. Click **Connect Git Repository**
4. Select `Chris-healthflex/Portfolio`
5. Configure:
   - **Root Directory:** Leave empty (`.`)
   - **Framework Preset:** Vite
   - Click **Deploy**

## 5. Check Webhook Status

1. Go to **Settings → Git**
2. Scroll to **Deploy Hooks**
3. Verify the webhook is active
4. If missing, Vercel should create it automatically when you reconnect

## 6. Manual Trigger Test

1. Make a small change (like updating this file)
2. Commit and push to `main` branch
3. Check Vercel dashboard - a new deployment should start automatically

## 7. Check Deployment Logs

If deployments are failing:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check the **Build Logs** for errors
4. Common issues:
   - Build command failing
   - Missing dependencies
   - Environment variables missing

## 8. Verify vercel.json

The `vercel.json` file should be at the root with:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 9. Force Redeploy

If nothing works:
1. Go to **Deployments** tab
2. Click the **⋯** menu on latest deployment
3. Click **Redeploy**
4. This will trigger a new build

## Troubleshooting Commands

Check if Vercel CLI is installed and connected:
```bash
npm i -g vercel
vercel login
vercel link
```

## Still Not Working?

1. Check GitHub repository settings:
   - Go to your repo → Settings → Webhooks
   - Verify Vercel webhook exists and is active

2. Check Vercel team/organization:
   - Make sure you have the right permissions
   - Check if you're in the correct team/organization

3. Contact Vercel support:
   - They can check webhook delivery logs
   - They can verify repository connection status

