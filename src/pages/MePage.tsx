import heroFigure from "@/assets/hero-figure.png";
import { ArrowRight, Download, Code, Palette, Layers, Cpu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const skills = [
  { icon: Code, label: "AI & Machine Learning", items: ["PyTorch", "TensorFlow", "LangChain"] },
  { icon: Palette, label: "Full-Stack Development", items: ["React", "Angular", "FastAPI"] },
  { icon: Layers, label: "Computer Vision & IoT", items: ["OpenCV", "SAM", "Raspberry Pi"] },
  { icon: Cpu, label: "Cloud & DevOps", items: ["AWS", "Docker", "MongoDB"] },
];

const MePage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

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
          <div className="space-y-8 z-10">
            <div className="space-y-2">
              <span className="lab-label">Software Development Engineer I</span>
              <h1 className="lab-title">lab.</h1>
            </div>
            
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl md:text-3xl font-semibold">
                Chris Thomas Varghese
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Software Development Engineer specializing in AI, IoT, and full-stack development. 
                Building intelligent systems that bridge algorithms, embedded systems, and cloud infrastructure.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a href="/projects" className="lab-button-primary inline-flex items-center gap-2">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </a>
              <button className="lab-button-outline inline-flex items-center gap-2">
                Download CV
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Tech Labels */}
            <div className="flex items-center gap-4 pt-4">
              <span className="font-mono text-xs text-muted-foreground">STATUS:</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono">
                AVAILABLE
              </span>
              <span className="font-mono text-xs text-muted-foreground">v2.0.25</span>
            </div>
          </div>

          {/* Right: Hero Figure */}
          <div className="relative flex justify-center items-start h-full">
            {/* Accent Shape Behind */}
            <div 
              className="absolute right-0 top-1/2 w-80 h-96 lg:w-[500px] lg:h-[600px] bg-primary rounded-3xl opacity-90"
              style={{ transform: `rotate(6deg) translateY(-50%)` }}
            />
            
            {/* Figure Image */}
            <div 
              className="relative z-10 mt-4 lg:mt-8 -ml-8 lg:-ml-12 transition-transform duration-75 ease-out"
              style={{ transform: `translateX(${translateX}px)` }}
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
      <section className="mt-20 border-t border-border pt-12">
        <div className="flex items-center gap-4 mb-12">
          <span className="lab-label">Capabilities</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">04 DOMAINS</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div key={skill.label} className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-colors">
              <skill.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-3">{skill.label}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item) => (
                  <span key={item} className="tech-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mt-20 border-t border-border pt-12">
        <div className="flex items-center gap-4 mb-8">
          <span className="lab-label">Mission</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-2xl md:text-3xl font-light leading-relaxed max-w-3xl">
          Building <span className="text-primary font-medium">intelligent systems</span> that combine 
          AI, IoT, and cloud technologies to solve real-world problems in healthcare and beyond.
        </p>
      </section>
    </div>
  );
};

export default MePage;
