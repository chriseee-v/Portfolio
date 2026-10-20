import React, { useRef, useEffect, useState, useContext, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { X, Cpu, Globe, Layers, Zap, Box, Code, Database, Cloud, Sparkles, Palette, Terminal, Wifi } from "lucide-react";
import GlassFolder, { type FolderFile } from "@/components/ui/glass-folder-cards";
import { ScrollContainerContext } from "@/contexts/ScrollContainerContext";

const techTopics = [
  { 
    id: 1, 
    title: "Computer Vision", 
    icon: Globe, 
    shortDesc: "Image Processing",
    description: "Real-time video analysis and pose estimation for healthcare applications.",
    fullContent: "Computer vision enables machines to interpret and understand visual information from the world. Using OpenCV, DINO, SAM, and pose estimation models, I've built systems that process 500+ video frames per second for exercise monitoring and clothing detection, improving accuracy by 35% for fitness applications.",
    color: "from-primary to-primary/70",
    technologies: ["OpenCV", "DINO", "SAM 2", "Florence-2"]
  },
  { 
    id: 2, 
    title: "RAG Systems", 
    icon: Cpu, 
    shortDesc: "AI Retrieval",
    description: "Retrieval-Augmented Generation for intelligent knowledge systems.",
    fullContent: "RAG systems combine the power of large language models with efficient information retrieval. I've built medical knowledge systems using ChromaDB, BGE embeddings, and LangChain that achieve 95% accuracy and process 5,000+ queries daily. The Clinician Agent reduced form-filling time by 40% for physiotherapy workflows.",
    color: "from-primary/90 to-primary/60",
    technologies: ["LangChain", "ChromaDB", "BGE", "Phoenix Tracer"]
  },
  { 
    id: 3, 
    title: "IoT Systems", 
    icon: Box, 
    shortDesc: "Embedded Tech",
    description: "Internet of Things solutions with Arduino, Raspberry Pi, and LoRaWAN.",
    fullContent: "IoT systems connect physical devices to the digital world. I've built smart streetlight management systems using LoRaWAN that reduced maintenance response times by 20%, EEG-controlled prosthetic arms with 85% accuracy, and traffic violation notification systems that increased fine collections by 50%.",
    color: "from-primary to-secondary",
    technologies: ["Arduino", "Raspberry Pi", "LoRaWAN", "3D Printing"]
  },
  { 
    id: 4, 
    title: "Cloud & DevOps", 
    icon: Cloud, 
    shortDesc: "Infrastructure",
    description: "AWS, Docker, and cloud infrastructure for scalable applications.",
    fullContent: "Cloud infrastructure enables applications to scale globally. I've deployed production systems using Docker, AWS S3, and EC2 that serve 200+ concurrent users across 50+ clinics. Reduced deployment time by 30% and achieved 99% API uptime for healthcare applications processing millions of records daily.",
    color: "from-primary/80 to-primary",
    technologies: ["AWS S3", "AWS EC2", "Docker", "Redis"]
  },
  { 
    id: 5, 
    title: "Full-Stack Web", 
    icon: Layers, 
    shortDesc: "Modern Frameworks",
    description: "React, Angular, and FastAPI for building complete web applications.",
    fullContent: "Modern full-stack development combines powerful frontend frameworks with efficient backend APIs. I've built real-time analytics dashboards with React and Angular, WebSocket services with FastAPI, and data visualization platforms using Plotly. Reduced visualization load time by 50% and data latency by 50%.",
    color: "from-primary to-accent",
    technologies: ["React", "Angular", "FastAPI", "Flask"]
  },
  { 
    id: 6, 
    title: "Real-time Data", 
    icon: Zap, 
    shortDesc: "WebSockets",
    description: "Live data streaming and real-time analytics for healthcare.",
    fullContent: "Real-time data processing enables instant insights and responsive applications. I've built WebSocket services integrating VALD athlete data, ETL pipelines with MongoDB caching, and live dashboards that reduced data latency by 50% and sped up data retrieval by 60% for visualizations.",
    color: "from-primary/70 to-primary/90",
    technologies: ["WebSocket", "MongoDB", "Plotly", "ETL"]
  },
  { 
    id: 7, 
    title: "Database Systems", 
    icon: Database, 
    shortDesc: "Data Storage",
    description: "MongoDB, Redis, and efficient data management for scalable systems.",
    fullContent: "Modern database systems enable efficient storage and retrieval of massive datasets. I've implemented MongoDB caching systems managing 500,000+ records daily, Redis for session management, and ETL pipelines that sped up data retrieval by 60% for real-time visualizations and analytics.",
    color: "from-secondary to-primary",
    technologies: ["MongoDB", "Redis", "MySQL", "PyMongo"]
  },
  { 
    id: 8, 
    title: "Machine Learning", 
    icon: Code, 
    shortDesc: "AI Models",
    description: "PyTorch, TensorFlow, and Scikit-Learn for intelligent systems.",
    fullContent: "Machine learning enables computers to learn from data and make predictions. I've developed EEG signal processing models with 85% accuracy, speaker diarization systems improving transcription by 25%, and trained models in Google Cloud Workbench with GPU support, speeding up training by 40%.",
    color: "from-primary to-primary/80",
    technologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "Pandas"]
  },
  { 
    id: 9, 
    title: "Data Visualization", 
    icon: Sparkles, 
    shortDesc: "Analytics",
    description: "Plotly, Pandas, and NumPy for interactive data insights.",
    fullContent: "Data visualization transforms complex data into actionable insights. I've built interactive dashboards using Plotly JSON outputs, ETL pipelines with Pandas and NumPy, and analytics platforms that reduced visualization load time by 50% for clinicians monitoring athlete performance.",
    color: "from-primary/85 to-primary/65",
    technologies: ["Plotly", "Pandas", "NumPy", "Matplotlib"]
  },
  { 
    id: 10, 
    title: "Web Automation", 
    icon: Palette, 
    shortDesc: "Data Extraction",
    description: "Puppeteer and automation for efficient data acquisition.",
    fullContent: "Web automation streamlines repetitive tasks and data collection. I've automated data extraction from VALD, Runscribe, and PhysioPlusTech using Puppeteer and Angular, cutting data acquisition time by 70% and enabling efficient decision-making with 500+ daily API requests.",
    color: "from-primary/75 to-primary",
    technologies: ["Puppeteer", "Selenium", "Angular", "Automation"]
  },
  { 
    id: 11, 
    title: "Python Ecosystem", 
    icon: Terminal, 
    shortDesc: "Backend Dev",
    description: "FastAPI, Flask, and Starlette for high-performance APIs.",
    fullContent: "Python's rich ecosystem enables rapid development of robust backend services. I've built production APIs with FastAPI and Flask, WebSocket services with Starlette, and data processing pipelines with Pydantic validation. These systems handle 10,000+ daily requests with 99% uptime.",
    color: "from-secondary to-secondary/80",
    technologies: ["FastAPI", "Flask", "Starlette", "Pydantic"]
  },
  { 
    id: 12, 
    title: "Signal Processing", 
    icon: Wifi, 
    shortDesc: "EEG & Audio",
    description: "Brain signals and audio analysis for innovative applications.",
    fullContent: "Signal processing enables interpretation of complex biological and audio data. I've developed EEG-controlled prosthetic systems with 85% accuracy, speaker diarization systems improving transcription by 25%, and real-time audio processing pipelines handling 200+ hours monthly.",
    color: "from-primary/90 to-primary/70",
    technologies: ["Signal Processing", "EEG", "Audio Analysis", "Scikit-Learn"]
  },
];

