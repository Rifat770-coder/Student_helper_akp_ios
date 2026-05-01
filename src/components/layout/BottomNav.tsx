import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, CheckSquare, Calendar, MessageCircle, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Home",    icon: Home },
  { to: "/cgpa",      label: "CGPA",    icon: Award },
  { to: "/notes",     label: "Notes",   icon: BookOpen },
  { to: "/todos",     label: "To-Do",   icon: CheckSquare },
  { to: "/routine",   label: "Routine", icon: Calendar },
  { to: "/chatbot",   label: "Chat",    icon: MessageCircle },
];

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Hide bottom nav on profile and settings pages
  const hiddenRoutes = ["/profile", "/settings"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch h-16">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              {label}
              {active && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-t-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
