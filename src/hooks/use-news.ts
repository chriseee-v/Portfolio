import { useState, useEffect } from "react";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author?: string;
}

// API Providers in order of preference (with fallback chain)
const API_PROVIDERS = {
  NEWSAPI_AI: {
    name: "NewsAPI.ai",
    fetch: async (query: string, limit: number, apiKey: string) => {
      // NewsAPI.ai uses eventregistry.org domain
      const response = await fetch(
        `https://eventregistry.org/api/v1/article/getArticles?query=${encodeURIComponent(query)}&resultType=articles&articlesCount=${limit}&apiKey=${apiKey}`,
        { mode: 'cors' }
      );
      if (!response.ok) throw new Error("NewsAPI.ai failed");
      const data = await response.json();
      if (data.articles?.results) {
        return data.articles.results.map((article: any, index: number) => ({
          id: article.uri || `newsapi-ai-${index}`,
          title: article.title || "",
          description: article.body?.substring(0, 200) || "",
          url: article.url || "",
          urlToImage: article.image,
          publishedAt: article.date || new Date().toISOString(),
          source: { name: article.source?.title || "News" },
          author: article.author,
        }));
      }
      throw new Error("NewsAPI.ai invalid response");
    },
  },
  NEWSDATA: {
    name: "NewsData.io",
    fetch: async (query: string, limit: number, apiKey: string) => {
      // NewsData.io free tier requires country parameter
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&category=technology&country=us&language=en&size=${limit}`
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`NewsData.io failed: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results.map((article: any, index: number) => ({
          id: article.article_id || `newsdata-${index}`,
          title: article.title || "",
          description: article.description || "",
          url: article.link || "",
          urlToImage: article.image_url,
          publishedAt: article.pubDate || new Date().toISOString(),
          source: { name: article.source_id || "News" },
          author: article.creator?.[0] || article.source_id,
        }));
      }
      throw new Error("NewsData.io invalid response");
    },
  },
  NEWSAPI: {
    name: "News API",
    fetch: async (query: string, limit: number, apiKey: string) => {
      // News API requires backend proxy due to CORS, but let's try headlines endpoint
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=technology&pageSize=${limit}&apiKey=${apiKey}`
      );
      if (!response.ok) {
        // 426 means upgrade required (paid plan needed)
        if (response.status === 426) {
          throw new Error("News API requires paid plan");
        }
        throw new Error("News API failed");
      }
      const data = await response.json();
      if (data.articles) {
        return data.articles.map((article: any, index: number) => ({
          id: article.url || `newsapi-${index}`,
          title: article.title || "",
          description: article.description || "",
          url: article.url || "",
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt || new Date().toISOString(),
          source: { name: article.source?.name || "News" },
          author: article.author,
        }));
      }
      throw new Error("News API invalid response");
    },
  },
  GNEWS: {
    name: "GNews API",
    fetch: async (query: string, limit: number, apiKey: string) => {
      // GNews has CORS issues from browser, skip for now or use backend proxy
      // For now, we'll skip it as it requires backend proxy
      throw new Error("GNews API requires backend proxy due to CORS");
    },
  },
  MEDIASTACK: {
    name: "Media Stack API",
    fetch: async (query: string, limit: number, apiKey: string) => {
      // Skip if API key is invalid (shows as "...")
      if (!apiKey || apiKey === "..." || apiKey.length < 10) {
        throw new Error("Media Stack API key invalid");
      }
      
      const response = await fetch(
        `https://api.mediastack.com/v1/news?access_key=${apiKey}&categories=technology&limit=${limit}&languages=en`
      );
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Media Stack API key invalid or expired");
        }
        throw new Error("Media Stack API failed");
      }
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data.map((article: any, index: number) => ({
          id: article.url || `mediastack-${index}`,
          title: article.title || "",
          description: article.description || "",
          url: article.url || "",
          urlToImage: article.image,
          publishedAt: article.published_at || new Date().toISOString(),
          source: { name: article.source || "News" },
          author: article.author,
        }));
      }
      throw new Error("Media Stack API invalid response");
    },
  },
  RSS_FALLBACK: {
    name: "RSS Feed",
    fetch: async (query: string, limit: number) => {
      // Use CORS proxy to fetch RSS feeds
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const rssFeeds = [
        { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
        { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
        { url: 'https://feeds.arstechnica.com/arstechnica/index', name: 'Ars Technica' },
      ];
      
      for (const feed of rssFeeds) {
        try {
          const response = await fetch(`${corsProxy}${encodeURIComponent(feed.url)}`);
          if (response.ok) {
            const xmlText = await response.text();
            
            // Parse RSS XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            
            // Check for parsing errors
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
              continue;
            }
            
            const items = xmlDoc.querySelectorAll('item');
            
            if (items.length > 0) {
              const articles = Array.from(items).slice(0, limit).map((item: Element, index: number) => {
                const getText = (selector: string) => {
                  const el = item.querySelector(selector);
                  return el?.textContent?.trim() || '';
                };
                
                const getAttr = (selector: string, attr: string) => {
                  const el = item.querySelector(selector);
                  return el?.getAttribute(attr) || '';
                };
                
                // Try different namespace variations for link
                const getLink = () => {
                  return getText('link') || 
                         getText('guid') || 
                         item.querySelector('link')?.textContent?.trim() || '';
                };
                
                const title = getText('title');
                const link = getLink();
                const description = getText('description')?.replace(/<[^>]*>/g, "").substring(0, 200) || '';
                const pubDate = getText('pubDate') || getText('dc:date') || new Date().toISOString();
                
                // Try multiple ways to get image
                const image = getAttr('enclosure', 'url') || 
                            getAttr('media:content', 'url') ||
                            getAttr('media:thumbnail', 'url') ||
                            item.querySelector('media\\:content, content')?.getAttribute('url') || '';
                
                return {
                  id: link || `rss-${index}`,
                  title,
                  description,
                  url: link,
                  urlToImage: image,
                  publishedAt: pubDate,
                  source: { name: feed.name },
                  author: getText('author') || getText('dc:creator') || feed.name,
                };
              });
              
              if (articles.length > 0) {
                return articles;
              }
            }
          }
        } catch (err) {
          // Try next feed
          continue;
        }
      }
      
      throw new Error("RSS feed failed");
    },
  },
};

