import { Megaphone, ExternalLink, Calendar, Mic, Award, Rocket } from "lucide-react";

const newsItems = [
  {
    id: 1,
    type: "talk",
    icon: Mic,
    title: "Speaking at React Conf 2024",
    date: "Dec 20, 2024",
    description: "Presenting on advanced animation patterns with GSAP and React.",
    link: "#",
  },
  {
    id: 2,
    type: "launch",
    icon: Rocket,
    title: "Launched Neural Canvas v2.0",
    date: "Dec 10, 2024",
    description: "Major update with new AI models and collaborative features.",
    link: "#",
  },
  {
    id: 3,
    type: "feature",
    icon: Award,
    title: "Featured in Awwwards",
    date: "Nov 25, 2024",
    description: "Neon Mesh project received Site of the Day recognition.",
    link: "#",
  },
  {
    id: 4,
    type: "announcement",
    icon: Megaphone,
    title: "Open Source Contribution",
    date: "Nov 15, 2024",
    description: "Released new GSAP plugin for scroll-triggered 3D animations.",
    link: "#",
  },
  {
    id: 5,
    type: "talk",
    icon: Mic,
    title: "Workshop at CSS Day",
    date: "Oct 30, 2024",
    description: "4-hour workshop on modern CSS techniques and animations.",
    link: "#",
  },
  {
    id: 6,
    type: "launch",
    icon: Rocket,
    title: "New Portfolio Live",
    date: "Oct 15, 2024",
    description: "Redesigned personal site with experimental lab aesthetic.",
    link: "#",
  },
];

const typeColors = {
  talk: "bg-blue-500/10 text-blue-600",
  launch: "bg-green-500/10 text-green-600",
  feature: "bg-yellow-500/10 text-yellow-600",
  announcement: "bg-purple-500/10 text-purple-600",
};

const NewsPage = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Activity Log</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">LATEST UPDATES</span>
        </div>
        <h1 className="lab-title mb-4">news.</h1>
        <p className="text-muted-foreground max-w-2xl">
          Talks, launches, features, and announcements from the lab.
        </p>
      </div>

      {/* News Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {newsItems.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.id}
              className="group p-5 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${typeColors[item.type as keyof typeof typeColors]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>

                  {/* Link */}
                  <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 text-xs text-primary">
                      Learn more
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Archive Link */}
      <div className="mt-12 text-center">
        <button className="lab-button-outline">
          View All Updates
        </button>
      </div>
    </div>
  );
};

export default NewsPage;
