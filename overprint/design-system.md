# Design system — Overprint

Synthesised from: `refs/flowers-sim/autopsy.md` (single reference)
Written: 2026-09-23 · Tokens live in: `src/app/globals.css` (`@theme`) · Tailwind version verified: v4 (`tailwindcss ^4`, `@import "tailwindcss"`)

Every entry carries provenance. `ref` = `refs/flowers-sim/autopsy.md`. `brief` = Overprint's stated constraints (live CMYK multiply layering, massive type, no stock photography, strict accessibility, fast loading).

---

## Decisions log

**One reference, so structure was taken and three axes diverge on purpose:**

| Axis | Reference | Overprint | Why |
|---|---|---|---|
| Surface | `#000` + 15% grain (ref §4) | **paper `#F4F1EA`** + faint paper grain | `multiply` on black is always black — ink layering needs a light substrate (brief) |
| Type families | condensed serif + mono (ref §3) | **Tangerine script headlines + Jost sans body** (user choice 2026-09-23; was Archivo 900 + IBM Plex Mono) | user direction; still breaks recognisability vs the ref's serif |
| Imagery | blurred photo + video (ref §7) | **generated photography (user choice, 2026-09-23): hero street shot + one image per work card; type + CSS ink shapes elsewhere** | brief: zero *stock* photography — the hero image is original (Nano Banana), not stock |
| Layout engine | absolute px + `zoom` (ref §2, weak) | **CSS grid, fluid `clamp()` type** | reflows at 200% zoom; a11y |
| Scroll | wheel hijack 1.4s, no reduced-motion (ref §8, weak) | **native scroll; CSS scroll-driven registration only when motion allowed** | keyboard + fast loading (brief) |

**Signature items → adjacent version**
- Hero: **user chose to match the reference hero** (full-bleed image, ink scrim, bracket index mid-left, intro + headline on the bottom edge, paper text). Divergence kept only in the subject — a generated street panning shot (model sharp on a city crossing, buses/taxis/traffic lights streaked) instead of their hat portrait.
- "F/s" logo + 272px "Flowers/sim®" footer wordmark → header text logo with CMYK dots. Footer: **user chose to match the reference** (phase 4) — edge-to-edge uppercase OVERPRINT wordmark on ink; kept Overprint's own by printing it as glowing CMYK plates.
- Oxblood `#A72D25` accent → four process inks, used as plates, never as small text.
- Bracket labels "(D)" → plate letters (C)(M)(Y)(K) — same device, Overprint's own meaning.
- Pinned 4686px horizontal gallery → native `scroll-snap` strip the keyboard can scroll.

**Taken as-is (craft)**: 8-col grid / 6px gutter / 10px edge, headlines starting at column 5, sub-1 serif-style line-height on display type, mono for all running text, 1px hairline separation, radius 0, no shadows, 100vh hero with headline on the bottom edge, inline chips inside a headline, press-in hover (scale down) at 200ms.

---

## 1. Foundations

| Token | Value | Source |
|---|---|---|
| `--spacing-edge` | 0.625rem (10px) all widths | ref §2 |
| `--spacing-gutter` | 0.375rem (6px) | ref §2 |
| columns | 8 at ≥ `md` (60rem / 960px), 4 below | ref §2 (8×172 @1440); 4-col mobile = decided |
| `--breakpoint-md` | 60rem (960) | ref §11 design tier |
| `--breakpoint-lg` | 75rem (1200) | ref §11 |
| `--breakpoint-xl` | 90rem (1440) | ref §11 |
| container | none — full width minus edge | ref §2 (edge-hugging) |

**Layout rules:** everything left-aligned; section headlines start at column 5 on desktop (`md:col-start-5`) and span full width on mobile; columns 1–2 hold indexes, small labels and meta. Utility: `grid-page`.

## 2. Spacing

