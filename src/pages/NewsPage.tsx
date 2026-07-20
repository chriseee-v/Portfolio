import { ExternalLink, RefreshCw, Loader2, ArrowUpRight, MessageSquare, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import useNews from "@/hooks/use-news";
import type { Feed } from "@/hooks/use-news";

const FEEDS: { id: Feed; label: string }[] = [
  { id: "top", label: "Top" },
  { id: "best", label: "Best" },
  { id: "new", label: "New" },
  { id: "show", label: "Show HN" },
  { id: "ask", label: "Ask HN" },
];

const NewsPage = () => {
  const [activeFeed, setActiveFeed] = useState<Feed>("top");
  const { articles, loading, error, refetch } = useNews(activeFeed, 12);

  const formatDate = (iso: string) => {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true });
    } catch {
      return iso;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="pt-10" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
        {/* Top meta bar */}
        <div className="flex items-stretch" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground self-center py-3">
            Hacker News
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderLeft: "2px solid hsl(var(--foreground))" }}>
            {loading ? (
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
            ) : (
              <span className="font-mono text-xs text-primary font-bold">{articles.length} STORIES</span>
            )}
            <button
              onClick={refetch}
              disabled={loading}
              className="w-7 h-7 flex items-center justify-center hover:bg-primary hover:text-white transition-colors disabled:opacity-40"
              style={{ border: "1.5px solid hsl(var(--foreground))" }}
              title="Refresh"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

        <h1
          className="font-bold lowercase leading-none py-4 text-foreground"
          style={{ fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-0.04em" }}
        >
          news<span className="text-primary">.</span>
        </h1>

        {/* Feed selector — brutalist tab bar */}
        <div className="flex overflow-x-auto pb-0" style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
          {FEEDS.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFeed(f.id)}
              className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-100 ${
                activeFeed === f.id
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-foreground hover:text-background"
              }`}
              style={{
                borderRight: i < FEEDS.length - 1 ? "2px solid hsl(var(--foreground))" : "none",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-12">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">
            Fetching from Hacker News...
          </span>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="py-8 px-4 mt-6" style={{ border: "2px solid hsl(var(--foreground))", boxShadow: "4px 4px 0 hsl(var(--foreground))" }}>
          <p className="font-mono text-sm font-bold text-foreground uppercase">{error}</p>
          <button onClick={refetch} className="lab-button-outline mt-4 text-xs">
            Retry
          </button>
        </div>
      )}

      {/* Stories grid */}
      {!loading && articles.length > 0 && (
        <div className="mt-0" style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
          {/* Column headers */}
          <div
            className="hidden md:grid grid-cols-[3rem_1fr_8rem_6rem] font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.2)" }}
          >
            <div className="px-4 py-2 text-center" style={{ borderRight: "1px solid hsl(var(--foreground) / 0.2)" }}>#</div>
            <div className="px-4 py-2" style={{ borderRight: "1px solid hsl(var(--foreground) / 0.2)" }}>Story</div>
            <div className="px-4 py-2" style={{ borderRight: "1px solid hsl(var(--foreground) / 0.2)" }}>Source</div>
            <div className="px-4 py-2">Score</div>
          </div>

          {articles.map((article, i) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid md:grid-cols-[3rem_1fr_8rem_6rem] items-start transition-colors duration-100 hover:bg-primary/5"
              style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.15)" }}
            >
              {/* Index */}
              <div
                className="hidden md:flex items-center justify-center py-4 text-muted-foreground font-mono text-xs font-bold h-full"
                style={{ borderRight: "1px solid hsl(var(--foreground) / 0.15)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Title + meta */}
              <div className="px-4 py-4 min-w-0" style={{ borderRight: "1px solid hsl(var(--foreground) / 0.15)" }}>
                <div className="flex items-start gap-2">
                  <span className="md:hidden font-mono text-[10px] text-muted-foreground mr-1 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </p>
                  <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground md:hidden">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    {article.score}
                  </span>
                  {article.commentCount > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <MessageSquare className="w-3 h-3" />
                      {article.commentCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Source */}
              <div
                className="hidden md:flex items-center px-4 py-4 h-full"
                style={{ borderRight: "1px solid hsl(var(--foreground) / 0.15)" }}
              >
                <span className="font-mono text-[10px] text-muted-foreground truncate">
                  {article.source.name}
                </span>
              </div>

              {/* Score */}
              <div className="hidden md:flex items-center gap-1.5 px-4 py-4 h-full">
                <TrendingUp className="w-3 h-3 text-primary shrink-0" />
                <span className="font-mono text-xs font-bold text-foreground">{article.score}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer link */}
      {!loading && articles.length > 0 && (
        <div className="flex justify-between items-center py-4 mt-0" style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            Powered by Hacker News API
          </span>
          <a
            href="https://news.ycombinator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider hover:text-primary transition-colors"
          >
            View on HN
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
