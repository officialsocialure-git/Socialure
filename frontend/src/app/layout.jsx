import "../styles/globals.css";
import "../styles/hero.css";
import "../styles/navigation.css";
import "../styles/theme.css";
import "../styles/brand.css";
import "../styles/responsive.css";
import { getSiteUrl, siteDescription, siteName } from "./seo.js";

const siteUrl = getSiteUrl();
const homeTitle = "Socialure | Brand Strategy, Websites & Creative Campaigns";
const socialImage = siteUrl ? `${siteUrl}/home.png` : undefined;

export const metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: homeTitle,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: siteUrl ? { canonical: siteUrl } : undefined,
  robots: { index: true, follow: true },
  openGraph: {
    title: homeTitle,
    description: siteDescription,
    type: "website",
    siteName,
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl } : {}),
    ...(socialImage ? { images: [{ url: socialImage, alt: "Socialure creative studio" }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: siteDescription,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
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
