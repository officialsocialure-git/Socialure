import React from "react";
import { ArrowLeft } from "lucide-react";
import "./service-detail.css";
import brandingContent from "./service-content/BrandingContent.js";
import prContent from "./service-content/PRContent.js";
import aiVideosContent from "./service-content/AIVideosContent.js";
import brandKitContent from "./service-content/BrandKitContent.js";
import socialMediaContent from "./service-content/SocialMediaContent.js";

const websiteContent = {
  number: "01",
  label: "WEBSITE BUILD",
  title: "A website that sells the way you would.",
  description: "Your website is your brand’s home. We design and build it to look beautiful, load fast and guide visitors from curious to buying, then shoot the photos and videos that fill it so every page feels real, not templated.",
  cards: [
    { tag: "Build", title: "Design and develop", text: "Website design and development, built around your brand kit." },
    { tag: "Shoot", title: "Photograph", text: "Website photoshoot and product visuals." },
    { tag: "Move", title: "Film", text: "Hero videos, product films and short clips for your pages." },
    { tag: "Tune", title: "Guide", text: "Page structure and messaging so visitors know what to do next." }
  ],
  bring: "Your product and a few key decisions.",
  offer: "Design, development, shoot planning and direction.",
  together: "You review the layout and copy before anything goes live.",
  cta: "Plan my website"
};

const serviceContent = {
  // Keep these IDs aligned with the five visible service cards in Services.jsx.
  // 01 Brand Foundation, 02 The Website, 03 The Content Engine,
  // 04 Campaigns and Shoots, 05 Press and Presence.
  website: { ...brandingContent, number: "01", label: "BRAND FOUNDATION" },
  branding: { ...websiteContent, number: "02", label: "WEBSITE BUILD" },
  pr: { ...socialMediaContent, number: "03", label: "THE CONTENT ENGINE" },
  "ai-videos": { ...aiVideosContent, number: "04", label: "CAMPAIGNS AND SHOOTS" },
  "brand-kit": { ...prContent, number: "05", label: "PRESS AND PRESENCE" },
  social: socialMediaContent
};

export default function ServiceDetail({ serviceId = "website", onBack }) {
  const service = serviceContent[serviceId] || websiteContent;

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
