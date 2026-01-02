import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

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
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="w-full py-4 px-6 md:px-8 flex items-center justify-between relative z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">L.</span>
        </div>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`lab-nav-link ${
              location.pathname === item.path ? "text-foreground after:w-full" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-muted rounded-full transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-foreground/60" />
          ) : (
            <Moon className="w-4 h-4 text-foreground/60" />
          )}
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card shadow-lg md:hidden py-4 px-6 mt-2 mx-4 rounded-xl">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-medium py-2 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 text-sm font-medium py-2 text-foreground/70"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
