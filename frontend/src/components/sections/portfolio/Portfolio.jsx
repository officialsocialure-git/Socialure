import React, { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import "./our-portfolio.css";

function LazyPreviewVideo({ project }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return;
    // Defer video decoding/network activity until a portfolio card approaches the viewport.
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { rootMargin: "160px 0px", threshold: 0.05 });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} className="our-portfolio__video" src={project.video}
      poster={project.image} muted loop playsInline preload="none"
      aria-label={project.title + " preview video"}
      onError={(event) => { event.currentTarget.style.display = "none"; }} />
  );
}

const projects = [
  {
    id: "01",
    title: "Fashion Film Campaign",
    type: "VIDEO",
    categories: ["CAMPAIGN", "MODEL SHOOT", "POST-PRODUCTION"],
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1400&q=85",
    video: "/video1.mp4",
    alt: "Fashion film campaign",
    layout: "top-video",
  },
  {
    id: "02",
    title: "Product Visuals",
    type: "PRODUCT",
    categories: ["PRODUCT", "PHOTOGRAPHY", "AI VISUALS"],
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1100&q=85",
    alt: "Premium skincare product visuals",
    layout: "top-product",
  },
  {
    id: "03",
    title: "E-commerce Brand Story",
    type: "E-COMMERCE",
    categories: ["E-COMMERCE", "BRANDING", "VISUALS"],
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1100&q=85",
    alt: "Warm modern interior brand photography",
    layout: "top-commerce",
  },
  {
    id: "04",
    title: "Automotive Film",
    type: "VIDEO",
    categories: ["VIDEO", "CAMPAIGN", "POST-PRODUCTION"],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85",
    video: "/videos/automotive-film.mp4",
    alt: "Sports car automotive film",
    layout: "bottom-car",
  },
  {
    id: "05",
    title: "Fashion Editorial",
    type: "FASHION",
    categories: ["FASHION", "CAMPAIGN", "STYLING"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85",
    video: "/video2.mp4",
    alt: "Fashion editorial portrait",
    layout: "bottom-fashion",
  },
];

export default function Portfolio() {
  return (
    <section className="our-portfolio" id="work" aria-labelledby="our-portfolio-title">
      <div className="our-portfolio__inner">
        <div className="our-portfolio__heading">
          <div>
            <div className="our-portfolio__eyebrow"><span /> SELECTED WORK</div>
            <h2 id="our-portfolio-title"><span className="our-portfolio__title-first">Our</span> <em>portfolio.</em></h2>
            <p>A showcase of our recent work across brand, digital, commerce, campaigns and creative production.</p>
          </div>
          <a className="our-portfolio__view-all" href="#contact">
            VIEW ALL WORK <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="our-portfolio__grid">
          {projects.map((project) => (
            <a
              className={`our-portfolio__card our-portfolio__card--${project.layout}`}
              href="#contact"
              key={project.id}
              aria-label={`Discuss a project like ${project.title}`}
            >
              <img className="our-portfolio__poster" src={project.image} alt={project.alt} loading="lazy" />
              {project.video && <LazyPreviewVideo project={project} />}
              <span className="our-portfolio__type"><span />{project.type}</span>
              <div className="our-portfolio__card-content">
                <div>
                  <h3>{project.title}</h3>
                  <ul aria-label="Project categories">
                    {project.categories.map((category) => <li key={category}>{category}</li>)}
                  </ul>
                </div>
                <span className="our-portfolio__arrow" aria-hidden="true"><ArrowUpRight size={21} /></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
