# Socialure — Next.js frontend

The original React UI, components, CSS, motion effects and public media assets are retained in this frontend. The app now uses the Next.js App Router.

## Run locally

From this `frontend` directory:

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open the local URL printed by Next.js.

## Contact form email

The contact form sends directly through EmailJS; a separate backend or database is not required.

1. Create an EmailJS email service and template.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`.
4. Configure the template to use these available variables: `name`, `from_name`, `email`, `reply_to`, `brand`, `company`, `phone`, `service`, `budget`, `message`, `source`, and `submitted_at`.

Because this is a browser integration, configure EmailJS allowed domains and spam protection before production deployment.

## Production build

```bash
npm run build
npm run start
```

## Structure

- `src/app/`: Next.js routes, layout, metadata and page entries
- `src/components/layout/`: shared navigation, branding and footer components
- `src/components/site/`: the main site composition
- `src/components/sections/`: home-page sections with their local styles
- `src/components/services/`: service-detail UI and content definitions
- `src/styles/`: global, theme, navigation and responsive styles
- `src/legacy/`: preserved code that is not included in the production application
- `public/`: image and video assets

Browser-only theme state is initialized after mount to avoid server-rendering hydration mismatches. Service paths render their content on the server.

## Search and social previews

Set `SITE_URL` in `.env.local` and in your deployment environment to your final public domain (including `https://`, without a trailing path), then rebuild. This enables absolute canonical links, Open Graph and X image URLs, organization and service structured data, and a sitemap with the home page and five service pages. Without it, page titles and descriptions still render, but absolute URL signals are omitted and the sitemap has no entries.

Each service URL renders its own content on the server. `/robots.txt`, `/sitemap.xml`, and the site icon are generated from `src/app/`. Submit the sitemap to your search console after deployment. Keep the page copy and service descriptions accurate as the business evolves; extra keyword meta tags do not improve Google ranking.
