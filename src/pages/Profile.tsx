import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { User, Mail, Lock, Save, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const ProfileContent = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const result = await updateProfile({ name, email });
    
    setSavingProfile(false);
    setProfileMessage({
      type: result.success ? "success" : "error",
      text: result.success ? "Profile updated successfully!" : result.error || "Failed to update profile",
    });

    setTimeout(() => setProfileMessage(null), 5000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setSavingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    
    setSavingPassword(false);
    setPasswordMessage({
      type: result.success ? "success" : "error",
      text: result.success ? "Password changed successfully!" : result.error || "Failed to change password",
    });

    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setTimeout(() => setPasswordMessage(null), 5000);
  };

  return (
    <PageLayout>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your account settings</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Information */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
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

            {profileMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  profileMessage.type === "success"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {profileMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={savingProfile}
            >
              <Save className="w-5 h-5" />
              {savingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  passwordMessage.type === "success"
                    ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {passwordMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={savingPassword}
            >
              <Lock className="w-5 h-5" />
              {savingPassword ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Security Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            🔒 <strong>Security:</strong> Your password is encrypted using SHA-256 hashing and stored securely in your browser.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

const Profile = () => (
  <ProtectedRoute>
    <ProfileContent />
  </ProtectedRoute>
);

export default Profile;
