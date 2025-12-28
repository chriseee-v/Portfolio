import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col md:flex-row"
            onClick={() => setIsOpen(false)}
          >
            {/* Top Panel (Mobile) / Left Panel (Desktop) - Dark/Light Background with Navigation */}
            <motion.div
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
              className={`w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center items-start pl-8 md:pl-12 lg:pl-16 xl:pl-24 pr-8 md:pr-0 ${
                theme === 'dark' ? 'bg-black' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Navigation Links */}
              <motion.nav
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-5 md:gap-6 w-full"
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase tracking-tight transition-colors ${
                        location.pathname === item.path
                          ? theme === 'dark' ? "text-gray-400" : "text-gray-600"
                          : theme === 'dark' ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                
                {/* Theme Toggle - Inside Menu */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + navItems.length * 0.1 }}
                  className="pt-6 mt-4 border-t border-gray-600 dark:border-gray-400"
                >
                  <button
                    onClick={() => {
                      toggleTheme();
                    }}
                    className={`flex items-center gap-3 text-xl md:text-2xl font-bold uppercase tracking-tight transition-colors ${
                      theme === 'dark' ? "text-white hover:text-gray-300" : "text-black hover:text-gray-700"
                    }`}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="w-6 h-6 md:w-7 md:h-7" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="w-6 h-6 md:w-7 md:h-7" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </motion.div>
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
              className="w-full md:w-1/2 h-1/2 md:h-full bg-primary flex flex-col justify-center items-center relative"
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
        )}
      </AnimatePresence>
    </>
  );
};
