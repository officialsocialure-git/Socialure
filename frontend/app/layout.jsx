import "../src/index.css";
import "../src/hero-tweaks.css";
import "../src/navbar-tweaks.css";
import "../src/admin-lock.css";
import "../src/admin-login-modal.css";
import "../src/showcase-visual.css";
import "../src/theme-modes.css";
import "../src/brand-green-unify.css";
import "../src/mobile-responsive.css";

export const metadata = {
  title: "Socialure",
  description: "Socialure builds brands, digital experiences and creative campaigns.",
  applicationName: "Socialure",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071f1b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
