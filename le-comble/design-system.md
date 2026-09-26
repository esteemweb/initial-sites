# Design system — Le Comble

Synthesised from: `REFERENCE-AUTOPSY.md` (KUBE Saint-Tropez, single reference) + `BRIEF.md`
Written: 24 September 2026 · Tokens live in: `src/app/globals.css` (`@theme` + `@utility` type roles)
Tailwind version: **v4** — the project is not scaffolded yet; this matches the house stack (Next 16, Tailwind 4, as in `overprint`, `Corneum`, `leafandcherry`). Default Tailwind scales are wiped with `initial`, so a class that isn't a token doesn't exist.

Provenance keys: **`ref §n`** = REFERENCE-AUTOPSY.md section · **`brief §n`** = BRIEF.md section · **`decided`** = my call, reason given · `(estimated)` = descends from an eyeballed measurement.

---

## Decisions log

**One reference, so nothing converged.** I took KUBE's *structure* and diverged on purpose. The brief already fixes palette, type direction and photography, so most divergence is the brief's own.

**Taken from KUBE (structure and craft):**
- A 12-column grid with a fixed gutter, full-width sections, and text that stays inside the margin while imagery may break out (ref §2.1–2.2)
- A small heading scale where hierarchy comes from switching typeface (serif headings, grotesque body), not from colour (ref §3.5)
- Exactly **one** accent, used sparingly, on a warm neutral ground; 3 UI colours per screen (ref §4.3)
- Flat, **hairline-separated** lists; no shadows anywhere (ref §6)
- **Stillness**: no scroll reveals, no pinning (ref §7.2)
- The eyebrow → heading → paragraph → link cluster (ref §3.5)
- FAQ answers open with a bold, direct sentence; FAQ blocks scoped per page, plus a full FAQ page (ref §11.2)
- One "Réserver" control that splits into three paths (ref §9, brief §10)
- Lazy-boot third-party booking code on first interaction (ref §7.3)
- Localised URLs, complete hreflang, FR as `x-default`, and a switcher that keeps you on the same page (ref §10)

**Diverged — the load-bearing axes:**
| Axis | KUBE | Le Comble | Why |
|---|---|---|---|
| Type families | Saphion 300, all caps / Inter 14 light | **Instrument Serif** 400 in **sentence case** / **Schibsted Grotesk** 400–500 *(user foundation brief; replaces Bodoni Moda)* | a printing-city serif, not Playfair; caps-at-300 is KUBE's signature (ref §15) |
| Colour | Lime `#daf092` on cream; lime **is** the action colour | **Four colours: chaux, indigo, vermillon, ciel** *(user foundation brief; replaces plaster/indigo/brass)*. All text is indigo; vermillon is fills, icons and display type only | the two Croix-Rousse dyes plus workshop daylight; bright because the building is bright |
| Motion | Lenis smooth scroll, nav shrinks on scroll, image drift | **Native scroll, a nav that doesn't shrink, no parallax**. Only hover and panel transitions | removes KUBE's heaviest motion, and reduced motion is handled |
| Paired images | Landscape pairs, full-bleed, 2–3px seams, second image appears on hover | **Two portraits**, kept inside the grid, offset against each other, both always visible | brief §11 asks for portrait pairs; KUBE's hover-only second image hides half the photos on touch devices (ref §14.14) |
| Radius | 4 / 8 / round | ~~0 everywhere~~ → **8 / 12 / 16** (user request, see §5) | originally square for the industrial building; the user asked for rounded corners |
| Section thread | Centred 1px vertical hairline | A **vertical rule on a column line**, never centred ("warp") | KUBE signature → adjacent version (brief §11 warp and weft) |
| Type | fluid `clamp()` everywhere | **Stepped once at 1024px** | house convention; easier to verify |
| Prices | hidden until the booking engine | **shown** on rooms, the menu, and in the booking panel | ref §15 Q3: a €190 room and a single €68 menu can state their price |

**Decided on the user's behalf:**
- **Superseded 24 September 2026 by the user's foundation brief:** the fonts (Bodoni Moda → Instrument Serif), the palette (plaster / indigo / brass / two inks / error → four colours) and the type scale (see §3, §4). The rest of this log stands.
- Leading for xl (1.1), lg (1.15), small (1.5) and label (1.3): the brief fixes display, md and body only; these sit between them.
- There is no error colour: an invalid field gets a 2px indigo edge and a message, because there is no fifth colour.
- The nav stays solid chaux at all times. There is no see-through state over the hero, which removes KUBE's invisible-"FR" bug (ref §14.10).

---

## 1. Foundations

| Token | Value | Source |
|---|---|---|
| page container | `--container-page` 1440px max (content 1344 at desktop margins) | decided — KUBE has no effective cap (ref §2.1); long lines of display type need one |
| booking sheet (desktop) | `--container-sheet` 400px | decided — KUBE's panel is 135px, too small to hold a line of facts (ref §9.1) |
| prose measure | `--container-prose` 62ch | ref §3.4 — KUBE runs about 80ch and it reads badly; 62 sits inside 45–75 |
| page margin | 20px (<768) · 32px (768–1023) · 48px (≥1024) | ref §2.1 (KUBE 16.7 → 34.7 → 48 fluid), stepped and rounded |
| gutter | 16px (<1024) · 24px (≥1024) | ref §2.1 (16 fixed); widened at desktop so the warp lines read |
| columns | 12 at every width; content collapses to 1 column at <768 but the rules still land on the 12-column lines | ref §2.1 |
| base unit | 4px | ref §2.3 (8 / 12 / 16 steps) |

