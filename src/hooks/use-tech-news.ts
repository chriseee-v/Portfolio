import { useState, useEffect } from 'react';

export type TechArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  reading_time_minutes: number;
  tag_list?: string[];
  tags?: string | string[];
  user: {
    name: string;
    username: string;
  };
  cover_image?: string;
};

export const useTechNews = (tag?: string, perPage: number = 10) => {
  const [articles, setArticles] = useState<TechArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build URL with optional tag filter
        const baseUrl = 'https://dev.to/api/articles';
        const params = new URLSearchParams({
          per_page: perPage.toString(),
          top: '7', // Get top articles from last 7 days
        });
        
        if (tag) {
          params.append('tag', tag);
        }
        
        const response = await fetch(`${baseUrl}?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        
        // Normalize the tags field to always be an array
        const normalizedData = data.map((article: any) => ({
          ...article,
          tags: article.tag_list || (typeof article.tags === 'string' ? article.tags.split(',').map((t: string) => t.trim()) : article.tags || [])
        }));
        
        setArticles(normalizedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
        console.error('Error fetching tech news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [tag, perPage]);

  return { articles, loading, error };
};
