# Motion Design System - lab. Portfolio

## Overview
This document outlines the motion hierarchy, micro-interactions, and animation patterns for the portfolio. We'll use **Framer Motion** for React components and **GSAP** for complex animations (circular gallery).

---

## 1. Motion Hierarchy & Rhythm

### Global Motion Rules

```typescript
// Motion timing constants
export const MOTION = {
  // Hero/Title: Slower, smoother (800-1200ms)
  hero: {
    duration: 1.0,
    ease: [0.25, 0.1, 0.25, 1], // easeInOutCubic
  },
  // Cards: Snappier (300-500ms)
  card: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1], // easeOut
  },
  // Chips/Pills: Very quick (120-180ms)
  chip: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1],
  },
  // Section entrance: Scroll-triggered (600-800ms)
  section: {
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1],
  },
};
```

### Scroll-Triggered Animations
- Hero loads immediately on page load
- All other sections animate only when scrolled into viewport
- Use Intersection Observer for performance
- Maximum 1-2 subtle parallax effects (hero image, EXP strip)

---

## 2. Implementation Plan

### Phase 1: Install Dependencies

```bash
npm install framer-motion
npm install @react-intersection-observer  # For scroll triggers
```

### Phase 2: Create Motion Utilities

**File: `src/lib/motion.ts`**

```typescript
import { Variants } from "framer-motion";

// Hero animations
export const heroVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }
  },
};

// Section entrance (scroll-triggered)
export const sectionVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }
  },
};

// Card hover states
export const cardHoverVariants: Variants = {
  rest: { 
    scale: 1, 
    y: 0,
    boxShadow: "0 4px 16px 0 hsl(0 0% 0% / 0.06)",
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    boxShadow: "0 16px 48px 0 hsl(0 0% 0% / 0.12)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
};

// Stagger children (for grids)
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  },
};

// Filter transition (fade out old, fade in new)
export const filterTransition = {
  layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};
```

---

## 3. Section-Specific Implementations

### 3.1 Hero Section (MePage)

**Enhancements:**
- Title fades in with slight upward motion
- Subtitle follows with delay
- CTAs scale on hover (120ms)
- Status chip pulses once on mount
- EXP number counts up

**Implementation:**

```typescript
// src/pages/MePage.tsx additions
import { motion } from "framer-motion";
import { useInView } from "@react-intersection-observer";

// Count-up hook for EXP
const useCountUp = (end: number, duration = 2, inView: boolean) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);
  
  return count;
};

// In component:
const { ref: expRef, inView: expInView } = useInView({ threshold: 0.5, triggerOnce: true });
const expCount = useCountUp(100, 2, expInView);

// Status chip pulse animation
<motion.span
  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono"
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
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

// CTA buttons with enhanced hover
<motion.a
  href="/projects"
  className="lab-button-primary inline-flex items-center gap-2"
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
>
  View Projects
  <motion.div
    animate={{ x: [0, 4, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <ArrowRight className="w-4 h-4" />
  </motion.div>
</motion.a>
```

### 3.2 EXP Strip Animation

**Enhancements:**
- Count-up animation for EXP number
- Bar fill animation
- Status chip pulse on first view
- Subtle glow on theme change

**Implementation:**

```typescript
// Add to MePage.tsx
const ExpStrip = () => {
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const expCount = useCountUp(100, 2, inView);
  const { theme } = useTheme();
  
  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4 pt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
    >
      <span className="font-mono text-xs text-muted-foreground">STATUS:</span>
      <motion.span
        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-mono relative"
        animate={{
          boxShadow: theme === "dark" 
            ? "0 0 20px rgba(251, 146, 60, 0.3)" 
            : "0 0 10px rgba(251, 146, 60, 0.2)",
        }}
        transition={{ duration: 0.3 }}
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
  );
};
```

### 3.3 Capabilities Grid

**Enhancements:**
- Cards reveal on scroll
- Hover reveals achievement metrics
- Icon scales on hover
- Staggered entrance

**Implementation:**

```typescript
// src/pages/MePage.tsx - Capabilities section
const CapabilitiesSection = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });
  
  const achievements = {
    "AI & Machine Learning": "Deployed 5+ production models",
    "Full-Stack Development": "Built 10+ scalable applications",
    "Computer Vision & IoT": "Processed 50+ hours of video daily",
    "Cloud & DevOps": "99% API uptime across 50+ clinics",
  };
  
  return (
    <motion.section
      ref={ref}
      className="mt-20 border-t border-border pt-12"
      variants={sectionVariants}
      initial="initial"
      animate={inView ? "animate" : "initial"}
    >
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate={inView ? "animate" : "initial"}
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.label}
            variants={staggerItem}
            className="group p-6 rounded-xl border border-border hover:border-primary/50 transition-colors relative overflow-hidden"
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
          >
            {/* Achievement overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 p-6 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-medium text-primary text-center">
                {achievements[skill.label]}
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
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.15 }}
                >
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
```

