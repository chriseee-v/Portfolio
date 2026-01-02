# Email Test Scripts

Quick guide to test the blog notification email system.

## Quick Start

### Option 1: Node.js Script (Recommended)

```bash
# Test with default email (test@example.com)
npm run test:email

# Test with your email
npm run test:email -- --email your-email@example.com

# Test on production
API_BASE_URL=https://your-domain.vercel.app npm run test:email -- --email your-email@example.com

# Only check subscribers (no emails sent)
npm run test:email -- --check-only

# Skip subscription test
npm run test:email -- --skip-subscribe

# Skip notification test
npm run test:email -- --skip-notification
```

### Option 2: Simple Bash Script

```bash
# Test with your email
./scripts/test-email-simple.sh your-email@example.com

# Test on production
API_BASE_URL=https://your-domain.vercel.app ./scripts/test-email-simple.sh your-email@example.com
```

## What the Scripts Do

1. **Subscribe Test**: Subscribes your email to the blog newsletter
2. **Subscribers Check**: Shows how many subscribers are in the system
3. **Notification Test**: Sends a test notification email to all subscribers

## Expected Results

### ✅ Success
- You'll see green checkmarks for each test
- You'll receive:
  - A welcome email (when subscribing)
  - A test blog notification email

### ❌ Failure
- Check that:
  - `RESEND_API_KEY` is set in your environment
  - API endpoints are accessible
  - Your email is valid

## Testing Locally

**Important**: API routes are Vercel serverless functions. For local development, you need to run both:

1. Start Vercel dev server (for API routes):
   ```bash
   npx vercel dev
   ```
   This will start the API server on port 3000.

2. In another terminal, start your Vite dev server:
   ```bash
   npm run dev
   ```
   This will start the frontend on port 8080.

3. In a third terminal, run the test:
   ```bash
   npm run test:email -- --email your-email@example.com
   ```

**Note**: The Vite config includes a proxy that forwards `/api/*` requests to the Vercel dev server, so the frontend can communicate with the API.

## Testing Production

1. Make sure your API is deployed to Vercel

2. Run the test:
   ```bash
   API_BASE_URL=https://your-domain.vercel.app npm run test:email -- --email your-email@example.com
   ```

## Troubleshooting

### "Failed to fetch" error
- Make sure your dev server is running (for local testing)
- Check the API_BASE_URL is correct (for production)

### "Email service not configured" error
- Set `RESEND_API_KEY` in your environment variables
- For local: Create a `.env` file with `RESEND_API_KEY=your_key`
- For Vercel: Add it in project settings

### No email received
- Check spam folder
- Wait a few minutes (email delivery can be delayed)
- Check Resend dashboard for delivery status
- Verify your email address is correct

### "Unauthorized" error
- If you set `BLOG_NOTIFICATION_API_KEY`, make sure to include it:
  ```bash
  BLOG_NOTIFICATION_API_KEY=your_key npm run test:email
  ```

## Manual Testing

You can also test manually using curl:

### Subscribe
```bash
curl -X POST http://localhost:3000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### Send Notification
```bash
curl -X POST http://localhost:3000/api/send-blog-notification \
  -H "Content-Type: application/json" \
  -d '{
    "blogPost": {
      "title": "Test Post",
      "date": "Jan 1, 2025",
      "readTime": "3 min",
      "tags": ["Test"],
      "summary": "Test summary",
      "url": "https://example.com"
    }
  }'
```

## Next Steps

After testing:
1. ✅ Verify emails are received
2. ✅ Check email design matches your portfolio
3. ✅ Test on different email clients (Gmail, Outlook, etc.)
4. ✅ Set up persistent storage (Vercel KV, Supabase, etc.)
5. ✅ Configure automation for sending notifications

Happy testing! 🚀

