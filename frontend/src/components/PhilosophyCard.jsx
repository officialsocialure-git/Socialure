import React from "react";
import {
  Compass, Lightbulb, Settings, Handshake, ChartNoAxesColumnIncreasing,
  Expand, Pencil, ArrowUpRight, X
} from "lucide-react";

const icons = {
  compass: Compass,
  lightbulb: Lightbulb,
  settings: Settings,
  handshake: Handshake,
  chart: ChartNoAxesColumnIncreasing,
  expand: Expand,
};

export default function PhilosophyCard({ card, onOpen, onEdit }) {
  const Icon = icons[card.icon] || Compass;

  return (
    <article className={`philosophy-card philosophy-card--${card.id}`}>
      <button
        className="philosophy-card__open"
        type="button"
        onClick={() => onOpen(card)}
        aria-label={`Read more about ${card.title}`}
      >
        <span className="philosophy-card__heading">
          <span className="philosophy-card__number">{card.number}</span>
          <span className="philosophy-card__slash">/</span>
          <span className="philosophy-card__title">{card.title}</span>
          <span className="philosophy-card__icon"><Icon size={19} strokeWidth={1.6} /></span>
        </span>
        <span className="philosophy-card__description">{card.description}</span>
        <span className="philosophy-card__image-wrap">
          <img
            className="philosophy-card__image"
            src={card.image}
            alt={card.imageAlt || ""}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.opacity = "0";
              event.currentTarget.parentElement.classList.add("image-fallback");
            }}
          />
          <span className="philosophy-card__image-caption">Explore principle <ArrowUpRight size={14} /></span>
        </span>
      </button>
      <button className="philosophy-card__edit" type="button" onClick={() => onEdit(card)} aria-label={`Edit ${card.title} card`} title="Edit card content and image">
        <Pencil size={13} />
      </button>
    </article>
  );
}

export function PhilosophyDialog({ card, onClose }) {
  if (!card) return null;
  const Icon = icons[card.icon] || Compass;
  return (
    <div className="philosophy-dialog-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="philosophy-dialog philosophy-dialog--detail" role="dialog" aria-modal="true" aria-labelledby="philosophy-dialog-title">
        <button className="philosophy-dialog__close" onClick={onClose} aria-label="Close details"><X size={19} /></button>
        <div className="philosophy-dialog__image"><img src={card.image} alt={card.imageAlt || ""} /></div>
        <div className="philosophy-dialog__body">
          <span className="philosophy-dialog__eyebrow"><Icon size={16} /> {card.number} / {card.title}</span>
          <h3 id="philosophy-dialog-title">{card.title}</h3>
          <p>{card.detail || card.description}</p>
          <button className="philosophy-dialog__done" onClick={onClose}>Back to philosophy <ArrowUpRight size={15} /></button>
        </div>
      </section>
    </div>
  );
}
