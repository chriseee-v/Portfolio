import { useEffect, useState, useRef } from 'react';

interface GradientColor {
  from: string;
  via?: string;
  to: string;
}

const gradients: GradientColor[] = [
  { from: 'from-orange-500', to: 'to-red-500' }, // Initial - orange/red
  { from: 'from-purple-500', via: 'via-pink-500', to: 'to-orange-500' }, // Projects
  { from: 'from-blue-500', via: 'via-cyan-500', to: 'to-teal-500' }, // Timeline
  { from: 'from-green-500', via: 'via-emerald-500', to: 'to-teal-500' }, // Explore
  { from: 'from-indigo-500', via: 'via-purple-500', to: 'to-pink-500' }, // Blog
  { from: 'from-yellow-500', via: 'via-orange-500', to: 'to-red-500' }, // News
  { from: 'from-rose-500', via: 'via-pink-500', to: 'to-purple-500' }, // Connect
];

import { RefObject } from 'react';

export const useScrollGradient = (getScrollPosition: () => number, containerRef: RefObject<HTMLDivElement>) => {
  const [currentGradient, setCurrentGradient] = useState<GradientColor>(gradients[0]);
  const [gradientProgress, setGradientProgress] = useState(0);
  const lastGradientIndexRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateGradient = () => {
      const scrollPosition = getScrollPosition();
      const container = containerRef.current;
      if (!container) return;

      const containerHeight = container.clientHeight;
      const totalHeight = container.scrollHeight || containerHeight * 7;
      
      if (totalHeight === 0) return;
      
      // Calculate which section we're in (0-6 for 7 pages)
      const scrollProgress = scrollPosition / totalHeight;
      const sectionIndex = Math.floor(scrollProgress * gradients.length);
      const clampedIndex = Math.max(0, Math.min(sectionIndex, gradients.length - 1));
      
      // Only update if gradient actually changed to prevent unnecessary re-renders
      if (clampedIndex !== lastGradientIndexRef.current) {
        lastGradientIndexRef.current = clampedIndex;
        setCurrentGradient(gradients[clampedIndex]);
      }
      
      // Calculate progress within current section for smooth blending
      const sectionHeight = totalHeight / gradients.length;
      const sectionProgress = (scrollPosition % sectionHeight) / sectionHeight;
      setGradientProgress(sectionProgress);
    };

    // Update on scroll - throttle for performance and reduce frequency
    let lastUpdate = 0;
    const throttleDelay = 150; // Increased to 150ms to reduce flickering
    
    const throttledUpdate = () => {
      const now = Date.now();
      if (now - lastUpdate >= throttleDelay) {
        updateGradient();
        lastUpdate = now;
      }
    };
    
    const interval = setInterval(throttledUpdate, throttleDelay);
    updateGradient(); // Initial update

    return () => {
      clearInterval(interval);
    };
  }, [getScrollPosition, containerRef]);

  return { currentGradient, gradientProgress };
};

