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
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to the appropriate page when route changes
  useEffect(() => {
    const path = location.pathname;
    const pageElement = pageRefs.current[path];
    
    if (pageElement && containerRef.current) {
      setIsScrolling(true);
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Reset scrolling flag after animation
      setTimeout(() => setIsScrolling(false), 1000);
    }
  }, [location.pathname]);

  // Update route based on scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        // Find which page is most visible
        let closestPage = pages[0];
        let minDistance = Infinity;

        pages.forEach((page) => {
          const pageElement = pageRefs.current[page.path];
          if (pageElement) {
            const rect = pageElement.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            const distance = Math.abs(rect.top - containerRect.top);
            
            if (distance < minDistance) {
              minDistance = distance;
              closestPage = page;
            }
          }
        });

        // Update route if different
        if (closestPage.path !== location.pathname) {
          navigate(closestPage.path, { replace: true });
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname, navigate, isScrolling]);

  const setPageRef = (path: string) => (el: HTMLDivElement | null) => {
    pageRefs.current[path] = el;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Main Content Card */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col w-full">
          <div className="flex-1 lab-card flex flex-col overflow-hidden">
            <Navigation />
            <main ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
              {pages.map(({ path, component: Component }) => (
                <div 
                  key={path}
                  ref={setPageRef(path)} 
                  className="min-h-screen px-6 md:px-8 lg:px-12 pb-8"
                >
                  <Component />
                </div>
              ))}
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