**Layout rules**
- Text **never** leaves the container. Only photography and indigo colour bands may run full width.
- Centred alignment is only for the hero headline and the closing call to action. Everything else is **left-aligned**. This diverges from KUBE, which centres every section intro (ref §2.2); left alignment suits a printed page.
- Asymmetric splits use whole columns: **5 + 7** or **4 + 8**, with an empty column where the design needs air. Never 6 + 6 with text touching the image.

## 2. Spacing scale

px-named, so `p-24` is 24px. Nothing else generates.

| Token | px | Used for | Source |
|---|---|---|---|
| `spacing-0` | 0 | reset | — |
| `spacing-1` | 1 | rule widths | ref §6 |
| `spacing-2` | 2 | link underline on hover, focus ring and offset, active booking row bar | decided |
| `spacing-4` | 4 | icon to label | ref §2.3 |
| `spacing-8` | 8 | tight stacks | ref §2.3 |
| `spacing-12` | 12 | eyebrow to heading | ref §2.3 |
| `spacing-16` | 16 | mobile gutter, paragraph gap | ref §2.1 |
| `spacing-20` | 20 | mobile margin | decided |
| `spacing-24` | 24 | desktop gutter, heading to body | ref §2.3 |
| `spacing-32` | 32 | body to link, tablet margin | ref §2.3 |
| `spacing-48` | 48 | desktop margin, block gap, button height | ref §2.3 |
| `spacing-56` | 56 | mobile sticky booking bar | decided (§8) |
| `spacing-64` | 64 | section padding (mobile), nav height <1024, booking row minimum | ref §2.3 (72 → rounded) |
| `spacing-72` | 72 | nav height ≥1024 | decided (§8) |
| `spacing-96` | 96 | section padding (desktop) | ref §2.3 (`section-space--main` 96 max) |
| `spacing-128` | 128 | chapter break (desktop) | ref §2.3 (`--large` 128 max) |

- Scale rule: linear up to 32, then roughly doubling (48, 64, 96, 128) — the same shape as KUBE.
- Section padding: **64 on mobile, 96 on desktop, a 1.5:1 ratio**. Chapter breaks use 96 / 128. KUBE only drops to about 0.75× on mobile; I rounded to a cleaner 1.5:1.
- Heading cluster: eyebrow → **12** → heading → **24** → paragraph → **32** → link. From ref §3.5 (estimated), rounded to the scale.

## 3. Typography

*Source: the user's foundation brief, 24 September 2026. Replaces Bodoni Moda and the 1.333 scale.*

**Families** — both from Google Fonts, self-hosted by `next/font` (`src/app/fonts.ts`), subset `latin` (covers every French character including œ Œ « » ’), preloaded, with metric-matched fallback faces generated at build time (Times New Roman at size-adjust 83.94%, Arial at 104.49%). Do not pass a `fallback` list to `next/font`: in Next 16 it replaces the generated face.

| Role | Token | Family | Used for |
|---|---|---|---|
| primary | `--font-serif` | **Instrument Serif** 400 (roman + italic) | display, headings, the menu, prices on room cards |
| secondary | `--font-sans` | **Schibsted Grotesk** 400 / 500 | body, UI, forms, labels, navigation |

**Scale** — `@utility type-*`, one switch at 1024px, no intermediate sizes. Sizes are tokens (`--type-*-lg` / `--type-*-sm`) so the styleguide can show both at once.

| Utility | ≥1024 | <1024 | Face | Leading | Tracking |
|---|---|---|---|---|---|
| `type-display` | 112 | 44 | Instrument Serif | 1.05 | −0.02em (both sizes are ≥40) |
| `type-xl` | 68 | 34 | Instrument Serif | 1.1 *(decided)* | −0.02em ≥1024, 0 below |
| `type-lg` | 40 | 28 | Instrument Serif | 1.15 *(decided)* | −0.02em ≥1024, 0 below |
| `type-md` | 24 | 20 | Instrument Serif | 1.2 | 0 |
| `type-body` | 17 | 16 | Schibsted Grotesk 400 | 1.6 | 0 |
| `type-small` | 14 | 14 | Schibsted Grotesk 400 (500 for UI) | 1.5 *(decided)* | 0 |
| `type-label` | 12 | 12 | Schibsted Grotesk 500, uppercase | 1.3 *(decided)* | +0.08em |

- Tracking −0.02em at 40px and above, 0 below. Line length capped at 62 characters (`--container-prose`).
- **Vermillon type exists only as `type-display-accent`, `type-xl-accent`, `type-lg-accent`** — every one ≥24px at both breakpoints. There is no `md` accent (20px on mobile).
- Case: sentence case for headings; uppercase only in `type-label`. Italic Instrument Serif is kept for dish names on the menu.
- Prices on room cards (rooms list, room detail, booking step 2) and every line of the menu are Instrument Serif, per the brief. Tables of rates stay in the sans with tabular figures.

