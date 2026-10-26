import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function About() {
  return (
    <section className="about section" id="about">
      <div className="eyebrow"><span /> BUILT AROUND YOUR BRAND</div>
      <h2>Good design gets noticed.<br /><em>Great design moves you forward.</em></h2>
      <p>We bring digital craft, brand thinking and creative production into one considered process — made for businesses ready to stand apart.</p>
      <a className="button button--gold" href="#contact">LET'S MAKE SOMETHING MATTER <ArrowUpRight size={14} /></a>
    </section>
  );
}