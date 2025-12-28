import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ScrollingText } from "@/components/ScrollingText";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Me", path: "/" },
  { label: "Projects", path: "/projects" },
  { label: "Timeline", path: "/timeline" },
  { label: "Explore", path: "/explore" },
  { label: "Blog", path: "/blog" },
  { label: "News", path: "/news" },
  { label: "Connect", path: "/connect" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const scrollPositionRef = useRef<number>(0);

  const scrollingTexts = [
    "Ongoing Projects",
    "New Projects",
    "Latest Work",
    "Featured Projects",
  ];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Also prevent smooth scroll container from scrolling
      const smoothScrollContainer = document.querySelector('.smooth-scroll-container') as HTMLElement;
      if (smoothScrollContainer) {
        smoothScrollContainer.style.overflow = 'hidden';
        smoothScrollContainer.style.position = 'fixed';
        smoothScrollContainer.style.width = '100%';
        smoothScrollContainer.style.top = `-${scrollPositionRef.current}px`;
      }
    } else {
      // Restore scroll position
      const savedScrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (savedScrollY) {
        window.scrollTo(0, savedScrollY);
      }
      
      // Restore smooth scroll container
      const smoothScrollContainer = document.querySelector('.smooth-scroll-container') as HTMLElement;
      if (smoothScrollContainer) {
        smoothScrollContainer.style.overflow = '';
        smoothScrollContainer.style.position = '';
        smoothScrollContainer.style.width = '';
        smoothScrollContainer.style.top = '';
      }
    }
    return () => {
      const savedScrollY = scrollPositionRef.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (savedScrollY) {
        window.scrollTo(0, savedScrollY);
      }
      const smoothScrollContainer = document.querySelector('.smooth-scroll-container') as HTMLElement;
      if (smoothScrollContainer) {
        smoothScrollContainer.style.overflow = '';
        smoothScrollContainer.style.position = '';
        smoothScrollContainer.style.width = '';
        smoothScrollContainer.style.top = '';
      }
    };
  }, [isOpen]);

  // Scroll menu to top when it opens on mobile
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isOpen && isMobile && menuPanelRef.current) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        if (menuPanelRef.current) {
          menuPanelRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Floating Arrow Button - Right Side */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-6 top-6 z-[10000] p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Toggle menu"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <motion.div
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Logo - Always visible */}
      <nav className="w-full py-4 px-6 md:px-8 flex items-center relative z-50">
        <Link to="/" className="flex flex-col items-start">
          <span className="text-foreground font-bold text-lg tracking-tight leading-none">CHRIS' LAB</span>
          <span className="text-foreground/60 font-normal text-sm tracking-tight leading-none">/ PORTFOLIO</span>
        </Link>
      </nav>

      {/* Full Screen Navigation Overlay - Split Screen Layout */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background overlay to prevent seeing content behind */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9998] bg-background"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] flex flex-col md:flex-row pointer-events-none"
              onClick={() => setIsOpen(false)}
            >
            {/* Top Panel (Mobile) / Left Panel (Desktop) - Dark/Light Background with Navigation */}
            <motion.div
              ref={menuPanelRef}
              initial={{ 
                x: isMobile ? 0 : '-100%',
                y: isMobile ? '-100%' : 0
              }}
              animate={{ 
                x: 0,
                y: 0
              }}
              exit={{ 
                x: isMobile ? 0 : '-100%',
                y: isMobile ? '-100%' : 0
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-start md:justify-center items-start pl-4 sm:pl-6 md:pl-12 lg:pl-16 xl:pl-24 pr-4 sm:pr-6 md:pr-0 overflow-y-auto pointer-events-auto ${
                theme === 'dark' ? 'bg-black' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
              style={{ 
                scrollBehavior: 'smooth',
                paddingTop: isMobile ? '1rem' : '0',
                paddingBottom: isMobile ? '1rem' : '0'
              }}
            >
              {/* Navigation Links */}
              <motion.nav
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col w-full"
                style={{
                  gap: isMobile ? 'clamp(0.75rem, 2vh, 1rem)' : '1.5rem'
                }}
              >
                {navItems.map((item, index) => {
                  // Check if this is the Connect item (last item)
                  const isConnect = item.path === "/connect";
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={isConnect ? "flex items-center justify-between w-full" : ""}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`font-bold uppercase tracking-tight transition-colors ${
                          isMobile 
                            ? 'text-lg sm:text-xl' 
                            : 'text-3xl lg:text-4xl xl:text-5xl'
                        } ${
                          location.pathname === item.path
                            ? theme === 'dark' ? "text-gray-400" : "text-gray-600"
                            : theme === 'dark' ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
                        }`}
                      >
                        {item.label}
                      </Link>
                      
                      {/* Theme Toggle - Next to Connect */}
                      {isConnect && (
                        <motion.button
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 + navItems.length * 0.1 }}
                          onClick={() => {
                            toggleTheme();
                          }}
                          className={`flex items-center transition-colors mr-8 md:mr-12 lg:mr-16 ${
                            theme === 'dark' ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
                          }`}
                        >
                          {theme === "dark" ? (
                            <Sun className={isMobile ? "w-5 h-5 sm:w-6 sm:h-6" : "w-8 h-8"} />
                          ) : (
                            <Moon className={isMobile ? "w-5 h-5 sm:w-6 sm:h-6" : "w-8 h-8"} />
                          )}
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.nav>
            </motion.div>

            {/* Bottom Panel (Mobile) / Right Panel (Desktop) - Orange Background with Scrolling Text */}
            <motion.div
              initial={{ 
                x: isMobile ? 0 : '100%',
                y: isMobile ? '100%' : 0
              }}
              animate={{ 
                x: 0,
                y: 0
              }}
              exit={{ 
                x: isMobile ? 0 : '100%',
                y: isMobile ? '100%' : 0
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full md:w-1/2 h-1/2 md:h-full bg-primary flex flex-col justify-center items-center relative pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrolling Text - Vertical Center */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full py-4 md:py-8 px-4 md:px-6"
              >
                <ScrollingText 
                  texts={scrollingTexts} 
                  speed={1}
                  className="h-8 md:h-10"
                />
              </motion.div>
            </motion.div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
