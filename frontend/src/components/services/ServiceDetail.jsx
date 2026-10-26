import React from "react";
import { ArrowLeft } from "lucide-react";
import "./service-detail.css";
import { services } from "./serviceData.js";

export default function ServiceDetail({ serviceId = "website", onBack }) {
  const service = services[serviceId] || services.website;

  const startProject = () => {
    const subject = encodeURIComponent(`Project enquiry — ${service.label}`);
    const body = encodeURIComponent(`Hi Offmint,\n\nI'd like to discuss ${service.label.toLowerCase()} for my brand.\n\nBrand / project name:\nWhat I need:\nIdeal timeline:\n\nThank you.`);
    window.location.href = `mailto:hello@offmint.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="service-detail-page">
      <section className="service-detail-panel" aria-labelledby="service-detail-title">
        <button type="button" className="service-detail-back" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={1.8} />
          <span>Back</span>
        </button>

        <div className="service-detail-eyebrow">{service.number} · {service.label}</div>
        <h1 id="service-detail-title">{service.title}</h1>
        <p className="service-detail-intro">{service.description}</p>

        <div className="service-detail-grid">
          {service.cards.map((card) => (
            <article className="service-detail-card" key={card.tag}>
              <span className="service-detail-tag">{card.tag}</span>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </div>

        <div className="service-detail-collaboration">
          <article className="service-detail-note">
            <span>You bring</span>
            <p>{service.bring}</p>
          </article>
          <article className="service-detail-note">
            <span>We bring</span>
            <p>{service.offer}</p>
          </article>
          <article className="service-detail-note service-detail-note--together">
            <span>Together</span>
            <p>{service.together}</p>
          </article>
        </div>

        <button type="button" className="service-detail-cta" onClick={startProject}>{service.cta}</button>
      </section>
    </main>
  );
}