### 3.4 Projects Section

**Enhancements:**
- Filter transitions with fade out/in
- Staggered card entrance
- Enhanced hover states
- Featured/new indicators

**Implementation:**

```typescript
// src/pages/ProjectsPage.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@react-intersection-observer";

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  
  const filteredProjects = activeFilter === "All" 
    ? projects 
    : projects.filter(p => p.category === activeFilter);
  
  // Featured projects (first 2)
  const featuredIds = [1, 2];
  
  return (
    <div>
      {/* Filters with enhanced animation */}
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
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            layout
          >
            {filter}
          </motion.button>
        ))}
      </div>
      
      {/* Projects Grid with AnimatePresence */}
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
              className="project-card group relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ 
                y: -8, 
                transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
              }}
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
              
              {/* Rest of card content */}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
```

### 3.5 Timeline Section

**Enhancements:**
- Scroll-linked active node scaling
- Connector line animation
- Dim previous nodes
- Card entrance on scroll

**Implementation:**

```typescript
// src/pages/TimelinePage.tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TimelinePage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });
  
  // Animate connector line
  const lineProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  return (
    <div ref={containerRef}>
      <div className="relative">
        {/* Animated connector line */}
        <motion.div
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary/50 to-border transform md:-translate-x-1/2"
          style={{
            background: `linear-gradient(to bottom, 
              hsl(var(--primary)) 0%, 
              hsl(var(--primary)) ${lineProgress}%, 
              hsl(var(--border)) ${lineProgress}%)`
          }}
        />
        
        {experiences.map((exp, index) => {
          const { ref, inView } = useInView({ 
            threshold: 0.5,
            triggerOnce: false // Re-trigger on scroll
          });
          
          return (
            <motion.div
              key={index}
              ref={ref}
              className="relative flex flex-col md:flex-row items-start gap-8"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ 
                opacity: inView ? 1 : 0.4,
                x: 0,
                scale: inView ? 1 : 0.95
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Node with scroll-based scale */}
              <motion.div
                className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2"
                animate={{
                  scale: inView ? 1.3 : 1,
                  boxShadow: inView 
                    ? "0 0 20px rgba(251, 146, 60, 0.5)" 
                    : "0 0 0px rgba(251, 146, 60, 0)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={`w-4 h-4 rounded-full border-4 border-card ${
                  exp.highlight ? "bg-primary" : "bg-muted"
                }`} />
              </motion.div>
              
              {/* Card content */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
```

### 3.6 Explore Circular Gallery

**Enhancements:**
- Inertia-based rotation
- Active item emphasis
- Keyboard navigation
- Smooth easing

**Implementation:**

```typescript
// src/pages/ExplorePage.tsx - Enhance CircularGallery
const CircularGallery = () => {
  // ... existing state ...
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Inertia rotation
  useEffect(() => {
    let velocity = 0;
    let lastTime = Date.now();
    
    const animate = () => {
      if (!isDragging.current && !selectedCard) {
        const now = Date.now();
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        
        // Apply friction
        velocity *= 0.95;
        rotationRef.current += velocity * delta * 60;
        setRotation(rotationRef.current);
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [selectedCard]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        rotationRef.current -= 30;
        setRotation(rotationRef.current);
      } else if (e.key === "ArrowRight") {
        rotationRef.current += 30;
        setRotation(rotationRef.current);
      } else if (e.key === "Enter" && activeIndex !== null) {
        handleCardClick(techTopics[activeIndex]);
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [activeIndex]);
  
  // Update active index based on card closest to top
  useEffect(() => {
    // Calculate which card is most visible
    // Set activeIndex accordingly
  }, [rotation]);
  
  return (
    <div
      ref={galleryRef}
      className="relative w-[680px] h-[680px] sm:w-[720px] sm:h-[720px] md:w-[820px] md:h-[820px] cursor-grab active:cursor-grabbing mx-auto"
      tabIndex={0}
      style={{ perspective: "1000px" }}
    >
      {techTopics.map((topic, index) => {
        const isActive = activeIndex === index;
        return (
          <FlipCard
            key={topic.id}
            // ... existing props ...
            className={isActive ? "ring-2 ring-primary scale-110" : ""}
          />
        );
      })}
    </div>
  );
};
```

### 3.7 Contact Form

