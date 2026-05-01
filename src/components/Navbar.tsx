import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  Home,
  BookOpen,
  CheckSquare,
  Calendar,
  MessageCircle,
  Award,
  LogOut,
  User,
  Sun,
  Moon,
  Search,
  Settings,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import GlobalSearch from "./search/GlobalSearch";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/cgpa", label: "CGPA", icon: Award },
  { to: "/notes", label: "Notes", icon: BookOpen },
  { to: "/todos", label: "To-Do", icon: CheckSquare },
  { to: "/routine", label: "Routine", icon: Calendar },
  { to: "/chatbot", label: "Chatbot", icon: MessageCircle },
];

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-primary">
            <Award className="w-6 h-6" />
            Student Helper
          </Link>

          {/* Desktop nav */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-2">
            {user && (
              <>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border border-border"
                  title="Search (Ctrl+K)"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden lg:inline">Search</span>
                  <kbd className="hidden lg:inline px-1.5 py-0.5 text-xs bg-muted rounded">⌘K</kbd>
                </button>
                <Link
                  to="/profile"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Link
                  to="/settings"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile right actions — clean header, no hamburger (bottom nav handles navigation) */}
          <div className="md:hidden flex items-center gap-1">
            {user && (
              <>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <Link
                  to="/profile"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
                <Link
                  to="/settings"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {!user && (
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-foreground">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu — only for non-logged-in users */}
        {menuOpen && !user && (
          <div className="md:hidden border-t border-border bg-card p-4 space-y-1">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)} className="block btn-primary text-sm text-center">
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
