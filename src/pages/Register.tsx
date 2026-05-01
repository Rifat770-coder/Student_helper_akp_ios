import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground mb-6">Start your academic journey</p>

            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-input pl-11" placeholder="Your full name" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input pl-11" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input pl-11" placeholder="Min 6 characters" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input pl-11" placeholder="Confirm your password" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                {loading ? <div className="spinner !w-5 !h-5" /> : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