| Token | Value | Used for | Source |
|---|---|---|---|
| `--spacing-edge` | 0.625rem | page side padding | ref §2 |
| `--spacing-gutter` | 0.375rem | grid column gap, card grid gap | ref §2 |
| `--spacing-target` | 2.75rem (44px) | min height of every link/control | brief (a11y) |
| `--spacing-stack` / `-sm` | 6rem / 3rem | headline → body copy | ref §5 (98px) |
| `--spacing-section` / `-sm` | 11rem / 5.5rem | section top padding — **2:1** | ref §2 (headlines at y≈181 in each artboard) |
| `--spacing-panel` | 125svh | min height of text panels over the pinned image | user choice (image holds to the 3rd–4th scroll) |
| `--spacing-pin` | 320svh | Process pinned-gallery section height | ref §8 (4686px pinned section) |
| `--spacing-card` / `-md` | 80vw / 36vw | Process step card width | decided — whole card fits one pinned screen |

Plus Tailwind's default 4px multiplier scale for small internal gaps.

## 3. Typography

**User choice (2026-09-23): headlines in Tangerine; secondary picked to complement it → Jost.** Tangerine is a calligraphic chancery script (static, 400/700 only); Jost is a geometric Futura-lineage sans whose even, upright forms contrast the script and stay highly readable at UI sizes.

| Role | Token | Family | Source |
|---|---|---|---|
| headlines / display / logo / wordmark | `--font-display` | Tangerine 700 (fallback Snell Roundhand, Apple Chancery, cursive) | user choice |
| body / UI / labels / eyebrows | `--font-body` | Jost (variable wght) | decided — complements Tangerine |

**Measured metrics** (canvas, 100px): Tangerine x-height 0.26em · cap 0.68em · ascender 0.76em · descender 0.25em. Archivo (previous) x-height 0.53em. Jost x-height 0.46em (Plex Mono 0.52em).

| Token | Size | Line-height | Tracking | Used for | Source |
|---|---|---|---|---|---|
| `--text-micro` | 0.75rem (12) | 1.2 | 0.02em | labels, meta, bracket plates | ref 8–10px **raised to 12** (a11y) |
| `--text-body` | 1rem (16) | 1.5 | 0 | all running text, nav | Plex 15px → Jost 16px (x-height 0.46 vs 0.52) |
| `--text-lede` | clamp(1.0625rem → 1.375rem) | 1.4 | 0 | intro paragraphs | ref 13px mono intro, enlarged |
| `--text-title` | clamp(2rem → 3.25rem) | 0.95 | 0 | card titles, rule titles, numerals, logo | 1.6× the Archivo size |
| `--text-head` | clamp(3.5rem → 8.75rem) | 0.9 | 0 | section h2, hero h1 | 1.6× the Archivo size |
| `--text-display` | clamp(4rem → 23vw) | 0.9 | 0 | Process fallback glyph | 1.6× |

- **Why 1.6×:** Tangerine's x-height is half Archivo's, so display tokens were scaled ×1.6 to keep the same optical size. Script letters connect, so all display tracking is 0.
- Headings: weight 700, `font-variant-ligatures: common-ligatures contextual`, `text-wrap: balance`. Script is never used below `text-title` — small labels such as "(C)" use Jost semibold.
- **Footer wordmark** "Overprint" (sentence case — all-caps script is 6.59em wide and reads poorly) uses `.wordmark-fit`: `font-size: calc(100cqi / var(--wordmark-em))`, `--wordmark-em: 2.62` (2.582em measured + 0.035em plate shift), line-height 1.05 for the descender.
- Fading text over the pinned image: the Principles heading and each rule fade individually (the list is taller than a screen at Tangerine sizes).
- Case: headings sentence case; eyebrows uppercase Jost.

## 4. Colour

