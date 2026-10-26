import React, { useEffect, useState } from "react";

export default function Hero() {
  const rotatingWords = ["Growth", "Strategy", "Visibility", "Identity"];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % rotatingWords.length);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="hero hero-arch hero-arch-image-only" id="home" aria-label="Socialure creative studio">
      <img
        className="hero-architecture-photo hero-architecture-photo--full"
        src="/home.png"
        alt="Photorealistic champagne arch with deep green and burgundy panels, glowing golden light, and an ivory marble podium"
        fetchPriority="high"
      />
      <div className="hero-image-copy">
        <div className="eyebrow"><span /> INDEPENDENT CREATIVE STUDIO</div>
        <h1 className="hero-image-title">
          <span>We Turn</span>
          <span className="hero-image-bordo">Great Products</span>
          <span>Into Loved <em>Brands.</em></span>
        </h1>
        <p className="hero-image-description">
          We architect bespoke e-commerce experiences, memorable brand identities, AI-powered content and high-impact creative campaigns for ambitious businesses.
        </p>
        <div className="hero-image-actions">
          <a className="hero-image-button hero-image-button-primary" href="#contact">START A PROJECT <span>↗</span></a>
          <a className="hero-image-button hero-image-button-outline" href="#work">EXPLORE OUR WORK <span>↗</span></a>
        </div>
        <div className="hero-image-capabilities">BRANDING <b>•</b> DIGITAL <b>•</b> CREATIVE <b>•</b> GROWTH</div>
      </div>
    </section>
  );
}
