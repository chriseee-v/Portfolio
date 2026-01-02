# Blog Notification System Setup

This guide will help you set up automatic email notifications for your blog subscribers when you publish new articles.

## Overview

The blog notification system includes:
- **Subscription API** (`/api/subscribe`) - Handles email subscriptions
- **Notification API** (`/api/send-blog-notification`) - Sends notifications to all subscribers
- **Beautiful Email Template** - Matches your portfolio's design system
- **Frontend Integration** - Subscribe form on the blog page

## Features

✅ Email validation with regex  
✅ Beautiful HTML email template matching your portfolio design  
✅ Automatic welcome email when users subscribe  
✅ Batch email sending (up to 50 recipients per email)  
✅ Responsive email design  
✅ Unsubscribe instructions included  

## Setup Instructions

### 1. Environment Variables

Add these to your Vercel project settings (Settings → Environment Variables):

#### Required:
- `RESEND_API_KEY` - Your Resend API key (already set up for contact form)

#### Optional (for persistent storage):
- `SUBSCRIPTIONS_STORAGE_URL` - URL to fetch subscriptions from (see Storage Options below)
- `SUBSCRIPTIONS_STORAGE_API_KEY` - API key for storage service
- `BLOG_NOTIFICATION_API_KEY` - Optional API key to protect the notification endpoint

### 2. Storage Options

The subscription system needs persistent storage. Choose one:

#### Option A: Vercel KV (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Storage
2. Create a new KV database
3. Update the API files to use Vercel KV (see example below)

#### Option B: Supabase (Free tier available)
1. Create a Supabase project
2. Create a `subscriptions` table with columns: `email`, `subscribed_at`, `verified`
3. Update API files to use Supabase client

#### Option C: Simple JSON File (Development only)
For development/testing, you can use a GitHub Gist or similar:
1. Create a GitHub Gist with an empty array `[]`
2. Get the raw URL
3. Set `SUBSCRIPTIONS_STORAGE_URL` to the raw URL
4. Use GitHub API to update it

#### Option D: MongoDB/PostgreSQL
Use any database service you prefer and update the API accordingly.

### 3. Update Storage in API Files

If using Vercel KV, update `api/subscribe.ts` and `api/send-blog-notification.ts`:

```typescript
import { kv } from '@vercel/kv';

async function getSubscriptions(): Promise<Subscription[]> {
  try {
    const data = await kv.get<Subscription[]>('subscriptions');
    return data || [];
  } catch (error) {
    console.error('Error reading subscriptions:', error);
    return [];
  }
}

async function saveSubscriptions(subscriptions: Subscription[]): Promise<void> {
  try {
    await kv.set('subscriptions', subscriptions);
  } catch (error) {
    console.error('Error saving subscriptions:', error);
  }
}
```

## How to Send Blog Notifications

### Method 1: Using the API Endpoint

When you add or update a blog post, send a POST request to `/api/send-blog-notification`:

```bash
curl -X POST https://your-domain.vercel.app/api/send-blog-notification \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "blogPost": {
      "title": "Building a LoRaWAN-Powered Smart Street Light Control System",
      "date": "Dec 27, 2025",
      "readTime": "6 min",
      "tags": ["IoT", "Smart Cities", "LoRaWAN"],
      "summary": "How we designed a centralized, long-range IoT system...",
      "url": "https://medium.com/@thechris241103/..."
    }
  }'
```

### Method 2: Using a Script

Create a script `scripts/send-blog-notification.js`:

```javascript
const blogPost = {
  title: "Your New Blog Post Title",
  date: "Jan 1, 2025",
  readTime: "5 min",
  tags: ["React", "TypeScript"],
  summary: "Your blog post summary...",
  url: "https://your-blog-url.com"
};

fetch('https://your-domain.vercel.app/api/send-blog-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': process.env.BLOG_NOTIFICATION_API_KEY
  },
  body: JSON.stringify({ blogPost })
})
.then(res => res.json())
.then(data => console.log('Notifications sent:', data))
.catch(err => console.error('Error:', err));
```

### Method 3: Automate with GitHub Actions

Create `.github/workflows/blog-notification.yml`:

```yaml
name: Send Blog Notification

on:
  push:
    paths:
      - 'src/data/blogs.json'

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Send Notification
        run: |
          # Extract latest blog post and send notification
          # Add your notification logic here
```

## Email Template Design

The email template matches your portfolio's design:
- **Primary Color**: `#ff6b35` (hsl(14 100% 55%))
- **Fonts**: Space Grotesk (headings), JetBrains Mono (labels)
- **Style**: Modern, clean, with gradient headers
- **Responsive**: Works on all email clients

## Testing

1. **Test Subscription**:
   - Go to your blog page
   - Enter your email in the subscribe form
   - Check your inbox for welcome email

2. **Test Notification**:
   - Use the API endpoint or script to send a test notification
   - Check that all subscribers receive the email

3. **Check Resend Dashboard**:
   - Go to [Resend Dashboard](https://resend.com/emails)
   - View sent emails and delivery status

## Troubleshooting

### Subscriptions not persisting
- **Issue**: Subscriptions are lost after deployment
- **Solution**: Set up persistent storage (Vercel KV, Supabase, etc.)

### Emails not sending
- **Issue**: API returns error
- **Solution**: 
  - Check `RESEND_API_KEY` is set correctly
  - Verify API key in Resend dashboard
  - Check Vercel function logs

### Email template not rendering
- **Issue**: Email looks broken
- **Solution**: 
  - Test in different email clients
  - Check HTML is valid
  - Some email clients have limited CSS support

### Too many API calls
- **Issue**: Hitting rate limits
- **Solution**: 
  - Resend free tier: 100 emails/day
  - Upgrade to paid plan if needed
  - Implement rate limiting

## Security Notes

1. **API Key Protection**: Set `BLOG_NOTIFICATION_API_KEY` to protect the notification endpoint
2. **Email Validation**: Always validate emails on both client and server
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Unsubscribe**: Implement proper unsubscribe functionality

## Next Steps

1. ✅ Set up environment variables
2. ✅ Choose and configure storage solution
3. ✅ Test subscription flow
4. ✅ Test notification sending
5. ✅ Set up automation (GitHub Actions, webhook, etc.)
6. ✅ Monitor email delivery rates

## Example: Automating Notifications

You can automate notifications when you update `blogs.json`:

1. Create a webhook that triggers on file changes
2. Parse the latest blog post from `blogs.json`
3. Call `/api/send-blog-notification` with the blog post data
4. All subscribers receive the notification automatically!

Your blog notification system is now ready! 🎉