| Role | Token | Value | Contrast on paper | Source |
|---|---|---|---|---|
| surface | `--color-paper` | `#F4F1EA` | — | brief |
| text | `--color-ink` | `#161412` (K plate) | 16.29:1 | brief |
| muted text | `--color-ink-muted` | `#595653` (ink @ 70%) | 6.46:1 | decided |
| hairline | `--color-rule` | `#85837E` (ink @ 50%) | 3.36:1 (non-text ≥ 3) | ref 1px @ 40% white |
| C plate | `--color-cyan` | `#00A3E0` | 2.54 — **never text** | brief |
| M plate | `--color-magenta` | `#E4007C` | 4.06 — large text only | brief |
| Y plate | `--color-yellow` | `#FFE500` | 1.13 — **never text** | brief |
| small-text accent | `--color-magenta-deep` | `#B3005F` | 6.04:1 | decided |

- Ink over plates: K on C 6.40 · K on M 4.02 · K on Y 14.40 · **K on C×M overlap 1.07 → text never sits on overlaps.**
- Plates render with `mix-blend-mode: multiply` inside an `isolation: isolate` stack. On ink (`.on-ink`) plates switch to `screen` and the K plate prints in paper — multiply is invisible on a dark substrate.
- Colour plates are always `aria-hidden`; the readable copy is the K plate or a separate element.
- Dark mode: none — ink needs paper (the substrate is the concept).

## 4b. Logo (2026-09-23, user brief: "a proper logo … in these three colours only")

- **Colours:** `#00A3E0` cyan · `#E4007C` magenta · `#FFE500` yellow — nothing else (no ink, no paper, no blend-generated overlap colours: plates simply stack).
- **Wordmark** `public/logo/overprint-logo.svg`: "Overprint" in Tangerine Bold, converted to outlines (fontTools + HarfBuzz shaping, kerning/ligatures on), printed as three plates stepped 34 units (3.4% of the em) to the right — cyan at the back, magenta, yellow on top — the order of the user's three-dot reference. Used in the header (`h-14` / `md:h-16`, alt "Overprint").
- **Mark** `public/logo/overprint-mark.svg`: three overlapping discs C → M → Y in a row (the reference image, refined).
- **Favicon** `src/app/icon.svg`: three overlapping discs in a triangle — the script "O" was too thin to survive 16px.
- Built for dark grounds (header over the hero image, ink footer). On paper the yellow face weakens (1.13:1) — it still reads through its magenta/cyan edges, but prefer dark placement.
- Rebuild: `scratchpad/logo/make_logo.py` pattern — shape text with HarfBuzz, draw glyphs through `SVGPathPen` with a y-flip transform, emit one `<path>` per plate.

## 5. Shape and depth

- Radius: **0** everywhere; `rounded-full` only for ink dots/discs. (ref §6)
- Separation: 1px `--color-rule` hairlines. No shadows. (ref §6)
- Depth: overlap + multiply, not elevation.
- Paper grain: fixed SVG turbulence overlay at 6% opacity, `pointer-events:none`. (ref §4 grain, adapted)
- Focus ring: 3px solid ink, 3px offset (paper on ink panels). (brief)

## 6. Motion

| Token | Value | Used for | Source |
|---|---|---|---|
| `--ease-press` | cubic-bezier(.42,0,.58,1) | hover press | ref easeInOut 200ms |
| `--ease-reveal` | cubic-bezier(.25,.46,.45,.94) | hero plate registration | ref `power1.out` |
| `--plate-shift` | 0.035em | resting misregistration | decided |
| hover | `scale-95`, 200ms | links/tiles only | ref scale 0.9, softened |

- **Registration reveal:** plates start ×6 misregistered and slide into register as the block enters view — CSS `animation-timeline: view()`, zero JS.
- All motion lives inside `@media (prefers-reduced-motion: no-preference)`; reduced = plates static at resting offset.
- Intensity: `subtle`. Functional? decorative — so it is removable.

## 7. Page architecture (ref §9, reordered for a studio)

