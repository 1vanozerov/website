# Ivan Ozerov — personal portfolio

A minimal, English-language portfolio made with Next.js and React Three Fiber, with three main sections and individual project pages:

| Page | Route | Design |
| --- | --- | --- |
| About | `/` | Ivan Ozerov, Germany / Working on Earth, freelance services and a reserved area for selected work. Cinematic monochrome megastructure. |
| Games | `/games/` | A **separate** project micro-site for **LAST SHIFT: MARS**, atmospheric psychological horror in development. Its own lightweight, slowly rotating 3D Mars with pixelation, ordered dithering and blur; the city scene does not load. |
| Contact | `/contact/` | Full-screen clickable email with a small copy toast. Monochrome megastructure. |
| Project detail | `/projects/{id}/` | Three minimal static project pages, reached from the scroll-driven 3D carousel. |

The About and Contact pages use large typography and cinematic 3D entrances without decorative frames. About features an integrated, dithered portrait and a scroll-driven CSS 3D project carousel with three editable screenshot slots. Games has a separate near-black visual language with a small dedicated WebGL planet, rust-colored light, and film grain.

## Edit the content

- `src/content/portfolio.ts` — public name, location, services, project layouts, email. Email is `ozerovtech@gmail.com` and copies to clipboard with an unobtrusive toast. To add screenshots, save images in `public/projects/` and add e.g. `image: "/projects/mobile.webp"` to the matching project. Optional `url` makes an external project link appear on its detail page; carousel cards open the site's internal `/projects/{id}/` routes. The three example slots are generic templates, not claims of completed client work.
- `src/content/games.ts` — the actual game details and optional link.
- `src/app/page.tsx` — About page with the scroll-driven carousel.
- `src/components/project-carousel.tsx` — accessible rotating 3D wheel with scroll progression and selectable projects.
- `src/components/project-visual.tsx` — screenshot placeholder or actual project image.
- `src/app/projects/[slug]/page.tsx` — statically exported project detail pages.
- `src/components/email-display.tsx` — copy-on-click email with a toast.
- `src/app/games/page.tsx` — standalone game micro-site.
- `src/app/contact/page.tsx` — contact page.
- `src/app/globals.css` — all visual styles.
- `src/components/site-background.tsx` — route-aware 3D city background for About and Contact only.
- `src/components/mars-background.tsx` and `mars-planet.tsx` — independent Games-page Mars, procedural surface, 20 FPS cap, nearest-neighbor pixelation, Bayer dithering, and reduced-motion support.
- `src/components/interface-motion.tsx` — short section/row reveals and one-shot scene interference triggers.
- `src/components/psx-portrait.tsx` — browser-side monochrome Bayer dithering of Ivan's real photo (one small canvas draw, no ongoing render loop).
- `public/images/me.png` — source portrait; replace this image if needed.
- `src/components/city-architecture.tsx` — instanced city structures.
- `src/components/psx-postprocess.tsx` — PSX-style post-processing, depth-based black fog, and transient horizontal signal glitches.
- `src/lib/camera-paths.ts` — closer starting camera with scroll-driven flight paths.

No fictional freelance case studies have been added.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, `/games`, or `/contact`.

Check the project:

```bash
npm run lint
npm run typecheck
npm run build
```

## Publish to GitHub Pages

1. Create a GitHub repository and push the project to `main`.
2. Select **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. The `.github/workflows/deploy.yml` builds a static site using `npm ci` and `npm run build`, then publishes `out/`.

`next.config.ts` automatically sets `basePath` for project Pages (e.g. `/ivanweb/`); internal navigation uses Next.js links. No server-side API is required.

The local repository has **not** been published to GitHub.
