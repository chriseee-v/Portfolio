import experiencesData from "@/data/experiences.json";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { sectionVariants, staggerContainer, staggerItem } from "@/lib/motion";

// Type definition for experiences
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
  
  // Use Intersection Observer instead of framer-motion scroll for better compatibility
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
      const containerTop = rect.top;
      const containerHeight = rect.height;
      
      // Calculate how much of the container has scrolled past the top of viewport
      const scrolledPast = Math.max(0, windowHeight - containerTop);
      const progress = Math.min(100, Math.max(0, (scrolledPast / (containerHeight + windowHeight)) * 100));
      
      // Only update if change is significant (reduce flickering)
      if (Math.abs(progress - lastProgress) > 0.5) {
        setLineProgress(progress);
        lastProgress = progress;
      }
      
      if (isActive) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };
    
    // Only update when container is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isActive = true;
            if (!rafId) {
              rafId = requestAnimationFrame(updateProgress);
            }
          } else {
            isActive = false;
            if (rafId) {
              cancelAnimationFrame(rafId);
              rafId = null;
            }
          }
        });
      },
      { threshold: 0, rootMargin: '-100px' }
    );
    
    observer.observe(container);
    
    return () => {
      observer.disconnect();
      isActive = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);
  
  const { ref: headerRef, inView: headerInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  return (
    <div>
      {/* Header */}
      <motion.div 
        ref={headerRef}
        className="mb-16 pt-8"
        variants={sectionVariants}
        initial="initial"
        animate={headerInView ? "animate" : "initial"}
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="lab-label">Career Path</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">{experiences.length} EXPERIENCES</span>
        </div>
        <h1 className="lab-title mb-4">timeline.</h1>
        <p className="text-muted-foreground max-w-2xl">
          A visual history of experiments, roles, and continuous evolution in tech.
        </p>
      </motion.div>

      {/* Timeline */}
      <div ref={containerRef} className="relative">
        {/* Animated Vertical Line - Full continuous line */}
        <div className="absolute left-[14px] md:left-1/2 top-0 bottom-0 w-px transform md:-translate-x-1/2 z-0">
          {/* Background line (full length) */}
          <div className="absolute top-0 bottom-0 w-full bg-border" />
          {/* Animated progress line */}
          <div
            className="absolute top-0 left-0 w-full bg-primary transition-all duration-150 ease-linear"
            style={{
              height: `${lineProgress}%`,
              willChange: 'height',
            }}
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-start gap-8 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
                  {/* Node */}
                  {exp.highlight ? (
                    <div
                      className="absolute left-[14px] md:left-1/2 transform md:-translate-x-1/2 -translate-y-0 z-10"
                      style={{
                        marginLeft: '-8px', // Center the 16px dot on the 1px line
                      }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full bg-primary relative scale-130" 
                        style={{ 
                          border: 'none', 
                          boxShadow: 'none', 
                          background: 'hsl(var(--primary))',
                          transform: 'scale(1.3)',
                        }}
                      >
                        <motion.div 
                          className="absolute rounded-full bg-primary/40"
                          style={{ 
                            width: '16px',
                            height: '16px',
                            left: '50%',
                            top: '50%',
                            marginLeft: '-8px',
                            marginTop: '-8px',
                            zIndex: -1,
                            pointerEvents: 'none',
                          }}
                          animate={{ 
                            scale: [1, 3, 1], 
                            opacity: [0.6, 0, 0.6],
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="absolute left-[14px] md:left-1/2 transform md:-translate-x-1/2 -translate-y-0 z-10"
                      style={{
                        marginLeft: '-8px', // Center the 16px dot on the 1px line
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-muted border-4 border-card relative z-10" />
                    </div>
                  )}

                  {/* Year Label */}
                  <div 
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}
                  >
                    <div className="inline-block">
                      <span className="font-mono text-2xl font-bold text-primary">{exp.year}</span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div 
                    className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}
                  >
                    <div className="p-6 rounded-xl border border-border hover:border-primary/30 transition-colors bg-card/50">
                      <h3 className="text-lg font-semibold mb-1">{exp.title}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span 
                            key={tech} 
                            className="tech-tag text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.section 
        className="mt-20 pt-12 border-t border-border"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {[
            { value: "1+", label: "Years Experience" },
            { value: "15+", label: "Projects Delivered" },
            { value: "30+", label: "Technologies" },
            { value: "∞", label: "Innovation" },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="text-center"
              variants={staggerItem}
            >
              <motion.div 
                className="text-4xl font-bold text-primary mb-2"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default TimelinePage;
