# Homepage sandbox

A copy of the live toeddro.com homepage, cut loose from the backend. Change anything here. Nothing in this folder deploys anywhere.

## Run it

```bash
cd homepage
npm install
npm run dev
```

Open http://localhost:8080. Works on your phone too: run `npm run dev -- --host` and open the Network URL it prints.

## What's real and what's stubbed

Real, byte-for-byte from production:
- `src/pages/Index.tsx` – the whole homepage
- `src/components/*` – every component the homepage uses
- `src/index.css`, `tailwind.config.ts` – the design system
- `src/data/operators.json` – 25 sample operators, same as `/data/operators.csv`. No contact fields.

Stubbed (file says `SANDBOX` at the top):
- `src/hooks/useOperators.tsx` – reads the JSON instead of Supabase
- `src/hooks/useAuth.tsx` – always signed out
- `src/hooks/useArticles.tsx`, `useReviews.tsx` – 3 articles, 4 reviews, hardcoded
- `AccountMenu`, `ClaimDialog`, `ReportDialog`, `ReviewDialog`, `RevealContact` – render nothing

Only `/` is routed. Every other link lands on the 404 page. That's expected.

## The brief

From the UI/UX feedback doc. Colours and contrast stay as they are.

| # | Area | Change | Owner |
|---|------|--------|-------|
| 1 | Hero | Try an alternative background gradient | Somya |
| 2 | Hero text | Slow down and smooth the reveal/glitch animation; characters should not all appear at once | Somya |
| 3 | Explore by location | Show a handful first, then "Load more". Consider filters. | Nihaar |
| 4 | Featured treks / locations | Replace the single-column layout with a compact bento grid | Nihaar |

Where to look in `Index.tsx`: search for `hero`, `Explore by location`, `LocationPills`, and the featured operators grid near `visible.map`.

## How to submit

1. Branch off `main`: `git checkout -b somya/hero-gradient` (your name, what it does)
2. Make the change. Keep each PR to one item from the table.
3. Open a PR to `main`. In the description: a before screenshot, an after screenshot, both on mobile width.
4. The other intern reviews. Balaji merges.

## Rules

- Do not touch `src/data/`. If you need different data, ask.
- Do not add a backend, env file, or API key. If a change seems to need one, it's out of scope for this sandbox.
- Do not install new dependencies without saying why in the PR.
- Ugly but working beats pretty but broken. Ship the small version first.


## Premium UI refresh

The homepage now includes a cinematic hero, destination discovery cards, activity discovery, interactive mood suggestions, trip-style tabs, a dark destination-inspiration panel and a travel inspiration gallery. New discovery actions reuse the existing homepage activity and location filters; no operator or review data was fabricated.

### Optional hero video

The archive does not include an approved travel video asset, so the hero uses an image fallback by default. To supply a hosted MP4, create a local `.env` file and set:

```env
VITE_HERO_VIDEO_URL=https://your-approved-cdn.example.com/toeddro-hero.mp4
```

Restart the Vite dev server after changing environment variables. The hero video is muted, looping and inline; the image fallback remains available.


## Ambient hero video

To enable the cinematic nature background, place a licensed MP4 at `public/media/toeddro-hero.mp4` and set `VITE_HERO_VIDEO_URL=/media/toeddro-hero.mp4` in `homepage/.env`. See `../AMBIENT_HERO_VIDEO.md` for clip guidance and reduced-motion behavior. Without the MP4, the existing static hero image remains as fallback.
