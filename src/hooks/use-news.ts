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
      // Using gemini-2.5-flash as requested
      // If this model is not available, try: gemini-1.5-flash, gemini-1.5-pro, or gemini-2.0-flash-exp
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      // Create a prompt that asks for recent news articles in JSON format
      const prompt = `Provide me with ${limit} recent news articles about ${query}. 
      IMPORTANT: For the "url" field, you MUST provide REAL, WORKING URLs from actual news websites.
      Use URLs from reputable tech news sources like:
      - TechCrunch (techcrunch.com)
      - The Verge (theverge.com)
      - Ars Technica (arstechnica.com)
      - Wired (wired.com)
      - Engadget (engadget.com)
      - BBC Technology (bbc.com/news/technology)
      - Reuters Technology (reuters.com/technology)
      - Or other well-known tech news sites
      
      If you cannot provide a real URL, use a Google search URL in this format:
      https://www.google.com/search?q=[article title with + instead of spaces]
      
      Return the response as a JSON array with the following structure:
      [
        {
          "title": "Article title",
          "description": "Brief description or summary",
          "url": "REAL URL from a news website or Google search URL",
          "urlToImage": "Image URL if available, otherwise empty string",
          "publishedAt": "Publication date in ISO format (use recent dates)",
          "source": { "name": "Source name (e.g., TechCrunch, The Verge)" },
          "author": "Author name if available"
        }
      ]
      
      Make sure the articles are recent (within the last few weeks) and relevant to ${query}. 
      Focus on technology, programming, AI, software development, and related topics.
      Return ONLY valid JSON, no markdown formatting, no code blocks.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

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
      } catch (parseError) {
        // If parsing fails, try to extract JSON array from the text
        const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedArticles = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse Gemini response as JSON");
        }
      }

      // Validate and transform the articles
      if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
        const articles: NewsArticle[] = parsedArticles.slice(0, limit).map((article: any, index: number) => {
          // If URL is invalid or placeholder, create a Google search URL
          let articleUrl = article.url || "";
          if (!articleUrl || 
              articleUrl.includes("example.com") || 
              articleUrl.includes("placeholder") ||
              !articleUrl.startsWith("http")) {
            // Create Google search URL for the article title
            const searchQuery = encodeURIComponent(article.title || query);
            articleUrl = `https://www.google.com/search?q=${searchQuery}`;
          }
          
          return {
            id: articleUrl || article.id || `gemini-${index}-${Date.now()}`,
            title: article.title || "Untitled Article",
            description: article.description || article.summary || "",
            url: articleUrl,
            urlToImage: article.urlToImage || article.image || "",
            publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
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
        }
      }

      throw new Error("Gemini returned invalid or empty article data");
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
