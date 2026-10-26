import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Camera, Globe2, Trophy, Users, Quote } from "lucide-react";
import "./client-stories.css";

const stories = [
  {
    quote: "Aurelia understood our vision instantly and turned it into a campaign that truly reflects our brand. The team is creative, professional and a pleasure to work with.",
    name: "Ritika Mehra",
    role: "Founder, Maison & Co.",
    initials: "RM",
    rating: 5,
  },
  {
    quote: "From the first idea to the final visuals, the process felt thoughtful and collaborative. The work gave our launch a clear, confident visual identity.",
    name: "Ananya Sharma",
    role: "Brand Lead, Studio North",
    initials: "AS",
    rating: 5,
  },
  {
    quote: "The team brought fresh perspective to our brief and made every detail feel intentional. The final campaign had exactly the energy we wanted.",
    name: "Karan Malhotra",
    role: "Marketing Director, Soléa",
    initials: "KM",
    rating: 5,
  },
];

const brands = ["LUMIÈRE", "earthy.", "NIVARA", "SOLÉA", "VELORA"];

const metrics = [
  { value: "50+", label: "Projects Delivered", Icon: Camera },
  { value: "30+", label: "Happy Brands", Icon: Users },
  { value: "5+", label: "Years of Experience", Icon: Trophy },
  { value: "10+", label: "Industries Served", Icon: Globe2 },
];

export default function ClientStories() {
  const [active, setActive] = useState(0);

  const goTo = (direction) => {
    setActive((current) => (current + direction + stories.length) % stories.length);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % stories.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const story = stories[active];

  return (
    <section className="client-stories" aria-labelledby="client-stories-title">
      <div className="client-stories__hero">
        <div className="client-stories__copy">
          <div className="client-stories__eyebrow"><span /> CLIENT STORIES</div>
          <h2 id="client-stories-title">Ideas that<br />feel like <em>you.</em></h2>
          <p>We don’t just deliver content, we understand your brand, your audience and the emotion you want to create. That’s why our clients come back, again and again.</p>
          <div className="client-stories__actions">
            <a className="client-stories__primary" href="#contact">Work With Us <ArrowRight size={18} /></a>
            <a className="client-stories__secondary" href="#contact"><span><ArrowUpRight size={20} /></span><b>EXPLORE<br />MORE STORIES</b></a>
          </div>
        </div>

        <div className="client-stories__visual">
          <span className="client-stories__shape client-stories__shape--green" />
          <span className="client-stories__shape client-stories__shape--gold" />
          <div className="client-stories__plant" aria-hidden="true">
            <span className="client-stories__stem" />
            <span className="client-stories__leaf leaf-one" />
            <span className="client-stories__leaf leaf-two" />
            <span className="client-stories__leaf leaf-three" />
            <span className="client-stories__leaf leaf-four" />
            <span className="client-stories__vase" />
          </div>
          <article className="client-stories__card" key={active}>
            <div className="client-stories__card-top">
              <Quote className="client-stories__quote-icon" fill="currentColor" strokeWidth={0} />
              <div className="client-stories__stars" aria-label={`${story.rating} out of 5 stars`}>{Array.from({ length: story.rating }, (_, i) => <span key={i}>★</span>)}</div>
            </div>
            <blockquote>{story.quote}</blockquote>
            <div className="client-stories__rule" />
            <div className="client-stories__card-bottom">
              <div className={`client-stories__avatar client-stories__avatar--${active}`} aria-hidden="true">{story.initials}</div>
              <div className="client-stories__person">
                <strong>{story.name}</strong>
                <span>{story.role}</span>
              </div>
              <div className="client-stories__controls">
                <button type="button" onClick={() => goTo(-1)} aria-label="Previous testimonial">←</button>
                <button type="button" onClick={() => goTo(1)} aria-label="Next testimonial">→</button>
              </div>
            </div>
          </article>
          <div className="client-stories__note" aria-hidden="true">Real<br />People.<br /><em>Real Impact.</em><span /></div>
        </div>
      </div>

      <div className="client-stories__metrics">
        {metrics.map(({ value, label, Icon }) => (
          <div className="client-stories__metric" key={label}>
            <span className="client-stories__metric-icon"><Icon aria-hidden="true" /></span>
            <div><strong>{value}</strong><span>{label}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}
