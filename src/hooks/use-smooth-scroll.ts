import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface SmoothScrollOptions {
  smoothness?: number; // 0-1, higher = smoother (0.08-0.15 recommended)
  speed?: number; // Scroll speed multiplier
  enableParallax?: boolean;
}

export const useSmoothScroll = (options: SmoothScrollOptions = {}) => {
  const {
    smoothness = 0.08,
    speed = 1,
    enableParallax = true,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    
    if (!container || !content) return;

    // Disable default scrolling
    container.style.overflow = 'hidden';
    container.style.height = '100vh';
    container.style.position = 'relative';
    
    content.style.position = 'absolute';
    content.style.top = '0';
    content.style.left = '0';
    content.style.width = '100%';
    content.style.willChange = 'transform';

    let isAnimating = false;

    // Smooth scroll function using requestAnimationFrame
    const smoothScroll = () => {
      const currentScroll = scrollYRef.current;
      const targetScroll = targetScrollYRef.current;
      
      // Calculate difference
      const diff = targetScroll - currentScroll;
      
      // Apply easing (exponential smoothing)
      if (Math.abs(diff) > 0.5) {
        scrollYRef.current += diff * smoothness;
        content.style.transform = `translate3d(0, -${scrollYRef.current}px, 0)`;
        setIsScrolling(true);
        isAnimating = true;
        rafIdRef.current = requestAnimationFrame(smoothScroll);
      } else {
        // Snap to target if very close
        scrollYRef.current = targetScroll;
        content.style.transform = `translate3d(0, -${scrollYRef.current}px, 0)`;
        setIsScrolling(false);
        isAnimating = false;
        rafIdRef.current = null; // Clear the ref to stop the loop
      }
    };

    // Handle wheel events
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const delta = e.deltaY * speed;
      const maxScroll = Math.max(0, content.scrollHeight - container.clientHeight);
      
      targetScrollYRef.current = Math.max(
        0,
        Math.min(targetScrollYRef.current + delta, maxScroll)
      );

      if (!isAnimating && rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    // Handle touch events for mobile
    let touchStartY = 0;
    let touchScrollY = 0;
    let isTouching = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchScrollY = scrollYRef.current;
      isTouching = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching) return;
      e.preventDefault();
      const touchY = e.touches[0].clientY;
      const delta = (touchStartY - touchY) * speed;
      const maxScroll = Math.max(0, content.scrollHeight - container.clientHeight);
      
      targetScrollYRef.current = Math.max(
        0,
        Math.min(touchScrollY + delta, maxScroll)
      );

      if (!isAnimating && rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(smoothScroll);
      }
    };

    const handleTouchEnd = () => {
      isTouching = false;
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const maxScroll = Math.max(0, content.scrollHeight - container.clientHeight);
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        targetScrollYRef.current = Math.min(
          targetScrollYRef.current + container.clientHeight * 0.8,
          maxScroll
        );
        if (!isAnimating && rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(smoothScroll);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        targetScrollYRef.current = Math.max(
          targetScrollYRef.current - container.clientHeight * 0.8,
          0
        );
        if (!isAnimating && rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(smoothScroll);
        }
      }
    };

    // Set up event listeners
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    // Initialize scroll position - ensure they start equal to prevent auto-scroll
    scrollYRef.current = 0;
    targetScrollYRef.current = 0;
    content.style.transform = `translate3d(0, 0, 0)`;

    // Cleanup
    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [smoothness, speed]);

  // Setup parallax effects using Intersection Observer
  useEffect(() => {
    if (!enableParallax || !contentRef.current) return;

    const parallaxElements = contentRef.current.querySelectorAll('[data-parallax]');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const speed = parseFloat(element.dataset.parallax || '0.5');
            const rect = element.getBoundingClientRect();
            const container = containerRef.current;
            
            if (!container) return;
            
            const containerRect = container.getBoundingClientRect();
            const elementTop = rect.top - containerRect.top;
            const elementHeight = rect.height;
            const containerHeight = containerRect.height;
            
            // Calculate parallax offset
            const progress = Math.max(0, Math.min(1, 
              (elementTop + elementHeight) / (containerHeight + elementHeight)
            ));
            
            const y = (progress - 0.5) * 100 * speed;
            gsap.to(element, {
              y: y,
              duration: 0.3,
              ease: 'power2.out',
            });
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    parallaxElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [enableParallax]);

  // Method to scroll to a specific position
  const scrollTo = (position: number, duration: number = 1.2) => {
    if (!contentRef.current) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const maxScroll = Math.max(0, contentRef.current.scrollHeight - container.clientHeight);
    const targetPosition = Math.max(0, Math.min(position, maxScroll));
    
    // Update target position
    targetScrollYRef.current = targetPosition;
    
    // Use GSAP to animate the scroll position smoothly
    const startPosition = scrollYRef.current;
    const obj = { value: startPosition };
    
    gsap.to(obj, {
      value: targetPosition,
      duration: duration,
      ease: "power2.inOut",
      onUpdate: () => {
        scrollYRef.current = obj.value;
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, -${obj.value}px, 0)`;
        }
      },
      onComplete: () => {
        scrollYRef.current = targetPosition;
        targetScrollYRef.current = targetPosition;
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, -${targetPosition}px, 0)`;
        }
      },
    });
  };

  // Get current scroll position
  const getScrollPosition = () => scrollYRef.current;

  return {
    containerRef,
    contentRef,
    isScrolling,
    scrollTo,
    getScrollPosition,
  };
};