**The bilingual constraint**
- Every `display` and `xl` string is written in French first, then translated.
- `display` strings: four words at most, no word over ten characters, in French (`checkDisplay()` in `src/lib/palette.ts`).
- Every headline is tested at 390px in both languages before it ships (`/styleguide` §04 shows the method). `src/content/display.test.ts` checks every string set in `type-display`; the 390px check of all 18 display and xl headlines passed on 24 September 2026 (no overflow, none centred).
- Never centre a headline that wraps differently between languages.

## 4. Colour

*Source: the user's foundation brief, 24 September 2026. Four colours; there is no fifth.*

| Name | Hex | Role | Registered as |
|---|---|---|---|
| **chaux** | `#FFFFFF` | the ground; lime chaux white; text on indigo | `--color-chaux` (every utility) |
| **indigo** | `#12266B` | **all** text: headings, body, labels, rules | `--color-indigo` (every utility) |
| **vermillon** | `#FF4A1C` | fills, CTAs, icons, section markers, display type | `--background-color-*`, `--border-color-*`, `--fill-*`, `--stroke-*` only |
| **ciel** | `#BFE3FF` | large calm fields and tinted sections | `--background-color-*` only |

The namespaces are the enforcement: **`text-vermillon`, `text-ciel` and `border-ciel` do not exist**, so a forbidden pairing cannot be written. `/styleguide` probes this live; `src/lib/palette.test.ts` checks it in the CSS.

**Contrast — measured with the WCAG formula** (`src/lib/palette.test.ts`):

| Pairing | Ratio | Allowed for |
|---|---|---|
| indigo on chaux | **13.86:1** | everything *(the brief stated 15.1; the formula gives 13.86 — still AAA)* |
| indigo on ciel | 10.33:1 | everything |
| chaux on indigo | 13.86:1 | everything |
| indigo on vermillon | 4.12:1 | large text only (≥24px); button labels ≥18px medium |
| vermillon on chaux | 3.36:1 | icons, rules, display type ≥24px |
| vermillon on indigo | 4.12:1 | icons and rules only |
| chaux on vermillon | 3.36:1 | **never** (no white body text on vermillon) |
| vermillon on ciel | 2.50:1 | **never** — and never in the same block |

**Rules**
- Vermillon never carries body text and never has white body text on it. Buttons filled vermillon take indigo labels at 18px minimum; buttons with small labels are indigo with chaux text.
- No gradients. No tints or opacity variants beyond the four tokens: disabled states are dashed indigo outlines, not faded; there is no scrim.
- Ciel is a field colour only — never text, never a border.
- One accent per section: vermillon and ciel never appear in the same block. **Enforced by `--mark-color`**: every mark (warp rule, arrow, +/− glyph, note rule) reads it through `stroke-mark` / `border-mark` / the warp rule. It is vermillon by default; `tone-ciel` (ciel sections, the footer) and `marks-indigo` (the booking flows, which use ciel for hovers and date ranges) switch it to indigo. Components never choose the accent themselves.
- Photography is the only saturated thing beyond these four.
- Hover on the indigo button inverts it (chaux fill, indigo text): there is no darker indigo to go to.

**Ground — amended 25 September 2026: indigo velvet.** The user pointed at the indigo band and asked for that colour as the page, in a different texture; from five indigo textures (damask, gold brocade, herringbone, moiré, crushed velvet) rendered on the real page they chose **crushed velvet**. Same four colours, roles swapped:
- **Indigo `#12266B`** is the ground (`--color-ground: var(--color-indigo)`), woven as crushed velvet — no visible thread, soft pools of nap light. The field sections use the same velvet crushed differently (a second seed), so rhythm comes from texture, not colour. White text 13.86:1; worst pixel on the velvet **6.24:1**.
- **Laque `#A5231A`** (madder) moves to the one band per page: the `band` utility (was `band-indigo`; Section tone `band`), a red brocade with an antique-gold figure. White text 7.36:1, worst 5.89:1.
- **Or `#DDA73F`** stays: accent button fill with indigo label (6.38:1), every mark (6.38:1 on indigo, 3.39:1 on the band), ≥24px accent headings. Never body text on the band, never on chaux (2.17).
- Primary buttons are chaux with an indigo label.
- Texture files: `silk-indigo-velvet.webp`, `silk-indigo-velvet-field.webp`, `silk-laque-brocade.webp`; the red twill and indigo damask tiles were deleted.

*Everything below this paragraph about the ground is history.*

**Shade changed again (same day): Garance et or ancien.** The user switched from imperial scarlet to the madder variant: laque **`#A5231A`** (a deeper madder red, still clearly red rather than maroon) with antique gold **`#DDA73F`**. Measured: chaux/laque 7.36, weave worst 6.88 (twill) and 5.89 (brocade), or/laque 3.39, indigo/or 6.38, or/chaux 2.17 (never). These supersede every earlier red/gold figure below.

