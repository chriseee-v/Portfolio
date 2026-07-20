import { useState, useEffect } from "react";
import { ExternalLink, Github, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import projectsData from "@/data/projects.json";
import { gsap } from "gsap";

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

      <div className="p-6 grid lg:grid-cols-[1fr_auto] gap-6 items-start">
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

          <h3 className="text-2xl font-bold uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
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
          className="shrink-0 flex flex-col items-center justify-center px-6 py-5 bg-primary text-white"
          style={{ minWidth: "200px", border: "2px solid hsl(var(--foreground))" }}
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
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
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

  const inProgressProjects = filteredProjects.filter((p) => p.status === "in-progress");
  const completedProjects = filteredProjects.filter((p) => p.status !== "in-progress");

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
        className="flex flex-wrap gap-0 mb-0"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${
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

      {/* Projects Grid */}
      <motion.div
        ref={ref}
        className="grid md:grid-cols-2 lg:grid-cols-3 mt-8 gap-6"
        initial="initial"
        animate={inView ? "animate" : "initial"}
        variants={{
          initial: {},
          animate: { transition: { staggerChildren: 0.07 } },
        }}
      >
        <AnimatePresence mode="wait">
          {/* In-progress projects — full width, shown first */}
          {inProgressProjects.map((project) => (
            <InProgressCard
              key={project.id}
              project={project}
              onClick={(e) => handleCardClick(e, project)}
            />
          ))}

          {/* Completed projects */}
          {completedProjects.map((project, index) => (
            <motion.article
              key={project.id}
              layout
              className="project-card group relative overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              onClick={(e) => handleCardClick(e, project)}
            >
              {/* Top bar */}
              <div
                className="flex items-center justify-between mb-4 pb-3"
                style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
              >
                <span className="font-mono text-xs text-muted-foreground font-bold">{project.year}</span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-1">
                  {project.category}
                </span>
              </div>

              <h3 className="text-lg font-bold uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description}
              </p>

              <div
                className="pt-3 pb-3 mb-4"
                style={{ borderTop: "1.5px solid hsl(var(--foreground) / 0.15)", borderBottom: "1.5px solid hsl(var(--foreground) / 0.15)" }}
              >
                <span className="text-xs font-mono font-bold text-foreground/60 uppercase tracking-wide">{project.role}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.stack.map((tech) => (
                  <span key={tech} className="tech-tag text-xs">{tech}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-3" style={{ borderTop: "1.5px solid hsl(var(--foreground) / 0.15)" }}>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Live
                  </a>
                )}
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
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
