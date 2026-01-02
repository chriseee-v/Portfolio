# Supabase Setup for Blog Subscriptions

This guide will help you set up Supabase to store blog subscription emails.

## Why Supabase?

✅ **Free tier** - 500MB database, 2GB bandwidth  
✅ **PostgreSQL database** - Reliable and scalable  
✅ **Easy to use** - Simple REST API, no complex setup  
✅ **Vercel integration** - Works seamlessly with Vercel  
✅ **Better than Redis** - Redis is for caching, Supabase is for persistent data storage  

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `portfolio-blog-subscriptions` (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for project to be created

## Step 2: Create Database Table

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create blog_subscriptions table
CREATE TABLE IF NOT EXISTS blog_subscriptions (
  email TEXT PRIMARY KEY,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT TRUE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_subscriptions_subscribed_at 
ON blog_subscriptions(subscribed_at DESC);

-- Enable Row Level Security (optional, for extra security)
ALTER TABLE blog_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to do everything
CREATE POLICY "Service role can do everything" 
ON blog_subscriptions 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get Your Credentials

1. Go to **Settings** → **API** (left sidebar)
2. You'll see two sections:

### Project URL
- Look for **"Project URL"** section
- Copy the URL (looks like: `https://xxxxx.supabase.co`)
- This is your `SUPABASE_URL`

### API Keys
- Scroll down to **"Project API keys"** section
- You'll see multiple keys listed:
  - `anon` `public` - **DON'T USE THIS ONE**
  - `service_role` `secret` - **USE THIS ONE** ✅

3. To reveal the `service_role` key:
   - Click the **eye icon** 👁️ next to the `service_role` key to reveal it
   - Or click **"Reveal"** button
   - Copy the entire key (it's long, starts with `eyJ...`)

⚠️ **Important**: 
- Use the `service_role` key (marked as `secret`), **NOT** the `anon` key (marked as `public`)
- The service_role key has full access and is safe to use in serverless functions
- Never expose the service_role key in client-side code

**If you can't see the service_role key:**
- Make sure you're logged in as the project owner
- Try refreshing the page
- Check if there's a "Reveal" or eye icon to show hidden keys

## Step 4: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

### For Production:
- **Name**: `SUPABASE_URL`
  - **Value**: Your Project URL (e.g., `https://xxxxx.supabase.co`)
  - **Environment**: Production, Preview, Development

- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
  - **Value**: Your service_role key (starts with `eyJ...`)
  - **Environment**: Production, Preview, Development

### For Local Development:
Create a `.env` file in your project root:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_your_resend_key
```

## Step 5: Verify Setup

1. Test subscribing with an email
2. Go to Supabase → **Table Editor** → `blog_subscriptions`
3. You should see your email in the table!

## Viewing Subscriptions

### In Supabase Dashboard:
1. Go to **Table Editor** (left sidebar)
2. Click on `blog_subscriptions`
3. See all subscribed emails with timestamps

### Via API:
```bash
# Get all subscriptions
curl https://your-domain.vercel.app/api/subscribe
```

## Database Schema

The `blog_subscriptions` table has:
- **email** (TEXT, PRIMARY KEY) - The subscriber's email
- **subscribed_at** (TIMESTAMP) - When they subscribed
- **verified** (BOOLEAN) - Whether email is verified (default: true)

## Security Notes

✅ The `service_role` key is used in serverless functions (secure)  
✅ Row Level Security is enabled  
✅ Only service_role can access the table  
✅ Never expose the service_role key in client-side code  

## Troubleshooting

### "Supabase not configured" error
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Make sure you're using the **service_role** key, not anon key
- Restart `vercel dev` after adding env variables

### "Table does not exist" error
- Run the SQL script in Step 2
- Check table name is exactly `blog_subscriptions`

### "Duplicate key" error
- This is normal - means email already exists
- The code handles this gracefully

## Next Steps

✅ Subscriptions are now saved to Supabase  
✅ Data persists across deployments  
✅ You can query/view subscriptions in Supabase dashboard  
✅ Ready for production!  

Your blog subscription system is now fully set up with persistent storage! 🎉

