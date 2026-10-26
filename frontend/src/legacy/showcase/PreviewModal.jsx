import React, { useEffect } from "react";
import { X } from "lucide-react";
import AnimatedVisual from "./AnimatedVisual.jsx";

export default function PreviewModal({ concept, onClose }) {
  useEffect(() => {
    if (!concept) return;
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [concept, onClose]);

  if (!concept) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="concept-modal" role="dialog" aria-modal="true" aria-label={concept.title} onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close preview"><X /></button>
        <div className="modal-visual"><AnimatedVisual kind={concept.kind} large /></div>
        <div className="modal-copy">
          <span className="concept-id">{concept.id} / MOTION STUDY</span>
          <h2>{concept.title}</h2>
          <p>{concept.subtitle}. A visual direction inspired by the connected worlds of brand identity, digital commerce and creative storytelling.</p>
        </div>
      </div>
    </div>
  );
}