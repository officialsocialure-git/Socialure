"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, Users, Settings, LogOut, Menu, X, UserRound, LockKeyhole, ShieldCheck, Save, RefreshCw } from "lucide-react";
import "../dashboard/dashboard.css";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
function token() { return typeof window === "undefined" ? "" : localStorage.getItem("socialure-admin-token") || sessionStorage.getItem("socialure-admin-token") || ""; }

export default function AdminSettingsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({});
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [menu, setMenu] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("socialure-admin-token"); sessionStorage.removeItem("socialure-admin-token");
    localStorage.removeItem("socialure-admin-profile"); sessionStorage.removeItem("socialure-admin-profile");
    router.replace("/");
  }, [router]);

  const load = useCallback(async () => {
    if (!token()) { router.replace("/"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${token()}` } });
      if (res.status === 401 || res.status === 403) { logout(); return; }
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not load admin profile.");
      setAdmin(result.admin || {}); setProfile({ name: result.admin?.name || "", email: result.admin?.email || "" });
    } catch(e) { setError(e.message || "Could not connect to the backend."); }
    finally { setLoading(false); }
  }, [router, logout]);

  useEffect(() => { load(); }, [load]);

  async function saveProfile(event) {
    event.preventDefault(); setSavingProfile(true); setError(""); setNotice("");
    try {
      const res = await fetch(`${API}/api/auth/profile`, { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token()}` }, body:JSON.stringify(profile) });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Profile update failed.");
      setAdmin(result.admin); setProfile({ name:result.admin.name, email:result.admin.email });
      const storage = localStorage.getItem("socialure-admin-token") ? localStorage : sessionStorage;
      storage.setItem("socialure-admin-profile", JSON.stringify(result.admin));
      setNotice("Profile saved successfully.");
    } catch(e) { setError(e.message || "Profile update failed."); }
    finally { setSavingProfile(false); }
  }

  async function changePassword(event) {
    event.preventDefault(); setError(""); setNotice("");
    if (passwords.newPassword !== passwords.confirmPassword) { setError("New password and confirmation do not match."); return; }
    if (passwords.newPassword.length < 12) { setError("Use a password with at least 12 characters."); return; }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API}/api/auth/password`, { method:"PATCH", headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token()}` }, body:JSON.stringify({ currentPassword:passwords.currentPassword, newPassword:passwords.newPassword }) });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Password update failed.");
      setPasswords({ currentPassword:"", newPassword:"", confirmPassword:"" });
      setNotice("Password changed successfully.");
    } catch(e) { setError(e.message || "Password update failed."); }
    finally { setSavingPassword(false); }
  }

  const initials = (admin.name || "A").slice(0,1).toUpperCase();
  return <main className="sd-shell">
    <aside className={`sd-sidebar ${menu ? "is-open" : ""}`}>
      <div className="sd-brand"><span>socialure</span><button className="sd-mobile-close" onClick={() => setMenu(false)} aria-label="Close menu"><X size={20}/></button></div>
      <nav className="sd-nav" aria-label="Admin navigation"><a href="/admin/dashboard"><LayoutDashboard size={19}/>Dashboard</a><a href="/admin/dashboard#enquiries"><Inbox size={19}/>Enquiries</a><a href="/admin/contacts"><Users size={19}/>Contacts</a><a className="active" href="/admin/settings"><Settings size={19}/>Settings</a></nav>
      <div className="sd-sidebar-bottom"><div className="sd-avatar">{initials}</div><div className="sd-admin-label"><strong>{admin.name || "Admin"}</strong><span>Administrator</span></div><button onClick={logout} title="Logout" aria-label="Logout"><LogOut size={18}/></button></div>
    </aside>
    {menu && <button className="sd-mobile-overlay" onClick={() => setMenu(false)} aria-label="Close menu"/>}
    <section className="sd-main">
      <header className="sd-topbar"><button className="sd-menu-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={22}/></button><div className="sd-welcome"><h1>Settings</h1><p>Manage your admin profile and account security.</p></div><div className="sd-top-actions"><button className="sd-icon-button" onClick={load} title="Refresh settings"><RefreshCw size={18}/></button><div className="sd-profile-chip"><span className="sd-avatar">{initials}</span><span>{admin.name || "Admin"}</span></div></div></header>
      {error && <div className="sd-alert" role="alert"><span>{error}</span><button onClick={() => setError("")}>Dismiss</button></div>}
      {notice && <div className="sd-notice" role="status">{notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}
      <div className="sd-settings-grid">
        <article className="sd-panel sd-settings-card">
          <div className="sd-settings-heading"><span className="sd-settings-icon tone-green"><UserRound size={21}/></span><div><h2>Admin Profile</h2><p>Update the name and email used for your admin account.</p></div></div>
          <form className="sd-form-grid sd-settings-form" onSubmit={saveProfile}>
            <label className="sd-form-wide">Full name<input required minLength={2} maxLength={100} value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})} placeholder="Your name" disabled={loading}/></label>
            <label className="sd-form-wide">Email address<input required type="email" value={profile.email} onChange={e => setProfile({...profile,email:e.target.value})} placeholder="admin@example.com" disabled={loading}/></label>
            <div className="sd-form-actions"><button className="sd-add-button" type="submit" disabled={savingProfile || loading}><Save size={16}/>{savingProfile ? "Saving…" : "Save Profile"}</button></div>
          </form>
          <div className="sd-account-meta"><span>Account role</span><strong>{admin.role || "admin"}</strong><span>Last login</span><strong>{admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "Not available"}</strong></div>
        </article>
        <article className="sd-panel sd-settings-card">
          <div className="sd-settings-heading"><span className="sd-settings-icon tone-gold"><LockKeyhole size={21}/></span><div><h2>Change Password</h2><p>Use at least 12 characters and avoid reusing an old password.</p></div></div>
          <form className="sd-form-grid sd-settings-form" onSubmit={changePassword}>
            <label className="sd-form-wide">Current password<input type="password" autoComplete="current-password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords,currentPassword:e.target.value})} placeholder="Enter current password"/></label>
            <label className="sd-form-wide">New password<input type="password" autoComplete="new-password" minLength={12} maxLength={200} required value={passwords.newPassword} onChange={e => setPasswords({...passwords,newPassword:e.target.value})} placeholder="At least 12 characters"/></label>
            <label className="sd-form-wide">Confirm new password<input type="password" autoComplete="new-password" minLength={12} maxLength={200} required value={passwords.confirmPassword} onChange={e => setPasswords({...passwords,confirmPassword:e.target.value})} placeholder="Re-enter new password"/></label>
            <div className="sd-form-actions"><button className="sd-add-button" type="submit" disabled={savingPassword}><ShieldCheck size={16}/>{savingPassword ? "Updating…" : "Update Password"}</button></div>
          </form>
        </article>
      </div>
      <footer className="sd-footer">Socialure Admin <span>•</span> Account settings</footer>
    </section>
  </main>;
}