**Enhancements:**
- Animated validation states
- Success pulse
- Error shake
- Field focus animations

**Implementation:**

```typescript
// src/pages/ConnectPage.tsx
import { motion } from "framer-motion";

const ConnectPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!validateEmail(formData.email)) newErrors.email = "Invalid email";
    if (!formData.message) newErrors.message = "Message is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSuccess(true);
    setFormData({ name: "", email: "", message: "" });
    setErrors({});
    
    setTimeout(() => setIsSuccess(false), 3000);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <motion.div
        animate={errors.name ? { x: [0, -10, 10, -10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <label className="lab-label block mb-2">Name</label>
        <motion.input
          type="text"
          required
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          className={`w-full px-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 transition-all ${
            errors.name
              ? "border-destructive focus:ring-destructive/50"
              : "border-border focus:ring-primary/50"
          }`}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-xs mt-1"
          >
            {errors.name}
          </motion.p>
        )}
      </motion.div>
      
      {/* Similar for email and message */}
      
      <motion.button
        type="submit"
        className="lab-button-primary w-full flex items-center justify-center gap-2"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
        <Send className="w-4 h-4" />
      </motion.button>
      
      {/* Success animation */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)"
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-600 text-center"
          >
            Message sent! I'll get back to you soon.
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
```

### 3.8 Theme Toggle Animation

**Enhancements:**
- Cross-fade transition (200-300ms)
- Smooth color transitions
- Glow effects

**Implementation:**

```typescript
// src/contexts/ThemeContext.tsx
import { motion, AnimatePresence } from "framer-motion";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTheme(prev => prev === "light" ? "dark" : "light");
      setTimeout(() => setIsTransitioning(false), 300);
    }, 50);
  };
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={theme}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={theme}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

---

## 4. Performance Considerations

### 4.1 Reduce Layout Thrash
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly and remove after animation

### 4.2 Intersection Observer
- Use `triggerOnce: true` for one-time animations
- Set appropriate `threshold` values
- Debounce scroll handlers

### 4.3 Reduce Motion for Performance
```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const motionConfig = prefersReducedMotion
  ? { duration: 0, ease: "linear" }
  : { duration: 0.5, ease: [0.4, 0, 0.2, 1] };
```

---

## 5. Accessibility

### 5.1 Reduced Motion
```typescript
// src/lib/motion.ts
export const getMotionConfig = () => {
  const prefersReducedMotion = typeof window !== "undefined" 
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  
  return prefersReducedMotion
    ? { duration: 0, transition: { duration: 0 } }
    : {};
};
```

### 5.2 Keyboard Navigation
- All interactive elements must be keyboard accessible
- Visible focus states (ring-2 ring-primary)
- Tab order logical
- Escape key closes modals

### 5.3 Focus Management
```typescript
// Focus trap for modals
const useFocusTrap = (isOpen: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isOpen) return;
    
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    // Trap focus logic
  }, [isOpen]);
};
```

---

## 6. Easter Egg: EXP Bar Reaction

```typescript
// When Explore section is interacted with, pulse EXP bar
const ExpBarEasterEgg = () => {
  const { ref: exploreRef, inView } = useInView({ threshold: 0.3 });
  const [pulse, setPulse] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }
  }, [inView]);
  
  return (
    <motion.div
      animate={pulse ? {
        boxShadow: "0 0 30px rgba(251, 146, 60, 0.6)",
        scale: 1.05,
      } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* EXP bar */}
    </motion.div>
  );
};
```

---

## 7. Implementation Priority

### Phase 1 (High Impact, Low Effort)
1. ✅ CTA hover states (120ms scale)
2. ✅ Card hover elevations
3. ✅ Filter button animations
4. ✅ Status chip pulse on mount

### Phase 2 (Medium Impact, Medium Effort)
5. ✅ Scroll-triggered section animations
6. ✅ Project card filter transitions
7. ✅ Timeline scroll-linked animations
8. ✅ Form validation animations

### Phase 3 (High Impact, High Effort)
9. ✅ EXP count-up animation
10. ✅ Capabilities hover achievements
11. ✅ Circular gallery enhancements
12. ✅ Theme transition cross-fade

---

## 8. Mobile Optimizations

```typescript
// Shorter animations on mobile
const isMobile = window.innerWidth < 768;
const animationDuration = isMobile ? 0.3 : 0.5;

// Replace hover with tap states
<motion.div
  whileHover={!isMobile ? { scale: 1.05 } : {}}
  whileTap={{ scale: 0.95 }}
  className="cursor-pointer"
>
```

---

This system provides a cohesive motion language while maintaining performance and accessibility.

