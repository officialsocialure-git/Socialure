"use client";

import React, { useEffect, useRef } from "react";

export default function IntroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const attemptPlay = () => video.play().catch(() => {});
    attemptPlay();
    video.addEventListener("canplay", attemptPlay);
    return () => video.removeEventListener("canplay", attemptPlay);
  }, []);

  return (
    <section className="intro-video" id="home" aria-label="Socialure creative studio hero">
      <video
        ref={videoRef}
        className="intro-video__background"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src="/IMG_5622.mp4" type="video/mp4" />
        <source src="/IMG_5622.MOV" type="video/quicktime" />
      </video>
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
