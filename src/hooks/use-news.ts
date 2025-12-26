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

const useNews = (query: string = "technology", limit: number = 10) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const fetchNews = async () => {
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

      // Create a prompt that uses Google Search to find the latest news
      const prompt = `Search the web for the ${limit} most recent news articles about "${query}" published in the last 7 days.
      
      Return ONLY a JSON array with this exact structure (no other text, no markdown):
      [
        {
          "title": "Article title",
          "description": "Brief summary",
          "url": "Full article URL",
          "urlToImage": "",
          "publishedAt": "2024-01-15T00:00:00Z",
          "source": { "name": "Source Name" },
          "author": "Author name"
        }
      ]
      
      Requirements:
      - Only articles from the last 7 days
      - Real URLs from actual news websites
      - Technology/programming/AI topics
      - Valid JSON only, no markdown code blocks`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("Gemini raw response:", text.substring(0, 500)); // Log first 500 chars for debugging

      // Try to extract JSON from the response
      // Gemini might wrap JSON in markdown code blocks
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      // Parse the JSON
      let parsedArticles: any[];
      try {
        parsedArticles = JSON.parse(jsonText);
        console.log("Parsed articles count:", parsedArticles?.length);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.log("Attempting to extract JSON from text...");
        // If parsing fails, try to extract JSON array from the text
        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            parsedArticles = JSON.parse(jsonMatch[0]);
            console.log("Successfully extracted JSON from text");
          } catch (e) {
            console.error("Failed to parse extracted JSON:", e);
            throw new Error(`Failed to parse Gemini response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
          }
        } else {
          console.error("No JSON array found in response");
          throw new Error(`Failed to parse Gemini response as JSON. Response preview: ${text.substring(0, 200)}`);
        }
      }

      // Validate and transform the articles
      if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
        console.log("Processing articles:", parsedArticles.length);
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
          
          return {
            id: articleUrl || article.id || `gemini-${index}-${Date.now()}`,
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
          setActiveProvider("Google Gemini");
          setLoading(false);
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
    fetchNews();
  }, [query, limit]);

  const refetch = () => {
    fetchNews();
  };

  return { articles, loading, error, refetch, activeProvider };
};

export default useNews;
