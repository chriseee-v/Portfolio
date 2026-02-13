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

The news feature uses Google Gemini's `gemini-2.5-flash` model to:
- Generate recent technology news articles based on your search query
- Provide structured article data (title, description, URL, image, etc.)
- Return articles in a consistent format for display
- Cache results for 8 hours to reduce API usage
- Provide fallback content when quota is exceeded

## Features

- ✅ **No CORS issues** - Works from any domain
- ✅ **Smart caching** - 8-hour cache reduces API calls
- ✅ **Quota-aware fallbacks** - Shows cached or sample content when limits hit
- ✅ **Flexible queries** - Search for any technology topic
- ✅ **Structured output** - Returns articles in a consistent format
- ✅ **Free tier available** - Generous free usage limits

## Free Tier Limits

Google Gemini offers different limits based on the model:

### gemini-2.5-flash (Currently Used - Recommended)
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**
- **Stable and production-ready**

### gemini-2.5-flash-lite (Ultra fast alternative)
- **15 requests per minute**
- **1,500 requests per day**
- **1 million tokens per day**
- **Optimized for speed and cost**

### gemini-2.5-pro (Advanced thinking model)
- **2 requests per minute**
- **50 requests per day**
- **Higher quality reasoning**

### Legacy models (deprecated or unavailable)
- `gemini-pro` - Not available in v1beta API
- `gemini-1.5-flash` - Not available in v1beta API
- `gemini-2.5-flash-lite-latest` - Very low limits (20 requests/day)

## Quota Management

The app includes several features to handle quota limits gracefully:

1. **8-hour caching** - Reduces API calls by caching results
2. **Fallback to any cached data** - Uses any available cached news when quota exceeded
3. **Static fallback content** - Shows sample tech news when no cache available
4. **Clear error messages** - Informs users about quota status

## Troubleshooting

### "You exceeded your current quota" (429 Error)
This means you've hit the daily request limit. Solutions:
- **Wait**: Limits reset daily (usually at midnight UTC)
- **Use cached data**: The app automatically shows cached articles
- **Upgrade**: Consider a paid Gemini plan for higher limits
- **Check usage**: Monitor at [Google AI Studio](https://makersuite.google.com/)

### "Gemini API key not found"
- Make sure you've added `VITE_GEMINI_API_KEY` to your `.env` file (local) or Vercel environment variables (production)
- Restart your dev server after adding the key locally
- Redeploy on Vercel after adding environment variables

### "Failed to parse Gemini response"
- This is rare, but can happen if Gemini returns unexpected formatting
- The code automatically tries to extract JSON from markdown code blocks
- Try refreshing the page

### Rate Limit Errors
- You've exceeded the per-minute limits
- Wait a minute and try again
- The app will show cached content automatically

## Model Selection

The app currently uses `gemini-2.5-flash` for the best balance of availability, stability, and quota limits. You can modify the model in `src/hooks/use-news.ts`:

```typescript
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash" // Stable and recommended
});
```

Available models in v1beta API (as of 2025):
- `gemini-2.5-flash` - **Recommended** - Stable, good performance and limits
- `gemini-2.5-flash-lite` - Ultra fast, same limits as flash
- `gemini-2.5-pro` - Advanced reasoning, lower limits (2 req/min, 50/day)
- `gemini-3-flash-preview` - Preview model, may have different limits
- `gemini-3-pro-preview` - Preview model, may have different limits

## Alternative: Using Traditional News APIs

If you prefer to use traditional news APIs instead of Gemini, you can modify `src/hooks/use-news.ts` to use services like:
- NewsData.io
- News API
- Media Stack
- RSS Feeds

However, Gemini provides a more reliable solution without CORS issues and with better flexibility.
