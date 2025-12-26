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
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Create a prompt that asks for recent news articles in JSON format
      const prompt = `Provide me with ${limit} recent news articles about ${query}. 
      Return the response as a JSON array with the following structure:
      [
        {
          "title": "Article title",
          "description": "Brief description or summary",
          "url": "Source URL if available, otherwise a placeholder",
          "urlToImage": "Image URL if available, otherwise empty string",
          "publishedAt": "Publication date in ISO format",
          "source": { "name": "Source name" },
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
        const articles: NewsArticle[] = parsedArticles.slice(0, limit).map((article: any, index: number) => ({
          id: article.url || article.id || `gemini-${index}-${Date.now()}`,
          title: article.title || "Untitled Article",
          description: article.description || article.summary || "",
          url: article.url || `https://example.com/article-${index}`,
          urlToImage: article.urlToImage || article.image || "",
          publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
          source: {
            name: article.source?.name || article.source || "Gemini News",
          },
          author: article.author || article.source?.name || "Unknown",
        }));

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
