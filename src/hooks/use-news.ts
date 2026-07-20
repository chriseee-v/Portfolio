import { useState, useEffect, useCallback } from "react";

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: { name: string };
  score: number;
  commentCount: number;
}

const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const CACHE_KEY = "hn_news_cache";
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

interface Cache {
  articles: NewsArticle[];
  ts: number;
  feed: string;
}

type Feed = "top" | "new" | "best" | "ask" | "show";

const FEED_ENDPOINTS: Record<Feed, string> = {
  top: "topstories",
  new: "newstories",
  best: "beststories",
  ask: "askstories",
  show: "showstories",
};

async function fetchItem(id: number): Promise<NewsArticle | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`);
    const item = await res.json();
    if (!item || item.type !== "story" || !item.url || item.dead || item.deleted) return null;
    return {
      id: String(item.id),
      title: item.title,
      description: item.text ? item.text.replace(/<[^>]+>/g, "").slice(0, 200) : "",
      url: item.url,
      publishedAt: new Date(item.time * 1000).toISOString(),
      source: { name: new URL(item.url).hostname.replace(/^www\./, "") },
      score: item.score ?? 0,
      commentCount: item.descendants ?? 0,
    };
  } catch {
    return null;
  }
}

const useNews = (feed: Feed = "top", limit: number = 12) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (force = false) => {
    if (!force) {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: Cache = JSON.parse(raw);
          if (Date.now() - cached.ts < CACHE_TTL && cached.feed === feed) {
            setArticles(cached.articles.slice(0, limit));
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    setLoading(true);
    setError(null);
    try {
      const idsRes = await fetch(`${HN_BASE}/${FEED_ENDPOINTS[feed]}.json`);
      const ids: number[] = await idsRes.json();
      const top = ids.slice(0, 40);
      const results = await Promise.all(top.map(fetchItem));
      const valid = results.filter(Boolean) as NewsArticle[];
      const sliced = valid.slice(0, limit);
      setArticles(sliced);
      try {
        const cache: Cache = { articles: sliced, ts: Date.now(), feed };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
      } catch {}
    } catch (err) {
      setError("Failed to load Hacker News. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [feed, limit]);

  useEffect(() => { fetchNews(false); }, [fetchNews]);

  return { articles, loading, error, refetch: () => fetchNews(true) };
};

export default useNews;
export type { Feed };