const useNews = (query: string = "technology", limit: number = 10) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    setActiveProvider(null);

    // Get API keys from environment
    const apiKeys = {
      newsapiAi: import.meta.env.VITE_NEWSAPI_AI_KEY,
      newsdata: import.meta.env.VITE_NEWSDATA_API_KEY,
      newsapi: import.meta.env.VITE_NEWS_API_KEY,
      gnews: import.meta.env.VITE_GNEWS_API_KEY,
      mediastack: import.meta.env.VITE_MEDIASTACK_API_KEY,
    };

    // Try each API provider in order until one succeeds
    // Skip GNews due to CORS issues (requires backend proxy)
    const providers = [
      { key: "newsdata", provider: API_PROVIDERS.NEWSDATA, apiKey: apiKeys.newsdata },
      { key: "mediastack", provider: API_PROVIDERS.MEDIASTACK, apiKey: apiKeys.mediastack },
      { key: "newsapiAi", provider: API_PROVIDERS.NEWSAPI_AI, apiKey: apiKeys.newsapiAi },
      { key: "newsapi", provider: API_PROVIDERS.NEWSAPI, apiKey: apiKeys.newsapi },
      { key: "rss", provider: API_PROVIDERS.RSS_FALLBACK, apiKey: null }, // No API key needed
    ];

    let lastError: Error | null = null;

    for (const { key, provider, apiKey } of providers) {
      // Skip if API key is required but not provided (except RSS)
      if (key !== "rss" && !apiKey) {
        continue;
      }

      try {
        console.log(`Trying ${provider.name}...`);
        const fetchedArticles = await provider.fetch(query, limit, apiKey || "");
        
        if (fetchedArticles && fetchedArticles.length > 0) {
          setArticles(fetchedArticles);
          setActiveProvider(provider.name);
          setLoading(false);
          console.log(`✓ Successfully fetched from ${provider.name}`);
          return;
        } else {
          // Empty results - try next provider
          console.log(`⚠ ${provider.name} returned empty results, trying next...`);
          continue;
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Unknown error");
        console.log(`✗ ${provider.name} failed:`, lastError.message);
        // Continue to next provider
        continue;
      }
    }

    // All providers failed
    setError(
      lastError?.message || 
      "All news APIs failed. Please check your API keys or try again later."
    );
    setArticles([]);
    setLoading(false);
    console.error("All news API providers failed");
  };

  useEffect(() => {
    fetchNews();
  }, [query, limit]);

  const refetch = () => {
    fetchNews();
  };

  return { articles, loading, error, refetch, activeProvider };
};

export default useNews;
