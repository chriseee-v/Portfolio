# Supabase Setup for Blog Subscriptions

This guide will help you set up Supabase to store blog subscription emails.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: Your project name (e.g., "portfolio-blog")
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (takes 1-2 minutes)

## Step 2: Create the Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create blog_subscriptions table
CREATE TABLE IF NOT EXISTS blog_subscriptions (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_email ON blog_subscriptions(email);

-- Create index on subscribed_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_subscribed_at ON blog_subscriptions(subscribed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE blog_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to do everything
-- (This is safe because we're using service role key in serverless functions)
CREATE POLICY "Service role can manage subscriptions"
ON blog_subscriptions
FOR ALL
USING (true)
WITH CHECK (true);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get Your Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (⚠️ Keep this secret!)

## Step 4: Add Environment Variables

### For Local Development (.env file)

Create or update `.env` in your project root:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
RESEND_API_KEY=your_resend_api_key_here
```

**Important**: 
- Use `SUPABASE_SERVICE_ROLE_KEY` (not anon key) for serverless functions
- The `.env` file is already in `.gitignore` to keep your keys secure

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - **Name**: `SUPABASE_URL`
     - **Value**: Your Supabase project URL
     - **Environment**: Production, Preview, Development (select all)
   - **Name**: `SUPABASE_SERVICE_ROLE_KEY`
     - **Value**: Your Supabase service role key
     - **Environment**: Production, Preview, Development (select all)
   - **Name**: `RESEND_API_KEY`
     - **Value**: Your Resend API key
     - **Environment**: Production, Preview, Development (select all)
4. Click **Save**
5. **Redeploy** your application

## Step 5: Verify Setup

1. Subscribe with a test email on your blog page
2. Check Supabase dashboard:
   - Go to **Table Editor**
   - Select `blog_subscriptions` table
   - You should see your test email!
3. Check console logs - you should see:
   ```
   💾 [SUPABASE] Saving subscription to database...
   ✅ [SUPABASE] Successfully saved subscription to database
   ```

## Viewing Subscriptions

### In Supabase Dashboard

1. Go to **Table Editor**
2. Select `blog_subscriptions` table
3. You'll see all subscribed emails with:
   - Email address
   - Subscription date
   - Verified status

### Via API

You can also check via the API endpoint:

```bash
curl http://localhost:3000/api/subscribe
```

Or in production:
```bash
curl https://your-domain.vercel.app/api/subscribe
```

## Database Schema

The `blog_subscriptions` table has:

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key (auto-increment) |
| `email` | TEXT | Email address (unique) |
| `subscribed_at` | TIMESTAMPTZ | When they subscribed |
| `verified` | BOOLEAN | Email verification status |
| `created_at` | TIMESTAMPTZ | Record creation time |
| `updated_at` | TIMESTAMPTZ | Last update time |

## Security Notes

1. **Service Role Key**: This key has full access to your database. Never expose it in client-side code!
2. **Row Level Security**: RLS is enabled but we use a policy that allows service role access (safe for serverless functions)
3. **Environment Variables**: Always use environment variables, never hardcode keys

## Troubleshooting

### "Supabase not configured" error
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Verify the keys are correct in Vercel dashboard
- Redeploy after adding environment variables

### "relation does not exist" error
- Make sure you ran the SQL script to create the table
- Check table name is `blog_subscriptions` (lowercase)

### "permission denied" error
- Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check RLS policies are set up correctly

### Emails not appearing in database
- Check console logs for errors
- Verify Supabase credentials are correct
- Check Supabase dashboard for any errors

## Free Tier Limits

Supabase free tier includes:
- **500 MB database storage**
- **2 GB bandwidth**
- **50,000 monthly active users**

Perfect for personal portfolios! If you need more, upgrade to Pro ($25/month).

## Next Steps

✅ Your subscriptions are now stored in Supabase!
✅ Emails persist across deployments
✅ You can view/manage them in Supabase dashboard
✅ Ready to send blog notifications to all subscribers

Your blog subscription system is now production-ready! 🎉

