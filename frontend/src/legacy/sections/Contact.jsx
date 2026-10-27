import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section className="contact section" id="contact">
      <div><div className="eyebrow"><span /> HAVE A GOOD ONE IN MIND?</div><h2>Let's build your<br /><em>next chapter.</em></h2></div>
      <a className="contact-link" href="mailto:hello@aurelia.studio">HELLO@AURELIA.STUDIO <ArrowUpRight size={14} /></a>
    </section>
  );
}