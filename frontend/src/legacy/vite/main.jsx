import React from "react";
import { createRoot } from "react-dom/client";
import SiteApp from "../../components/site/SiteApp.jsx";
import "../../styles/globals.css";
import "../../styles/hero.css";
import "../../styles/navigation.css";
import "../showcase/showcase-visual.css";
import "../../styles/theme.css";
import "../../styles/brand.css";
import "../../styles/responsive.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SiteApp />
  </React.StrictMode>
);
