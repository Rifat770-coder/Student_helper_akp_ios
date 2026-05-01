import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { hashPassword, verifyPassword } from "@/lib/cryptoUtils";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; token?: string; error?: string }>;
  resetPassword: (email: string, token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("student_sphere_session");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
    setLoading(false);
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      return JSON.parse(localStorage.getItem("student_sphere_users") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem("student_sphere_users", JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email);
    
    if (!found) {
      return { success: false, error: "Invalid email or password" };
    }

    // Check if password is hashed (new format) or plain text (old format)
    let isValid = false;
    if (found.passwordHash) {
      // New hashed password
      isValid = await verifyPassword(password, found.passwordHash);
    } else if ((found as any).password) {
      // Old plain text password - migrate to hashed
      isValid = (found as any).password === password;
      if (isValid) {
        // Migrate to hashed password
        found.passwordHash = await hashPassword(password);
        delete (found as any).password;
        saveUsers(users);
      }
    }

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    const userData = { id: found.id, name: found.name, email: found.email };
    setUser(userData);
    localStorage.setItem("student_sphere_session", JSON.stringify(userData));
    return { success: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already registered" };
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash,
    };
    users.push(newUser);
    saveUsers(users);

    const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
    setUser(userData);
    localStorage.setItem("student_sphere_session", JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("student_sphere_session");
  };

  const updateProfile = async (updates: { name?: string; email?: string }) => {
    if (!user) return { success: false, error: "Not authenticated" };

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    
    if (idx === -1) {
      return { success: false, error: "User not found" };
    }

    // Check if email is already taken
    if (updates.email && updates.email !== user.email) {
      if (users.find((u) => u.email === updates.email)) {
        return { success: false, error: "Email already in use" };
      }
    }

    // Update user
    if (updates.name) users[idx].name = updates.name;
    if (updates.email) users[idx].email = updates.email;
    saveUsers(users);

    // Update session
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("student_sphere_session", JSON.stringify(updatedUser));

    return { success: true };
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "Not authenticated" };

    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    
    if (idx === -1) {
      return { success: false, error: "User not found" };
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, users[idx].passwordHash);
    if (!isValid) {
      return { success: false, error: "Current password is incorrect" };
    }

    // Update password
    users[idx].passwordHash = await hashPassword(newPassword);
    saveUsers(users);

    return { success: true };
  };

  const requestPasswordReset = async (email: string) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === email);
    
    if (idx === -1) {
      // Don't reveal if email exists
      return { success: true };
    }

    // Generate reset token (in real app, this would be sent via email)
    const token = crypto.randomUUID();
    const tokenHash = await hashPassword(token);
    
    users[idx].resetToken = tokenHash;
    users[idx].resetTokenExpiry = Date.now() + 3600000; // 1 hour
    saveUsers(users);

    // In a real app, send email with token
    // For demo, return token directly
    return { success: true, token };
  };

  const resetPassword = async (email: string, token: string, newPassword: string) => {
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === email);
    
    if (idx === -1) {
      return { success: false, error: "Invalid reset link" };
    }

    const user = users[idx];
    
    // Check if token exists and is not expired
    if (!user.resetToken || !user.resetTokenExpiry) {
      return { success: false, error: "Invalid reset link" };
    }

    if (Date.now() > user.resetTokenExpiry) {
      return { success: false, error: "Reset link has expired" };
    }

    // Verify token
    const isValid = await verifyPassword(token, user.resetToken);
    if (!isValid) {
      return { success: false, error: "Invalid reset link" };
    }

    // Update password
    users[idx].passwordHash = await hashPassword(newPassword);
    delete users[idx].resetToken;
    delete users[idx].resetTokenExpiry;
    saveUsers(users);

    return { success: true };
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      requestPasswordReset,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
