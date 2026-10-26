# Offmint Agency — Next.js frontend

The original React UI, components, CSS, motion effects and public media assets are retained in this frontend. The app now uses the Next.js App Router.

## Run locally

From this `frontend` directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Next.js.

## Production build

```bash
npm run build
npm run start
```

## Structure

- `app/layout.jsx`: global styles and page metadata
- `app/page.jsx`: home page entry
- `app/services/[slug]/page.jsx`: service detail route entry
- `src/components/`: retained React UI components
- `src/sections/`: retained site sections
- `src/*.css`: original visual styles and responsive/animation rules
- `public/`: original image and video assets

Browser-only theme and path state is initialized after mount to avoid server-rendering hydration mismatches.
