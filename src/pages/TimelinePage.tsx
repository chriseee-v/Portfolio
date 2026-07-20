import experiencesData from "@/data/experiences.json";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

type Experience = {
  year: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
  highlight: boolean;
};

const experiences = experiencesData as Experience[];

const TimelinePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let isActive = false;
    let lastProgress = 0;

    const updateProgress = () => {
      if (!isActive) return;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolledPast = Math.max(0, windowHeight - rect.top);
      const progress = Math.min(100, Math.max(0, (scrolledPast / (rect.height + windowHeight)) * 100));
      if (Math.abs(progress - lastProgress) > 0.5) {
        setLineProgress(progress);
        lastProgress = progress;
      }
      if (isActive) rafId = requestAnimationFrame(updateProgress);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            if (!rafId) rafId = requestAnimationFrame(updateProgress);
          } else {
            isActive = false;
            if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
          }
        });
      },
      { threshold: 0, rootMargin: "-100px" }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      isActive = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div>
      {/* Header */}
      <motion.div
        ref={headerRef}
        className="pt-10"
        style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div
          className="flex items-stretch"
          style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
        >
          <span className="lab-label px-0 py-3 self-center">Career Path</span>
          <div className="flex-1" />
          <span
            className="font-mono text-xs text-muted-foreground px-4 py-3 self-center"
            style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          >
            {experiences.length} EXPERIENCES
          </span>
        </div>
        <h1 className="lab-title py-4">timeline<span className="text-primary">.</span></h1>
        <p className="text-muted-foreground max-w-2xl pb-6 text-sm">
          A visual history of experiments, roles, and continuous evolution in tech.
        </p>
      </motion.div>

      {/* Timeline */}
      <div ref={containerRef} className="relative mt-12">
        {/* Animated Vertical Line */}
        <div className="absolute left-[7px] md:left-1/2 top-0 bottom-0 w-[2px] transform md:-translate-x-1/2 z-0">
          <div className="absolute top-0 bottom-0 w-full bg-border opacity-40" />
          <div
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-150 ease-linear"
            style={{ height: `${lineProgress}%`, willChange: "height" }}
          />
        </div>

        <div className="space-y-10">
          {experiences.map((exp, index) => {
            const itemProgress = (index / Math.max(experiences.length - 1, 1)) * 100;
            const isActive = lineProgress >= itemProgress;

            return (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-start gap-6 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Node */}
                <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 z-10 top-6">
                  <div
                    className="w-4 h-4 transition-all duration-500"
                    style={{
                      background: isActive ? "hsl(var(--primary))" : "hsl(var(--muted))",
                      border: "2px solid hsl(var(--foreground))",
                      boxShadow: isActive ? "2px 2px 0px hsl(var(--foreground))" : "none",
                    }}
                  >
                    {exp.highlight && isActive && (
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: [1, 2.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{ zIndex: -1 }}
                      />
                    )}
                  </div>
                </div>

                {/* Year */}
                <div
                  className={`flex-1 pl-10 md:pl-0 ${
                    index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"
                  } pt-4`}
                >
                  <span
                    className={`font-mono text-3xl font-bold transition-colors duration-500 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {exp.year}
                  </span>
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 pl-10 md:pl-0 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <div
                    className="p-5 bg-card transition-all duration-500"
                    style={{
                      border: "2px solid hsl(var(--foreground))",
                      boxShadow: isActive
                        ? "4px 4px 0px hsl(var(--primary))"
                        : "4px 4px 0px hsl(var(--foreground))",
                    }}
                  >
                    <h3 className="font-bold uppercase tracking-tight mb-1">{exp.title}</h3>
                    <p className="text-sm font-mono font-bold text-primary mb-3 uppercase tracking-wider">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="tech-tag text-xs">{tech}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <section
        className="mt-16"
        style={{ borderTop: "2px solid hsl(var(--foreground))" }}
      >
        <div
          className="flex items-stretch"
          style={{ borderBottom: "2px solid hsl(var(--foreground))" }}
        >
          <span className="lab-label px-0 py-3 self-center">By The Numbers</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {[
            { value: "2+", label: "Years Experience" },
            { value: "15+", label: "Projects Delivered" },
            { value: "30+", label: "Technologies" },
            { value: "∞", label: "Innovation" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-start p-6"
              style={{
                borderRight: i < 3 ? "2px solid hsl(var(--foreground))" : "none",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <span className="text-5xl font-bold text-primary font-mono mb-2">{stat.value}</span>
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TimelinePage;
