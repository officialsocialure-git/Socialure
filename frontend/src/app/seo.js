export const siteName = "Socialure";
export const siteDescription =
  "Socialure is a creative studio helping brands grow through brand strategy, website design, content, social media, campaigns and video production.";

export function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    return ["http:", "https:"].includes(url.protocol) ? url.origin : null;
  } catch {
    return null;
  }
}

export function toJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
