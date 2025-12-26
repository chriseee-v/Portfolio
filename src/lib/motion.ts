import { Variants } from "framer-motion";

// Motion timing constants
export const MOTION = {
  // Hero/Title: Slower, smoother (800-1200ms)
  hero: {
    duration: 1.0,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number], // easeInOutCubic
  },
  // Cards: Snappier (300-500ms)
  card: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number], // easeOut
  },
  // Chips/Pills: Very quick (120-180ms)
  chip: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
  // Section entrance: Scroll-triggered (600-800ms)
  section: {
    duration: 0.7,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
};

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
  },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
};

// Stagger children (for grids)
export const staggerContainer: Variants = {
  initial: {},
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

// Filter transition
export const filterTransition = {
  layout: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Respect reduced motion preference
export const getMotionConfig = () => {
  if (typeof window === "undefined") return {};
  
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
  return prefersReducedMotion
    ? { duration: 0, transition: { duration: 0 } }
    : {};
};

// Button hover variants
export const buttonHoverVariants = {
  hover: { 
    scale: 1.05, 
    y: -2,
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  },
};

// Chip/pill variants
export const chipVariants = {
  hover: { 
    scale: 1.05,
    transition: { duration: 0.15 }
  },
};

