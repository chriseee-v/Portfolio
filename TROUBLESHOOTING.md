# Troubleshooting 500 Error on Subscribe

## Quick Check: Is the Supabase Table Created?

The most common cause of a 500 error is that the `blog_subscriptions` table doesn't exist in Supabase.

### To Fix:

1. **Go to Supabase Dashboard** → Your Project
2. **Click "SQL Editor"** (left sidebar)
3. **Click "New Query"**
4. **Paste this SQL:**

```sql
CREATE TABLE IF NOT EXISTS blog_subscriptions (
  email TEXT PRIMARY KEY,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT TRUE
);
```

5. **Click "Run"** (or press Cmd/Ctrl + Enter)
6. **You should see**: "Success. No rows returned"

### Verify Table Exists:

1. Go to **Table Editor** (left sidebar)
2. You should see `blog_subscriptions` in the list
3. Click on it to see the table structure

## Check Vercel Logs:

1. Go to **Vercel Dashboard** → Your Project
2. Click **"Functions"** tab
3. Click on the latest function invocation
4. Check the logs for error messages

Look for errors like:
- `relation "blog_subscriptions" does not exist`
- `Supabase request failed: 404`
- Any other error messages

## Common Errors:

### Error: "relation blog_subscriptions does not exist"
**Fix**: Create the table using the SQL above

### Error: "Supabase credentials not configured"
**Fix**: Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables

### Error: "401 Unauthorized"
**Fix**: Make sure you're using the `service_role` key, not the `anon` key

### Error: "404 Not Found"
**Fix**: Check that your `SUPABASE_URL` is correct (should end with `.supabase.co`)

## Test the API Directly:

```bash
curl -X POST https://chris404.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

Check the response for error details.

## Check Environment Variables in Vercel:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Verify these are set:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
3. Make sure they're enabled for **Production**, **Preview**, and **Development**

## Still Not Working?

1. Check Vercel function logs for the exact error
2. Make sure the table exists in Supabase
3. Verify environment variables are set correctly
4. Try redeploying after adding environment variables

