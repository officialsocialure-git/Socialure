import React from "react";

/**
 * Art-directed CSS storefront composition inspired by the approved reference.
 * This is deliberately a miniature creative-agency portfolio scene rather than
 * generic orbital geometry. Motion stays subtle so the mockups remain legible.
 */
export default function AnimatedVisual({ kind = "universe", large = false }) {
  return (
    <div className={`showcase-scene showcase--${kind} ${large ? "showcase-scene--large" : ""}`} aria-label="Animated e-commerce and brand portfolio showcase">
      <div className="scene-halo" />
      <div className="scene-arc scene-arc--one" />
      <div className="scene-arc scene-arc--two" />
      <div className="scene-floor" />

      <div className="scene-pedestal pedestal--back"><span /></div>
      <div className="scene-pedestal pedestal--front"><span /></div>

      <article className="brand-card brand-card--identity">
        <span className="mini-label">BRAND IDENTITY</span>
        <div className="identity-emblem">A<span>✳</span></div>
        <strong>AARANYĀ</strong>
        <small>ROOTED IN RITUAL</small>
        <div className="identity-swatches"><i /><i /><i /><i /></div>
      </article>

      <div className="device device--laptop">
        <div className="laptop-screen">
          <div className="store-nav"><b>AARANYĀ</b><span>SHOP&nbsp;&nbsp; OUR STORY&nbsp;&nbsp; JOURNAL</span><i>♡</i></div>
          <div className="store-hero">
            <div className="store-copy"><small>THE EVERYDAY RITUAL</small><strong>Find your<br /><em>natural</em> rhythm.</strong><span>Thoughtful essentials for a more intentional life.</span><b>DISCOVER THE COLLECTION ↗</b></div>
            <div className="store-product product--bottle"><span /><i /></div>
            <div className="store-product product--jar"><span /><i /></div>
          </div>
          <div className="store-bottom"><span>MADE WITH INTENTION</span><span>01 — 04</span></div>
        </div>
        <div className="laptop-base" />
      </div>

      <div className="device device--phone">
        <div className="phone-frame">
          <div className="phone-notch" />
          <div className="phone-top"><span>9:41</span><span>•••</span></div>
          <div className="phone-brand">AARANYĀ <span>☰</span></div>
          <div className="phone-photo"><div className="phone-bottle" /><div className="phone-leaf">✳</div></div>
          <div className="phone-product-copy"><small>BOTANICAL BODY OIL</small><strong>Daily Ritual Oil</strong><span>₹ 1,299.00</span><b>ADD TO BAG&nbsp; +</b></div>
        </div>
      </div>

      <article className="brand-card brand-card--campaign">
        <span className="mini-label">CAMPAIGN / 03</span>
        <div className="campaign-art"><div className="campaign-sun" /><div className="campaign-bottle" /><div className="campaign-leaf">✳</div></div>
        <strong>MADE OF NATURE.</strong>
        <small>CREATIVE CAMPAIGN</small>
      </article>

      <div className="scene-orbit-label label--left">STRATEGY <i /></div>
      <div className="scene-orbit-label label--right"><i /> DIGITAL CRAFT</div>
      <div className="scene-spark spark--one" />
      <div className="scene-spark spark--two" />
      <div className="scene-spark spark--three" />
    </div>
  );
}