import React, { useEffect, useState } from "react";
import { ArrowUpRight, Play, Pencil, X, RotateCcw, Upload, Check, Sparkles } from "lucide-react";
import PhilosophyCard, { PhilosophyDialog } from "../components/PhilosophyCard.jsx";
import { defaultPhilosophyCards, defaultPhilosophyHeading } from "../data/philosophyContent.js";
import "./philosophy.css";
import "./philosophy-layout-fix.css";
import "./philosophy-mobile-carousel.css";

const STORAGE_KEY = "aurelia-philosophy-content-v1";

function ConnectingLines({ mobile = false }) {
  const goldWave = mobile
    ? "M-30 205 C120 145 220 145 340 185 S560 225 700 180 S930 140 1080 180 S1320 150 1510 195"
    : "M-30 205 C65 105 155 55 265 138 S390 220 500 132 S630 32 720 145 S855 165 960 100 S1090 60 1190 145 S1375 85 1510 190";
  return (
    <svg className="philosophy-lines" viewBox="0 0 1500 570" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="philosophyGoldLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9b5d22" />
          <stop offset="48%" stopColor="#f4a52d" />
          <stop offset="100%" stopColor="#bd792b" />
        </linearGradient>
        <filter id="philosophyLineGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path className="philosophy-lines__halo" d={goldWave} />
      <path d={goldWave} />
      <path className="philosophy-lines__lower" d="M-35 390 C110 410 200 555 365 530 S565 405 690 435 S895 530 1040 430 S1300 370 1515 300" />
      {(mobile
        ? [[190,169],[440,194],[665,191],[900,157],[1135,177],[1335,169],[1470,190]]
        : [[190,86],[440,164],[665,45],[900,126],[1135,76],[1335,157],[1470,128]]
      ).map(([cx, cy], index) => (
        <g key={index} filter="url(#philosophyLineGlow)">
          <circle cx={cx} cy={cy} r="9" fill="#fff1c4" opacity=".7" />
          <circle cx={cx} cy={cy} r="6.5" fill="#bf792b" stroke="#e9a84b" strokeWidth="1.4" />
        </g>
      ))}
    </svg>
  );
}

