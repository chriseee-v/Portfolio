import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";

const filters = ["All", "Web", "3D", "Experiments", "Client"];

const projects = [
  {
    id: 1,
    title: "Clinician Agent for Stance Health",
    role: "AI Developer",
    year: "2025",
    stack: ["RAG", "Redis", "Phoenix Tracer", "Docker", "AWS"],
    category: "Web",
    description: "RAG-powered agent that reduced form-filling time by 40% for physiotherapy workflows. Scaled to 200+ concurrent users across 50+ clinics.",
  },
  {
    id: 2,
    title: "MCP Server & Client",
    role: "Backend Developer",
    year: "2025",
    stack: ["ChromaDB", "Flask", "LangChain", "BGE"],
    category: "Web",
    description: "Medical knowledge retrieval system with 95% accuracy. Processes 5,000+ queries daily with 99% API uptime.",
  },
  {
    id: 3,
    title: "Exercise Monitoring System",
    role: "Computer Vision Engineer",
    year: "2025",
    stack: ["OpenCV", "Pose Estimation", "DINO", "SAM 2"],
    category: "Experiments",
    description: "Real-time pose estimation system that improved form accuracy by 35%. Processes 500+ video frames per second.",
  },
  {
    id: 4,
    title: "Healthflex One-View",
    role: "Full Stack Developer",
    year: "2025",
    stack: ["FastAPI", "WebSocket", "MongoDB", "Plotly"],
    category: "Web",
    description: "Real-time athlete analytics platform integrating VALD data. Reduced data latency by 50% for 100+ users.",
  },
  {
    id: 5,
    title: "EEG-Controlled Prosthetic Arm",
    role: "IoT & ML Engineer",
    year: "2024",
    stack: ["Python", "Scikit-Learn", "Raspberry Pi", "3D Printing"],
    category: "Experiments",
    description: "Brain-controlled prosthetic arm with 85% action accuracy. Patent pending for commercial development.",
  },
  {
    id: 6,
    title: "Smart Streetlight Management",
    role: "IoT Developer",
    year: "2024",
    stack: ["Arduino", "LoRaWAN", "Python", "Firebase"],
    category: "Client",
    description: "IoT solution for centralized streetlight control. Reduced maintenance response times by 20%. Smart India Hackathon 24' Semi-Finalist.",
  },
];

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div>
      {/* Header */}
      <div className="mb-12 pt-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Selected Work</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">{projects.length} PROJECTS</span>
        </div>
        <h1 className="lab-title mb-4">projects.</h1>
        <p className="text-muted-foreground max-w-2xl">
          A collection of experiments, client work, and personal explorations in code and design.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="project-card group relative overflow-hidden"
          >
            {/* Accent Corner */}
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                <span className="tech-tag">{project.category}</span>
              </div>

              <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              <div className="pt-2 border-t border-border/50">
                <span className="text-xs font-medium text-foreground/60">{project.role}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="tech-tag text-xs">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Hover Actions */}
              <div className="flex gap-3 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1 text-sm text-primary hover:underline">
                  <ExternalLink className="w-3 h-3" />
                  View
                </button>
                <button className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground">
                  <Github className="w-3 h-3" />
                  Code
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
