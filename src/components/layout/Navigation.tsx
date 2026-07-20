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
    <nav className="w-full py-0 relative z-50" style={{ borderBottom: "2px solid hsl(var(--foreground))" }}>
      <div className="flex items-stretch">
        {/* Logo block */}
        <Link
          to="/"
          className="flex items-center px-6 py-4 font-mono font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
          style={{ borderRight: "2px solid hsl(var(--foreground))" }}
        >
          LAB.
        </Link>

        {/* Desktop nav items */}
        <div className="hidden md:flex items-stretch flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-5 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-colors duration-150 flex items-center ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-foreground hover:text-background"
              }`}
              style={{ borderRight: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Spacer */}
        <div className="hidden md:flex flex-1" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="hidden md:flex items-center px-5 py-4 font-mono text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors duration-150"
          style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center px-5 py-4 ml-auto hover:bg-foreground hover:text-background transition-colors duration-150"
          style={{ borderLeft: "2px solid hsl(var(--foreground))" }}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 bg-background z-50"
          style={{ borderBottom: "2px solid hsl(var(--foreground))", borderTop: "2px solid hsl(var(--foreground))" }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-6 py-4 font-mono text-xs uppercase tracking-widest font-bold transition-colors duration-150 ${
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-foreground hover:text-background"
              }`}
              style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.2)" }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => { toggleTheme(); setIsOpen(false); }}
            className="flex items-center gap-2 w-full px-6 py-4 font-mono text-xs uppercase tracking-widest font-bold hover:bg-foreground hover:text-background transition-colors duration-150"
          >
            {theme === "dark" ? <><Sun className="w-4 h-4" /> Light Mode</> : <><Moon className="w-4 h-4" /> Dark Mode</>}
          </button>
        </div>
      )}
    </nav>
  );
};
