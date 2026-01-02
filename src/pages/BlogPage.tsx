import { useState } from "react";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import blogsData from "@/data/blogs.json";

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

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BlogPage = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }
    
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    // Clear error and start loading
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Handle network errors
      if (!response) {
        throw new Error('Network error: Could not reach the server. Make sure Vercel dev server is running (vercel dev)');
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      const text = await response.text();
      
      // If response is empty, it might be a 404 or server error
      if (!text) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Make sure to run "vercel dev" for local development.');
        }
        throw new Error(`Empty response from server (Status: ${response.status})`);
      }

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // If it's not JSON, show the text response
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      // Check if response is ok
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status} ${response.statusText}`);
      }

      // Success - set subscribed state
      setIsSubscribed(true);
    } catch (err: any) {
      // Provide helpful error messages
      let errorMessage = err.message || 'Something went wrong. Please try again.';
      
      // Add helpful hints for common errors
      if (err.message?.includes('Failed to fetch') || err.message?.includes('Network error')) {
        errorMessage = 'Cannot connect to server. For local development, run "vercel dev" in a separate terminal.';
      }
      
      setError(errorMessage);
      setIsSubscribed(false);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {/* Header */}
      <div className="mb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Thoughts & Writings</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">{posts.length} ARTICLES</span>
        </div>
        <h1 className="lab-title mb-4">blog.</h1>
        <p className="text-muted-foreground max-w-2xl">
          Technical deep-dives, design explorations, and lessons learned from building digital experiences.
        </p>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            onClick={() => post.url && window.open(post.url, '_blank')}
            className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer relative overflow-hidden"
          >
            {/* Accent Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Main Content */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="tech-tag text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {post.summary}
                </p>
              </div>

              {/* Meta */}
              <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground">
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

            {/* Read More */}
            <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-sm font-medium">Read article</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <section className="mt-16 p-6 md:p-8 rounded-2xl bg-muted/30 border border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-2">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">Get notified when new articles are published.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="flex-1 md:w-64">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="your@email.com"
                disabled={isSubscribed}
                className={`w-full px-4 py-2 rounded-full border bg-card text-sm focus:outline-none focus:ring-2 min-w-0 ${
                  error 
                    ? "border-destructive focus:ring-destructive/50" 
                    : "border-border focus:ring-primary/50"
                } ${isSubscribed ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {error && (
                <p className="mt-1 text-xs text-destructive ml-4">{error}</p>
              )}
            </div>
            <button 
              type="submit"
              disabled={isSubscribed || isLoading}
              className={`px-6 whitespace-nowrap flex-shrink-0 transition-colors ${
                isSubscribed 
                  ? "lab-button-primary bg-green-600 hover:bg-green-600 cursor-default" 
                  : "lab-button-primary"
              } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
            >
              {isLoading ? "Subscribing..." : isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
