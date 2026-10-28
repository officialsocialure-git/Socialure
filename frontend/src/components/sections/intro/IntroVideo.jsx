"use client";

export default function IntroVideo() {
  return (
    <section className="intro-video" id="home" aria-label="Offmint creative studio hero">
      <video
        className="intro-video__background"
        src="/IMG_1470.MOV"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="intro-video__shade" aria-hidden="true" />
      <div className="intro-video__copy">
        <h1 className="intro-video__title">
          <span>We Turn</span>
          <span className="intro-video__bordo">Great Products</span>
          <span>Into Loved <em>Brands.</em></span>
        </h1>
      </div>
    </section>
  );
}
