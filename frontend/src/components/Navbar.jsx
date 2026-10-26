import React, { useState } from "react";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import BrandLogo from "./BrandLogo.jsx";

const links = [
  ["Services", "#services"],
  ["Work", "#work"],
  ["Process", "#process"],
  ["About", "#philosophy"],
  ["Contact", "#contact"],
];

export default function Navbar({ theme = "dark", onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  return (
    <header className="topbar">
      <BrandLogo />
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className={open ? "nav nav--open" : "nav"}>
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="nav-cta" href="#contact">LET'S TALK <ArrowUpRight size={14} /></a>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          aria-pressed={!isDark}
        >
          {isDark ? <Moon size={17} /> : <Sun size={17} />}
          <span>{isDark ? "Dark" : "Light"}</span>
        </button>
      </div>
    </header>
  );
}
