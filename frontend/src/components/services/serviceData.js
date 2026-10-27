import brandingContent from "./content/BrandingContent.js";
import prContent from "./content/PRContent.js";
import aiVideosContent from "./content/AIVideosContent.js";
import socialMediaContent from "./content/SocialMediaContent.js";

const websiteContent = {
  number: "02",
  label: "WEBSITE BUILD",
  title: "A website that sells the way you would.",
  description: "Your website is your brand’s home. We design and build it to look beautiful, load fast and guide visitors from curious to buying, then shoot the photos and videos that fill it so every page feels real, not templated.",
  cards: [
    { tag: "Build", title: "Design and develop", text: "Website design and development, built around your brand kit." },
    { tag: "Shoot", title: "Photograph", text: "Website photoshoot and product visuals." },
    { tag: "Move", title: "Film", text: "Hero videos, product films and short clips for your pages." },
    { tag: "Tune", title: "Guide", text: "Page structure and messaging so visitors know what to do next." },
  ],
  bring: "Your product and a few key decisions.",
  offer: "Design, development, shoot planning and direction.",
  together: "You review the layout and copy before anything goes live.",
  cta: "Plan my website",
};

export const services = {
  website: {
    ...brandingContent,
    number: "01",
    label: "BRAND FOUNDATION",
    name: "Brand Foundation",
    seoTitle: "Brand Strategy & Identity",
    seoDescription: "Build a brand people remember with clear positioning, visual identity, messaging and a practical brand kit from Socialure.",
  },
  branding: {
    ...websiteContent,
    name: "Website Design & Development",
    seoTitle: "Website Design & Development",
    seoDescription: "Socialure designs and builds brand-led websites with clear messaging, product visuals and a smooth path from discovery to enquiry.",
  },
  pr: {
    ...socialMediaContent,
    number: "03",
    label: "THE CONTENT ENGINE",
    name: "Content & Social Media",
    seoTitle: "Content Creation & Social Media",
    seoDescription: "Plan and create consistent social media content with Socialure: content themes, visual assets, captions and a practical publishing plan.",
  },
  "ai-videos": {
    ...aiVideosContent,
    number: "04",
    label: "CAMPAIGNS AND SHOOTS",
    name: "Campaigns & Video Production",
    seoTitle: "Creative Campaigns & Video Production",
    seoDescription: "Bring your brand story to life with creative campaigns, product shoots and AI-powered video concepts produced by Socialure.",
  },
  "brand-kit": {
    ...prContent,
    number: "05",
    label: "PRESS AND PRESENCE",
    name: "Press & Brand Presence",
    seoTitle: "Public Relations & Brand Presence",
    seoDescription: "Shape your brand story with thoughtful PR, media and creator outreach, clear messaging and purposeful campaigns from Socialure.",
  },
};

export const serviceSlugs = Object.keys(services);
