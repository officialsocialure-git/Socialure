import React, { useEffect, useState } from "react";
import {
  ArrowRight, Monitor, Sprout, Megaphone, Video, Package,
  ChartNoAxesColumnIncreasing, Pencil, X, Upload, Check
} from "lucide-react";
import "./services-showcase.css";
import "./services-red-accents.css";

const STORAGE_KEY = "aurelia-our-services-v1";
const defaults = [
  { id: "website", number: "01", title: "Brand Foundation", description: "Positioning, identity and a brand kit you can build on.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85", alt: "Brand foundation and strategy", icon: "monitor" },
  { id: "branding", number: "02", title: "The Website", description: "Modern, high-performing websites that turn visitors into customers.", image: "https://images.unsplash.com/photo-1634942536790-2534db3a2e7d?auto=format&fit=crop&w=1000&q=85", alt: "Website design and development", icon: "sprout" },
  { id: "pr", number: "03", title: "The Content Engine", description: "Creative content and social media strategy to keep your brand active and growing.", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1000&q=85", alt: "Content creation and media", icon: "megaphone" },
  { id: "ai-videos", number: "04", title: "Campaigns and Shoots", description: "Visual campaigns, product shoots and AI-powered videos that bring your story to life.", image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=1000&q=85", alt: "Campaign and video production", icon: "video" },
  { id: "brand-kit", number: "05", title: "Press and Presence", description: "Public relations, brand assets and social presence that amplify your credibility.", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=85", alt: "Press, brand assets and social presence", icon: "package" },
];
const iconMap = { monitor: Monitor, sprout: Sprout, megaphone: Megaphone, video: Video, package: Package, chart: ChartNoAxesColumnIncreasing };
const defaultHeading = { eyebrow: "OUR SERVICES", title: "Creative Solutions ", accent: "for Every Stage.", description: "From strategy and design to content and growth, we offer end-to-end creative services to help your brand stand out and scale." };

function ServiceEditor({ item, onClose, onSave }) {
  const [draft, setDraft] = useState(item);
  const [error, setError] = useState("");
  useEffect(() => setDraft(item), [item]);
  if (!item) return null;
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please choose an image file."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Please use an image smaller than 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { update("image", String(reader.result)); setError(""); };
    reader.onerror = () => setError("Could not read this image. Please try another.");
    reader.readAsDataURL(file);
  };
  return <div className="services-editor-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="services-editor" role="dialog" aria-modal="true" aria-labelledby="services-editor-title">
      <div className="services-editor-head">
        <div><span className="services-editor-kicker">✦ SERVICE CUSTOMIZER</span><h3 id="services-editor-title">Edit {item.title}</h3></div>
        <button type="button" className="services-editor-close" onClick={onClose} aria-label="Close editor"><X size={19} /></button>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
        <div className="services-editor-preview"><img src={draft.image} alt="Current service preview" /><span>Choose an image to update this service card.</span></div>
        <label>Service heading<input required maxLength={48} value={draft.title} onChange={(event) => update("title", event.target.value)} /></label>
        <label>Description<textarea required maxLength={180} rows={3} value={draft.description} onChange={(event) => update("description", event.target.value)} /></label>
        <label>Image URL<input value={draft.image.startsWith("data:") ? "" : draft.image} placeholder="Paste an image URL" onChange={(event) => update("image", event.target.value)} /></label>
        <label className="services-editor-upload"><Upload size={16} /> Upload photo from your computer<input type="file" accept="image/*" onChange={upload} /></label>
        {error && <p className="services-editor-error">{error}</p>}
        <div className="services-editor-actions"><button type="button" className="services-editor-cancel" onClick={onClose}>Cancel</button><button type="submit" className="services-editor-save"><Check size={16} /> Save changes</button></div>
      </form>
    </section>
  </div>;
}

export default function Services({ onOpenService }) {
  const [cards, setCards] = useState(defaults);
  const [heading, setHeading] = useState(defaultHeading);
  const [headingDraft, setHeadingDraft] = useState(defaultHeading);
  const [editing, setEditing] = useState(null);
  const [editingHeading, setEditingHeading] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.cards?.length === 5) setCards(saved.cards.map((card) => ({ ...card, title: defaults.find((item) => item.id === card.id)?.title || card.title })));
      if (saved?.heading) {
        const restoredHeading = {
          ...defaultHeading,
          ...saved.heading,
          title: saved.heading.title?.trim() || defaultHeading.title,
          accent: saved.heading.accent?.trim() || defaultHeading.accent,
          description: saved.heading.description?.trim() || defaultHeading.description,
        };
        setHeading(restoredHeading);
        setHeadingDraft(restoredHeading);
      }
    } catch (error) { console.warn("Could not load saved services.", error); }
  }, []);
  const persist = (nextCards, nextHeading) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ cards: nextCards, heading: nextHeading }));
      setNotice("Changes saved in this browser");
      window.setTimeout(() => setNotice(""), 2600);
    } catch { setNotice("Storage is full. Try a smaller image."); }
  };
  const saveCard = (updatedCard) => {
    const next = cards.map((card) => card.id === updatedCard.id ? updatedCard : card);
    setCards(next); persist(next, heading); setEditing(null);
  };
  const saveHeading = (event) => {
    event.preventDefault(); setHeading(headingDraft); persist(cards, headingDraft); setEditingHeading(false);
  };
  return <section className="services-showcase section" id="services">
    <div className="services-showcase-inner">
      <header className="services-showcase-heading">
        <div className="services-showcase-eyebrow"><i /><span className="services-showcase-eyebrow-text">{heading.eyebrow}</span><i /></div>
        <h2 className="services-five-ways-heading"><span className="services-five-ways-gold">Five ways</span> <span className="services-five-ways-cream">we work with</span> <span className="services-five-ways-red">you.</span></h2>
        <p>{heading.description?.trim() || defaultHeading.description}</p>
      </header>
      {notice && <div className="services-showcase-notice" role="status"><Check size={14} />{notice}</div>}
      <div className="sliding-services-panels" aria-label="Explore our services">
        {cards.map((card, index) => (
          <article className="sliding-service-slot" key={card.id}>
            <div
              className="sliding-service-panel"
              tabIndex={0}
              role="group"
              aria-label={card.title}
              onMouseEnter={(event) => { if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) event.currentTarget.classList.add("is-open"); }}
              onMouseLeave={(event) => { if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) event.currentTarget.classList.remove("is-open"); }}
              onClick={(event) => { if (event.target.closest(".sliding-service-explore")) return; if (window.matchMedia("(max-width: 620px)").matches) { event.currentTarget.classList.toggle("is-open"); } else { onOpenService?.(card.id); } }}
              onFocus={(event) => event.currentTarget.classList.add("is-open")}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.classList.remove("is-open"); }}
              onKeyDown={(event) => { if (event.key === "Escape") event.currentTarget.classList.remove("is-open"); }}
            >
              <div className="sliding-service-reveal">
                <img src={card.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.opacity = ".15"; }} />
                <span className="sliding-service-image-shade" />
              </div>
              <div className="sliding-service-door">
                <div className="sliding-service-copy">
                  <span className="sliding-service-number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{defaults.find((item) => item.id === card.id)?.title || card.title}</h3>
                  <span className="sliding-service-rule" />
                  <p>{card.description}</p>
                </div>
                <button type="button" className="sliding-service-explore" onClick={(event) => { event.stopPropagation(); onOpenService?.(card.id); }} aria-label={"Explore " + card.title}>
                  <span className="sliding-service-label">EXPLORE</span><span className="sliding-service-arrow" aria-hidden="true">→</span>
                </button>
                <span className="sliding-service-metal" aria-hidden="true" />
              </div>
              <span className="sliding-service-track" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </div>
    {editing && <ServiceEditor item={editing} onClose={() => setEditing(null)} onSave={saveCard} />}
    {editingHeading && <div className="services-editor-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setEditingHeading(false)}>
      <section className="services-editor" role="dialog" aria-modal="true" aria-labelledby="services-heading-editor-title">
        <div className="services-editor-head"><div><span className="services-editor-kicker">SECTION CUSTOMIZER</span><h3 id="services-heading-editor-title">Edit section heading</h3></div><button type="button" className="services-editor-close" onClick={() => setEditingHeading(false)} aria-label="Close editor"><X size={19} /></button></div>
        <form onSubmit={saveHeading}>
          <label>Eyebrow<input required value={headingDraft.eyebrow} onChange={(event) => setHeadingDraft({ ...headingDraft, eyebrow: event.target.value })} /></label>
          <label>Main heading<input required value={headingDraft.title} onChange={(event) => setHeadingDraft({ ...headingDraft, title: event.target.value })} /></label>
          <label>Highlighted heading<input required value={headingDraft.accent} onChange={(event) => setHeadingDraft({ ...headingDraft, accent: event.target.value })} /></label>
          <label>Section description<textarea required rows={3} value={headingDraft.description} onChange={(event) => setHeadingDraft({ ...headingDraft, description: event.target.value })} /></label>
          <div className="services-editor-actions"><button type="button" className="services-editor-cancel" onClick={() => setEditingHeading(false)}>Cancel</button><button type="submit" className="services-editor-save"><Check size={16} /> Save heading</button></div>
        </form>
      </section>
    </div>}
  </section>;
}
