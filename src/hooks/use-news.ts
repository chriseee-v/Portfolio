import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const CACHE_KEY_PREFIX = "gemini_news_cache_";
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

interface CachedNews {
  articles: NewsArticle[];
  timestamp: number;
  query: string;
  limit: number;
}

const useNews = (query: string = "technology", limit: number = 10) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  // Check cache first
  const getCachedNews = (): NewsArticle[] | null => {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${query}_${limit}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const data: CachedNews = JSON.parse(cached);
        const now = Date.now();
        // Check if cache is still valid (less than 4 hours old)
        if (now - data.timestamp < CACHE_DURATION && data.query === query && data.limit === limit) {
          console.log("Using cached news data");
          // Ensure all cached articles have unique IDs
          const usedIds = new Set<string>();
          const articlesWithUniqueIds = data.articles.map((article, index) => {
            let uniqueId = article.id;
            // If ID is missing or already used, generate a new one
            if (!uniqueId || usedIds.has(uniqueId)) {
              let attempts = 0;
              do {
                const randomSuffix = Math.random().toString(36).substring(2, 15);
                const titleHash = (article.title || `article-${index}`)
                  .substring(0, 30)
                  .replace(/\s+/g, "-")
                  .replace(/[^a-zA-Z0-9-]/g, "");
                uniqueId = `gemini-cached-${index}-${data.timestamp}-${randomSuffix}-${titleHash}`;
                attempts++;
              } while (usedIds.has(uniqueId) && attempts < 10);
            }
            usedIds.add(uniqueId);
            return { ...article, id: uniqueId };
          });
          return articlesWithUniqueIds;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(cacheKey);
        }
      }
    } catch (err) {
      console.error("Error reading cache:", err);
    }
    return null;
  };

  // Save to cache
  const saveToCache = (articles: NewsArticle[]) => {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${query}_${limit}`;
      const data: CachedNews = {
        articles,
        timestamp: Date.now(),
        query,
        limit,
      };
      localStorage.setItem(cacheKey, JSON.stringify(data));
      console.log("News data cached");
    } catch (err) {
      console.error("Error saving cache:", err);
    }
  };

  const fetchNews = async (forceRefresh: boolean = false) => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cachedArticles = getCachedNews();
      if (cachedArticles) {
        setArticles(cachedArticles);
        setActiveProvider("Gemini (Cached)");
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    setError(null);
    setActiveProvider(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      setError("Gemini API key not found. Please add VITE_GEMINI_API_KEY to your environment variables.");
      setLoading(false);
      return;
    }

    try {
      console.log("Trying Google Gemini...");
      
      const genAI = new GoogleGenerativeAI(apiKey);
      // Using gemini-2.5-flash with Google Search enabled for real-time news
      // If this model is not available, try: gemini-1.5-flash, gemini-1.5-pro, or gemini-2.0-flash-exp
      const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-lite-latest",
        tools: [{ googleSearch: {} } as any] // Type assertion needed for google_search tool
      });

      // Create a more flexible prompt that doesn't demand real-time search
      const prompt = `Provide ${limit} recent technology news articles about "${query}".
      
      Format your response as a JSON array. You can include a brief explanation before the JSON if needed, but make sure the JSON array is clearly marked.
      
      JSON structure:
      [
        {
          "title": "Article title",
          "description": "Brief summary or description",
          "url": "Article URL or Google search URL",
          "urlToImage": "",
          "publishedAt": "2024-12-15T00:00:00Z",
          "source": { "name": "Source Name" },
          "author": "Author name or source name"
        }
      ]
      
      Focus on technology, programming, AI, and software development topics.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Gemini raw response:", text.substring(0, 500)); // Log first 500 chars for debugging

      // Try to extract JSON from the response
      // Gemini might include explanatory text before/after the JSON
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.includes("```json")) {
        const jsonBlock = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonBlock) {
          jsonText = jsonBlock[1].trim();
        }
      } else if (jsonText.includes("```")) {
        const jsonBlock = jsonText.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonBlock) {
          jsonText = jsonBlock[1].trim();
        }
      }

      // Try to find JSON array in the text (might be embedded in explanatory text)
      let parsedArticles: any[] = [];
      
      // First, try parsing the whole text
      try {
        parsedArticles = JSON.parse(jsonText);
        if (Array.isArray(parsedArticles)) {
          console.log("Parsed articles count:", parsedArticles.length);
        } else {
          throw new Error("Response is not an array");
        }
      } catch (parseError) {
        console.log("Direct parse failed, searching for JSON array...");
        
        // Try to find JSON array pattern in the text
        // Look for array that starts with [ and ends with ]
        const jsonArrayPattern = /\[\s*\{[\s\S]*\}\s*\]/;
        const jsonMatch = jsonText.match(jsonArrayPattern);
        
        if (jsonMatch) {
          try {
            parsedArticles = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted JSON array from text");
          } catch (e) {
            console.error("Failed to parse extracted JSON:", e);
            // Try a more lenient extraction - find anything between [ and ]
            const bracketMatch = jsonText.match(/\[([\s\S]*)\]/);
            if (bracketMatch) {
              try {
                parsedArticles = JSON.parse(`[${bracketMatch[1]}]`);
                console.log("Successfully parsed with bracket extraction");
              } catch (e2) {
                console.error("All JSON extraction methods failed");
                throw new Error(`Failed to parse Gemini response. Response preview: ${text.substring(0, 300)}`);
              }
            } else {
              throw new Error(`No JSON array found in response. Preview: ${text.substring(0, 300)}`);
            }
          }
        } else {
          // Last resort: try to extract individual objects and build array
          const objectPattern = /\{[\s\S]*?\}/g;
          const objects = jsonText.match(objectPattern);
          if (objects && objects.length > 0) {
            try {
              parsedArticles = objects.map(obj => JSON.parse(obj));
              console.log(`Extracted ${parsedArticles.length} articles from individual objects`);
            } catch (e) {
              throw new Error(`Failed to parse response. Preview: ${text.substring(0, 300)}`);
            }
          } else {
            throw new Error(`No JSON structure found. Response preview: ${text.substring(0, 300)}`);
          }
        }
      }

      // Validate and transform the articles
      if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
        console.log("Processing articles:", parsedArticles.length);
        const baseTimestamp = Date.now();
        const usedIds = new Set<string>();
        
        const articles: NewsArticle[] = parsedArticles.slice(0, limit).map((article: any, index: number) => {
          // Use the URL from Gemini's search results if available and valid
          let articleUrl = article.url || "";
          
          // Validate URL - if it's invalid, create a Google search URL as fallback
          if (!articleUrl || 
              articleUrl.includes("example.com") || 
              articleUrl.includes("placeholder") ||
              !articleUrl.startsWith("http")) {
            // Fallback: Create Google search URL for the article title
            const searchTerms = [
              article.title || query,
              article.source?.name || article.source || ""
            ].filter(Boolean).join(" ");
            const searchQuery = encodeURIComponent(searchTerms);
            articleUrl = `https://www.google.com/search?q=${searchQuery}`;
          }
          
          // Validate and format the published date
          let publishedDate = article.publishedAt || article.published_at || new Date().toISOString();
          try {
            const date = new Date(publishedDate);
            // If date is more than 30 days old, use current date (likely invalid)
            if (date < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
              publishedDate = new Date().toISOString();
            }
          } catch {
            publishedDate = new Date().toISOString();
          }
          
          // Generate a unique ID - ensure it's truly unique even if URLs are duplicated
          let uniqueId: string;
          let attempts = 0;
          do {
            const randomSuffix = Math.random().toString(36).substring(2, 15);
            const titleHash = (article.title || `article-${index}`)
              .substring(0, 30)
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9-]/g, "");
            uniqueId = `gemini-${index}-${baseTimestamp}-${randomSuffix}-${titleHash}`;
            attempts++;
          } while (usedIds.has(uniqueId) && attempts < 10);
          
          usedIds.add(uniqueId);
          
          return {
            id: uniqueId,
            title: article.title || "Untitled Article",
            description: article.description || article.summary || "",
            url: articleUrl,
            urlToImage: article.urlToImage || article.image || "",
            publishedAt: publishedDate,
            source: {
              name: article.source?.name || article.source || "Gemini News",
            },
            author: article.author || article.source?.name || "Unknown",
          };
        });

        if (articles.length > 0) {
          setArticles(articles);
          setActiveProvider("Gemini");
          setLoading(false);
          saveToCache(articles); // Cache the results
          console.log(`✓ Successfully fetched ${articles.length} articles from Google Gemini`);
          return;
        } else {
          console.warn("Articles array is empty after processing");
        }
      } else {
        console.warn("Parsed articles is not an array or is empty:", parsedArticles);
      }

      throw new Error(`Gemini returned invalid or empty article data. Parsed: ${JSON.stringify(parsedArticles).substring(0, 200)}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to fetch news from Gemini: ${errorMessage}`);
      setArticles([]);
      setLoading(false);
      console.error("Gemini API failed:", errorMessage);
    }
  };

  useEffect(() => {
    fetchNews(false); // Don't force refresh on mount
  }, [query, limit]);

  const refetch = () => {
    fetchNews(true); // Force refresh when manually called
  };

  return { articles, loading, error, refetch, activeProvider };
};

export default useNews;
