# Fix Vercel Auto-Deployment Issue

## Quick Fix Steps:

### 1. Check Git Integration in Vercel

1. Go to [vercel.com](https://vercel.com) → Your Project
2. Navigate to **Settings → Git**
3. Verify:
   - ✅ Repository: `Chris-healthflex/Portfolio`
   - ✅ Production Branch: `main`
   - ✅ **Automatic deployments from Git** toggle is **ON** (green)

### 2. Reconnect Git Repository (Most Common Fix)

1. In **Settings → Git**
2. Click **Disconnect** (if connected)
3. Click **Connect Git Repository**
4. Select `Chris-healthflex/Portfolio`
5. Configure:
   - **Production Branch:** `main`
   - **Root Directory:** Leave **EMPTY** (important!)
   - **Framework Preset:** Vite
6. Click **Deploy**

### 3. Check GitHub Webhook

1. Go to GitHub: `https://github.com/Chris-healthflex/Portfolio/settings/hooks`
2. Look for a Vercel webhook
3. If missing or failed:
   - Go back to Vercel
   - Reconnect the repository (step 2)
   - Vercel will recreate the webhook

### 4. Verify Webhook Delivery

1. In GitHub → Settings → Webhooks
2. Click on the Vercel webhook
3. Check **Recent Deliveries**
4. Look for:
   - ✅ Green checkmarks (200 status)
   - ❌ Red X marks (failed deliveries)
5. If failed, click on a failed delivery to see the error

### 5. Test the Connection

1. Make a small change (add a comment to any file)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Check Vercel Dashboard immediately
4. A new deployment should start within seconds

### 6. Check Vercel Project Settings

Go to **Settings → General** and verify:

- **Root Directory:** Must be **EMPTY** or `.` (not `the-lab-interface`)
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build` (or auto-detected)
- **Output Directory:** `dist` (or auto-detected)
- **Install Command:** `npm install` (or auto-detected)

### 7. Common Issues & Solutions

#### Issue: "Root Directory" is set to `the-lab-interface`
**Fix:** Change to empty or `.` in Settings → General

#### Issue: Webhook not receiving events
**Fix:** 
1. Disconnect and reconnect Git in Vercel
2. Check GitHub repository permissions
3. Ensure you have admin access to the repo

#### Issue: Wrong branch configured
**Fix:** 
- Settings → Git → Production Branch should be `main`
- Not `master` or any other branch

#### Issue: Vercel can't access the repository
**Fix:**
1. Check GitHub → Settings → Applications → Authorized OAuth Apps
2. Ensure Vercel has access
3. Re-authorize if needed

### 8. Force Reconnect (Nuclear Option)

If nothing works:

1. **In Vercel:**
   - Settings → Git → Disconnect
   - Delete the project (or create a new one)

2. **Create New Project:**
   - Click "Add New Project"
   - Import `Chris-healthflex/Portfolio`
   - Configure:
     - Root Directory: **EMPTY**
     - Framework: Vite
   - Deploy

3. **Update Domain** (if you had a custom domain):
   - Settings → Domains
   - Add your domain again

### 9. Verify Auto-Deploy is Working

After fixing, test with:
```bash
echo "<!-- test -->" >> index.html
git add index.html
git commit -m "Test auto-deploy"
git push origin main
```

Within 10-30 seconds, you should see a new deployment in Vercel.

### 10. Check Deployment Logs

If deployments start but fail:
1. Go to Deployments tab
2. Click on the failed deployment
3. Check Build Logs for errors
4. Common issues:
   - Build command failing
   - Missing environment variables
   - Dependency installation errors

## Still Not Working?

1. **Check Vercel Status:** https://www.vercel-status.com
2. **Check GitHub Status:** https://www.githubstatus.com
3. **Contact Vercel Support:** They can check webhook delivery logs
4. **Check Repository Permissions:** Ensure Vercel has read access

## Quick Checklist:

- [ ] Git repository is connected in Vercel
- [ ] Production branch is set to `main`
- [ ] Root Directory is **EMPTY** (not `the-lab-interface`)
- [ ] Automatic deployments toggle is **ON**
- [ ] GitHub webhook exists and is active
- [ ] You have admin access to the GitHub repo
- [ ] Recent push triggered a deployment (check Vercel dashboard)

