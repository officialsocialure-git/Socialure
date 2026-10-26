import React from "react";
import "./project-process.css";

const stages = [
  {
    number: "01",
    title: "Understand",
    description: "We learn about your products, brands, audience and market to find the right opportunities.",
  },
  {
    number: "02",
    title: "Positioning",
    description: "We build strong brand foundations, define your positioning and create strategies for long-term success.",
  },
  {
    number: "03",
    title: "Build",
    description: "We design and develop your website and create brand-aligned content that delivers a polished digital experience.",
  },
  {
    number: "04",
    title: "Grow",
    description: "We strengthen your online visibility through SEO-friendly optimization, digital marketing and ongoing growth strategies.",
  },
];

export default function ProjectProcess() {
  return (
    <section className="project-process" id="our-process" aria-labelledby="project-process-title">
      <div className="project-process-inner">
        <div className="project-process-eyebrow"><span />OUR PROCESS<span /></div>
        <h2 id="project-process-title">How Our <em><span className="project-project-word">Project</span> <span className="project-runs-word">Runs.</span></em></h2>
        <p className="project-process-subtitle">
          From understanding to growth, we follow a clear and result-driven process.
        </p>

        <div className="project-process-timeline">
          {stages.map((stage) => (
            <article className="project-process-stage" key={stage.number}>
              <span className="project-process-dot" aria-hidden="true" />
              <div className="project-process-number">{stage.number}</div>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
