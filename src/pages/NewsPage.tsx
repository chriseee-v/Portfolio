import { ExternalLink, Calendar, Clock, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import useNews from "@/hooks/use-news";
import { sectionVariants, staggerContainer, staggerItem } from "@/lib/motion";
import { formatDistanceToNow } from "date-fns";

const NewsPage = () => {
  const [query, setQuery] = useState("technology programming AI");
  const { articles, loading, error, refetch, activeProvider } = useNews(query, 12);
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const estimateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  const popularQueries = [
    "artificial intelligence",
    "web development",
    "cybersecurity",
    "machine learning",
    "cloud computing",
  ];

  return (
    <div>
      {/* Header */}
      <motion.div 
        ref={headerRef}
        className="mb-12 pt-8"
        variants={sectionVariants}
        initial="initial"
        animate={headerInView ? "animate" : "initial"}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Tech News</span>
          <div className="flex-1 h-px bg-border" />
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {loading ? "LOADING..." : `${articles.length} ARTICLES`}
            </span>
            {activeProvider && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-xs text-primary" title={`Using ${activeProvider}`}>
                  {activeProvider}
                </span>
              </>
            )}
          </div>
        </div>
        <h1 className="lab-title mb-4">news.</h1>
        <p className="text-muted-foreground max-w-2xl mb-6">
          Latest technology news, programming updates, and industry insights from around the web.
        </p>

        {/* Search/Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news topics..."
            className="flex-1 px-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                refetch();
              }
            }}
          />
          <motion.button
            onClick={() => refetch()}
            className="lab-button-primary px-6 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Refresh
              </>
            )}
          </motion.button>
        </div>

        {/* Popular Queries */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground font-mono">POPULAR:</span>
          {popularQueries.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                setTimeout(() => refetch(), 100);
              }}
              className="px-3 py-1 rounded-full text-xs bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading news...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-6"
        >
          <p className="font-semibold mb-2">All news APIs failed</p>
          <p className="text-xs mb-2">{error}</p>
          <p className="text-xs opacity-80">
            The system tried multiple providers with automatic fallback. Check console for details. 
            Add API keys to your .env file for better results. See NEWS_API_SETUP.md for instructions.
          </p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && articles.length === 0 && (
        <div className="p-8 rounded-xl bg-muted/30 border border-border text-center">
          <p className="text-muted-foreground mb-4">No news articles found.</p>
          <p className="text-sm text-muted-foreground">
            Try a different search query or check your API configuration.
          </p>
        </div>
      )}

      {/* News Grid */}
      <AnimatePresence>
        {!loading && articles.length > 0 && (
          <motion.div
            className="grid md:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                variants={staggerItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => window.open(article.url, '_blank')}
                className="group p-5 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer relative overflow-hidden"
              >
                {/* Accent Line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex gap-4">
                  {/* Source Badge */}
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                    <span className="text-xs font-bold">
                      {article.source.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{article.source.name}</span>
                    </div>
                    
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {article.description || "No description available."}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{estimateReadTime(article.description || article.title)}</span>
                      </div>
                    </div>

                    {/* Link */}
                    <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-flex items-center gap-1 text-xs text-primary">
                        Read article
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsPage;
