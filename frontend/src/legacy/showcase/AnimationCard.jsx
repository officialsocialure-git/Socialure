import React from "react";
import { ArrowUpRight } from "lucide-react";
import AnimatedVisual from "./AnimatedVisual.jsx";

export default function AnimationCard({ concept, onPreview }) {
  return (
    <button className="concept-card" onClick={() => onPreview(concept)} aria-label={`Preview ${concept.title}`}>
      <div className="concept-visual">
        <AnimatedVisual kind={concept.kind} />
        <span className="preview-button">VIEW CONCEPT <ArrowUpRight size={12} /></span>
      </div>
      <div className="concept-info">
        <span className="concept-id">{concept.id} / MOTION STUDY</span>
        <h3>{concept.title}</h3>
        <p>{concept.subtitle}</p>
      </div>
    </button>
  );
}