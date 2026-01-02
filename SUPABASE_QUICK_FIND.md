# Quick Guide: Finding Supabase Service Role Key

## Where to Find It:

1. **Go to Supabase Dashboard** → Your Project
2. **Click "Settings"** (gear icon, left sidebar)
3. **Click "API"** (under Settings)
4. **Scroll down** to "Project API keys" section

## What You'll See:

```
Project API keys
┌─────────────────────────────────────────┐
│ anon        public    [Copy] [Reveal]   │
│ service_role secret   [Copy] [Reveal]   │ ← USE THIS ONE!
└─────────────────────────────────────────┘
```

## Steps:

1. Find the row that says **`service_role`** with **`secret`** badge
2. Click the **"Reveal"** button (or eye icon 👁️)
3. Copy the entire key (it's very long, starts with `eyJ...`)

## Visual Guide:

The key will look like this when revealed:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.xxxxx...
```

## Common Issues:

### "I only see anon key"
- Make sure you're the project owner/admin
- Try refreshing the page
- Check if you need to scroll down more

### "The key is hidden/covered"
- Click the "Reveal" button or eye icon
- Some browsers may need you to click twice

### "I see service_role but it's different"
- Make sure it says `service_role` with `secret` badge
- NOT `anon` with `public` badge

## What to Copy:

Copy the ENTIRE key - it's one long string with dots (`.`) in it. It should be several hundred characters long.

## Security Note:

⚠️ **Never share this key publicly!**
- Only use in server-side code (like Vercel functions)
- Never put it in client-side JavaScript
- Keep it in environment variables only

