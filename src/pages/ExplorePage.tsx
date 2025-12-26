import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { X, Brain, Eye, Box, Zap, Code2, Database, Cloud, BarChart3, Bot, Terminal, Radio } from "lucide-react";

const techTopics = [
  { 
    id: 1, 
    title: "Computer Vision", 
    icon: Eye, 
    shortDesc: "Image Processing",
    description: "Real-time video analysis and pose estimation for healthcare applications.",
    fullContent: "Computer vision enables machines to interpret and understand visual information from the world. Using OpenCV, DINO, SAM, and pose estimation models, I've built systems that process 500+ video frames per second for exercise monitoring and clothing detection, improving accuracy by 35% for fitness applications.",
    color: "from-primary to-primary/70",
    technologies: ["OpenCV", "DINO", "SAM 2", "Florence-2"]
  },
  { 
    id: 2, 
    title: "RAG Systems", 
    icon: Brain, 
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
    icon: Code2, 
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
    icon: Brain, 
    shortDesc: "AI Models",
    description: "PyTorch, TensorFlow, and Scikit-Learn for intelligent systems.",
    fullContent: "Machine learning enables computers to learn from data and make predictions. I've developed EEG signal processing models with 85% accuracy, speaker diarization systems improving transcription by 25%, and trained models in Google Cloud Workbench with GPU support, speeding up training by 40%.",
    color: "from-primary to-primary/80",
    technologies: ["PyTorch", "TensorFlow", "Scikit-Learn", "Pandas"]
  },
  { 
    id: 9, 
    title: "Data Visualization", 
    icon: BarChart3, 
    shortDesc: "Analytics",
    description: "Plotly, Pandas, and NumPy for interactive data insights.",
    fullContent: "Data visualization transforms complex data into actionable insights. I've built interactive dashboards using Plotly JSON outputs, ETL pipelines with Pandas and NumPy, and analytics platforms that reduced visualization load time by 50% for clinicians monitoring athlete performance.",
    color: "from-primary/85 to-primary/65",
    technologies: ["Plotly", "Pandas", "NumPy", "Matplotlib"]
  },
  { 
    id: 10, 
    title: "Web Automation", 
    icon: Bot, 
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
    icon: Radio, 
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
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${topic.color} shadow-lg flex items-center justify-center`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-card border border-border shadow-lg p-2 flex flex-col items-center justify-center"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Icon className="w-5 h-5 text-primary mb-1" />
          <span className="text-[10px] font-semibold text-center leading-tight">
            {topic.title}
          </span>
          <span className="text-[8px] text-muted-foreground text-center mt-1">
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="relative w-[90%] max-w-md md:max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className={`relative h-32 md:h-40 bg-gradient-to-br ${topic.color} p-4 md:p-8 flex items-end`}>
          <div className="absolute top-2 right-2 md:top-4 md:right-4">
            <button
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-white">{topic.title}</h2>
              <p className="text-sm md:text-base text-white/80">{topic.shortDesc}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-6">
            {topic.description}
          </p>
          <p className="text-sm md:text-base text-foreground leading-relaxed mb-6 md:mb-8">
            {topic.fullContent}
          </p>

          {/* Technologies */}
          <div>
            <h3 className="lab-label mb-2 md:mb-3 text-sm md:text-base">Related Technologies</h3>
            <div className="flex flex-wrap gap-1.5 md:gap-2">
              {topic.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium bg-gradient-to-r ${topic.color} text-white`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              TOPIC #{topic.id.toString().padStart(2, '0')}
            </span>
            <button className="lab-button-primary text-sm md:text-base px-4 py-2">
              Explore Projects
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CircularGallery = () => {
  const cardsRef = useRef<(FlipCardHandle | null)[]>([]);
  const [selectedCard, setSelectedCard] = useState<TopicType | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const radius = 280;
  const cardCount = techTopics.length;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging.current && !selectedCard) {
        rotationRef.current += 0.15;
        setRotation(rotationRef.current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [selectedCard]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const angle = (index / cardCount) * Math.PI * 2 + (rotation * Math.PI) / 180;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const cardRotation = (angle * 180) / Math.PI + 90;

      card.setPosition(x, y, cardRotation);
    });
  }, [rotation, cardCount]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    rotationRef.current += deltaX * 0.3;
    setRotation(rotationRef.current);
    lastX.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isCardTouch = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isCardTouch.current = (e.target as HTMLElement).closest('.flip-card') !== null;
    
    if (!isCardTouch.current) {
      isDragging.current = true;
      lastX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || isCardTouch.current) return;
    
    const deltaX = Math.abs(e.touches[0].clientX - touchStartX.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartY.current);
    
    // Only drag if horizontal movement is significantly greater than vertical (swipe gesture)
    // This prevents interfering with normal page scrolling
    if (deltaX > deltaY * 2 && deltaX > 20) {
      e.preventDefault();
      e.stopPropagation();
      const currentX = e.touches[0].clientX;
      const moveDelta = currentX - lastX.current;
      rotationRef.current += moveDelta * 0.3;
      setRotation(rotationRef.current);
      lastX.current = currentX;
    } else {
      // If it's more vertical, allow normal scrolling
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    isCardTouch.current = false;
  };

  const handleCardClick = (topic: TopicType) => {
    setSelectedCard(topic);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedCard(null);
      setIsClosing(false);
    }, 400);
  };

  return (
    <div className="relative min-h-[50vh] flex items-center justify-center overflow-x-hidden overflow-y-visible">
      {/* Center Text */}
      <div className="absolute z-10 text-center pointer-events-none">
        <h2 className="text-xl md:text-2xl font-light text-foreground mb-2">
          The future is built on
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-primary">
          Creative Technology.
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground uppercase tracking-widest">
          Drag to explore
        </p>
      </div>

      {/* Circular Gallery */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-[680px] h-[680px] sm:w-[720px] sm:h-[720px] md:w-[820px] md:h-[820px] cursor-grab active:cursor-grabbing mx-auto"
        style={{ perspective: "1000px" }}
      >
        {techTopics.map((topic, index) => (
          <FlipCard
            key={topic.id}
            ref={(el) => (cardsRef.current[index] = el)}
            topic={topic}
            index={index}
            onClick={() => handleCardClick(topic)}
          />
        ))}
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

const ExplorePage = () => {
  return (
    <div className="overflow-x-hidden overflow-y-visible">
      {/* Header */}
      <div className="mb-0 pt-4">
        <div className="flex items-center gap-4 mb-2">
          <span className="lab-label">Tech Radar</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted-foreground">CIRCULAR GALLERY</span>
        </div>
        <h1 className="lab-title mb-2">explore.</h1>
        <p className="text-muted-foreground max-w-2xl">
          Drag to rotate the gallery. Hover over cards to flip them. Click to expand and read in detail.
        </p>
      </div>

      {/* Circular Gallery */}
      <CircularGallery />
    </div>
  );
};

export default ExplorePage;
