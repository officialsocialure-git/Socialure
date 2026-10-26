import { notFound, redirect } from "next/navigation";
import SiteApp from "../../../components/site/SiteApp.jsx";
import { services, serviceSlugs } from "../../../components/services/serviceData.js";
import { getSiteUrl, siteName, toJsonLd } from "../../seo.js";

const aliases = {
  "website-build": "branding",
  "social-media": "pr",
  social: "pr",
};

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const slug = aliases[params.slug] || params.slug;
  const service = services[slug];
  if (!service) return { title: "Service not found", robots: { index: false } };

  const siteUrl = getSiteUrl();
  const title = `${service.seoTitle} | ${siteName}`;
  const url = siteUrl ? `${siteUrl}/services/${slug}` : undefined;
  const image = siteUrl ? `${siteUrl}/home.png` : undefined;

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title,
      description: service.seoDescription,
      type: "website",
      siteName,
      locale: "en_US",
      ...(url ? { url } : {}),
      ...(image ? { images: [{ url: image, alt: `${service.name} by Socialure` }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: service.seoDescription,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function ServicePage({ params }) {
  if (aliases[params.slug]) redirect(`/services/${aliases[params.slug]}`);
  const service = services[params.slug];
  if (!service) notFound();

  const siteUrl = getSiteUrl();
  const url = siteUrl ? `${siteUrl}/services/${params.slug}` : null;
  const structuredData = url
    ? {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${url}#service`,
            name: service.name,
            description: service.seoDescription,
            url,
            provider: { "@id": `${siteUrl}/#organization` },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: service.name, item: url },
            ],
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
      <SiteApp serviceId={params.slug} />
    </>
  );
}
