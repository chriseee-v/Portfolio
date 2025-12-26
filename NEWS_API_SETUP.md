# News API Setup - Google Gemini

This portfolio uses **Google Gemini AI** to fetch and generate news articles instead of traditional news APIs.

## Setup Instructions

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Add API Key to Environment Variables

#### Local Development (.env file)

Create or update `.env` in the project root:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

**Important:** The `.env` file is already in `.gitignore` to keep your API key secure.

#### Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Your Gemini API key
   - **Environment:** Production, Preview, Development (select all)
4. Click **Save**
5. Redeploy your application

## How It Works

The news feature uses Google Gemini's `gemini-pro` model to:
- Generate recent technology news articles based on your search query
- Provide structured article data (title, description, URL, image, etc.)
- Return articles in a consistent format for display

## Features

- ✅ **No CORS issues** - Works from any domain
- ✅ **No rate limits** (within Google's free tier limits)
- ✅ **Flexible queries** - Search for any technology topic
- ✅ **Structured output** - Returns articles in a consistent format
- ✅ **Free tier available** - Generous free usage limits

## Free Tier Limits

Google Gemini offers a free tier with:
- **60 requests per minute**
- **1,500 requests per day**

For most portfolio sites, this is more than sufficient.

## Troubleshooting

### "Gemini API key not found"
- Make sure you've added `VITE_GEMINI_API_KEY` to your `.env` file (local) or Vercel environment variables (production)
- Restart your dev server after adding the key locally
- Redeploy on Vercel after adding environment variables

### "Failed to parse Gemini response"
- This is rare, but can happen if Gemini returns unexpected formatting
- The code automatically tries to extract JSON from markdown code blocks
- Try refreshing the page

### Rate Limit Errors
- You've exceeded the free tier limits
- Wait a few minutes and try again
- Consider upgrading to a paid plan if you need higher limits

## Alternative: Using Traditional News APIs

If you prefer to use traditional news APIs instead of Gemini, you can modify `src/hooks/use-news.ts` to use services like:
- NewsData.io
- News API
- Media Stack
- RSS Feeds

However, Gemini provides a more reliable solution without CORS issues and with better flexibility.
