# Corneum design system

Tokens live in `src/app/globals.css` (`@theme` + `@utility`). Tailwind's default scales are wiped, so a class that isn't in this file does not generate. **Sources:** "Prompt" = the step-1 build prompt. "Autopsy §n" = `REFERENCE-AUTOPSY.md`.

> **Status:** complete (steps 1–7). Product data lives in `src/data/products.ts`, tagged `brief` or `draft`; see DATA-NOTES.md.

## Colour
| Token | Value | Use | Contrast on paper | Source |
|---|---|---|---|---|
| `paper` | #FFFFFF | The ground, everywhere | — | Prompt |
| `ink` | #000000 | All type, rules, structure; primary button fill | 21:1 | Prompt |
| `green` | #00524A | Data and active percentages **only**. Never a fill, never a link. | 9.11:1 | Prompt |
| `ink-muted` | ink @ 0.6 | Secondary text, labels | 5.74:1 ✅ AA | Prompt; autopsy §3 (muted = ink at opacity) |
| `hairline` | ink @ 0.12, 1px | The only separator | 1.32:1, **separators only**, never a component boundary (fails WCAG 1.4.11) | Prompt; autopsy §7 |
| backdrop | `bg-ink/60` | Modal backdrop (the 0.6 step) | — | Autopsy §7, blur dropped |

Two UI colours per screen, three at most. No gradients, no tints. There is no error colour: errors are words with an `ERROR —` mono prefix.

## Type
Geist Sans (variable, one file: 300 display/headings, 400 body) and Geist Mono 400 (one file), via `next/font/google`: self-hosted, preloaded, metric-matched fallback. Measured: 2 font requests, 52KB.

| Utility | <1024 | ≥1024 | Font | Line height | Tracking |
|---|---|---|---|---|---|
| `type-display` | 44 | 140 | Sans 300 | 1.0 | −0.04em |
| `type-h3` | 34 | 56 | Sans 300 | 1.1 → 1.0 | −0.02em |
| `type-h4` | 20 | 32 | Sans 300 | 1.2 → 1.0 | −0.02em |
| `type-subtitle` | 20 | 20 | Sans 400 | 1.2 | 0 |
| `type-body` | **16** | 14 | Sans 400 | 1.4 | 0 |
| `type-data` | 14 | 14 | Mono 400 uppercase | 1.4 | 0 |

Source: prompt (scale), autopsy §2 (ratio, solid leading, tracking). Stepped at 1024 with no clamp. Headings use `text-wrap: balance`. Prose uses `max-w-measure` (55ch). Hierarchy comes from size, family and opacity, never bold (`font-bold` does not exist).

## Spacing
`0 · 8 · 16 · 20 · 24 · 40 · 48 · 64 · 96 · 160`, px-named (`p-20` = 20px). Grid gutter and margin are both 20.
Sizes (not spacing): `max-w-modal` 454px (autopsy §7), `max-w-measure` 55ch.

## Grid
`grid-page`: 12 columns, 20px gap, 20px inline padding, no max-width, 12 columns at every width. Left = feeling (large). Right rail from col 9 = facts (3 columns). Centre = product. Centred text = the brand speaking in first person. Staggered lines snap to column starts. Source: autopsy §1.

## Radius
`rounded-none` for imagery · `rounded-panel` 20px for panels and modals · `rounded-pill` 999px for anything tappable. Nothing else.

## Motion
`ease-enter` cubic-bezier(0.16, 1, 0.3, 1) at 520–920ms (the modal uses 720) · `ease-exit` cubic-bezier(0.55, 0, 0.85, 0.36) at 360ms (**exit duration was not specified: proposed**) · link and button hover to opacity 0.72 at 160ms · active 0.6. Nothing loops and nothing exceeds 920ms. Under `prefers-reduced-motion` every transition resolves instantly to its end state. Source: autopsy §5 and §12.

**Additions (final pass).** All of these are opt-in: the default style is the finished state, so reduced motion, older browsers and no-JS get the complete page.
- **Title rise:** every page title rises out of a baseline mask on load (720ms, ease-enter). On the home page the second line starts 80ms later. Utility `title-rise`.
- **Reading fill:** the home premise fills in word by word from 0.45 opacity (still 3:1 contrast) as it scrolls up. `ReadingLine`, CSS scroll-driven.
- **Hairline draw:** each `Section`'s top hairline draws left to right as the section enters. CSS scroll-driven.
- **Product morph:** a product image morphs from card to product page and back. React `ViewTransition`, `share="morph"`, 720ms ease-enter. The page crossfades around it: out 360ms ease-exit, in 520ms ease-enter. Under reduced motion the swap is instant.
- **Wayfinding:** the current nav section gets `aria-current` and a 1px ink underline (`NavLink`).
- **Also:** a skip link is the first focusable element, and text selection is ink on paper.

