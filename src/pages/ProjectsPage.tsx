import { useState, useEffect } from "react";
import { ExternalLink, Github, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import projectsData from "@/data/projects.json";
import { gsap } from "gsap";
import { ProjectsMarquee } from "@/components/ui/3d-testimonails";

const filters = ["All", "AI", "Full Stack", "Computer Vision", "IoT"];

type Project = {
  id: number;
  title: string;
  role: string;
  year: string;
  status?: string;
  startedAt?: string;
  stack: string[];
  category: string;
  description: string;
  url?: string;
  github?: string;
};

const projects = projectsData as Project[];

function useElapsed(startedAt?: string) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    if (!startedAt) return;
    const start = new Date(startedAt).getTime();

    const tick = () => {
      const diff = Date.now() - start;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setElapsed(`${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return elapsed;
}

function InProgressCard({ project, onClick }: { project: Project; onClick: (e: React.MouseEvent) => void }) {
  const elapsed = useElapsed(project.startedAt);

  return (
    <motion.article
      layout
      className="group relative overflow-hidden cursor-pointer md:col-span-2 lg:col-span-3"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      onClick={onClick}
      style={{
        border: "2px solid hsl(var(--primary))",
        boxShadow: "5px 5px 0px hsl(var(--primary))",
        background: "hsl(var(--card))",
      }}
    >
      {/* Active pulse bar at top */}
      <div className="h-1 w-full bg-primary relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(90deg, hsl(var(--primary)) 0, hsl(var(--primary-foreground)/0.3) 12px, hsl(var(--primary)) 24px)",
            animation: "marquee 2s linear infinite",
            width: "200%",
          }}
        />
      </div>

      <div className="p-4 md:p-6 grid lg:grid-cols-[1fr_auto] gap-5 md:gap-6 items-start">
        <div>
          {/* Top meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] bg-primary text-white px-2 py-1 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse inline-block" />
              IN PROGRESS
            </span>
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
            <span
              className="font-mono text-xs font-bold uppercase tracking-wider px-2 py-1 text-foreground"
              style={{ border: "1.5px solid hsl(var(--foreground) / 0.3)" }}
            >
              {project.category}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-5 max-w-2xl leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.stack.map((tech) => (
              <span key={tech} className="tech-tag text-xs">{tech}</span>
            ))}
          </div>

          <div className="flex gap-4 items-center pt-4" style={{ borderTop: "1.5px solid hsl(var(--foreground) / 0.15)" }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-foreground/60 hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="w-3 h-3" />
                Code
              </a>
            )}
            <span className="ml-auto text-xs font-mono text-muted-foreground">→ VIEW</span>
          </div>
        </div>

        {/* Live timer block */}
        <div
          className="shrink-0 w-full lg:w-auto flex flex-col items-center justify-center px-4 md:px-6 py-5 bg-primary text-white"
          style={{ minWidth: "0", border: "2px solid hsl(var(--foreground))" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-3.5 h-3.5 text-white/70" />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">Building since</span>
          </div>
          <div className="font-mono text-[10px] text-white/60 mb-2 uppercase tracking-widest">
            {project.startedAt ? new Date(project.startedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""}
          </div>
          <div className="font-mono font-bold text-white text-sm tracking-widest tabular-nums">
            {elapsed}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-background z-[9999]";
    overlay.style.transform = "translateX(-100%)";
    overlay.style.borderRight = "4px solid hsl(var(--primary))";
    document.body.appendChild(overlay);

    gsap.to(overlay, {
      x: 0,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        navigate(`/projects/${project.id}`);
        setTimeout(() => {
          gsap.to(overlay, {
            x: "100%",
            duration: 0.35,
            ease: "power2.inOut",
            onComplete: () => document.body.removeChild(overlay),
          });
        }, 100);
      },
    });
  };

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div>
      {/* Header */}
      <div className="pt-10" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
        <div className="flex items-stretch mb-0" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
          <span className="lab-label px-0 py-3 self-center">Selected Work</span>
          <div className="flex-1" />
          <span
            className="font-mono text-xs text-muted-foreground px-4 py-3 self-center"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          >
            {projects.length} PROJECTS
          </span>
        </div>
        <h1 className="lab-title py-4">projects<span className="text-primary">.</span></h1>
        <p className="text-muted-foreground max-w-2xl pb-6 text-sm">
          A collection of experiments, client work, and personal explorations in code and design.
        </p>
      </div>

      {/* Filters */}
      <div
        className="grid grid-cols-2 sm:flex gap-0 mb-0"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`w-full px-3 sm:px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "hover:bg-foreground hover:text-background"
            }`}
            style={{ borderRight: "1px solid hsl(var(--foreground) / 0.3)" }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Animated project marquee */}
      <div className="mt-8 -mx-6 w-screen max-w-none md:-mx-10 lg:-mx-14">
        <ProjectsMarquee
          projects={filteredProjects}
          onProjectClick={(project) => handleCardClick({ preventDefault: () => undefined } as React.MouseEvent, project)}
        />
      </div>

    </div>
  );
};

export default ProjectsPage;
