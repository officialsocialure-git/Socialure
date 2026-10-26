"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Inbox, FolderKanban, Users, Settings, LogOut, Search,
  Bell, ChevronDown, Mail, UserRound, CheckCircle2, Clock3, Menu, X,
  Eye, Download, RefreshCw, ArrowUpRight
} from "lucide-react";
import "./dashboard.css";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const STATUSES = ["New", "Contacted", "In Progress", "Completed", "Closed"];

function getToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("socialure-admin-token") || window.sessionStorage.getItem("socialure-admin-token") || "";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({});
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [activeEnquiry, setActiveEnquiry] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [savingEnquiry, setSavingEnquiry] = useState(false);
  const [loginToast, setLoginToast] = useState("");
  const [newEnquiry, setNewEnquiry] = useState({ name: "", email: "", phone: "", company: "", service: "", message: "" });

  const logout = useCallback(() => {
    window.localStorage.removeItem("socialure-admin-token");
    window.sessionStorage.removeItem("socialure-admin-token");
    window.localStorage.removeItem("socialure-admin-profile");
    window.sessionStorage.removeItem("socialure-admin-profile");
    router.replace("/");
  }, [router]);

  const loadDashboard = useCallback(async () => {
    const token = getToken();
    if (!token) { router.replace("/"); return; }
    setLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [statsResponse, enquiriesResponse, profileResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/enquiries?page=1&limit=50`, { headers }),
        fetch(`${API_BASE_URL}/api/auth/me`, { headers })
      ]);
      if ([statsResponse, enquiriesResponse, profileResponse].some(response => response.status === 401 || response.status === 403)) {
        logout();
        return;
      }
      const [statsData, enquiriesData, profileData] = await Promise.all([
        statsResponse.json(), enquiriesResponse.json(), profileResponse.json()
      ]);
      if (!statsResponse.ok || !statsData.success) throw new Error(statsData.message || "Could not load dashboard stats.");
      if (!enquiriesResponse.ok || !enquiriesData.success) throw new Error(enquiriesData.message || "Could not load enquiries.");
      setStats(statsData.data);
      setEnquiries(enquiriesData.data || []);
      setAdmin(profileData.admin || profileData.data || JSON.parse(window.localStorage.getItem("socialure-admin-profile") || window.sessionStorage.getItem("socialure-admin-profile") || "{}"));
    } catch (err) {
      setError(err.message || "Could not connect to the server. Please check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, [router, logout]);

  useEffect(() => {
    const notice = window.sessionStorage.getItem("socialure-login-toast");
    if (notice) {
      setLoginToast(notice);
      window.sessionStorage.removeItem("socialure-login-toast");
      const timer = window.setTimeout(() => setLoginToast(""), 3600);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const filteredEnquiries = useMemo(() => enquiries.filter(item => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [item.name, item.email, item.service, item.message, item.company].some(value => String(value || "").toLowerCase().includes(query));
    return matchesSearch && (status === "All" || item.status === status);
  }), [enquiries, search, status]);

  async function updateStatus(id, nextStatus) {
    const token = getToken();
    setUpdatingId(id);
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Status update failed.");
      setEnquiries(current => current.map(item => (item._id === id ? { ...item, status: nextStatus } : item)));
      loadDashboard();
    } catch (err) {
      setError(err.message || "Status update failed.");
    } finally {
      setUpdatingId("");
    }
  }

  async function createEnquiry(event) {
    event.preventDefault();
    setSavingEnquiry(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEnquiry)
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not add enquiry.");
      setShowCreate(false);
      setNewEnquiry({ name: "", email: "", phone: "", company: "", service: "", message: "" });
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not add enquiry.");
    } finally {
      setSavingEnquiry(false);
    }
  }

  async function deleteEnquiry(item) {
    if (!window.confirm(`Delete the enquiry from ${item.name}? This cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not delete enquiry.");
      setActiveEnquiry(null);
      await loadDashboard();
    } catch (err) {
      setError(err.message || "Could not delete enquiry.");
    }
  }

  async function exportCsv() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries/export`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!response.ok) throw new Error("Could not export enquiries.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "socialure-enquiries.csv";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) { setError(err.message); }
  }

  const cards = [
    { label: "Total Enquiries", value: stats?.totalEnquiries ?? "—", icon: Mail, tone: "rose" },
    { label: "New Enquiries", value: stats?.newEnquiries ?? "—", icon: Inbox, tone: "green" },
    { label: "In Progress", value: stats?.activeProjects ?? "—", icon: FolderKanban, tone: "gold" },
    { label: "Total Clients", value: stats?.totalClients ?? "—", icon: Users, tone: "blue" }
  ];

  return (
    <main className="sd-shell">
      <aside className={`sd-sidebar ${mobileMenu ? "is-open" : ""}`}>
        <div className="sd-brand"><span>socialure</span><button onClick={() => setMobileMenu(false)} className="sd-mobile-close" aria-label="Close menu"><X size={20}/></button></div>
        <nav className="sd-nav" aria-label="Admin navigation">
          <a className="active" href="/admin/dashboard" onClick={() => setMobileMenu(false)}><LayoutDashboard size={19}/>Dashboard</a>
          <a href="/admin/dashboard#enquiries" onClick={() => setMobileMenu(false)}><Inbox size={19}/>Enquiries</a>
          <a href="/admin/contacts" onClick={() => setMobileMenu(false)}><Users size={19}/>Contacts</a>
          <a href="/admin/settings" onClick={() => setMobileMenu(false)}><Settings size={19}/>Settings</a>
        </nav>
        <div className="sd-sidebar-bottom">
          <div className="sd-avatar">{(admin.name || admin.email || "A").slice(0,1).toUpperCase()}</div>
          <div className="sd-admin-label"><strong>{admin.name || "Admin"}</strong><span>Administrator</span></div>
          <button onClick={logout} aria-label="Logout" title="Logout"><LogOut size={18}/></button>
        </div>
      </aside>

      {mobileMenu && <button className="sd-mobile-overlay" aria-label="Close menu" onClick={() => setMobileMenu(false)} />}
      <section className="sd-main">
        {loginToast && <div className="sd-toast" role="status"><span className="sd-toast-icon"><CheckCircle2 size={19} /></span><span><strong>Login successful</strong><small>{loginToast}</small></span><button onClick={() => setLoginToast("")} aria-label="Dismiss notification"><X size={17} /></button></div>}
        <header className="sd-topbar">
          <button className="sd-menu-button" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu size={22}/></button>
          <div className="sd-welcome"><h1>Welcome back, {admin.name?.split(" ")[0] || "Admin"} <span>👋</span></h1><p>Here’s a quick look at your business.</p></div>
          <div className="sd-top-actions">
            <button className="sd-icon-button" title="Refresh dashboard" onClick={loadDashboard}><RefreshCw size={18}/></button>
            <span className="sd-top-divider"/>
            <div className="sd-profile-chip"><span className="sd-avatar">{(admin.name || admin.email || "A").slice(0,1).toUpperCase()}</span><span>{admin.name || "Admin"}</span><ChevronDown size={15}/></div>
          </div>
        </header>

        {error && <div className="sd-alert" role="alert"><span>{error}</span><button onClick={() => setError("")}>Dismiss</button></div>}

        <section className="sd-stats-grid" id="overview" aria-label="Overview statistics">
          {cards.map(({ label, value, icon: Icon, tone }) => <article className={`sd-stat-card tone-${tone}`} key={label}>
            <div className="sd-stat-icon"><Icon size={21}/></div>
            <div><p>{label}</p><strong>{loading ? "…" : value}</strong></div>
          </article>)}
        </section>

        <section className="sd-content-grid">
          <article className="sd-panel sd-enquiries-panel" id="enquiries">
            <div className="sd-panel-heading">
              <div><h2>Latest Enquiries</h2><p>View requests and update their status.</p></div>
              <div className="sd-heading-actions"><button className="sd-add-button" onClick={() => setShowCreate(true)}>+ Add Enquiry</button><button className="sd-export-button" onClick={exportCsv}><Download size={16}/> Export CSV</button></div>
            </div>
            <div className="sd-toolbar">
              <label className="sd-search"><Search size={17}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search enquiries..." aria-label="Search enquiries"/></label>
              <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter by status">
                <option>All</option>{STATUSES.map(item => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div className="sd-table-wrap">
              <table className="sd-table">
                <thead><tr><th>Contact</th><th>Service</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {!loading && filteredEnquiries.map(item => <tr key={item._id}>
                    <td><strong>{item.name}</strong><span>{item.email}</span></td>
                    <td>{item.service || "General enquiry"}</td>
                    <td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"}) : "—"}</td>
                    <td><select className={`sd-status status-${(item.status || "New").toLowerCase().replaceAll(" ","-")}`} value={item.status || "New"} disabled={updatingId === item._id} onChange={event => updateStatus(item._id,event.target.value)} aria-label={`Status for ${item.name}`}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></td>
                    <td><div className="sd-row-actions"><button title="View enquiry" onClick={() => setActiveEnquiry(item)}><Eye size={16}/></button><button title="Delete enquiry" className="sd-delete-button" onClick={() => deleteEnquiry(item)}><X size={16}/></button></div></td>
                  </tr>)}
                  {!loading && filteredEnquiries.length === 0 && <tr><td colSpan="5" className="sd-empty">No enquiries found. Try another search or add an enquiry.</td></tr>}
                  {loading && <tr><td colSpan="5" className="sd-empty">Loading enquiries…</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="sd-table-footer"><span>Showing {filteredEnquiries.length} {filteredEnquiries.length === 1 ? "enquiry" : "enquiries"}</span><button onClick={loadDashboard}><RefreshCw size={14}/> Refresh</button></div>
          </article>

          <aside className="sd-side-column">
            <article className="sd-panel sd-summary-panel">
              <div className="sd-panel-heading"><div><h2>Enquiry Summary</h2><p>Current status breakdown</p></div><ArrowUpRight size={19}/></div>
              {(stats?.statusBreakdown || []).length ? stats.statusBreakdown.map(item => {
                const total = stats.totalEnquiries || 1;
                return <div className="sd-breakdown-row" key={item.status}><div><span>{item.status || "Unassigned"}</span><strong>{item.count}</strong></div><div className="sd-progress"><span style={{width:`${Math.min(100,(item.count/total)*100)}%`}}/></div></div>;
              }) : <p className="sd-muted">{loading ? "Loading summary…" : "No enquiry data yet."}</p>}
            </article>
            <article className="sd-panel sd-help-panel" id="settings">
              <div className="sd-help-icon"><CheckCircle2 size={21}/></div>
              <h2>Keep it organised</h2>
              <p>Update each enquiry’s status as you contact clients so nothing gets missed.</p>
              <button onClick={() => setShowCreate(true)}>+ Add an enquiry</button>
            </article>
          </aside>
        </section>
        <footer className="sd-footer">Socialure Admin <span>•</span> Simple workspace for your enquiries</footer>

        {showCreate && <div className="sd-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !savingEnquiry) setShowCreate(false); }}>
          <section className="sd-modal" role="dialog" aria-modal="true" aria-labelledby="sd-create-title">
            <div className="sd-modal-head"><div><h2 id="sd-create-title">Add Enquiry</h2><p>Save a new client request.</p></div><button onClick={() => setShowCreate(false)} disabled={savingEnquiry} aria-label="Close"><X size={20}/></button></div>
            <form onSubmit={createEnquiry} className="sd-form-grid">
              <label>Full name *<input required minLength={2} maxLength={120} value={newEnquiry.name} onChange={e => setNewEnquiry({...newEnquiry,name:e.target.value})} placeholder="Customer name"/></label>
              <label>Email address *<input required type="email" value={newEnquiry.email} onChange={e => setNewEnquiry({...newEnquiry,email:e.target.value})} placeholder="name@example.com"/></label>
              <label>Phone<input value={newEnquiry.phone} onChange={e => setNewEnquiry({...newEnquiry,phone:e.target.value})} placeholder="Phone number"/></label>
              <label>Company<input value={newEnquiry.company} onChange={e => setNewEnquiry({...newEnquiry,company:e.target.value})} placeholder="Company (optional)"/></label>
              <label className="sd-form-wide">Service<input value={newEnquiry.service} onChange={e => setNewEnquiry({...newEnquiry,service:e.target.value})} placeholder="Website development, branding..."/></label>
              <label className="sd-form-wide">Message *<textarea required minLength={5} maxLength={5000} rows={4} value={newEnquiry.message} onChange={e => setNewEnquiry({...newEnquiry,message:e.target.value})} placeholder="What does the client need?"/></label>
              <div className="sd-form-actions"><button type="button" className="sd-cancel-button" onClick={() => setShowCreate(false)} disabled={savingEnquiry}>Cancel</button><button type="submit" className="sd-add-button" disabled={savingEnquiry}>{savingEnquiry ? "Saving…" : "Save Enquiry"}</button></div>
            </form>
          </section>
        </div>}

        {activeEnquiry && <div className="sd-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setActiveEnquiry(null); }}>
          <section className="sd-modal" role="dialog" aria-modal="true" aria-labelledby="sd-detail-title">
            <div className="sd-modal-head"><div><h2 id="sd-detail-title">Enquiry Details</h2><p>Client request information</p></div><button onClick={() => setActiveEnquiry(null)} aria-label="Close"><X size={20}/></button></div>
            <div className="sd-detail-list">
              <div><span>Name</span><strong>{activeEnquiry.name}</strong></div><div><span>Email</span><strong>{activeEnquiry.email}</strong></div>
              <div><span>Phone</span><strong>{activeEnquiry.phone || "Not provided"}</strong></div><div><span>Company</span><strong>{activeEnquiry.company || "Not provided"}</strong></div>
              <div><span>Service</span><strong>{activeEnquiry.service || "General enquiry"}</strong></div><div><span>Budget</span><strong>{activeEnquiry.budget || "Not provided"}</strong></div><div><span>Source</span><strong>{activeEnquiry.source || "Website"}</strong></div>
              <div><span>Status</span><strong>{activeEnquiry.status || "New"}</strong></div><div><span>Date</span><strong>{activeEnquiry.createdAt ? new Date(activeEnquiry.createdAt).toLocaleString() : "—"}</strong></div>
              <div className="sd-detail-message"><span>Message</span><p>{activeEnquiry.message}</p></div>
            </div>
            <div className="sd-form-actions"><button className="sd-cancel-button" onClick={() => setActiveEnquiry(null)}>Close</button><button className="sd-danger-button" onClick={() => deleteEnquiry(activeEnquiry)}>Delete Enquiry</button></div>
          </section>
        </div>}
      </section>
    </main>
  );
}
