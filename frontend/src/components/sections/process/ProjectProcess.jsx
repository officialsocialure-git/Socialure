"use client";

import React, { useEffect, useState } from "react";
import { Search, Target, Settings, TrendingUp } from "lucide-react";
import "./project-process.css";

const stages = [
  { number: "01", title: "Understand", description: "We learn about your products, brands, audience and market to find the right opportunities.", Icon: Search },
  { number: "02", title: "Positioning", description: "We build strong brand foundations, define your positioning and create strategies for long-term success.", Icon: Target },
  { number: "03", title: "Build", description: "We design and develop your website and create brand-aligned content that delivers a polished digital experience.", Icon: Settings },
  { number: "04", title: "Grow", description: "We strengthen your online visibility through SEO-friendly optimization, digital marketing and ongoing growth strategies.", Icon: TrendingUp },
];

export default function ProjectProcess() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % stages.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="project-process" id="our-process" aria-labelledby="project-process-title">
      <div className="project-process-inner">
        <div className="project-process-eyebrow"><span />OUR PROCESS<span /></div>
        <h2 id="project-process-title">How Our <em><span className="project-project-word">Project</span> <span className="project-runs-word">Runs.</span></em></h2>
        <p className="project-process-subtitle">
          From understanding to growth, we follow a clear and result-driven process.
        </p>

        <div className="project-process-timeline" style={{ "--active-step": activeStep }}>
          <div className="project-process-base-line" aria-hidden="true" />
          <div className="project-process-progress-line" aria-hidden="true" />
          <div className="project-process-tracker" aria-hidden="true">
            <span className="project-process-tracker-circle">
              {React.createElement(stages[activeStep].Icon, { size: 17, strokeWidth: 2.1 })}
            </span>
          </div>
          {stages.map((stage, index) => (
            <button
              className={`project-process-stage ${index === activeStep ? "is-active" : ""}`}
              key={stage.number}
              type="button"
              onClick={() => setActiveStep(index)}
              aria-pressed={index === activeStep}
              aria-label={`Show step ${stage.number}: ${stage.title}`}
            >
              <span className="project-process-dot" aria-hidden="true" />
              <span className="project-process-number">{stage.number}</span>
              <span className="project-process-stage-title">{stage.title}</span>
              <span className="project-process-stage-description">{stage.description}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
