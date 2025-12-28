import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Navigation } from "./components/layout/Navigation";
import MePage from "./pages/MePage";
import ProjectsPage from "./pages/ProjectsPage";
import TimelinePage from "./pages/TimelinePage";
import ExplorePage from "./pages/ExplorePage";
import BlogPage from "./pages/BlogPage";
import NewsPage from "./pages/NewsPage";
import ConnectPage from "./pages/ConnectPage";
import NotFound from "./pages/NotFound";
import { useEffect, useRef, useState } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { useScrollGradient } from "@/hooks/use-scroll-gradient";
import { gsap } from "gsap";

const queryClient = new QueryClient();

const pages = [
  { path: "/", component: MePage },
  { path: "/projects", component: ProjectsPage },
  { path: "/timeline", component: TimelinePage },
  { path: "/explore", component: ExplorePage },
  { path: "/blog", component: BlogPage },
  { path: "/news", component: NewsPage },
  { path: "/connect", component: ConnectPage },
];

const ScrollableLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitialMountRef = useRef(true);
  const lastPathRef = useRef<string>(location.pathname);
  
  // Use smooth scroll hook
  const { containerRef, contentRef, isScrolling: smoothScrollActive, scrollTo, getScrollPosition } = useSmoothScroll({
    smoothness: 0.08,
    speed: 1,
    enableParallax: true,
  });

  // Use scroll gradient hook
  const { currentGradient } = useScrollGradient(getScrollPosition, containerRef);

  // Scroll to the appropriate page when route changes (only if path actually changed)
  useEffect(() => {
    const path = location.pathname;
    
    // Skip on initial mount or if path hasn't changed
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      lastPathRef.current = path;
      return;
    }
    
    // Only scroll if path actually changed
    if (path === lastPathRef.current) return;
    lastPathRef.current = path;
    
    const pageElement = pageRefs.current[path];
    
    if (pageElement && containerRef.current && contentRef.current) {
      setIsScrolling(true);
      
      // Calculate target scroll position relative to content
      const containerRect = containerRef.current.getBoundingClientRect();
      const pageRect = pageElement.getBoundingClientRect();
      const currentScroll = getScrollPosition();
      const scrollOffset = pageRect.top - containerRect.top + currentScroll;
      
      // Scroll to the target position
      scrollTo(scrollOffset, 1.2);
      
      // Reset scrolling flag after animation
      setTimeout(() => {
        setIsScrolling(false);
      }, 1300);
    }
  }, [location.pathname, containerRef, contentRef, scrollTo, getScrollPosition]);

  // Update route based on scroll position (using transform instead of scrollTop)
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Don't check scroll position on initial mount
    if (isInitialMountRef.current) return;

    const checkScrollPosition = () => {
      // Skip if we're programmatically scrolling or smooth scroll is active
      if (isScrolling || smoothScrollActive) return;

      // Get current scroll position from the hook
      const currentScroll = getScrollPosition();

      // Find which page is most visible
      let closestPage = pages[0];
      let minDistance = Infinity;

      pages.forEach((page) => {
        const pageElement = pageRefs.current[page.path];
        if (pageElement && container) {
          const containerRect = container.getBoundingClientRect();
          const pageRect = pageElement.getBoundingClientRect();
          const pageTop = pageRect.top - containerRect.top + currentScroll;
          const distance = Math.abs(pageTop - currentScroll);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestPage = page;
          }
        }
      });

      // Update route if different (but only if user scrolled, not programmatic)
      if (closestPage.path !== location.pathname && minDistance < 100) {
        navigate(closestPage.path, { replace: true });
      }
    };

    // Check scroll position periodically, but less frequently
    const intervalId = setInterval(checkScrollPosition, 500);

    return () => {
      clearInterval(intervalId);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname, navigate, isScrolling, smoothScrollActive, containerRef, contentRef, getScrollPosition]);

  const setPageRef = (path: string) => (el: HTMLDivElement | null) => {
    pageRefs.current[path] = el;
  };

  // Build gradient class string
  const gradientClass = `bg-gradient-to-br ${currentGradient.from} ${currentGradient.via ? currentGradient.via : ''} ${currentGradient.to}`;

  return (
    <div 
      className={`min-h-screen relative overflow-hidden overflow-x-hidden ${gradientClass}`}
      style={{
        transition: 'background 0.8s ease-out',
        willChange: 'background',
      }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-background/80 dark:bg-background/90 backdrop-blur-sm pointer-events-none" />
      
      {/* Main Content Card */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 lab-card flex flex-col overflow-hidden">
            <Navigation />
            <main 
              ref={containerRef} 
              className="smooth-scroll-container flex-1"
            >
              <div 
                ref={contentRef}
                className="smooth-scroll-content"
              >
                {pages.map(({ path, component: Component }) => (
                  <div 
                    key={path}
                    ref={setPageRef(path)} 
                    className="min-h-screen px-6 md:px-8 lg:px-12 pb-8 overflow-x-hidden"
                  >
                    <Component />
                  </div>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<ScrollableLayout />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
