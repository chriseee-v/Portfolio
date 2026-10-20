import { Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react";
import blogsData from "@/data/blogs.json";
import { useTechNews } from "@/hooks/use-tech-news";

// Type definition for blog posts
type BlogPost = {
  id: number;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  summary: string;
  url?: string;
};

const posts = blogsData as BlogPost[];

const BlogPage = () => {
  // Fetch latest tech news
  const { articles: techNews, loading: newsLoading, error: newsError } = useTechNews('javascript', 8);
  
  // Combine personal blogs with tech news
  const allArticles = [
    ...posts.map(post => ({ ...post, source: 'personal' as const })),
    ...techNews.map(article => ({ ...article, source: 'tech-news' as const }))
  ];

  return (
    <div>
      {/* Header */}
      <div className="pt-10" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
        <div className="flex items-stretch" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          <span className="lab-label px-0 py-3 self-center">Thoughts & Writings</span>
          <div className="flex-1" />
          <span className="font-mono text-xs text-muted-foreground px-4 py-3 self-center" style={{ borderLeft: "2px solid hsl(var(--foreground))" }}>
            {allArticles.length} ARTICLES
          </span>
        </div>
        <h1 className="lab-title py-4">blog<span className="text-primary">.</span></h1>
        <p className="text-muted-foreground max-w-2xl pb-6 text-sm">
          My technical writings and curated tech news from the developer community.
        </p>
      </div>

      {/* Posts List */}
      {newsLoading && posts.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {allArticles.map((item) => {
            const isPersonal = item.source === 'personal';

            if (isPersonal) {
              const post = item as typeof posts[0] & { source: 'personal' };
              return (
                <article
                  key={`personal-${post.id}`}
                  onClick={() => post.url && window.open(post.url, '_blank')}
                  className="group p-5 cursor-pointer transition-all duration-150 bg-card"
                  style={{
                    border: "2px solid hsl(var(--foreground))",
                    boxShadow: "4px 4px 0px hsl(var(--foreground))",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "2px 2px 0px hsl(var(--primary))", e.currentTarget.style.transform = "translate(2px,2px)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "4px 4px 0px hsl(var(--foreground))", e.currentTarget.style.transform = "none")}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs font-mono font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                          My Blog
                        </span>
                        {post.tags.map((tag) => (
                          <span key={tag} className="tech-tag text-xs">{tag}</span>
                        ))}
                      </div>
                      <h2 className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{post.summary}</p>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="font-mono text-xs">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-xs">{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.15)", paddingTop: "0.75rem" }}>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Read article</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </article>
              );
            } else {
              const article = item as typeof techNews[0] & { source: 'tech-news' };
              return (
                <article
                  key={`tech-${article.id}`}
                  onClick={() => window.open(article.url, '_blank')}
                  className="group p-5 cursor-pointer transition-all duration-150 bg-card"
                  style={{
                    border: "2px solid hsl(var(--foreground))",
                    boxShadow: "4px 4px 0px hsl(var(--foreground))",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = "2px 2px 0px hsl(var(--primary))", e.currentTarget.style.transform = "translate(2px,2px)")}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = "4px 4px 0px hsl(var(--foreground))", e.currentTarget.style.transform = "none")}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {article.cover_image && (
                      <div className="md:w-44 h-28 overflow-hidden flex-shrink-0" style={{ border: "2px solid hsl(var(--foreground))" }}>
                        <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(article.tags) && article.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="tech-tag text-xs">#{tag}</span>
                        ))}
                      </div>
                      <h2 className="text-lg font-bold uppercase tracking-tight group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl line-clamp-2">{article.description}</p>
                      <div className="text-xs font-mono text-muted-foreground">by {article.user.name}</div>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span className="font-mono text-xs">
                          {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-mono text-xs">{article.reading_time_minutes} min</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.15)", paddingTop: "0.75rem" }}>
                    <span className="text-xs font-mono font-bold uppercase tracking-widest">Read on Dev.to</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </article>
              );
            }
          })}
        </div>
      )}

    </div>
  );
};

export default BlogPage;