function EditCardDialog({ card, onClose, onSave }) {
  const [draft, setDraft] = useState(card);
  const [uploadError, setUploadError] = useState("");
  useEffect(() => setDraft(card), [card]);
  if (!card) return null;

  const change = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Please use an image smaller than 2 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      change("image", String(reader.result));
      setUploadError("");
    };
    reader.onerror = () => setUploadError("This image could not be read. Try another file.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="philosophy-dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="philosophy-editor" role="dialog" aria-modal="true" aria-labelledby="philosophy-editor-title">
        <div className="philosophy-editor__top">
          <div><span className="philosophy-editor__eyebrow"><Sparkles size={14} /> CARD CUSTOMIZER</span><h3 id="philosophy-editor-title">Edit {card.number} / {card.title}</h3></div>
          <button className="philosophy-dialog__close" onClick={onClose} aria-label="Close editor"><X size={19} /></button>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); onSave(draft); }}>
          <div className="philosophy-editor__preview">
            <img src={draft.image} alt="Current card preview" />
            <div><strong>Live image preview</strong><span>Changes apply to this card when you save.</span></div>
          </div>
          <label>Card title<input value={draft.title} maxLength={32} onChange={(event) => change("title", event.target.value)} required /></label>
          <label>Short description<textarea value={draft.description} maxLength={180} rows={3} onChange={(event) => change("description", event.target.value)} required /></label>
          <label>Expanded detail<textarea value={draft.detail || ""} maxLength={500} rows={3} onChange={(event) => change("detail", event.target.value)} placeholder="Extra text shown when a visitor clicks the card" /></label>
          <label>Image URL<input value={draft.image.startsWith("data:") ? "" : draft.image} onChange={(event) => change("image", event.target.value)} placeholder="Paste an image URL, or upload below" /></label>
          <label className="philosophy-editor__upload"><Upload size={16} /><span>Choose a picture from your computer</span><input type="file" accept="image/*" onChange={handleImageUpload} /></label>
          {uploadError && <p className="philosophy-editor__error">{uploadError}</p>}
          <div className="philosophy-editor__actions">
            <button type="button" className="philosophy-editor__cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="philosophy-editor__save"><Check size={16} /> Save card</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function Philosophy() {
  const [cards, setCards] = useState(defaultPhilosophyCards);
  const [activeCard, setActiveCard] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const [activeHead, setActiveHead] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [isMobileCarousel, setIsMobileCarousel] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const updateViewport = () => setIsMobileCarousel(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  // Card anchor points are sampled from the actual gold SVG wave at runtime.
  const [waveSlots, setWaveSlots] = useState([
    { left: 0, top: "19%", scale: 0.94, opacity: 0.94 },
    { left: 17.4, top: "38%", scale: 0.96, opacity: 0.98 },
    { left: 34, top: "8%", scale: 1.02, opacity: 1 },
    { left: 50, top: "27%", scale: 0.96, opacity: 0.98 },
    { left: 65.6, top: "14%", scale: 1, opacity: 1 },
    { left: 82, top: "38%", scale: 0.94, opacity: 0.95 },
  ]);

  useEffect(() => {
    const measureWave = () => {
      const stage = document.querySelector(".philosophy-cards--carousel");
      const svg = stage?.querySelector(".philosophy-lines");
      const path = svg?.querySelector("path:not(.philosophy-lines__halo):not(.philosophy-lines__lower)");
      if (!stage || !svg || !path) return;
      const stageRect = stage.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;
      const totalLength = path.getTotalLength();
      const mobile = window.matchMedia("(max-width: 700px)").matches;
      const cardWidth = stageRect.width * (mobile ? 0.46 : 0.162);
      // On mobile, use two card-width-spaced anchor points; sample their exact Y from the same SVG gold wave.
      const centerFractions = mobile
        ? [0.23, 0.75]
        : [0.08, 0.246, 0.412, 0.578, 0.744, 0.91];
      const densePoints = Array.from({ length: 1201 }, (_, sampleIndex) => {
        const point = path.getPointAtLength((totalLength * sampleIndex) / 1200);
        return {
          x: svgRect.left + (point.x / viewBox.width) * svgRect.width,
          y: svgRect.top + (point.y / viewBox.height) * svgRect.height,
        };
      });
      const measured = centerFractions.map((fraction, index) => {
        const targetCenterX = stageRect.left + stageRect.width * fraction;
        const point = densePoints.reduce((nearest, candidate) =>
          Math.abs(candidate.x - targetCenterX) < Math.abs(nearest.x - targetCenterX) ? candidate : nearest
        );
        const left = ((targetCenterX - cardWidth / 2 - stageRect.left) / stageRect.width) * 100;

        // IMPORTANT: on mobile the hanging dot must sit ON the sampled gold path.
        // The thread is 40px tall, so the card top is exactly 40px below the path.
        const threadLength = mobile ? 40 : 34;
        const pathY = point.y - stageRect.top;
        const top = Math.max(0, pathY + threadLength);

        return {
          left,
          top: `${top}px`,
          pathY: `${pathY}px`,
          threadLength,
          scale: [0.94, 0.96, 1.02, 0.96, 1, 0.94][index],
          opacity: [0.94, 0.98, 1, 0.98, 1, 0.95][index],
        };
      });
      setWaveSlots(measured);
    };
    measureWave();
    const observer = new ResizeObserver(measureWave);
    const stage = document.querySelector(".philosophy-cards--carousel");
    if (stage) observer.observe(stage);
    window.addEventListener("resize", measureWave);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureWave);
    };
  }, []);

  useEffect(() => {
    if (carouselPaused || editingCard || activeCard) return undefined;
    // Keep two cards visible on mobile, but advance the carousel by ONE card each time.
    // This creates the staggered flow: 01+02 -> 02+03 -> 03+04 ... in a continuous loop.
    const step = 1;
    const timer = window.setInterval(() => setActiveHead((head) => (head + step) % cards.length), 1500);
    return () => window.clearInterval(timer);
  }, [carouselPaused, editingCard, activeCard, cards.length, isMobileCarousel]);

  const moveCarousel = (direction) => {
    // Manual navigation also advances one card at a time on mobile.
    setActiveHead((head) => (head + direction + cards.length) % cards.length);
  };

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const savedById = new Map(parsed.map((card) => [card.id, card]));
          setCards(defaultPhilosophyCards.map((card) => ({ ...card, ...(savedById.get(card.id) || {}) })));
        }
      }
    } catch (error) {
      console.warn("Could not load saved philosophy cards.", error);
    }
  }, []);

  const saveCard = (updatedCard) => {
    const updated = cards.map((card) => card.id === updatedCard.id ? updatedCard : card);
    setCards(updated);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setSavedNotice(true);
      window.setTimeout(() => setSavedNotice(false), 2600);
    } catch (error) {
      alert("This image is too large to save in browser storage. Try a smaller image (under 2 MB).");
    }
    setEditingCard(null);
  };

  const resetCards = () => {
    if (!window.confirm("Reset all nine cards to the original default content and pictures?")) return;
    setCards(defaultPhilosophyCards);
    window.localStorage.removeItem(STORAGE_KEY);
    setSavedNotice(false);
  };

  return (
    <section className="philosophy-section" id="philosophy">
      <div className="philosophy-atmosphere" />
      <div className="philosophy-intro">
        <div className="philosophy-eyebrow"><span>[ {defaultPhilosophyHeading.eyebrow} ]</span><i /></div>
        <h2>{defaultPhilosophyHeading.title}<em>{defaultPhilosophyHeading.accent === "Enduring Value." ? <>Enduring <span className="philosophy-value-word">Value.</span></> : defaultPhilosophyHeading.accent}</em></h2>
        <p>{defaultPhilosophyHeading.description}</p>
        <div className="philosophy-actions">
          <a className="philosophy-cta" href="#philosophy-cards">Explore our approach <ArrowUpRight size={15} /></a>
          <button className="philosophy-story" type="button" onClick={() => setActiveCard(cards[0])}><span><Play size={15} fill="currentColor" /></span><b>WATCH<br />OUR STORY</b></button>
        </div>
      </div>
      <div className="philosophy-edit-tools" aria-label="Card editing tools">
        <span><Pencil size={13} /> Hover over a card to edit it.</span>
        <button type="button" onClick={resetCards}><RotateCcw size={12} /> Reset cards</button>
        {savedNotice && <span className="philosophy-saved"><Check size={13} /> Saved in this browser</span>}
      </div>

      <div className="philosophy-handwriting" aria-label="Ideas, Design, Impact">
        <span>Ideas</span><span>Design</span><span>Impact</span>
        <svg viewBox="0 0 250 100" aria-hidden="true"><path d="M7 90 C60 15 125 -2 183 20 C230 38 213 65 180 79" /></svg>
      </div>
      <nav className="philosophy-side-nav" aria-label="Philosophy topics">
        <a href="#philosophy-cards">People</a><a href="#philosophy-cards">Brands</a><a href="#philosophy-cards">Technology</a><a href="#philosophy-cards">Growth</a><i />
      </nav>
      <a className="philosophy-scroll" href="#philosophy-cards" aria-label="Scroll to philosophy cards"><span><i /></span>SCROLL</a>

      <div
        className="philosophy-cards philosophy-cards--carousel"
        id="philosophy-cards"
        onMouseEnter={() => setCarouselPaused(true)}
        onMouseLeave={() => setCarouselPaused(false)}
        onFocusCapture={() => setCarouselPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setCarouselPaused(false);
        }}
      >
        <ConnectingLines mobile={isMobileCarousel} />
        {cards.map((card, index) => {
          const slot = (index - activeHead + cards.length) % cards.length;
          const visible = slot < (isMobileCarousel ? 2 : waveSlots.length);
          const config = waveSlots[slot] || { left: slot === 0 ? 0 : 52, top: "28px", scale: 1, opacity: 1 };
          const positionStyle = visible
            ? {
                left: `${config.left}%`, top: config.top,
                opacity: config.opacity,
                transform: `translate3d(0, 0, 0) scale(${config.scale})`,
                "--anchor-thread": `${config.threadLength || 34}px`,
                zIndex: 20 + (slot % 2), pointerEvents: "auto",
              }
            : {
                // Mobile pair carousel: new cards enter from the right; outgoing cards exit left along the gold track.
                left: isMobileCarousel ? (slot >= 7 ? "-60%" : "110%") : (slot === 6 ? "101%" : "-22%"),
                top: isMobileCarousel ? (waveSlots[slot % 2]?.top || "18%") : "18%",
                opacity: 0,
                transform: isMobileCarousel ? "translate3d(0, 0, 0) scale(.88)" : "scale(.72)",
                zIndex: 1, pointerEvents: "none",
              };
          return (
            <div className={`philosophy-card-slot philosophy-card-slot--${card.id} philosophy-card-slot--carousel`} key={card.id} data-carousel-slot={slot} style={positionStyle} aria-hidden={!visible}>
              <span className="philosophy-hanging-anchor" aria-hidden="true"><i /></span>
              <PhilosophyCard card={card} onOpen={setActiveCard} onEdit={setEditingCard} />
            </div>
          );
        })}
        <div className="philosophy-carousel-controls" aria-label="Philosophy carousel controls">
          <button type="button" onClick={() => moveCarousel(-1)} aria-label="Previous principles">←</button>
          <span>{String(activeHead + 1).padStart(2, "0")} <i /> 09</span>
          <button type="button" onClick={() => moveCarousel(1)} aria-label="Next principles">→</button>
        </div>
      </div>

      <div className="philosophy-bottom-copy">CRAFTING<br />BRANDS<br />FOR A BRIGHTER<br />TOMORROW.<i /></div>
      <div className="philosophy-seal" aria-label="Aurelia Creative Studio"><small>✦ AURELIA CREATIVE STUDIO ✦</small><b>A</b><span>IDEAS • DESIGN • IMPACT</span></div>

      <PhilosophyDialog card={activeCard} onClose={() => setActiveCard(null)} />
      <EditCardDialog card={editingCard} onClose={() => setEditingCard(null)} onSave={saveCard} />
    </section>
  );
}
