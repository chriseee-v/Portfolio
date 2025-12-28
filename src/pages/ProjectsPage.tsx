import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import projectsData from "@/data/projects.json";
import { staggerContainer, staggerItem, filterTransition, buttonHoverVariants } from "@/lib/motion";
import { gsap } from "gsap";

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
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const navigate = useNavigate();
  
  // Featured projects (first 2)
  const featuredIds = [1, 2];

  // Handle card click with smooth left-to-right transition
  const handleCardClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    const card = e.currentTarget as HTMLElement;
    
    // Create overlay for transition effect
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-background z-[9999]';
    overlay.style.transform = 'translateX(-100%)';
    document.body.appendChild(overlay);

    // Animate overlay from left to right
    gsap.to(overlay, {
      x: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Navigate or open link after transition
        if (project.url) {
          window.open(project.url, '_blank', 'noopener,noreferrer');
        }
        // Slide out to the right
        setTimeout(() => {
          gsap.to(overlay, {
            x: '100%',
            duration: 0.4,
            ease: "power2.inOut",
            onComplete: () => {
              document.body.removeChild(overlay);
            }
          });
        }, 300);
      }
    });
  };

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
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === filter
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
            layout
          >
            {filter}
          </motion.button>
        ))}
      </div>

      {/* Projects Grid */}
      <motion.div
        ref={ref}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate={inView ? "animate" : "initial"}
      >
        <AnimatePresence mode="wait">
          {filteredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              layout
              variants={staggerItem}
              className="project-card group relative overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
              onClick={(e) => handleCardClick(e, project)}
            >
              {/* Featured badge */}
              {featuredIds.includes(project.id) && (
                <motion.div
                  className="absolute top-2 right-2 z-10"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.5,
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-mono rounded">
                    NEW
                  </span>
                </motion.div>
              )}
              
              {/* Accent Corner */}
              <div className="absolute top-0 right-0 w-16 h-16">
                <motion.div 
                  className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
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
                    <motion.span 
                      key={tech} 
                      className="tech-tag text-xs"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.15 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                {/* Hover Actions */}
                <motion.div 
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {project.url && (
                    <motion.a 
                      href={project.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                      whileHover={{ x: 2 }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </motion.a>
                  )}
                  {project.github && (
                    <motion.a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
                      whileHover={{ x: 2 }}
                    >
                      <Github className="w-3 h-3" />
                      Code
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ProjectsPage;
