import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, ArrowLeft, Key } from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await requestPasswordReset(email);
    
    setLoading(false);
    
    if (result.success) {
      setResetToken(result.token || null);
      setMessage({
        type: "success",
        text: "Password reset instructions have been generated. Copy the token below.",
      });
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to request password reset",
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
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset token
            </p>
          </div>

          {!resetToken ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-10"
                    placeholder="your@email.com"
                    required
                  />
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
                {loading ? "Sending..." : "Send Reset Token"}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <p className="text-sm text-accent mb-2">
                  ✅ Reset token generated successfully!
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Copy this token and use it on the reset password page:
                </p>
                <div className="bg-background p-3 rounded border border-border">
                  <code className="text-xs break-all">{resetToken}</code>
                </div>
              </div>

              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}`}
                className="btn-primary w-full justify-center"
              >
                Continue to Reset Password
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          💡 In a real application, the reset token would be sent to your email.
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
