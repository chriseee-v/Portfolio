import heroFigure from "@/assets/hero-figure.png";
import TypewriterCube from "@/components/TypewriterCube";
import { ArrowRight, Download, Brain, Code2, Eye, Cloud } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { heroVariants, sectionVariants, staggerContainer, staggerItem, buttonHoverVariants, chipVariants } from "@/lib/motion";
import { useCountUp } from "@/hooks/use-count-up";
import { useTheme } from "@/contexts/ThemeContext";

const skills = [
  { icon: Brain, label: "AI & Machine Learning", items: ["PyTorch", "TensorFlow", "LangChain"] },
  { icon: Code2, label: "Full-Stack Development", items: ["React", "Angular", "FastAPI"] },
  { icon: Eye, label: "Computer Vision & IoT", items: ["OpenCV", "SAM", "Raspberry Pi"] },
  { icon: Cloud, label: "Cloud & DevOps", items: ["AWS", "Docker", "MongoDB"] },
];

const MePage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  
  // Scroll-triggered animations
  const { ref: expRef, inView: expInView } = useInView({ threshold: 0.5, triggerOnce: true });
  const { ref: capabilitiesRef, inView: capabilitiesInView } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: missionRef, inView: missionInView } = useInView({ threshold: 0.3, triggerOnce: true });
  
  // Count-up for EXP
  const expCount = useCountUp(100, 2, expInView);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const heroTop = heroRef.current.offsetTop;
      const heroHeight = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress through the hero section
      const progress = Math.min(
        Math.max((scrollY - heroTop + windowHeight) / (heroHeight + windowHeight), 0),
        1
      );
      
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate translateX based on scroll progress (slides right as you scroll down)
  const translateX = scrollProgress * 200; // Adjust multiplier for more/less movement

  return (
    <div>
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-[70vh] flex items-center">
        {/* Vertical Label */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <span className="lab-vertical-text text-muted-foreground">
            EXP—100
          </span>
        </div>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full pl-0 lg:pl-12">
          {/* Left: Text Content */}
          <motion.div 
            className="space-y-8 z-10"
            variants={heroVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="space-y-2"
              variants={heroVariants}
            >
              <motion.span 
                className="lab-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                SDE - I
              </motion.span>
              <motion.h1 
                className="lab-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ minHeight: "1.2em" }}
              >
                <TypewriterCube />
              </motion.h1>
            </motion.div>
            
            <motion.div 
              className="space-y-4 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-semibold">
                Chris Thomas Varghese
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Software Development Engineer specializing in AI, IoT, and full-stack development. 
                Building intelligent systems that bridge algorithms, embedded systems, and cloud infrastructure.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.a 
                href="/projects" 
                className="lab-button-primary inline-flex items-center gap-2"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                View Projects
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.a>
              <motion.a 
                href="/Chris_Resume__Copy_.pdf" 
                download="Chris_Thomas_Varghese_Resume.pdf"
                className="lab-button-outline inline-flex items-center gap-2"
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Download CV
                <Download className="w-4 h-4" />
              </motion.a>
            </motion.div>

            {/* Tech Labels */}
            <motion.div 
              ref={expRef}
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <span className="font-mono text-xs text-muted-foreground">STATUS:</span>
              <motion.span
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  boxShadow: theme === "dark" 
                    ? "0 0 20px rgba(251, 146, 60, 0.3)" 
                    : "0 0 10px rgba(251, 146, 60, 0.2)",
                }}
                transition={{ 
                  delay: 1.2, 
                  type: "spring", 
                  stiffness: 200,
                  damping: 15 
                }}
                whileHover={{ scale: 1.05 }}
              >
                AVAILABLE
              </motion.span>
              <motion.span 
                className="font-mono text-xs text-muted-foreground"
                key={expCount}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                EXP—{expCount}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Right: Hero Figure */}
          <div className="relative flex justify-center items-start h-full">
            {/* Accent Shape Behind */}
            <div 
              className="absolute right-0 top-1/4 w-60 h-72 lg:w-[350px] lg:h-[450px] bg-primary rounded-3xl opacity-90"
              style={{ transform: `rotate(6deg) translateY(-30%)` }}
              data-parallax="0.3"
            />
            
            {/* Figure Image */}
            <div 
              className="relative z-10 mt-4 lg:mt-8 -ml-8 lg:-ml-12 transition-transform duration-75 ease-out"
              style={{ transform: `translateX(${translateX}px)` }}
              data-parallax="0.5"
            >
              <img
                src={heroFigure}
                alt="Fashion Tech Figure"
                className="w-80 md:w-96 lg:w-[450px] h-auto object-contain animate-float rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <motion.section 
        ref={capabilitiesRef}
        className="mt-20 border-t border-border pt-12"
        variants={sectionVariants}
        initial="initial"
        animate={capabilitiesInView ? "animate" : "initial"}
      >
        <div className="flex items-center gap-4 mb-12">
          <span className="lab-label">Capabilities</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">04 DOMAINS</span>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate={capabilitiesInView ? "animate" : "initial"}
        >
          {skills.map((skill, index) => {
            const achievements: Record<string, string> = {
              "AI & Machine Learning": "Deployed 5+ production models",
              "Full-Stack Development": "Built 10+ scalable applications",
              "Computer Vision & IoT": "Processed 50+ hours of video daily",
              "Cloud & DevOps": "99% API uptime across 50+ clinics",
            };
            
            return (
              <motion.div
                key={skill.label}
                variants={staggerItem}
                className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-colors relative overflow-hidden"
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                {/* Achievement overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 p-6 flex items-center justify-center backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm font-medium text-center group-hover:text-white">
                    {achievements[skill.label] || "Achievement"}
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <skill.icon className="w-8 h-8 text-primary mb-4" />
                </motion.div>
                <h3 className="font-semibold mb-3">{skill.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <motion.span
                      key={item}
                      className="tech-tag"
                      variants={chipVariants}
                      whileHover="hover"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Mission Statement */}
      <motion.section 
        ref={missionRef}
        className="mt-20 border-t border-border pt-12"
        variants={sectionVariants}
        initial="initial"
        animate={missionInView ? "animate" : "initial"}
      >
        <div className="flex items-center gap-4 mb-8">
          <span className="lab-label">Mission</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <motion.p 
          className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Building <motion.span 
            className="text-primary font-medium"
            animate={{ 
              textShadow: theme === "dark" 
                ? "0 0 20px rgba(251, 146, 60, 0.5)" 
                : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            intelligent systems
          </motion.span> that combine 
          AI, IoT, and cloud technologies to solve real-world problems in healthcare and beyond.
        </motion.p>
      </motion.section>
    </div>
  );
};

export default MePage;