**Shade chosen from four red-gold variants (same day): Écarlate impérial.** The user compared cinnabar, imperial scarlet, saffron and madder side by side on the real page and picked imperial scarlet: laque **`#C1272D`** (a purer lacquer red) with a brighter gold **`#FFC940`**. Measured: chaux/laque 5.84, weave worst 5.43 (twill) and 4.58 (brocade), or/laque 3.80, indigo/or 9.03, or/chaux 1.54 (never). These supersede the #B8321A / #F2C14E figures in the next paragraph.

**Ground — amended a third time the same day: lacquer red and gold replace emerald.** The user didn't like emerald and asked for "a mix of gold and red but not maroon". Palette now **chaux, indigo, laque `#B8321A`, or `#F2C14E`** — still four.
- **Laque** is a warm red pulled toward gold (not the brown-purple of maroon). It is the ground, woven as silk twill whose highlights are gold thread; the field sections are a red brocade whose ogee-and-flower figure is shot in gold.
- **Text stays chaux**: 5.98:1 on flat laque; worst pixel on the weave **5.55:1 (twill)**, **4.68:1 (brocade)**.
- **Or (gold)** does everything vermillon used to and more: the accent button fill (indigo label 8.26:1; 3.57:1 against the ground, above 3:1 for a control), every mark (warp rules, arrows, quote rules — `--mark-color` is gold everywhere) and the ≥24px `type-*-accent` headings. Never body text (3.57), never on chaux (1.68).
- **Vermillon left the palette**: a red button on a red ground has nothing to separate it.
- Primary buttons are chaux with a laque label; the focus ring is chaux.
- Texture files: `silk-laque-twill.webp`, `silk-laque-brocade.webp`, `silk-indigo-damask.webp`. Emerald tiles deleted.

*The emerald and ciel paragraphs below are kept as history.*

**Ground — amended again the same day: emerald replaces ciel.** The user found sky blue didn't work and asked for emerald green. The palette is now **chaux, indigo, emeraude `#0A5C42`, vermillon** — still four; ciel has left it.
- **Roles, not colour names.** Components now use `ink` (text, rules, marks, ink-filled buttons) and `ground` (the page; the label on ink fills), defined once in `globals.css` as `--color-ink: var(--color-chaux)` and `--color-ground: var(--color-emeraude)`. The next change of ground is one line.
- **Text flips to chaux**: a deep emerald needs light text. Chaux on emerald 8.01:1; measured on the actual woven tiles, worst pixel **6.62:1 (twill)** and **6.18:1 (damask)**. The silk's lightening threads are held back (`light=0.35` in the generator) because they are what erode light-on-dark contrast.
- **Indigo** is now the band and the accent button's label only: indigo on emerald is 1.73:1, never text.
- **Vermillon** on emerald is 2.38:1 — never text, never a line. It is the accent button's fill (it separates from the ground by hue) and the marks on the indigo band. The `type-*-accent` utilities remain for chaux/indigo contexts only; the styleguide shows them refused on emerald.
- Primary buttons are **chaux with an emerald label** and invert to the ground on hover; the band's button keeps chaux-on-indigo.
- Texture files: `silk-emerald-twill.webp`, `silk-emerald-damask.webp`, `silk-indigo-damask.webp`.

*The ciel paragraph below is kept as history.*

**Ground and texture — amended by user request (24 September 2026).** The user asked for "no white background — rich colour and rich texture", chose **ciel** as the ground and **woven silk jacquard** as the texture. This overrides the foundation brief's chaux ground and "no tints":
- **The ground** is ciel woven as plain silk twill (`ground`, `html`): header, menus, booking sheet, mobile bar and the hero panel included.
- **Field sections** (FAQ, footer, rates, menu lists, "Le nom") are the same ciel woven as **damask** — an ogee lattice with a flower at each crossing, the classic Lyon silk layout, drawn by thread direction (`tone-ciel`). Rhythm comes from the weave, not a second colour.
- **The indigo band** is indigo damask (`band-indigo`).
- Tiles: `public/texture/*.webp`, 960 px shown at 480 CSS px, seamless, 59–63 KB each, generated by `scripts/generate_textures.py`. Worst-case text contrast measured on the actual pixels: **indigo on the ciel twill 7.91:1, on the ciel damask 7.19:1, chaux on the indigo damask 8.07:1** — all above AA and within 0.1 of AAA's 7:1.
- **Consequences for the colour rules:** vermillon on ciel is 2.50:1, too faint for a line or icon, so every mark (warp rules, arrows, glyphs, note rules) is now **indigo by default**; the indigo band alone switches marks to vermillon. Vermillon survives on the ciel ground only as the **accent button's fill, outlined in indigo**. The rule "vermillon and ciel never in the same block" is retired in that one form.
- Chaux is no longer a background. It remains text on indigo and the small `on-dark` button fill.
- Hovers and date ranges that used ciel (invisible on a ciel ground) now invert to indigo, or use an indigo inset ring.

## 5. Shape and depth

- **Radius — amended by user request (24 September 2026): rounded corners, not square.** It replaces "0 everywhere". The trade-off: square corners suited the industrial building and set us apart from KUBE (whose buttons are 4px, panels 8px, icons round), and this brings the shape language closer to the reference. Colour, type and imagery still carry the difference.