1. Header (not fixed; overlays the hero image at all widths): wordmark · stacked nav in col 5 · "Start a project" tile top-right
2. **Image zone** (user choice, 2026-09-23 — ref §9 items 2–3, where the hero photo keeps running behind the 01–04 list): `<ImageZone>` pins `public/images/hero-street-motion.jpg` (Nano Banana via agy, 1376×768 — street panning shot: buses, taxis, traffic lights, pedestrians in motion blur) as a sticky 100svh backdrop — `ink/40` scrim, top `ink/60` and bottom `ink/80` gradients, paper text — while three panels scroll over it (~3.5 screens total, `--spacing-panel: 125svh` for panels 2–3):
   - Hero — (C)(M)(Y)(K) index cols 1–2 with `paper/40` hairlines; mono intro; h1 on the bottom edge. Header overlays it (paper text, paper focus ring).
   - Principles — numbered 01–04 rows on col 5, `paper/40` hairlines, body `paper/85`.
   - Statement — inline ink chips (normal blend on the photo; multiply would sink them) + 3 mono paragraphs in col 5.
   - Motion: image zooms 1 → 1.12 over the first 300vh (`.backdrop-zoom`, `scroll(root)`); each panel rises in and lifts out (`.panel-fade`, `view()`). Both reduced-motion safe.
   - Panels 2–3 carry a local shade behind their text column (`w-3/4 bg-radial from-ink/75 to-transparent to-95%`, scrolls with the panel) so the busy street stays bright elsewhere; secondary copy is full paper, not /85.
   - Measured worst-case contrast over the street image (p95-brightest backdrop pixel): nav 7.09 · index 5.82 · intro 7.33 · h1 9.95 · rules h2 8.80 · rule titles ≥ 5.74 · rule bodies ≥ 5.06 · statement h2 6.48 · statement paras ≥ 5.01.
