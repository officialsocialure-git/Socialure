"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Inbox, Users, Settings, LogOut, Search, Plus, Menu, X, Pencil, Trash2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import "../dashboard/dashboard.css";

const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const blank = { name: "", email: "", phone: "", company: "", notes: "" };
function token() { return typeof window === "undefined" ? "" : localStorage.getItem("socialure-admin-token") || sessionStorage.getItem("socialure-admin-token") || ""; }

export default function ContactsPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState({});
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  const [menu, setMenu] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("socialure-admin-token"); sessionStorage.removeItem("socialure-admin-token");
    localStorage.removeItem("socialure-admin-profile"); sessionStorage.removeItem("socialure-admin-profile");
    router.replace("/");
  }, [router]);

  const load = useCallback(async (nextPage = page) => {
    if (!token()) { router.replace("/"); return; }
    setLoading(true); setError("");
    try {
      const headers = { Authorization: `Bearer ${token()}` };
      const [res, profileRes] = await Promise.all([
        fetch(`${API}/api/contacts?page=${nextPage}&limit=50&search=${encodeURIComponent(query)}`, { headers }),
        fetch(`${API}/api/auth/me`, { headers })
      ]);
      if (res.status === 401 || res.status === 403 || profileRes.status === 401 || profileRes.status === 403) { logout(); return; }
      const [result, profile] = await Promise.all([res.json(), profileRes.json()]);
      if (!res.ok || !result.success) throw new Error(result.message || "Unable to load contacts.");
      setItems(result.data || []); setTotal(result.pagination?.total || 0); setPages(Math.max(1, result.pagination?.pages || 1)); setPage(nextPage);
      setAdmin(profile.admin || {});
    } catch (e) { setError(e.message || "Could not connect to the backend."); }
    finally { setLoading(false); }
  }, [page, query, router, logout]);

  useEffect(() => { const t = setTimeout(() => load(1), 250); return () => clearTimeout(t); }, [query]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => { setEditing(null); setForm(blank); setError(""); setNotice(""); setModal(true); };
  const openEdit = item => { setEditing(item); setForm({ name:item.name || "", email:item.email || "", phone:item.phone || "", company:item.company || "", notes:item.notes || "" }); setError(""); setNotice(""); setModal(true); };

  async function save(event) {
    event.preventDefault(); setSaving(true); setError(""); setNotice("");
    try {
      const res = await fetch(editing ? `${API}/api/contacts/${editing._id}` : `${API}/api/contacts`, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not save contact.");
      setModal(false); setNotice(editing ? "Contact updated successfully." : "Contact added successfully."); await load(1);
    } catch(e) { setError(e.message || "Could not save contact."); }
    finally { setSaving(false); }
  }

  async function remove(item) {
    if (!window.confirm(`Delete contact ${item.name}? This cannot be undone.`)) return;
    setError(""); setNotice("");
    try {
      const res = await fetch(`${API}/api/contacts/${item._id}`, { method:"DELETE", headers:{ Authorization:`Bearer ${token()}` } });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not delete contact.");
      setNotice("Contact deleted."); await load(page);
    } catch(e) { setError(e.message || "Could not delete contact."); }
  }

  const initials = name => (name || "?").split(/\s+/).slice(0,2).map(part => part[0]).join("").toUpperCase();
  return <main className="sd-shell">
    <aside className={`sd-sidebar ${menu ? "is-open" : ""}`}>
      <div className="sd-brand"><span>socialure</span><button className="sd-mobile-close" onClick={() => setMenu(false)} aria-label="Close menu"><X size={20}/></button></div>
      <nav className="sd-nav" aria-label="Admin navigation">
        <a href="/admin/dashboard"><LayoutDashboard size={19}/>Dashboard</a><a href="/admin/dashboard#enquiries"><Inbox size={19}/>Enquiries</a>
        <a className="active" href="/admin/contacts"><Users size={19}/>Contacts</a><a href="/admin/settings"><Settings size={19}/>Settings</a>
      </nav>
      <div className="sd-sidebar-bottom"><div className="sd-avatar">{initials(admin.name || "Admin")}</div><div className="sd-admin-label"><strong>{admin.name || "Admin"}</strong><span>Administrator</span></div><button onClick={logout} title="Logout" aria-label="Logout"><LogOut size={18}/></button></div>
    </aside>
    {menu && <button className="sd-mobile-overlay" onClick={() => setMenu(false)} aria-label="Close menu"/>}
    <section className="sd-main">
      <header className="sd-topbar"><button className="sd-menu-button" onClick={() => setMenu(true)} aria-label="Open menu"><Menu size={22}/></button><div className="sd-welcome"><h1>Contacts</h1><p>Keep your client details organised in one place.</p></div><div className="sd-top-actions"><button className="sd-icon-button" onClick={() => load(page)} title="Refresh contacts"><RefreshCw size={18}/></button><div className="sd-profile-chip"><span className="sd-avatar">{initials(admin.name || "Admin")}</span><span>{admin.name || "Admin"}</span></div></div></header>
      {error && <div className="sd-alert" role="alert"><span>{error}</span><button onClick={() => setError("")}>Dismiss</button></div>}
      {notice && <div className="sd-notice" role="status">{notice}<button onClick={() => setNotice("")}>Dismiss</button></div>}
      <section className="sd-stats-grid sd-contact-stats"><article className="sd-stat-card tone-green"><div className="sd-stat-icon"><Users size={21}/></div><div><p>Total Contacts</p><strong>{loading ? "…" : total}</strong></div></article><article className="sd-stat-card tone-gold"><div className="sd-stat-icon"><Inbox size={21}/></div><div><p>Page</p><strong>{page} / {pages}</strong></div></article></section>
      <article className="sd-panel sd-enquiries-panel">
        <div className="sd-panel-heading"><div><h2>Client Directory</h2><p>Add, search, update or remove contacts.</p></div><button className="sd-add-button" onClick={openNew}><Plus size={16}/> Add Contact</button></div>
        <div className="sd-toolbar"><label className="sd-search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name, email, company or phone..." aria-label="Search contacts"/></label></div>
        <div className="sd-table-wrap"><table className="sd-table sd-contacts-table"><thead><tr><th>Contact</th><th>Company</th><th>Phone</th><th>Added</th><th>Actions</th></tr></thead><tbody>
          {loading && <tr><td colSpan="5" className="sd-empty">Loading contacts…</td></tr>}
          {!loading && items.map(item => <tr key={item._id}><td><div className="sd-contact-cell"><span className="sd-contact-initials">{initials(item.name)}</span><div><strong>{item.name}</strong><span>{item.email}</span></div></div></td><td>{item.company || "—"}</td><td>{item.phone || "—"}</td><td>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—"}</td><td><div className="sd-row-actions"><button title="Edit contact" onClick={() => openEdit(item)}><Pencil size={15}/></button><button title="Delete contact" className="sd-delete-button" onClick={() => remove(item)}><Trash2 size={15}/></button></div></td></tr>)}
          {!loading && !items.length && <tr><td colSpan="5" className="sd-empty">No contacts yet. Add your first client contact.</td></tr>}
        </tbody></table></div>
        <div className="sd-table-footer"><span>{total} contact{total === 1 ? "" : "s"}</span><div className="sd-pager"><button disabled={page <= 1 || loading} onClick={() => load(page-1)} aria-label="Previous page"><ChevronLeft size={16}/></button><span>{page} / {pages}</span><button disabled={page >= pages || loading} onClick={() => load(page+1)} aria-label="Next page"><ChevronRight size={16}/></button></div></div>
      </article>
      <footer className="sd-footer">Socialure Admin <span>•</span> Contacts directory</footer>
      {modal && <div className="sd-modal-backdrop" onMouseDown={e => { if(e.target === e.currentTarget && !saving) setModal(false); }}><section className="sd-modal" role="dialog" aria-modal="true" aria-labelledby="sd-contact-modal-title">
        <div className="sd-modal-head"><div><h2 id="sd-contact-modal-title">{editing ? "Edit Contact" : "Add Contact"}</h2><p>Contact information is saved to your database.</p></div><button onClick={() => setModal(false)} disabled={saving} aria-label="Close"><X size={20}/></button></div>
        <form className="sd-form-grid" onSubmit={save}>
          <label>Full name *<input required minLength={2} maxLength={120} value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Client name"/></label>
          <label>Email address *<input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="client@example.com"/></label>
          <label>Phone<input value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} maxLength={40} placeholder="Phone number"/></label>
          <label>Company<input value={form.company} onChange={e => setForm({...form,company:e.target.value})} maxLength={160} placeholder="Company name"/></label>
          <label className="sd-form-wide">Notes<textarea rows={3} value={form.notes} onChange={e => setForm({...form,notes:e.target.value})} maxLength={3000} placeholder="Optional notes"/></label>
          <div className="sd-form-actions"><button type="button" className="sd-cancel-button" onClick={() => setModal(false)} disabled={saving}>Cancel</button><button type="submit" className="sd-add-button" disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Add Contact"}</button></div>
        </form>
      </section></div>}
    </section>
  </main>;
}
