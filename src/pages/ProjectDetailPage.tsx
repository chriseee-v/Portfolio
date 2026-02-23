import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Tag } from "lucide-react";
import projectsData from "@/data/projects.json";
import { buttonHoverVariants } from "@/lib/motion";

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
  longDescription?: string;
  features?: string[];
  challenges?: string[];
  impact?: string[];
};

const projects = projectsData as Project[];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <button
            onClick={() => navigate("/projects")}
            className="text-primary hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20"
    >
      {/* Back Button */}
      <motion.button
        onClick={() => navigate("/projects")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
        variants={buttonHoverVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <span className="tech-tag mb-4 inline-block">{project.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            
            <div className="flex flex-wrap gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{project.role}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{project.stack.length} Technologies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(project.url || project.github) && (
          <div className="flex gap-4">
            {project.url && (
              <motion.a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <ExternalLink className="w-4 h-4" />
                View Live Project
              </motion.a>
            )}
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Github className="w-4 h-4" />
                View Source Code
              </motion.a>
            )}
          </div>
        )}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="project-card"
          >
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-foreground/80 leading-relaxed text-lg">
              {project.longDescription || project.description}
            </p>
          </motion.section>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="project-card"
            >
              <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-3">
                {project.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground/80">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Challenges & Solutions */}
          {project.challenges && project.challenges.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="project-card"
            >
              <h2 className="text-2xl font-semibold mb-4">Challenges & Solutions</h2>
              <ul className="space-y-3">
                {project.challenges.map((challenge, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground/80">{challenge}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Impact & Results */}
          {project.impact && project.impact.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="project-card bg-primary/5 border-primary/20"
            >
              <h2 className="text-2xl font-semibold mb-4">Impact & Results</h2>
              <ul className="space-y-3">
                {project.impact.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="project-card"
          >
            <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="tech-tag"
                  whileHover={{ scale: 1.05 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.section>

          {/* Project Info */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="project-card"
          >
            <h3 className="text-lg font-semibold mb-4">Project Info</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Year</span>
                <p className="font-medium">{project.year}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Role</span>
                <p className="font-medium">{project.role}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category</span>
                <p className="font-medium">{project.category}</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
