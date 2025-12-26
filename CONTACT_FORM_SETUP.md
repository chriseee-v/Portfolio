# Contact Form Email Setup

This guide will help you set up email notifications for your portfolio contact form using Resend.

## Overview

The contact form uses Resend to send email notifications when someone submits a message. The setup includes:
- A Vercel serverless function (`/api/send-email.ts`) to handle email sending
- Resend API integration for reliable email delivery
- Automatic email notifications to your inbox

## Setup Instructions

### 1. Create a Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Get Your API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Portfolio Contact Form")
4. Copy the API key (starts with `re_`)

### 3. Add Environment Variables

#### Local Development (.env file)

Add to your `.env` file in the project root:

```env
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=thechris241103@gmail.com
```

**Important:** The `.env` file is already in `.gitignore` to keep your API key secure.

#### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:
   - **Name:** `RESEND_API_KEY`
     - **Value:** Your Resend API key
     - **Environment:** Production, Preview, Development (select all)
   - **Name:** `CONTACT_EMAIL`
     - **Value:** `thechris241103@gmail.com` (or your preferred email)
     - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application

### 4. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Add your domain (e.g., `chris404.vercel.app` or your custom domain)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually takes a few minutes)

Once verified, update the `from` field in `/api/send-email.ts`:

```typescript
from: 'Portfolio Contact <contact@yourdomain.com>',
```

**Note:** For testing, you can use `onboarding@resend.dev` (default), but it's limited and not recommended for production.

## How It Works

1. **User submits form** → Frontend sends POST request to `/api/send-email`
2. **Serverless function** → Validates data and sends email via Resend
3. **Email delivered** → You receive an email with the contact form details
4. **Reply-to set** → You can reply directly to the sender's email

## Email Format

The email you receive includes:
- **Subject:** "New Contact Form Message from [Name]"
- **From:** Your verified domain (or `onboarding@resend.dev` for testing)
- **Reply-To:** The sender's email address
- **Content:** 
  - Sender's name and email
  - Timestamp
  - Full message content
  - HTML formatted for easy reading

## Testing

1. Fill out the contact form on your portfolio
2. Submit the form
3. Check your email inbox (and spam folder)
4. You should receive an email notification

## Troubleshooting

### "Failed to send email" error

- Check that `RESEND_API_KEY` is set correctly in Vercel
- Verify your API key is active in Resend dashboard
- Check Vercel function logs for detailed error messages

### Emails going to spam

- Verify your domain with Resend
- Use a custom domain instead of `onboarding@resend.dev`
- Set up SPF and DKIM records (Resend provides these)

### API key not working

- Make sure the key starts with `re_`
- Check that the key hasn't been revoked in Resend dashboard
- Verify environment variables are set in Vercel

### Function not found (404)

- Make sure `/api/send-email.ts` exists in your project root
- Vercel automatically detects serverless functions in the `/api` directory
- Redeploy after adding the file

## Free Tier Limits

Resend's free tier includes:
- **100 emails per day**
- **3,000 emails per month**
- Perfect for personal portfolios

If you need more, upgrade to a paid plan starting at $20/month.

## Security Notes

- API keys are stored as environment variables (never in code)
- Form validation happens on both client and server
- Email addresses are validated before sending
- Rate limiting is handled by Resend

## Next Steps

1. Set up your Resend account
2. Add environment variables to Vercel
3. Test the contact form
4. (Optional) Verify your domain for better deliverability

Your contact form is now production-ready! 🎉

