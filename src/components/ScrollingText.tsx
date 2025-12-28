import { useEffect, useRef } from 'react';

interface ScrollingTextProps {
  texts: string[];
  speed?: number;
  className?: string;
}

export const ScrollingText = ({ texts, speed = 1, className = '' }: ScrollingTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Create text with separators
    const textContent = texts.join(' • ');
    
    // Create multiple copies for seamless loop
    const copies = 3;
    wrapper.innerHTML = Array(copies).fill(textContent).map((text, i) => 
      `<span class="inline-block mr-8">${text}</span>`
    ).join('');

    let animationId: number;
    let position = 0;
    const scrollSpeed = speed;

    const animate = () => {
      position -= scrollSpeed;
      
      // Get the width of one copy
      const firstSpan = wrapper.querySelector('span');
      if (firstSpan) {
        const copyWidth = firstSpan.offsetWidth + 32; // 32px for margin
        
        // Reset position when scrolled past one copy width (seamless loop)
        if (Math.abs(position) >= copyWidth) {
          position = 0;
        }
      }
      
      wrapper.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a brief delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [texts, speed]);

  return (
    <div 
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap scrolling-text-container ${className}`}
      style={{ width: '100%' }}
    >
      <div
        ref={wrapperRef}
        className="inline-flex text-black font-bold text-xl md:text-2xl uppercase tracking-wider"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
