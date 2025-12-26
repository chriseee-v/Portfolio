import { Calendar, Clock, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "The Art of Micro-Interactions",
    date: "Dec 15, 2024",
    readTime: "5 min",
    tags: ["Design", "UX"],
    summary: "How subtle animations and feedback loops create delightful user experiences that feel natural and intuitive.",
  },
  {
    id: 2,
    title: "WebGL Performance Optimization",
    date: "Nov 28, 2024",
    readTime: "8 min",
    tags: ["WebGL", "Performance"],
    summary: "Deep dive into shader optimization, geometry instancing, and efficient rendering pipelines for smooth 60fps experiences.",
  },
  {
    id: 3,
    title: "Building Design Systems at Scale",
    date: "Nov 12, 2024",
    readTime: "6 min",
    tags: ["Design Systems", "React"],
    summary: "Lessons learned from building and maintaining design systems for large distributed teams.",
  },
  {
    id: 4,
    title: "The Future of CSS: Container Queries",
    date: "Oct 30, 2024",
    readTime: "4 min",
    tags: ["CSS", "Frontend"],
    summary: "Exploring the new CSS container queries and how they change the way we think about responsive design.",
  },
  {
    id: 5,
    title: "GSAP vs Framer Motion: A Comparison",
    date: "Oct 15, 2024",
    readTime: "7 min",
    tags: ["Animation", "React"],
    summary: "An in-depth comparison of the two most popular animation libraries for modern web development.",
  },
];

const BlogPage = () => {
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
      <section className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Stay in the loop</h3>
            <p className="text-sm text-muted-foreground">Get notified when new articles are published.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 px-4 py-2 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="lab-button-primary px-6">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
