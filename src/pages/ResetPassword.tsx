import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setLoading(true);
    const result = await resetPassword(email, token, newPassword);
    
    setLoading(false);
    
    if (result.success) {
      setMessage({
        type: "success",
        text: "Password reset successfully! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to reset password",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-xl p-8 border border-border shadow-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your reset token and new password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reset Token</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="form-input font-mono text-sm"
                placeholder="Paste your reset token here"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Need a new reset token?
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
