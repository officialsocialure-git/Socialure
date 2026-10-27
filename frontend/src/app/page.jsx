import SiteApp from "../components/site/SiteApp.jsx";
import { getSiteUrl, siteDescription, siteName, toJsonLd } from "./seo.js";

export default function HomePage() {
  const siteUrl = getSiteUrl();
  const structuredData = siteUrl
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: siteName,
            url: siteUrl,
            description: siteDescription,
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: siteName,
            url: siteUrl,
            description: siteDescription,
            publisher: { "@id": `${siteUrl}/#organization` },
          },
        ],
      }
    : null;

  return (
    <>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
        />
      )}
      <SiteApp />
    </>
  );
}
