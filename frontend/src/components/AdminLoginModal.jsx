"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, X } from "lucide-react";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function AdminLoginModal({ open, onClose }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, loading]);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setMessageType("error");
      setShowPassword(false);
      setLoading(false);
      setAuthenticated(false);
      setPassword("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("");
    setMessageType("error");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success || !result.token) {
        throw new Error(result.message || "Login failed. Please check your email and password.");
      }

      // Respect Remember me: persistent storage when checked, tab-only storage otherwise.
      window.localStorage.removeItem("socialure-admin-token");
      window.sessionStorage.removeItem("socialure-admin-token");
      window.localStorage.removeItem("socialure-admin-profile");
      window.sessionStorage.removeItem("socialure-admin-profile");
      const storage = rememberMe ? window.localStorage : window.sessionStorage;
      storage.setItem("socialure-admin-token", result.token);
      storage.setItem("socialure-admin-profile", JSON.stringify(result.admin || {}));

      // Show success as a toast on the destination page, without waiting in the modal.
      window.sessionStorage.setItem("socialure-login-toast", "Welcome back! You are signed in.");
      setPassword("");
      router.push("/admin/dashboard");
    } catch (error) {
      setMessage(error.message || "Unable to connect to the backend. Check that the API is running on port 5000.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !loading) onClose();
    }}>
      <section className="admin-login-modal" role="dialog" aria-modal="true" aria-labelledby="admin-login-title">
        <button className="admin-login-close" type="button" onClick={onClose} aria-label="Close admin login" disabled={loading}>
          <X size={23} strokeWidth={1.6} />
        </button>

        <div className="admin-login-emblem" aria-hidden="true">
          <LockKeyhole size={34} strokeWidth={2.4} />
        </div>
        <h2 id="admin-login-title">Admin Login</h2>
        <p className="admin-login-subtitle">Welcome back, Please login to your dashboard</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <div className="admin-login-input-wrap">
            <Mail size={22} strokeWidth={1.8} aria-hidden="true" />
            <input id="admin-email" name="email" type="email" autoComplete="username"
              placeholder="admin@yourdomain.com" value={email}
              onChange={(event) => setEmail(event.target.value)} required disabled={loading || authenticated} />
          </div>

          <label htmlFor="admin-password">Password</label>
          <div className="admin-login-input-wrap">
            <LockKeyhole size={21} strokeWidth={1.8} aria-hidden="true" />
            <input id="admin-password" name="password" type={showPassword ? "text" : "password"}
              autoComplete="current-password" placeholder="Enter your password" value={password}
              onChange={(event) => setPassword(event.target.value)} required disabled={loading || authenticated} />
            <button className="admin-password-toggle" type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"} disabled={loading || authenticated}>
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button className="admin-login-submit" type="submit" disabled={loading || authenticated}>
            {loading ? "Signing in..." : authenticated ? "Authenticated" : "Login to Dashboard"}
            {!loading && <ArrowRight size={19} />}
          </button>

          <div className="admin-login-options">
            <label className="admin-remember">
              <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} disabled={loading || authenticated} />
              <span>Remember me</span>
            </label>
            <button className="admin-forgot" type="button" onClick={() => {
              setMessage("Password reset is not configured yet. Please contact the site administrator.");
              setMessageType("error");
            }} disabled={loading || authenticated}>
              Forgot password?
            </button>
          </div>
          {message && <p className={`admin-login-message ${messageType === "success" ? "is-success" : "is-error"}`} role="status">{message}</p>}
          {authenticated && <button className="admin-login-dismiss" type="button" onClick={onClose}>Close</button>}
        </form>
      </section>
    </div>
  );
}
