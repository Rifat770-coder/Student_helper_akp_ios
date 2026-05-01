import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import { ArrowLeft } from "lucide-react";

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

const PageLayout = ({ children, maxWidth }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className="page-container">
      <Navbar />
      {/* pb-20 on mobile reserves space above the fixed BottomNav */}
      <div className={`content-container pb-20 md:pb-0 ${maxWidth || ""}`}>
        {!isDashboard && (
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default PageLayout;