| Token | Value | Applied to |
|---|---|---|
| `--radius-control` | 8px | buttons, inputs, steppers, choice chips, calendar days, table sittings, skip link |
| `--radius-image` | 12px | every photograph |
| `--radius-panel` | 16px | the Réserver sheet (desktop), bottom sheet top corners (mobile) |
| `--radius-full` | 9999px | the live-availability dot |

Rules and full-width bands stay straight: a 1px line or an edge-to-edge band has no corner to round.
- **Separation: 1px rules, no shadows** (ref §6). `--shadow-*: initial`.
  - *Weft:* horizontal 1px `--color-indigo` between list rows, FAQ rows and footer groups; full container width.
  - *Warp:* a vertical 1px `--color-indigo` rule, **96px tall** on desktop and 64px on mobile, placed **on a column line** (column 1 by default). It runs from the top of a section into its eyebrow. This is the adjacent version of KUBE's centred thread (ref §2.3).
  - *Strong rule:* 1px `--color-indigo` for the top of a table and under the nav once you have scrolled.
- The booking sheet has no backdrop (no scrim: it would be a tint), a 1px indigo border and no shadow.
- **Focus ring:** 2px `--color-indigo` outline at a 2px offset on light grounds; 2px chaux on indigo. Always visible under `:focus-visible` (ref §13: focus was unverified on KUBE; ours is specified).

**Image ratios** (`aspect-*`). Tall crops echo the two-metre windows (brief §3, §11); the reference's ratios are listed in ref §5.1.

| Token | Ratio | Used for | Source |
|---|---|---|---|
| `aspect-window` | 1 / 2 | image A of a portrait pair; rooms with the full window bank | brief §11 "very tall crops" |
| `aspect-tall` | 2 / 3 | image B of a pair; room cards; the list-driven image | ref §5.1 (2:3 on room detail) |
| `aspect-portrait` | 4 / 5 | the chef, hands in the kitchen | ref §5.1 (4:5 variant) |
| `aspect-square` | 1 / 1 | food from above on plain plates | brief §11 |
| `aspect-landscape` | 3 / 2 | the only landscape: the view from Le Toit, the map | ref §5.1 (3:2) |

Treatment: `--radius-image` (12px), no border, no shadow, `object-fit: cover`. Text is **not** set on photographs, so no scrim is needed. It diverges from KUBE, which overlays titles on its tiles (ref §5.4).

## 6. Motion

| Token | Value | Used for | Source |
|---|---|---|---|
| `--duration-fast` | 150ms | colour and underline hover | decided |
| `--duration-base` | 300ms | booking sheet, accordion, list-driven image swap | ref §7.1 (0.3s throughout) |
| `--duration-slow` | 600ms | the menu overlay opening | ref §7.1 (0.6s) |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | enter / decelerate | decided |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | panels open and close | ref §7.1 (`power3.inOut`) |

- **Intensity: subtle.** No smooth-scroll library, no scroll reveals, no parallax, no nav shrink. **One exception, by user request (24 September 2026):** the home hero is a full-screen looping video — see below. Hover changes colour and underline only. Images do not zoom.
- The list-driven image swap (rooms by floor, venues) crossfades opacity over 300ms. On touch, tapping a row changes the image; nothing depends on hover alone.
- `prefers-reduced-motion: reduce` sets every transition and animation to 0.01ms, and `scroll-behavior` to auto.

**Hero video — amended by user request (24 September 2026).** It overrides brief §13 ("leave the full-screen background video"); the cost the brief warned about is managed rather than ignored:
- One 10-second loop (Kling 3.0 Pro from a GPT Image 2.5 golden-hour keyframe of the dining room). First and last frames are the same image, so `loop` has no seam (measured mean difference 1.4/255).
- Files: `public/video/hero-1080.mp4` **1.6 MB** (landscape), `hero-portrait.mp4` **0.5 MB** (centre crop for portrait screens), posters `hero-poster.webp` 164 KB / `hero-poster-portrait.webp` 58 KB. The reference's hero pulls ~23 MB (autopsy §5.3).
- The still poster renders first; the video is attached only after the page's `load` event and fades in over `--duration-slow` once it is playing.
- `prefers-reduced-motion` and Save-Data visitors get the still only; a 48px pause/play button is always visible; the video is `aria-hidden` and the still carries the alt text.
- Text never sits on the footage: the headline, second line, fact line and accent CTA sit in a solid chaux panel (`rounded-panel`) over it. A scrim would be a tint (§4).
- Height: `hero-screen` = the viewport minus the nav (64 / 72).

## 7. Page architecture

**Home, in order.** The restaurant leads; the rooms follow (brief §1, §10):

