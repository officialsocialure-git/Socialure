"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../layout/Navbar.jsx";
import Footer from "../layout/Footer.jsx";
import IntroVideo from "../sections/intro/IntroVideo.jsx";
import OurPhilosophyEditorial from "../sections/philosophy/OurPhilosophyEditorial.jsx";
import Services from "../sections/services/Services.jsx";
import ProjectProcess from "../sections/process/ProjectProcess.jsx";
import Portfolio from "../sections/portfolio/Portfolio.jsx";
import ClientStories from "../sections/testimonials/ClientStories.jsx";
import ContactBrief from "../sections/contact/ContactBrief.jsx";
import ServiceDetail from "../services/ServiceDetail.jsx";

export default function App({ serviceId = null }) {
  const router = useRouter();
  // Start with deterministic values so Next.js server rendering and hydration agree.
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("socialure-theme");
      if (saved === "light" || saved === "dark") setTheme(saved);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("socialure-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const mobileTheme = window.matchMedia("(max-width: 640px)");
    const keepMobileDark = () => {
      if (mobileTheme.matches) setTheme("dark");
    };
    keepMobileDark();
    mobileTheme.addEventListener?.("change", keepMobileDark);
    return () => mobileTheme.removeEventListener?.("change", keepMobileDark);
  }, []);

  const openService = (serviceId) => {
    router.push(`/services/${serviceId}`);
  };

  const toggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");

  const backToServices = () => {
    router.push("/#services");
  };

  if (serviceId) {
    return (
      <div className="agency-site" data-theme={theme}>
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <ServiceDetail serviceId={serviceId} onBack={backToServices} />
      </div>
    );
  }

  return (
    <main className="agency-site" data-theme={theme}>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <IntroVideo />
      <OurPhilosophyEditorial />
      <Services onOpenService={openService} />
      <ProjectProcess />
      <Portfolio />
      <ClientStories />
      <ContactBrief />
      <Footer />
    </main>
  );
}