type TopicType = typeof techTopics[0];

interface FlipCardProps {
  topic: TopicType;
  index: number;
  onClick: (el: HTMLDivElement | null) => void;
}

interface FlipCardHandle {
  element: HTMLDivElement | null;
  setPosition: (x: number, y: number, rotation: number) => void;
}

const FlipCard = forwardRef<FlipCardHandle, FlipCardProps>(({ topic, onClick }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const lastTapRef = useRef(0);
  const Icon = topic.icon;

  useImperativeHandle(ref, () => ({
    element: cardRef.current,
    setPosition: (x: number, y: number, rotation: number) => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x,
          y,
          rotation,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
  }));

  const handleMouseEnter = () => {
    setIsFlipped(true);
    gsap.to(cardRef.current, {
      scale: 1.15,
      zIndex: 50,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsFlipped(false);
    gsap.to(cardRef.current, {
      scale: 1,
      zIndex: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const cardTouchStartX = useRef(0);
  const cardTouchStartY = useRef(0);
  const cardIsDragging = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    cardTouchStartX.current = e.touches[0].clientX;
    cardTouchStartY.current = e.touches[0].clientY;
    cardIsDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const deltaX = Math.abs(e.touches[0].clientX - cardTouchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - cardTouchStartY.current);
    
    // If moved more than 10px, consider it a drag
    if (deltaX > 10 || deltaY > 10) {
      cardIsDragging.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!cardIsDragging.current) {
      // It's a tap, not a drag
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapRef.current;
      
      if (tapLength < 300 && tapLength > 0) {
        // Double tap - open expanded view
        onClick(cardRef.current);
      } else {
        // Single tap - flip the card
        setIsFlipped(!isFlipped);
        gsap.to(cardRef.current, {
          scale: isFlipped ? 1 : 1.15,
          zIndex: isFlipped ? 1 : 50,
          duration: 0.3,
          ease: "power2.out",
        });
      }
      
      lastTapRef.current = currentTime;
    }
    cardIsDragging.current = false;
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        // On desktop, click opens expanded view
        if (isFlipped) {
          onClick(cardRef.current);
        }
      }}
      className="flip-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-28 md:w-24 md:h-32 cursor-pointer"
      style={{ 
        transformStyle: "preserve-3d",
        zIndex: 1,
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 bg-primary flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", border: "2px solid hsl(var(--foreground))" }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 bg-card p-2 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            border: "2px solid hsl(var(--foreground))",
          }}
        >
          <Icon className="w-5 h-5 text-primary mb-1" />
          <span className="text-[10px] font-bold uppercase font-mono text-center leading-tight">
            {topic.title}
          </span>
          <span className="text-[8px] text-muted-foreground text-center mt-1 font-mono uppercase">
            {topic.shortDesc}
          </span>
        </div>
      </div>
    </div>
  );
});

FlipCard.displayName = "FlipCard";

interface ExpandedCardProps {
  topic: TopicType;
  isClosing: boolean;
  onClose: () => void;
}

const ExpandedCard = ({ topic, isClosing, onClose }: ExpandedCardProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const Icon = topic.icon;

  useEffect(() => {
    if (modalRef.current && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { scale: 0.5, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, []);

  useEffect(() => {
    if (isClosing && modalRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [isClosing]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center overscroll-contain p-3 md:p-4 overflow-y-auto"
      onWheel={(event) => event.stopPropagation()}
      onTouchMove={(event) => event.stopPropagation()}
      onClick={onClose}
      style={{ minHeight: '100%', background: "hsl(var(--foreground) / 0.16)", backdropFilter: "blur(3px)" }}
    >
      <div
        ref={contentRef}
        className="relative my-4 max-h-[calc(100svh-1.5rem)] w-[calc(100%-1rem)] max-w-lg overflow-y-auto rounded-sm backdrop-blur-2xl md:my-auto md:w-[90%]"
        style={{ background: "hsl(var(--background) / 0.56)", border: "1px solid hsl(0 0% 100% / 0.58)", backdropFilter: "blur(22px) saturate(1.25)", boxShadow: "8px 8px 0 hsl(var(--foreground) / 0.26), inset 0 1px 0 hsl(0 0% 100% / 0.3), 0 18px 60px hsl(0 0% 0% / 0.28)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — solid orange, no gradient */}
        <div className="relative p-4 backdrop-blur-xl md:p-8" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.42))", borderBottom: "1px solid hsl(0 0% 100% / 0.55)", backdropFilter: "blur(16px) saturate(1.3)", boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.35), inset 0 -1px 0 hsl(0 0% 0% / 0.18)" }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center bg-white/10 backdrop-blur-md transition-colors hover:bg-white/25 md:top-4 md:right-4"
            style={{ border: "1px solid rgba(255,255,255,0.62)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white/10 backdrop-blur-md md:h-14 md:w-14"
              style={{ border: "1px solid rgba(255,255,255,0.58)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.35)" }}>
              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">{topic.title}</h2>
              <p className="font-mono text-xs text-white/70 uppercase tracking-widest mt-0.5">{topic.shortDesc}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8" style={{ background: "hsl(var(--background) / 0.38)" }}>
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
            {topic.description}
          </p>
          <p className="text-sm md:text-base text-foreground leading-relaxed mb-6 md:mb-8">
            {topic.fullContent}
          </p>

          {/* Technologies */}
          <div>
            <h3 className="lab-label mb-2 md:mb-3">RELATED TECHNOLOGIES</h3>
            <div className="flex flex-wrap gap-2">
              {topic.technologies.map((tech) => (
                <span
                  key={tech}
                  className="tech-tag backdrop-blur-md"
                  style={{ background: "hsl(var(--foreground) / 0.08)", borderColor: "hsl(var(--foreground) / 0.42)", boxShadow: "inset 0 1px 0 hsl(0 0% 100% / 0.28)" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            style={{ borderTop: "2px solid hsl(var(--foreground))" }}>
            <span className="font-mono text-xs text-muted-foreground">
              TOPIC #{topic.id.toString().padStart(2, '0')}
            </span>
            <a href="/projects" className="lab-button-primary text-sm backdrop-blur-md" style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.78), hsl(var(--primary) / 0.48))", borderColor: "hsl(0 0% 100% / 0.65)", boxShadow: "4px 4px 0 hsl(var(--foreground) / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.35)" }}>
              EXPLORE PROJECTS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const SimpleTechGrid = () => {
  const [selectedCard, setSelectedCard] = useState<TopicType | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => { setSelectedCard(null); setIsClosing(false); }, 400);
  };
  return (
    <div className="py-8 md:py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techTopics.map((topic) => {
          const Icon = topic.icon;
          return <button key={topic.id} type="button" onClick={() => setSelectedCard(topic)} className="text-left bg-card p-5 transition-transform hover:-translate-y-1" style={{ border: "2px solid hsl(var(--foreground))", boxShadow: "4px 4px 0 hsl(var(--foreground))" }}>
            <div className="flex items-center gap-3 mb-4"><span className="w-10 h-10 bg-primary flex items-center justify-center shrink-0"><Icon className="w-5 h-5 text-white" /></span><span className="font-bold uppercase tracking-tight">{topic.title}</span></div>
            <p className="text-sm text-muted-foreground">{topic.description}</p>
            <span className="inline-block mt-4 font-mono text-[10px] uppercase tracking-widest text-primary">Read more →</span>
          </button>;
        })}
      </div>

      {/* Expanded Card Modal */}
      {selectedCard && (
        <ExpandedCard
          topic={selectedCard}
          isClosing={isClosing}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

const ExploreFolderGallery = () => {
  const [selectedCard, setSelectedCard] = useState<TopicType | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const scrollContainerRef = useContext(ScrollContainerContext);

  useEffect(() => {
    if (!selectedCard) return;
    const scrollContainer = scrollContainerRef?.current;
    const previousBodyOverflow = document.body.style.overflow;
    const previousContainerOverflow = scrollContainer?.style.overflowY;
    document.body.style.overflow = "hidden";
    if (scrollContainer) scrollContainer.style.overflowY = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      if (scrollContainer) scrollContainer.style.overflowY = previousContainerOverflow ?? "";
    };
  }, [selectedCard, scrollContainerRef]);
  const findTopic = (file: FolderFile) => techTopics.find((topic) => topic.title === file.name);
  const openTopic = (file: FolderFile) => {
    const topic = findTopic(file);
    if (topic) setSelectedCard(topic);
  };
  const closeTopic = () => {
    setIsClosing(true);
    setTimeout(() => { setSelectedCard(null); setIsClosing(false); }, 400);
  };
  const folders = [
    { label: "AI & Intelligence", tone: "light" as const, files: techTopics.slice(0, 4).map((topic) => ({ name: topic.title, meta: topic.shortDesc })) },
    { label: "Systems & Cloud", tone: "dark" as const, files: techTopics.slice(3, 7).map((topic) => ({ name: topic.title, meta: topic.shortDesc })) },
    { label: "Vision & Devices", tone: "light" as const, files: techTopics.slice(7, 12).map((topic) => ({ name: topic.title, meta: topic.shortDesc })) },
  ];

  return (
    <div className="relative py-10 md:py-16">
      <div className="relative grid grid-cols-1 items-end justify-items-center gap-12 md:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => <GlassFolder key={folder.label} {...folder} onFileSelect={openTopic} />)}
      </div>
      <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hover to lift · Click to open · Select a file</p>
      {selectedCard && <ExpandedCard topic={selectedCard} isClosing={isClosing} onClose={closeTopic} />}
    </div>
  );
};

const ExplorePage = () => {
  return (
    <div className="overflow-visible">
      {/* Header */}
      <div className="pt-10" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
        <h1 className="lab-title py-4">explore<span className="text-primary">.</span></h1>
        <p className="text-muted-foreground max-w-2xl pb-6 text-sm">
          Explore the folders to browse the systems, tools, and experiments behind the work.
        </p>
      </div>

      <ExploreFolderGallery />
    </div>
  );
};

export default ExplorePage;