1. **Nav** — wordmark, 4 links, the FR/EN switch, **Réserver** (an indigo button)
2. **Hero** — full-screen looping video with a chaux panel holding the `type-display` headline ("On vient pour dîner." — four words), a `type-lg` second line ("Certains restent dormir."), one fact line (menu, days, price), then two actions: **Réserver une table** (accent) and **Les chambres** (text link). The dining-room portrait pair moves into the Navette section. **The first booking prompt is inside the first screen** (ref §11.1).
3. **Navette** (the restaurant) — the chef's line, the €68 menu as facts, the table call to action, and the statement that most guests don't stay here (brief §5)
4. **Camille** (the chef) — a short passage with a portrait pair
5. **Rooms** — the four floors as a weft-ruled list (floor label / name / one line / from-price), with a list-driven image. This is the adjacent version of KUBE's "trois univers" tiles (ref §2.5).
6. **The building** — 1831, the traboule, four-metre ceilings; a portrait pair (brief §3)
7. **Le Toit** (the roof bar) — an **indigo band**: fourteen seats, no bookings, open from six
8. **Private hire** — one paragraph and an enquiry link
9. **FAQ** — 6 questions on ciel (the hill, eating here without staying, no children under 10, the train)
10. **Footer** — ciel, **6 links**, address and train line, the language switch

- **Section anatomy:** `section` (`py-64 lg:py-96`) → `grid-page` → warp rule on column 1 → `type-label` eyebrow → 12 → heading → 24 → body (max `--container-prose`) → 32 → link or button.
- **Background sequence:** chaux throughout; **one** indigo band per page at most; ciel only for the FAQ and footer (ref §4.4).
- **Calls to action:** the hero, the Navette section, and the rooms section each carry their *own* booking path. No section more than **two screens** from a Réserver button; the nav button is always visible.

## 8. Components

**Button** — corners `--radius-control` (8px) on every variant except the text link.

- **accent** is the one vermillon button: the single primary call to action at the top of a page that sells something (home hero, restaurant, menu, room detail, Camille, private hire). Only in blocks whose mark colour is vermillon — never on ciel.
- *Brief gap, resolved:* vermillon buttons need indigo labels of 18px or more, but the scale has no sans size at or above 18 (body is 17) and allows no intermediate sizes. The accent label is therefore Instrument Serif at `md` — inside the scale, above the floor.

| Variant | Height | Padding | Text | Bg / fg | Hover | Disabled |
|---|---|---|---|---|---|---|
| primary | 48 | 0 × 24 | `type-small` 500 | indigo / chaux | inverts: chaux / indigo | dashed indigo outline |
| secondary | 48 | 0 × 24 | `type-small` 500 | transparent, 1px indigo border / indigo | inverts: indigo / chaux | dashed indigo outline |
| on-dark | 48 | 0 × 24 | `type-small` 500 | chaux / indigo | inverts: indigo / chaux, chaux border | dashed outline |
| text link | auto | 0 | `type-small` 500 | indigo, 1px underline at a 4px offset | 2px underline | — |
| **accent** | 56 | 0 × 24 | `type-md` (Instrument Serif 24 / 20) | vermillon / indigo | inverts: indigo / chaux | dashed outline |

**The Réserver control** (the three paths; ref §9, §15 Q2; brief §10)
- **Trigger:** the nav primary button, labelled "Réserver". It opens on click or tap, **never on hover**.
- **Panel:** desktop, a 400px-wide sheet anchored under the button; mobile (<768), a bottom sheet the full width of the screen. Chaux background, 1px indigo border, no scrim behind. Opens in `--duration-base` with `--ease-in-out`.
- **Rows, in this order:** **Une table** → **Une chambre** → **Le bâtiment**. Each row is at least 64px tall and holds a `type-md` label, one `type-small` fact line (for example: "Navette · mar–sam · menu 68 €" / "19 chambres · dès 190 €" / "Privatisation · réponse sous 2 jours ouvrés"), and a vermillon arrow (the sheet sits on chaux). Weft rules between rows. The hovered or focused row gets an indigo 2px left bar.
- **Behaviour:** closes on Esc, on outside tap, after a selection, and **on scroll**, which fixes KUBE's panel that stays open (ref §9.1). Focus is trapped while it's open and returns to the trigger. Every path stays on-site.
- **Context:** opens preselected when a page has a subject: a room page's row carries that room, and on the Navette pages the table row takes focus. *(Amended during the build:)* each path is **its own route**, `/fr/reserver/table|chambre|batiment` ↔ `/en/book/table|room|building`, with its state in the query (`?room=trame&from=…&to=…&guests=2&step=2`, `?date=…&service=dinner&party=2`). Every step can be linked to, and the back button walks the steps (ref §9.3). Personal details never go in the URL.
- **Mobile sticky bar:** after the hero leaves view, a 56px chaux bar pinned to the bottom, with a top weft rule and one full-width primary button. On a room page it reads "Réserver · Trame · dès 260 €". This fixes KUBE's lack of a persistent mobile booking action (ref §9.6).

**Room row (rooms list)** — floor label (`type-label`) · name (`type-md`) · one line (`type-body`) · "dès 260 €" (`type-body` 500, tabular) · vermillon arrow. The whole row is the link. Weft rule below. The image slot is `aspect-tall`.

**Paired portraits** — image A spans columns 2–5 at `aspect-window` (1:2); image B spans columns 7–10 at `aspect-tall` (2:3), **bottom-aligned** with A, leaving column 6 empty. *(Amended during the build: 5 + 5 columns made A about 1,100px tall at 1440, taller than the screen.)* **Compact variant**, for a pair beside text inside 7 columns: the inner spans are 6 + 5 so the images keep their size. **Room detail**: A over columns 1–4 and B over 5–7, bottom-aligned, with the text in 9–12. That page sells the room, so its photographs are the largest on the site. Mirrored in alternate sections. On mobile: A is 7 of 12 columns, B is 5 of 12 and offset 48px down, with a 16px gap. Both images are always visible (ref §5.2; brief §11).

