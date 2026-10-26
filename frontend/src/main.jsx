import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./hero-tweaks.css";
import "./navbar-tweaks.css";
import "./showcase-visual.css";
import "./theme-modes.css";
import "./brand-green-unify.css";
import "./mobile-responsive.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);