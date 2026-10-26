import React from "react";
import BrandLogo from "./BrandLogo.jsx";

export default function Footer() {
  return (
    <footer className="footer">
      <BrandLogo />
      <span>IDEAS · DESIGN · IMPACT.</span>
      <span>© {new Date().getFullYear()} SOCIALURE</span>
    </footer>
  );
}
