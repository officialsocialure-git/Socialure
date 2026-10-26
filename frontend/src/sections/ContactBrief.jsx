"use client";

import React, { useState } from "react";
import { ArrowRight, Facebook, Linkedin, Mail, ChevronDown, Phone, Instagram, CheckCircle2, AlertCircle, LoaderCircle } from "lucide-react";
import "./contact-brief.css";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
const services = [
  "Campaign production",
  "Product photography",
  "Brand film",
  "AI-generated content",
  "Post-production only",
  "Retainer partnership",
  "Not sure yet — let's talk",
];
const budgets = ["Under ₹2 lakh", "₹2–5 lakh", "₹5–15 lakh", "₹15–50 lakh", "₹50 lakh+", "Let's discuss"];

export default function ContactBrief() {
  const [form, setForm] = useState({ name: "", brand: "", phone: "", email: "", service: "", budget: "", details: "" });
  const [submission, setSubmission] = useState({ state: "idle", message: "" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (submission.state === "sending") return;
    setSubmission({ state: "sending", message: "" });
    try {
      const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.brand.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          service: form.service,
          budget: form.budget,
          message: form.details.trim() || `Budget range: ${form.budget}. No additional project details provided.`,
          source: "Website Contact Form"
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        throw new Error(result.message || "We couldn’t send your enquiry. Please try again.");
      }
      setSubmission({ state: "success", message: "Thanks! Your enquiry has been received. Our team will get back to you soon." });
      setForm({ name: "", brand: "", phone: "", email: "", service: "", budget: "", details: "" });
    } catch (error) {
      setSubmission({ state: "error", message: error.message || "Could not connect to the server. Please try again." });
    }
  };

  return (
    <section className="contact-brief" id="contact">
      <div className="contact-brief__story">
        <div className="contact-brief__story-content">
          <div className="contact-brief__eyebrow"><span /> WORK WITH US</div>
          <h2>Great stories<br />start <span className="contact-brief__headline-accent">here.</span></h2>
          <p className="contact-brief__intro">
            Share your idea, and we’ll take it from there. Whether it’s a campaign,
            a product shoot or a brand film — we’d love to hear it.
          </p>
          <a className="contact-brief__detail" href="mailto:hello@aurelia.studio">
            <Mail aria-hidden="true" /><span>hello@aurelia.studio</span>
          </a>
          <a className="contact-brief__detail" href="tel:+918920286941">
            <Phone aria-hidden="true" /><span>+91 89202 86941</span>
          </a>
          <a className="contact-brief__detail" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <Instagram aria-hidden="true" /><span>Follow us on Instagram</span>
          </a>
          <div className="contact-brief__socials" aria-label="Social media">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
            <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X"><span className="contact-brief__x-mark">𝕏</span></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin /></a>
          </div>
        </div>
      </div>

      <div className="contact-brief__form-panel">
        <div className="contact-brief__form-wrap">
          <h3>Start a <span className="contact-brief__form-heading-accent">brief.</span></h3>
          <p className="contact-brief__subtext">Fill this in and we’ll get back to you within 24 hours. No generic auto-replies.</p>

          {submission.state === "success" && <div className="contact-brief__form-feedback is-success" role="status"><CheckCircle2 aria-hidden="true"/><span>{submission.message}</span></div>}
          {submission.state === "error" && <div className="contact-brief__form-feedback is-error" role="alert"><AlertCircle aria-hidden="true"/><span>{submission.message}</span></div>}

          <form onSubmit={submit}>
            <label>Your name <span className="contact-brief__required">*</span>
              <input name="name" value={form.name} onChange={update} placeholder="Your Name" autoComplete="name" minLength={2} maxLength={120} required disabled={submission.state === "sending"} />
            </label>
            <label>Brand / company
              <input name="brand" value={form.brand} onChange={update} placeholder="Brand Name" autoComplete="organization" maxLength={160} disabled={submission.state === "sending"} />
            </label>
            <label>Contact Number <span className="contact-brief__required">*</span>
              <input name="phone" value={form.phone} onChange={update} placeholder="Contact Number" type="tel" autoComplete="tel" maxLength={40} required disabled={submission.state === "sending"} />
            </label>
            <label>Email
              <input name="email" value={form.email} onChange={update} placeholder="hello@yourbrand.com" type="email" autoComplete="email" disabled={submission.state === "sending"} />
            </label>
            <label>What do you need?
              <span className="contact-brief__select-wrap">
                <select name="service" value={form.service} onChange={update} required disabled={submission.state === "sending"}>
                  <option value="" disabled>Select a service</option>
                  {services.map((service) => <option key={service} value={service}>{service}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </span>
            </label>
            <label>Budget range
              <span className="contact-brief__select-wrap">
                <select name="budget" value={form.budget} onChange={update} required disabled={submission.state === "sending"}>
                  <option value="" disabled>Select budget</option>
                  {budgets.map((budget) => <option key={budget} value={budget}>{budget}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </span>
            </label>
            <button className="contact-brief__submit" type="submit" disabled={submission.state === "sending"}>
              {submission.state === "sending" ? <>Sending… <LoaderCircle aria-hidden="true" className="contact-brief__spinner"/></> : <>Send Enquiry <ArrowRight aria-hidden="true" /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
