import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import projectsData from "@/data/projects.json";

const filters = ["All", "AI", "Full Stack", "Computer Vision", "IoT"];

// Type definition for projects
type Project = {
  id: number;
  title: string;
  role: string;
  year: string;
  stack: string[];
  category: string;
  description: string;
  url?: string;
  github?: string;
};

const projects = projectsData as Project[];

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
                {project.url && (
                  <a 
                    href={project.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View
                  </a>
                )}
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
                  >
                    <Github className="w-3 h-3" />
                    Code
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
