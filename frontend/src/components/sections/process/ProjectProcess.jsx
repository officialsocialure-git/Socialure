"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const timelineRef = useRef(null);
  const dotRefs = useRef([]);
  const [trackerStyle, setTrackerStyle] = useState({});

  const updatePositions = useCallback(() => {
    const timeline = timelineRef.current;
    const activeDot = dotRefs.current[activeStep];
    const firstDot = dotRefs.current[0];
    const lastDot = dotRefs.current[stages.length - 1];

    if (!timeline || !activeDot) return;

    const timelineRect = timeline.getBoundingClientRect();
    const activeDotRect = activeDot.getBoundingClientRect();

    // Exact center coordinates of the active dot relative to timeline container
    const top = activeDotRect.top - timelineRect.top + activeDotRect.height / 2;
    const left = activeDotRect.left - timelineRect.left + activeDotRect.width / 2;

    let progressHeight = 0;
    let firstDotTop = 24;
    let baseLineHeight = "calc(100% - 48px)";

    if (firstDot) {
      const firstRect = firstDot.getBoundingClientRect();
      firstDotTop = firstRect.top - timelineRect.top + firstRect.height / 2;
      progressHeight = Math.max(0, top - firstDotTop);
    }

    if (firstDot && lastDot) {
      const firstRect = firstDot.getBoundingClientRect();
      const lastRect = lastDot.getBoundingClientRect();
      const lastDotTop = lastRect.top - timelineRect.top + lastRect.height / 2;
      baseLineHeight = `${lastDotTop - firstDotTop}px`;
    }

    setTrackerStyle({
      "--tracker-top": `${top}px`,
      "--tracker-left": `${left}px`,
      "--progress-height": `${progressHeight}px`,
      "--base-line-top": `${firstDotTop}px`,
      "--base-line-height": baseLineHeight,
    });
  }, [activeStep]);

  useEffect(() => {
    updatePositions();
    const handleResize = () => updatePositions();
    window.addEventListener("resize", handleResize);
    document.fonts?.ready?.then(updatePositions);
    return () => window.removeEventListener("resize", handleResize);
  }, [updatePositions]);

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

        <div
          ref={timelineRef}
          className="project-process-timeline"
          style={{
            "--active-step": activeStep,
            "--active-position": `${12.5 + activeStep * 25}%`,
            ...trackerStyle,
          }}
        >
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
              <span
                ref={(el) => (dotRefs.current[index] = el)}
                className="project-process-dot"
                aria-hidden="true"
              />
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