**Accordion (FAQ)** — question `type-md` (serif, sentence case — KUBE's caps grotesque is tiring to read, ref §11.2), a 16px indigo +/− glyph on the right (FAQs sit on ciel), the row at least 64px, a weft rule below. The answer opens with a medium-weight lead sentence, then regular — all indigo; `--duration-base`.

**Nav** — 64px (<1024) / 72px (≥1024), chaux, **solid at all times**; an indigo rule underneath once the page has scrolled. Mobile: wordmark, Réserver, and a "Menu" text button that opens a full-screen chaux sheet listing the links in `type-md` with weft rules between them.

**Input** — 48px, 1px `--color-indigo`, `--radius-control` corners, label above in `type-small` 500, focus ring as in §5. Error: a 2px indigo edge plus a `type-small` 500 message (there is no error colour).

**Language switch** — "FR / EN" with **both options visible** (only two languages); the current one underlined 2px, the other a plain link, both indigo. Keeps the same page.

## 9. Responsive rules

| Width | Margin | Gutter | Section padding | Hero heading |
|---|---|---|---|---|
| <768 | 20 | 16 | 64 | 48 |
| 768–1023 | 32 | 16 | 64 | 48 |
| ≥1024 | 48 | 24 | 96 | 80 |
| ≥1440 | container capped at 1440 | 24 | 96 | 80 |

- Breakpoints: `md` 768, `lg` 1024 (type and spacing step here), `xl` 1440.
- Type is **stepped** once at 1024. Nothing is fluid.
- Grid collapse: the 5 + 7 splits stack at <1024, image first on the restaurant and building sections, text first on rooms.
- Nothing hides on mobile, except the list-driven image on the rooms list (each row shows its own thumbnail instead).
- **Touch targets at least 44px.** Booking rows 64px, buttons 48px, nav links 48px tall.

## 10. Originality boundary

**Taken from the reference (structure and craft):** the 12-column grid with fixed gutter; the one-accent restraint; hairline separation; stillness; the heading cluster; per-page FAQ blocks with a bold lead sentence; the three-path booking control; lazy booking code; localised URLs.

**Deliberately not taken (signature):**
- The lime-on-cream palette → chaux / indigo / vermillon / ciel (user foundation brief)
- Saphion set in light caps → Instrument Serif in sentence case
- The room tile triptych (2 squares + 1 wide) → a weft-ruled floor list with a list-driven tall image
- Full-bleed landscape pairs with 2px seams and a second image on hover → portrait pairs inside the grid, offset, always visible
- The centred vertical thread → a warp rule on a column line
- The full-screen video hero → a still portrait pair
- The pop-up offer, the Day Pass, GDS codes, and a 15-link footer → none; 6 footer links

No copy, image, icon or logo in this project comes from the reference.

---

## Token audit

Every value in this document exists in `src/app/globals.css`: the colours (4, registered in 6 namespaces), the fonts (2), the weights (2), the spacing (16), the containers (3), the radii (4), the aspect ratios (5), the breakpoints (3), the eases (2), the durations (3), and every type role as an `@utility`. Section padding, the grid and the warp rule are `@utility` blocks too. Verified 24 September 2026.

## Amendment — photography discipline and interaction (25 September 2026)

User request: "the images are not looking good… bring them in some order or discipline… also they should be interactive." Supersedes the paired-image and aspect rules above (1:2 + 2:3 staggered pairs).

- **Three frames only.** Every portrait photograph shows at **4:5**; the one landscape (the view from the roof) at **3:2**; the plates at **1:1** (triptych only). Photos are cropped into the frame with `object-fit: cover` — the original files keep their ratios. The `aspect` override prop is gone; `frame` exists only so a pair can force both photos to 4:5.
- **Pairs** (`PairedPortraits`): two 4:5 frames of identical size, side by side, top and bottom aligned, no offset. Full width: columns 2–6 and 7–11. Beside text (`compact`): the two halves of that area. Mobile: the two halves of the page. Room detail: columns 1–4 and 5–8, text 9–12.
- **Single portraits**: 4:5 over four columns, on the right (lg columns 9–12; mobile 5–12). The Camille page's lead portrait is the one exception at five columns.
- **Interaction** (`Photo`): the frame is a button. Hover or keyboard focus eases the photograph to 105% over `--duration-slow`, draws a 2px gold edge inside the frame and shows a gold enlarge glyph. Click, tap or Enter opens the **lightbox** (`src/components/ui/lightbox.tsx`, mounted once in the layout): the velvet ground full screen, the whole photograph uncropped, its caption (the alt text), a counter, ← → buttons and arrow keys through every photo on the page (wrapping), Esc / Fermer / a click outside to close; focus is trapped and returned; the page behind does not scroll. Photos inside a link (the room list) are not buttons (`interactive={false}`) and zoom with the link's hover. Reduced motion removes the zoom (global rule).

## Amendment — hero motion and interaction (25 September 2026)

User request: "the hero page is super still and boring. put some motion, interaction and fun elements." Built in `src/components/sections/hero-stage.tsx`, motion utilities in `globals.css` (Hero motion block).

- **Entrance.** The headline rises word by word out of a mask (`word-mask` / `word-rise`); eyebrow, second line, fact, tonight and the buttons follow, staggered 110ms (`rise`, `--i`).
- **The turning word.** "On vient pour **dîner. / trinquer. / Camille. / Navette.**" (EN: dinner. / drinks. / Camille. / Navette.), every 2.8s, the old word leaving up, the new rising in, a gold thread drawn under it each time. Every full line still keeps the display rule (tested in `display.test.ts`, both languages). Pauses while the pointer or focus is on the panel and while the tab is hidden. Screen readers read only the real title.
- **Candlelight.** On a fine pointer: a gold pool of light follows the cursor over the video (`candle-glow`, soft-light blend), the video drifts up to 16px against it (`hero-parallax`, scaled 105% so no edge shows) and the panel leans up to 2° (`hero-tilt`). Eased, and it settles back when the pointer leaves.
- **Tonight.** A live dot and "Ce soir, encore de la place à" with the next evening's open dinner sittings (from `lib/booking`, same numbers as the booking flow), up to four chips that open the table booking for that evening. Every 9–15s another guest books a table of two: that chip flashes gold and its count drops (announced politely to screen readers).
- **The ribbon.** A velvet strip along the bottom of the hero: five facts in italic serif between gold four-point stars, sliding right to left over 70s, pausing on hover. Decorative (`aria-hidden`): all of it is said elsewhere on the page.
- **Reduced motion:** no turning, no pointer effects, no bookings ticking; entrance and ribbon still (global rule). The pause button moved up to sit above the ribbon.

## Amendment — the liquid cloth (25 September 2026)

User request: "can you make background wobble with the movement of mouse?", then "not this kinda wobble. like jelly or liquidy type". The first version (the whole tile drifting on a spring) was replaced.

`src/components/ui/cloth.tsx` (mounted in the layout) draws the page's velvet again on a WebGL2 canvas fixed behind all content, sampled in page coordinates (480 CSS px tiles, scrolling with the page) so at rest it matches the CSS tile under it exactly. A fragment shader bends the weave:
- **trail:** each pointer move leaves a point (up to 32, 2.6 s each) that pushes the cloth the way the pointer went, in a round falloff of 150 px, then wobbles back as it fades: push × e^(−2.2·age) × cos(9·age) — jelly settling;
- **lens:** a swell of the weave under the pointer, stronger with speed, following on a spring — a drop under silk;
- **sheen:** up to 6% lighter where the cloth is most bent.
While it runs `<html>` has `cloth-live`: field sections turn clear so one continuous cloth shows through; panels (`ground`: header, hero panel, ribbon) stay solid. Frames are drawn only while something moves (and on scroll). Not attached for reduced motion, touch, a coarse pointer or no WebGL2 — the static velvet stays.

**Text joins in (same day).** User: "can we make the texts also do the same without making a mess". The trail and the jelly formula moved to `src/lib/jelly.ts` (tested in `jelly.test.ts`) and drive the text from the same loop as the cloth:
- heading words (`<JellyText>` in `Cluster` and the `type-md` subheads wraps each word in `.jelly-w`, an inline-block — lines break exactly as before) take the push at their centre × 0.33, capped at **10 px**, with a tilt of 0.25°/px capped at **3°**;
- paragraphs and quotes move as whole blocks × 0.1, capped at **4 px** — never split, so reading is undisturbed;
- never moved: a link or button itself (text inside a link does move — the link box, which takes the click, stays put; room names in the room list move as one piece so their hover underline survives), forms, dialogs, photos, panels, the header, the nav and the hero (which has its own motion);
- transforms only, so nothing reflows and the text stays sharp; every transform is cleared once the trail dies out. Positions are measured after fonts load and again whenever `main` changes size. Works without WebGL2 too (text over the static velvet). Off for reduced motion and touch.

**One rule for the whole site (same day).** User: "give a check to the whole site. some are wobbling and some arent." Targets are no longer chosen by tag (which missed list items, definitions, plain headings, spans). `measure()` in `cloth.tsx` now walks every element in `<main>` and moves each visible element that holds text of its own — the outermost one, so what is inside moves with it:
- **big** (heading words, and anything set in `type-display / xl / lg / md`): × 0.33, capped at 10 px, with a tilt that shrinks as the block gets wider (3° for a word, barely any for a long quote);
- **the rest**: × 0.1, capped at 4 px, no tilt;
- **still, always:** buttons, button-shaped links and chips (`rounded-*`), form fields and labels, the booking calendar (one widget), photos, panels, dialogs, the header, the nav, the hero, anything hidden. Links that read as plain text move like text; the text of an FAQ question moves, the row that opens it does not.
Checked by a whole-site audit (30 pages, FR and EN): about 1,050 moving pieces, none left out, none tagged that did not move under a pointer sweep, and no control moving.

