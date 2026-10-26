import { serviceSlugs } from "../components/services/serviceData.js";
import { getSiteUrl } from "./seo.js";

export default function sitemap() {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];

  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...serviceSlugs.map((slug) => ({
      url: `${siteUrl}/services/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  ];
}