5. Selected work (phase 1, 2026-09-23 — ref §9 item 6 catalog grid): 4 cards 2-col 7:8 on cols 1–4 beside one feature on cols 5–8 spanning both rows, `gutter` gaps both axes; each card a generated photo (`public/images/work/*-photo.jpg`, Nano Banana 2 via Higgsfield, portrait 4:5, hyperrealistic), title + meta set on the image over a bottom `ink/85` gradient; image `scale-105` on hover (500ms, `ease-press`). Placeholder projects.
6. Process (phase 2, 2026-09-23 — ref §8/§9 item 5 pinned horizontal gallery): section is `--spacing-pin` (320svh) tall with a sticky 100svh box; the track (intro card + 4 step cards, `--spacing-card` 80vw / `--spacing-card-md` 36vw, image 3:2) slides left by exactly its overflow (`translate: calc(-100% + 100cqw)`) on a named view timeline over `contain 0% → 100%`. Pure CSS; reduced motion / no scroll-timeline support = native keyboard-scrollable snap strip. All four step images generated (`public/images/process/{proof,separate,register,print}-photo.jpg`, Nano Banana 2 via Higgsfield, hyperrealistic). A step without an `image` falls back to a live CMYK plate glyph (`.plate-shift-wide`, 0.08em).
7. Studio (phase 3, 2026-09-23 — ref §9 item 9 team rows): intro headline + lede on col 5; one row per person with `rule` hairlines — portrait col 1 (4:5, `rule` border), name/role cols 3–4, bio cols 5–8; mobile = portrait col 1 + name cols 2–4, bio full width. Portraits: `public/images/team/*-casual.jpg` (Z Image via Higgsfield at the user's request, cheapest tier; casual, looking at camera, 3:4 cropped to 4:5); a person without `portrait` falls back to a CMYK ink-disc monogram. Placeholder people/bios.
8. Footer (phase 4, 2026-09-23 — ref §9 item 10): 100svh `bg-ink` panel, `on-ink`. Bracket (C)(M)(Y)(K) index nav cols 1–2 (44px links, `paper/40` hairlines) · contact block col 5 (h2, lede, email link) · edge-to-edge OVERPRINT wordmark on the bottom edge (`.wordmark-fit`: `font-size: calc(100cqi / var(--wordmark-em))`, `--wordmark-em: 6.24` = 6.2em advance + 0.035em plate shift) · small-print bar. Muted text `paper/70` = 8.38:1 on ink; hairlines `paper/40` = 3.52:1.

Section anatomy: `section.pt-section-sm md:pt-section` → `grid-page` → eyebrow (col 1–2, micro) + h2 (col 5–8, head) → content.

## 8. Components

- **Nav link:** mono body, `min-h-target`, underline on hover/focus, hairline between rows.
- **Index row:** plate letter in a 1.5rem ink disc + label, hairline below, `min-h-target`.
- **Numbered row:** numeral `text-title` col 5, title `text-title` col 6–8, body mono muted, hairline top.
- **Work card:** `<article>`; art box `aspect-7/8` with ink shapes; title `text-title`; meta micro muted. Not a link (no case-study pages yet).
- **CTA tile → project enquiry** (`components/project-dialog.tsx`, 2026-09-23): the header tile is a `<button>` with a photo background (`process/separate-photo.jpg`, reused) under an `ink/90→ink/20` gradient; it opens a native `<dialog>` (right half on desktop, full screen on mobile; Esc closes, focus returns to the tile). Fields: name*, email*, company, project types* (C/M/Y/K checkbox chips), budget, timeline, message* (≥20 chars) + hidden honeypot. Validation in `lib/enquiry.ts`; errors are inline, prefixed "Error:", in yellow (14.4:1 on ink), linked by `aria-describedby`, and focus jumps to the first invalid field. **Demo site (2026-09-26): nothing is sent or stored** — a valid submit shows the confirmation plus the quiet line "Demo site: no enquiry was sent." (`text-micro`, `paper/70`, 8.38:1). No API route exists. All controls ≥ 44px.
- **Footer email** (`components/email-actions.tsx`): the address is a disclosure button (not a bare mailto) opening three 44px actions — Copy address (clipboard + `role=status` announcement), Open in your email app (mailto), Send through our form (opens the enquiry dialog via `openEnquiry()` / the `overprint:open-enquiry` event in `lib/site.ts`). Esc/outside-click close; focus returns to the address. Footer index (K) is now “Send a brief” → the same dialog. The address is `hello@overprint.example` (`lib/site.ts`) — a reserved `.example` domain that can never belong to anyone (was `hello@overprint.studio`, a domain registered to a third party; changed 2026-09-26, see SECURITY-AUDIT.md).
- **PlateText:** K plate = real text; C/M/Y duplicates `aria-hidden`, multiply, offset by `--plate-shift`.
- **Ink chip:** `.ink-chip` — two 0.8em discs, second shifted 0.28em, margin 0.08em / 0.36em so it never touches the next word.
- **Process slab:** colour block carries only the decorative plate letter; step counter and copy sit below on paper (12px text never sits on magenta — 4.02:1).
- **Overflow:** `main` and `footer` use `overflow-x: clip` so plate fringes at the page edge never create sideways scroll.
- **Scroll registration range:** `entry 0% → entry 100%` so blocks at the very end of the page still finish registering.

## 9. Responsive rules

| Width | Columns | Section top | Display |
|---|---|---|---|
| < 960 | 4 | 5.5rem | `14.8vw`, min 2.5rem |
| ≥ 960 | 8 | 11rem | `14.8vw` |

- Headings go to full width below `md`; indexes stack above the headline.
- Nothing hides on mobile. Touch targets ≥ 44px.

## 10. Originality boundary

**Taken:** grid ratios, col-5 headline axis, type proportions (line-height < 1, mono body), hairline/radius-0 language, section rhythm, 100vh hero with bottom-anchored headline, inline chips, press-in hover.
**Not taken:** photography, video, F/s marks, wordmark footer, oxblood, copy, bracket labels' meaning, scroll hijack, pinned gallery. No copy, image or logo comes from the reference.

---

## Token audit

Every value above exists in `src/app/globals.css` `@theme` (or as a documented `:root` variable for `--plate-shift` / `--reg`, which have no Tailwind namespace). Verified: 2026-09-23.
