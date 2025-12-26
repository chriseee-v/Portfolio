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
      const response = await fetch(
        `https://api.newsapi.ai/v1/article/getArticles?query=${encodeURIComponent(query)}&resultType=articles&articlesCount=${limit}&apiKey=${apiKey}`
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
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${encodeURIComponent(query)}&language=en&size=${limit}`
      );
      if (!response.ok) throw new Error("NewsData.io failed");
      const data = await response.json();
      if (data.results) {
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
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${limit}&apiKey=${apiKey}`
      );
      if (!response.ok) throw new Error("News API failed");
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
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=${limit}&apikey=${apiKey}`
      );
      if (!response.ok) throw new Error("GNews API failed");
      const data = await response.json();
      if (data.articles) {
        return data.articles.map((article: any, index: number) => ({
          id: article.url || `gnews-${index}`,
          title: article.title || "",
          description: article.description || "",
          url: article.url || "",
          urlToImage: article.image,
          publishedAt: article.publishedAt || new Date().toISOString(),
          source: { name: article.source?.name || "News" },
          author: article.source?.name,
        }));
      }
      throw new Error("GNews API invalid response");
    },
  },
  MEDIASTACK: {
    name: "Media Stack API",
    fetch: async (query: string, limit: number, apiKey: string) => {
      const response = await fetch(
        `http://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${encodeURIComponent(query)}&limit=${limit}&languages=en`
      );
      if (!response.ok) throw new Error("Media Stack API failed");
      const data = await response.json();
      if (data.data) {
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
      // RSS fallback doesn't need API key
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://feeds.feedburner.com/oreilly/radar')}&count=${limit}`;
      const response = await fetch(rssUrl);
      if (!response.ok) throw new Error("RSS feed failed");
      const data = await response.json();
      if (data.status === "ok" && data.items) {
        return data.items.map((item: any, index: number) => ({
          id: item.guid || item.link || `rss-${index}`,
          title: item.title || "",
          description: item.description?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
          url: item.link || "",
          urlToImage: item.enclosure?.link || item.thumbnail,
          publishedAt: item.pubDate || new Date().toISOString(),
          source: { name: item.author || "Tech News" },
          author: item.author,
        }));
      }
      throw new Error("RSS feed invalid response");
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
    const providers = [
      { key: "newsapiAi", provider: API_PROVIDERS.NEWSAPI_AI, apiKey: apiKeys.newsapiAi },
      { key: "newsdata", provider: API_PROVIDERS.NEWSDATA, apiKey: apiKeys.newsdata },
      { key: "newsapi", provider: API_PROVIDERS.NEWSAPI, apiKey: apiKeys.newsapi },
      { key: "gnews", provider: API_PROVIDERS.GNEWS, apiKey: apiKeys.gnews },
      { key: "mediastack", provider: API_PROVIDERS.MEDIASTACK, apiKey: apiKeys.mediastack },
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
