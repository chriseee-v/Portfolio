# News API Setup Guide - Multi-Provider Fallback System

The news page now supports **5 different news APIs with automatic fallback**. If one API fails, the system automatically tries the next one in the chain. This ensures maximum reliability and uptime.

## 🎯 Fallback Chain Order

The system tries APIs in this order (only on failure):

1. **NewsAPI.ai** (Best features - full content, sentiment analysis)
2. **NewsData.io** (Commercial use allowed on free tier)
3. **News API** (Most popular, 150k+ sources)
4. **GNews API** (Simple REST API)
5. **Media Stack API** (100 requests/month)
6. **RSS Feed** (No API key needed - final fallback)

## 🔑 API Keys Setup

Add any combination of these API keys to your `.env` file. The system will use whichever ones you provide, in order of preference:

```env
# NewsAPI.ai - 2000 tokens, no time limit, full article content
VITE_NEWSAPI_AI_KEY=your_newsapi_ai_key_here

# NewsData.io - 200 API credits/day, commercial use allowed
VITE_NEWSDATA_API_KEY=your_newsdata_key_here

# News API - 100 requests/day, 150k+ sources
VITE_NEWS_API_KEY=your_newsapi_key_here

# GNews API - 100 requests/day, simple REST API
VITE_GNEWS_API_KEY=your_gnews_key_here

# Media Stack API - 100 requests/month
VITE_MEDIASTACK_API_KEY=your_mediastack_key_here
```

**Note:** You don't need all keys! The system will work with just one, or even none (RSS fallback).

## 📋 Getting API Keys

### 1. NewsAPI.ai (Recommended - Best Features)
- **Website:** https://newsapi.ai/
- **Free Tier:** 2,000 tokens (no time limit)
- **Features:** Full article content, sentiment analysis, entity recognition
- **Sign up:** https://newsapi.ai/register
- **Get key:** Dashboard → API Keys

### 2. NewsData.io (Best for Commercial Use)
- **Website:** https://newsdata.io/
- **Free Tier:** 200 API credits/day (~500 calls/month)
- **Features:** Commercial use allowed, 84k+ sources, 80+ languages
- **Sign up:** https://newsdata.io/register
- **Get key:** Dashboard → API Key

### 3. News API (Most Popular)
- **Website:** https://newsapi.org/
- **Free Tier:** 100 requests/day
- **Features:** 150k+ sources globally, development/testing only
- **Sign up:** https://newsapi.org/register
- **Get key:** Dashboard → API Key

### 4. GNews API (Simple & Fast)
- **Website:** https://gnews.io/
- **Free Tier:** 100 requests/day, 10 articles per request
- **Features:** Simple REST API, no CORS issues
- **Sign up:** https://gnews.io/register
- **Get key:** Dashboard → API Key

### 5. Media Stack API
- **Website:** https://mediastack.com/
- **Free Tier:** 100 requests/month
- **Features:** Real-time news, may have delays on free tier
- **Sign up:** https://mediastack.com/signup
- **Get key:** Dashboard → Access Key

## 🚀 How It Works

1. **Automatic Fallback:** If an API fails (error, rate limit, etc.), the system automatically tries the next one
2. **Smart Selection:** Only tries APIs that have keys configured
3. **Empty Results:** If an API returns empty results, it tries the next one
4. **Final Fallback:** RSS feed works without any API key
5. **Provider Display:** Shows which API is currently being used in the UI

## 💡 Best Practices

### For Maximum Reliability:
- Add at least 2-3 API keys (different providers)
- NewsAPI.ai + NewsData.io is a great combination
- NewsData.io allows commercial use (important for production)

### For Development:
- Start with just GNews API (easiest to get)
- Or use RSS fallback (no setup needed)

### For Production:
- Use NewsData.io (commercial use allowed)
- Add NewsAPI.ai for better features
- Keep RSS as final fallback

## 🔍 Troubleshooting

### No articles showing:
1. Check browser console for error messages
2. Verify at least one API key is set correctly
3. Check API rate limits (may have hit daily limit)
4. Try refreshing - system will try next API

### All APIs failing:
- Check your internet connection
- Verify API keys are correct in `.env`
- Check if you've hit rate limits
- RSS fallback should still work

### CORS errors:
- GNews API and NewsData.io work without CORS issues
- News API requires backend proxy (not implemented)
- RSS fallback has no CORS issues

### Rate limiting:
- Free tiers have daily/monthly limits
- System automatically falls back to next API
- Consider upgrading to paid tiers for production

## 📊 API Comparison

| API | Free Tier | Commercial Use | Full Content | Best For |
|-----|-----------|----------------|--------------|----------|
| NewsAPI.ai | 2000 tokens | ✅ | ✅ | Best features |
| NewsData.io | 200 credits/day | ✅ | ❌ | Commercial projects |
| News API | 100 req/day | ❌ | ❌ | Development |
| GNews API | 100 req/day | ❌ | ❌ | Simple setup |
| Media Stack | 100 req/month | ❌ | ❌ | Backup option |
| RSS Feed | Unlimited | ✅ | ❌ | No setup needed |

## 🎨 Features

- ✅ Automatic fallback on failure
- ✅ Shows active provider in UI
- ✅ Works with any combination of API keys
- ✅ No API key needed (RSS fallback)
- ✅ Smart error handling
- ✅ Console logging for debugging
- ✅ Empty result detection
- ✅ Rate limit handling

## 🔄 Testing the Fallback

To test the fallback system:

1. Add only one API key (e.g., GNews)
2. Temporarily set an invalid key
3. Watch console logs - you'll see it try each API
4. RSS fallback should work as final option

The system is designed to be resilient and always provide news, even if some APIs are down or rate-limited.