## Focus
`:focus-visible`: 2px solid ink outline, 2px offset, on everything.

## Components
| Component | File | States |
|---|---|---|
| Button (primary: ink fill; secondary: paper + 1px ink border) | `components/ui/Button.tsx` | default, hover, active, focus, disabled, loading (width-locked), error (text + `aria-describedby`); empty = N/A |
| Hairline | `components/ui/Hairline.tsx` | static |
| MetaRow / MetaList | `components/ui/MetaRow.tsx` | default, loading, error, empty; hover/active/focus = N/A (static). Value at col 9 from 1024, **col 7 below** (four 10.8px columns can't hold a value) |
| Card (the one card) | `components/ui/Card.tsx` | default, hover (0.72), focus (ring), active; image pending shows a ratio-held empty slot |
| ProductImage | `components/ui/ProductImage.tsx` | 4:5, radius 0; `Photograph pending` until a file exists |
| BuyBar | `components/site/BuyBar.tsx` | fixed bottom below 1024; pages add `pb-96` |
| DoseLine | `components/site/DoseLine.tsx` | SVG drawing from brief §6; the product page's one orchestrated moment (fill rises 920ms, once) |
| SpecTable | `components/ui/SpecTable.tsx` | Comparisons only (added step 4; a comparison is tabular, not a card grid). `<table>` on the page grid with explicit roles; default, loading, error, empty. Hidden below 1024; pages stack MetaRows instead |
| SpecModal | `components/ui/SpecModal.tsx` | default, loading, error, empty; native `<dialog>` |
| VesselFlight | `components/site/VesselFlight.tsx`, `lib/flight.ts` | Vessel 01 as one continuous object from the hero into the pin: 90 Blender-rendered frames (alpha WebP) on one fixed canvas that places itself between two anchors (`data-vessel-anchor="hero"` / `"pin"`). It tumbles and swings over the premise line on the way, then turns, fills and caps in the pin. Frame 1 loads with the page; the rest wait for the first scroll. Reduced motion and no JS get the hero still and the pin still |
| Section | `components/site/Section.tsx` | Page section frame: hairline above, mono label at col 1, `py-64 lg:py-96`. Shared by every page |
| SkinSection, GrowthCycle | `components/site/*.tsx` | Static SVG diagrams, 340-unit viewBox so 14-unit labels stay ≥14px on a phone; `<title>` + `<desc>` |
| QuantityStepper | `components/ui/QuantityStepper.tsx` | − / value / +; 48px pills, 1px ink border; default, hover, focus, disabled at 1 and 9, loading |
| TextField | `components/ui/TextField.tsx` | label above (data, 0.6); 48px pill input (radius rule: tappable = 999), 1px ink border; default, hover, focus, filled, disabled (hairline border), error (2px border + `ERROR —` text, `aria-invalid`) |
| Grid / GridOverlay | `components/ui/Grid.tsx`, `GridOverlay.tsx` | overlay toggled with G |

Data type is uppercase, but case-sensitive units keep their case via `keepCase()` (`src/lib/keepCase.tsx`): pH never renders as PH.

Print: with a spec sheet open, only the sheet prints ("Print spec sheet" → save as PDF).

Touch targets are 48px minimum, including text-style triggers and the modal close button.

## The orchestrated moment
The build prompt allows one orchestrated moment: the Vessel 01 pin. At the user's request ("rotate like the reference") it now starts in the hero. The vessel lifts off, tumbles across the premise line and lands in the pin. This deliberately adopts the reference's travelling-object technique, which the autopsy had listed as leave-behind. It is still one moment, one object, and it ends when the pin releases. Everything else on the page stays still.

## Metadata and share cards
- **Icons:** `src/app/icon.svg` (the vessel outline with its dose line, in ink only) and `src/app/apple-icon.png` (180px).
- **Share cards** (1200×630, rendered at build time by `src/app/_og/card.tsx`):
  - built in this system: paper, a mono kicker, a Geist Light title, a hairline, a mono data line with green only on percentages, and the product image at radius 0;
  - one for the home page (`app/opengraph-image.tsx`) and one per product (`app/range/[slug]/opengraph-image.tsx`);
  - fonts are TTFs in `src/app/_og/`.
- **`sitemap.xml` / `robots.txt`:** from `app/sitemap.ts` and `app/robots.ts`. `/bag`, `/checkout` and `/styleguide` are disallowed.
- **Absolute URLs** come from `SITE_URL` (`src/lib/site.ts`): `NEXT_PUBLIC_SITE_URL`, falling back to `http://localhost:3005`. **Set it before any deployment**, or the cards and sitemap will point at localhost.

## Tests
`npm test` runs Node's built-in test runner over `src/**/*.test.ts`. There are no extra packages, because Node 24 strips the types. `src/lib/rules.test.ts` covers the first-order vessel rule (`src/lib/rules.ts`), which the bag and checkout both read through `canCheckout`.
