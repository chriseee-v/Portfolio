import experiencesData from "@/data/experiences.json";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  // Animate connector line progress
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
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
        {/* Animated Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border transform md:-translate-x-1/2 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-primary"
            style={{
              height: useTransform(lineProgress, (v) => `${v}%`),
            }}
          />
        </div>

        {/* Timeline Items */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const TimelineItem = ({ exp, index }: { exp: typeof experiences[0], index: number }) => {
              const { ref, inView } = useInView({ 
                threshold: 0.5,
                triggerOnce: false // Re-trigger on scroll
              });
              
              return (
                <motion.div
                  ref={ref}
                  key={index}
                  className={`relative flex flex-col md:flex-row items-start gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ 
                    opacity: inView ? 1 : 0.4,
                    x: 0,
                    scale: inView ? 1 : 0.95
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Node with scroll-based scale */}
                  {exp.highlight ? (
                    <motion.div
                      className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-0 z-20"
                      animate={{
                        scale: inView ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full bg-primary relative" 
                        style={{ 
                          border: 'none', 
                          boxShadow: 'none', 
                          background: 'hsl(var(--primary))',
                        }}
                      >
                        {inView && (
                          <motion.div 
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40"
                            style={{ 
                              width: '16px',
                              height: '16px',
                              zIndex: -1,
                              pointerEvents: 'none',
                            }}
                            animate={{ 
                              scale: [1, 3, 1], 
                              opacity: [0.6, 0, 0.6] 
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-0 z-20"
                      animate={{
                        scale: inView ? 1.3 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-4 h-4 rounded-full bg-muted border-4 border-card relative z-20" />
                    </motion.div>
                  )}

                  {/* Year Label */}
                  <motion.div 
                    className={`flex-1 ${index % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"} pl-12 md:pl-0`}
                    animate={{ opacity: inView ? 1 : 0.6 }}
                  >
                    <div className="inline-block">
                      <span className="font-mono text-2xl font-bold text-primary">{exp.year}</span>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12"}`}
                    whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  >
                    <div className="p-6 rounded-xl border border-border hover:border-primary/30 transition-colors bg-card/50">
                      <h3 className="text-lg font-semibold mb-1">{exp.title}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{exp.company}</p>
                      <p className="text-sm text-muted-foreground mb-4">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
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
                    </div>
                  </motion.div>
                </motion.div>
              );
            };
            
            return <TimelineItem key={index} exp={exp} index={index} />;
          })}
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
