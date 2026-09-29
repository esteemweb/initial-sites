# Uroko (鱗)

Demo site for a fictional Japanese tattoo studio in Motomachi, Yokohama: traditional irezumi by hand (tebori) and by
machine. Built as an agency portfolio piece. Every name, address, artist, booking and price is invented; nothing is
charged anywhere.

## What it does

- **Motif library** — 23 traditional motifs with meanings, placements and session counts. Filters and search live in
  the URL; a motif opens as a side panel from the library and as a full page from a shared link.
- **Artists** — three resident artists with focus, availability and recent work.
- **Studio** — tebori versus machine, how sessions are planned, a desktop pinned chapter built on native scroll.
- **Booking** — three-step consultation booking with server-side validation, a simulated deposit (test card only) and
  a calendar file. State travels in a signed cookie; there is no database.
- **Piece tracker** — progress ring, next session, healing notes and the full plan for multi-session work.
- **Aftercare** — day-by-day timeline plus four guides.
- **Sound** — an ambience loop that is off until the visitor presses a labelled toggle.

## Stack

Next.js 16 (App Router, no `src/`), TypeScript, Tailwind v4 with every value as a token in `app/globals.css`.
Fonts are self-hosted and subset to the glyphs in use. Motif plates were generated once with an image model from
prompts written for this project and stored as WebP; the typographic plate is the fallback.

## Run

```
npm install
npm run dev          # http://localhost:3010
npm run build && npm start
npm test             # Playwright smoke tests against the production build (uses installed Chrome)
```

Set `BOOKING_SECRET` in production and replace `uroko.example` in `lib/content/site.ts` with the real domain.

## Scripts

| Script | Purpose |
|---|---|
| `node scripts/subset-fonts.mjs` | Regenerate the Japanese font subsets after adding Japanese text |
| `node scripts/ambience.mjs` | Re-synthesise the ambience loop (procedural, no samples) |
| `node --experimental-strip-types scripts/motif-art.mjs --only koi` | Regenerate a motif plate (costs credits; capped) |
| `node scripts/contact-sheet.mjs` | Tile all plates into one review image |

## Design

Uroko's look is its own: a mark of overlapping fish scales, a hero of indigo ink spreading into the scale pattern,
and a palette of traditional pigments (sumi black, indigo, shell white, vermilion). The current direction and its
rules are in `CLAUDE.md`. All copy, images, audio and code were made for this project.
