# Uroko — project notes

Demo site for a fictional Japanese tattoo studio in Motomachi, Yokohama (irezumi, tebori and machine).
Next.js 16 + TypeScript + Tailwind v4, App Router, no `src/`.

## Run

```
npm run dev      # http://localhost:3010
npm run build && npm run start   # prebuilt, also port 3010
```

## Direction

Uroko is a studio about its work, so the site leads with the work. **Never use:**
- an emblem laid over a face;
- pure black and crimson (#990000 / #D60407);
- a figure under a red beam;
- a 3D logo spinning at the footer;
- big stat rows.

- **Mark:** overlapping fish scales, the uroko pattern, inside one large scale. It is drawn in code by
  `scripts/emblem-scales.mjs`, then `node scripts/emblem-trace.mjs` traces it to `lib/content/emblem-path.ts`.
  The header logo (`components/site/Emblem.tsx`), the boot screen and the 3D model (`components/home/Emblem3D.tsx`)
  all read that path. No eyes, no red band.
  potrace was uninstalled (2026-09-29) to clear an npm audit warning. Before running `emblem-trace.mjs` again,
  reinstall it with `npm install -D potrace`.
- **Header (`components/site/Header.tsx`):** one row on desktop:
  - the mark and "Uroko 鱗" on the left;
  - the pages in a line;
  - the sound toggle, the next consultation (from 1280 px) and a vermilion Book link on the right.
  It scrolls away with the page. `--header-h` in globals.css matches its desktop height. Phones: mark, sound and a
  menu button.
- **Palette:** traditional pigments only, all tokens in `app/globals.css` `@theme`:
  - sumi (墨) ink black `--color-ink` #0f0f12;
  - ai (藍) indigo `--color-ai` #1e3553;
  - gofun (胡粉) cool shell white `--color-paper` #eceff0, not cream;
  - shu (朱) vermilion as the single accent: `--color-shu` #c23a1f for fills, `-bright` #ec6a4a for text on dark,
    `-deep` #9e2c16 for text on light.
  - The 3D mark is shell white, lit by a vermilion key and an indigo fill.
- **Hero (`components/home/Hero.tsx`):** the user's choice (restored 2026-09-29 after an artwork-led version).
  The 2026-09-29 audit noted that this layout, a portrait with a giant name behind the head and a list bottom-right,
  is the part of the site closest to the study; the user decided to keep it. Back to front:
  - `HeroInk.tsx`: a drop of indigo ink spreads through dark water, then the scale pattern draws itself outward from
    it on a plain 2D canvas. It takes about three seconds, then stops.
  - The serif name (`.hero-masthead`, capitals-only font subset).
  - The tattooed man, cut out (`public/photos/hero/figure-wide.webp` and `figure-tall.webp`, made by
    `node scripts/hero-cutout.mjs` from `generated/hero/figure-4096.png`), so his head sits in front of the name.
    His red backdrop is removed; the ink scene is his background. `object-fit: contain` keeps his head uncut on
    wide screens.
  - The 3D pair starts small **above** his head and grows as you scroll. Never put it over his face.
  - An artwork-led alternative existed briefly: the dragon flash unrolling with the healed piece wiping over it
    on scroll. It is recorded in `SECURITY-AUDIT.md`.
- **Home order:** hero, motifs (featured strip, then by kind), artists, large projects (statement, the studio's
  numbers as one sentence, tebori/machine/large-piece chapters, the four steps), booking, aftercare, visiting.
- **3D mark:** it starts above the man's head, tumbles through the motifs, returns for the process steps, then leaves.
  It has no footer moment.
- Keep the dark, cinematic mood and the motion: the boot screen, the 3D mark, the two pinned set pieces
  (`components/home/Cinema.tsx`) and the revolving motif cards. Lenis runs on fine pointers only.
- The tebori / machine / large-piece chapters are a pinned split screen on desktop: text on the left, a large photo
  panel on the right, and a vermilion progress line between them. Each change:
  - the next photo wipes up over the whole panel, led by a vermilion line on the wipe's edge, and settles from a zoom
    while the old one pushes in and darkens;
  - the counter, name and kanji roll through their masks;
  - the lines fade and lift in order.
  Phones stack each chapter with its own full-width photo.
- Process steps (`[data-process]`): on desktop the section pins, the ink photo wipes in and pushes in slowly, and
  the four steps reveal one after another (line, kanji, text), then all hold together. On phones each reveals once on
  entry. The kanji sit in a fixed-width column so every title and description lines up.
- Visiting is a full-screen ending: the rainy Motomachi photo fills the section and pushes in slowly with the scroll
  (`[data-visit]` in Cinema). `components/site/OpenNow.tsx` shows a live "open now / opens at" line from
  `site.openingHours` in Japan time. Keep `hours` (display) and `openingHours` (data) in sync.
  Pins are created in page order (motif strip first). Under reduced motion they pin and swap instantly.
- No AI-template tells (see `SLOP-AUDIT.md`, local only): no counter loader, no text or scroll reveals, no count-ups,
  marquees, glitch, grain, glows, blurs, equaliser bars or tracked-caps eyebrows.

## Rules

- Do not run git commands here. This folder has its own `.git` (the user handles it); `E:\demo-sites\uroko` exists
  but is empty.
- The studio, people and address are fictional on purpose: `2F, 9-99 Motomachi` (Motomachi stops at 5-chōme),
  `hello@uroko.example`, handle `@uroko.demo`, artists Kaito, Mio and Sho. Never use a real address, handle or name.
  Handles are shown as plain text marked "(fictional account)", never as links.
- `components/ui/spotlight-card.tsx` (the pasted GlowCard) wraps the artist, motif and aftercare guide cards at the
  user's request. It stays in the studio's vermilion with no hue drift, allows touch scrolling, and uses one shared,
  throttled pointer listener. Keep it off the hero. `autoGlow` makes a card glow on its own: a light laps its border
  every 7 s (one shared loop, visible cards only, still under reduced motion). It is on for every card that uses it (artists, motifs, aftercare guides).
- Every motif image on the site is a `MotifTurn` (plate + on-skin photo, `components/motifs/MotifTurn.tsx`).
  - It revolves (`Revolve.tsx`, `.revolve` in globals.css) to a photo of the motif tattooed on the body, with varied
    placement, skin tone, angle and framing (`wornOn` in motifs.ts).
  - Desktop: hover or keyboard focus. Touch screens: it turns by itself while mid-screen.
  - Photos come from `scripts/worn-art.mjs` (Nano Banana 2, four per 2x2 grid, plates as references). It is a dry
    run unless `--spend` is passed; `--resplit <grid>` re-crops saved grids for free.
  - A new motif needs a plate, a shot line in the script and a photo.
- Boot screen: `components/site/BootLoader.tsx` + `.boot*` in `app/globals.css`, on every full load (about 2.8 s).
  It fires `uroko:reveal` when the window opens (Emblem3D and HeroInk start) and `uroko:ready` when the page is
  released.
- Every colour, size, radius and easing is a token in `app/globals.css` `@theme`. No arbitrary values in components
  unless the token is added first.
- Mobile first: most visitors arrive from Instagram on phones. Budget: ≤600 KB first load, LCP < 2 s on 4G.
- Sound is off by default and only ever starts from the labelled toggle. Respect `prefers-reduced-motion`.
- Nothing is charged; the booking deposit is a demo.
  - The card fields have no form `name`, so the browser never sends them.
  - They are checked in the browser (`lib/booking/card.ts`).
  - Only the last four digits of a published test card reach the server, which accepts nothing else.
- The Japanese display font is subset to the glyphs in use. After adding Japanese text, run
  `node scripts/subset-fonts.mjs` to regenerate `app/fonts/*.woff2` (`scripts/glyphs.mjs` just lists the glyphs).
  It also writes the capitals-only masthead subset.

## Deploying (Vercel, from a public GitHub repo)

- Set **`BOOKING_SECRET`** in Vercel (Project → Settings → Environment Variables, for Production and Preview) to a
  long random value. It signs the booking cookie. Without it, the fallback in the public code is used and anyone
  could forge their own booking cookie. Do not prefix it with `NEXT_PUBLIC_`. To make a value, run either of these
  and paste the output:
  ```
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  openssl rand -base64 32
  ```
  Redeploy after adding it; environment variables only reach new builds.
- Share previews, the sitemap and search data use Vercel's own **`VERCEL_PROJECT_PRODUCTION_URL`** automatically;
  nothing to set. Locally they fall back to `https://uroko.example`.
- Security headers are set in `next.config.ts` (nosniff, no framing, referrer policy, permissions policy;
  `X-Powered-By` is off). Vercel adds HSTS itself.
- The audit and what was fixed: `SECURITY-AUDIT.md`. `npm audit` still needs running from a machine with registry
  access.

## Layout

- `app/` routes · `components/site` shell · `components/ui` primitives · `components/home` hero, 3D mark, motion ·
  `components/motifs` plates and revolving cards · `components/sound` audio toggle · `lib/content` studio, motif and
  artist data · `lib/booking` booking state, validation and the test-card check.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

- Booking state travels in a signed httpOnly cookie (`lib/booking/store.ts`). No database, nothing is charged. See Deploying for `BOOKING_SECRET`.

- `node scripts/ambience.mjs` regenerates the synthesised ambience loop in `public/audio/` (procedural, no samples). `scripts/subset-fonts.mjs` also emits the TTFs that the Open Graph images use.

- Motif plates: `node --experimental-strip-types scripts/motif-art.mjs --only <slugs>` regenerates via Higgsfield GPT Image 2.5 (0.25 credits each, low quality is enough). Hard cap: 30 Higgsfield credits for the whole site; cap raised to 40 by the user; 63.72 actually spent after an accidental 24-credit overspend (log in memory). Do not spend more without the user's go-ahead. Raw PNGs land in `generated/` (ignored); `scripts/contact-sheet.mjs` tiles them for review.

- `npm test` runs the Playwright smoke suite (tests/site.spec.ts) against a production build on port 3012 using the installed Chrome. Run `npm run build` first.
