# Reference autopsy — KUBE Saint-Tropez

**Reference:** https://www.kubehotel-saint-tropez.com/fr
**Captured:** 24 September 2026, end of season (the hotel closes around 10 October)
**For:** Le Comble, a restaurant with rooms in Croix-Rousse, Lyon (see `BRIEF.md`)
**Scope:** homepage, `/fr/chambres` (rooms), `/fr/chambres/prestige-ibiza` (room detail), `/fr/restaurant-bar-hotel-saint-tropez` and `/fr/rooftop-hotel-saint-tropez` (the two restaurants), `/fr/privatisation`, `/fr/faq`. EN/IT/RU spot-checked. The Mews room booking flow was walked to the card-payment step and stopped there. Nothing was entered or submitted.

---

## 0. How this was captured, and how far to trust it

| Method | Used for | Confidence |
|---|---|---|
| Headed Chromium 1234 driven by Playwright, reading computed styles, `document.fonts`, custom properties, ScrollTrigger instances and inline scripts | Layout, type, colour, motion, booking behaviour | **measured** |
| The site's own shipped tokens (CSS custom properties on `:root`) | Type, spacing and colour scales | **transcribed**, which is better than measured |
| The site's stylesheet (`kube-sainttropez.webflow.shared.*.min.css`, 293 KB) and 14 inline `<script>` blocks, read in full | Transitions, hover rules, animation logic, reduced motion | **measured** |
| Chrome DevTools Protocol plus Playwright `requestfinished` sizes | Page weight, video weight | **measured**. Tracker and CDN sizes vary a little between runs |
| Screenshots at 1440×900 and 390×844 (touch and mobile UA emulated) | Proportions, crops, visual hierarchy | Values eyeballed from screenshots are marked *(est.)* |

**Environment notes and caveats**

- `devicePixelRatio` was 1.25 in the desktop captures because the OS runs at 125% scaling. Border widths below are the **authored** token values (for example 0.5px = `.03125rem`), not the snapped computed values.
- Headless Chromium is blocked by the Vimeo player ("We couldn't verify the security of your connection"). Every video observation comes from a **headed** browser.
- The page content width at a 1440 window is 1428px (a 12px scrollbar). Fluid values were checked against both widths.
- Root font-size is 16px at every width. The rem base does not step, but almost every size is a `clamp()` between viewports of 320px and 2240px (see §2), so pixel values are only valid at the stated width.
- The Cookiebot consent banner **never appeared** during capture from this location, although Cookiebot loads. Its design is unknown.
- **Skipped:** the IT and RU pages beyond their homepages, the activity detail pages, the spa page, the gallery, the magazine, and the Backyou quote form (a third-party form, not opened). Keyboard focus rings were not verified. Lumos focus tokens exist (`--focus--width: 1px`, outer offset 3px), but I did not confirm them rendering.

---

## 1. First impression

- **Three-word gut reaction:** calm, expensive, template-y.
- **Where the eye lands (homepage, desktop):** (1) the full-screen video, which is people, texture and sun rather than the building; (2) the uppercase display headline in the bottom third; (3) the small lime "Réserver" button under it. The header "RÉSERVER" link, top right, comes fourth.
- **Most distinctive thing:** a very light, high-contrast display face (Saphion, weight 300, all caps) set against lots of warm off-white, with **one acid lime** (`#daf092`) as the only saturated UI colour. The combination is **KUBE's signature**. The underlying technique (one thin display face in caps, one warm neutral ground, a single accent kept for action) transfers. The lime-on-cream pairing and the Saphion face do not.

---

## 2. Layout

### 2.1 Grid system (shipped tokens)

The site is built on **Lumos**, Timothy Ricks' Webflow framework (`--_theme---*`, `u-section`, `data-trigger`, `clickable_wrap`, `lumos.modal`). Everything is fluid between a 320px and a 2240px viewport (`--site--viewport-min: 20`, `--site--viewport-max: 140`, both in rem).

| Token | Value | At 1440px | At 390px |
|---|---|---|---|
| `--site--column-count` | 12 | 12 | 12 (mostly collapses to 1) |
| `--site--margin` (page side margin) | clamp 16px → 48px | **34.7px** | **16.7px** |
| `--site--gutter` (column gap) | 16px, fixed | 16px | 16px |
| `--max-width--main` | 140rem = **2240px** | never reached | never reached |
| Column width | `(min(max-width, 100% − 2×margin) − 11×gutter) / 12` | **≈98.6px** | n/a |
| `--nav--height` | 7rem (112px), animates to 4rem (64px) | 112 → 64 | 64 |

In practice **there is no maximum width**. The layout scales with the window up to 2240px. The container is `margin + 12 columns + 16px gutters`.

### 2.2 How content is positioned

The site uses three positioning modes and switches between them deliberately:

1. **Centred, narrow, typographic.** Every section intro (eyebrow, heading, paragraph, link) is centred. Paragraph measure is about 515px at 1440, roughly **80 characters per line** at 14px (counted on the intro paragraph). That is too long for the size (see §3).
2. **Full-bleed image mosaics with 2–3px seams.** Room tiles, service cards and paired images run edge to edge (`x = 2px`), with gaps of about 2–4px between images *(est. 3px)*. The text stays inside the 34.7px margin while the imagery nearly touches the viewport edge. **This is the main way it breaks its own grid.**
3. **Asymmetric editorial splits.**
   - *Activities:* the text and one portrait image sit in columns 1–3 (image 328×389 at x = 34). The list of activities occupies roughly columns 6–12 (x ≈ 608 → 1394) *(est.)*. Columns 4–5 are empty.
   - *Privatisation:* the text column starts about one column in (x ≈ 149) and runs to x ≈ 591. The image takes the **right half, bled to the viewport edge** (x = 724 → 1426, 702×828–890).
   - *Restaurant and rooftop "images" block:* the heading is left-aligned in columns 1–4, the paragraph plus link is right-aligned in columns 9–12 *(est.)*, and the middle is empty.

The intro photo (672×512) spans **exactly 6 of 12 columns, centred** (6 × 98.6 + 5 × 16 = 672). That confirms the 12-column grid is real and used.

### 2.3 Vertical rhythm (shipped tokens)

| Token | Range (320 → 2240) | At 1440 |
|---|---|---|
| `section-space--small` | 48 → 64 | 57px |
| `section-space--main` | 72 → 96 | **86px** |
| `section-space--large` | 96 → 128 | **115px** |
| `section-space--page-top` | 160 → 224 | 197px |
| space-1 / 2 / 3 | 8 / 12 / 16 (fixed) | — |
| space-4 / 5 | 22→24 / 28→32 | 23 / 30 |
| space-6 / 7 / 8 | 34→48 / 40→64 / 48→80 | 42 / 54 / 67 |

The rule is **linear steps of 4px at the small end (8, 12, 16) and fluid, widening steps at the large end**. Nothing sits on a baseline grid. Section padding scales down to about 0.75× on mobile, not 0.5×. It stays generous.

**The vertical hairline.** Several sections open with a single **1px vertical rule, about 145px tall, centred** *(est.)*, above the eyebrow: the intro, the rooms list, the FAQ, and "Toutes nos chambres" on the room page. It acts as a thread pulling you into the next section. It is the one decorative device on the site.

### 2.4 Section heights — homepage

| # | Section | Desktop 1440×900 | Mobile 390×844 |
|---|---|---|---|
| 1 | Hero (video, `min-height: 100svh`) | 900 | 844 |
| 2 | Intro (hairline, eyebrow, H2, 2 paragraphs, link, 6-column photo) | 1082 | 876 |
| 3 | Rooms, "trois univers" (2 square tiles + 1 wide tile) | 1698 | 1730 |
| 4 | Services, "Expériences" (4 portrait cards) | 745 | 760 (becomes a swiper) |
| 5 | Activities (asymmetric list + image) | 764 | 778 (becomes an accordion) |
| 6 | CTA (full-bleed photo, H2, button, 100svh) | 900 | 844 |
| 7 | Privatisation (50/50 split) | 900 | 689 |
| 8 | FAQ (8 questions, `background-2`) | ≈1200–1530 depending on open state | 1226 |
| 9 | Footer (CTA band, links, logos, newsletter, legal) | ≈1226 | 1557 |
| | **Total document height** | **≈9,200–9,400px** (drifts as lazy media resolves) | **9,302px** |

Two sections are pinned to exactly one screen (hero and CTA). The others size to content. The rhythm between them is carried by `section-space--main/large` and by alternating full-bleed and contained blocks, not by background colour.

### 2.5 Other page layouts

- **Rooms index (`/fr/chambres`, 7,010px):** 100svh photo hero, then the index section: centred intro, **tag chips** (16 tags, 3 rows, centred), a "12 chambres" count on the left, a "Galerie / Liste" toggle on the right, then a **3-column full-bleed grid** of 473×607 portrait cards (0.78:1) with 2–3px seams. Room names sit **below** the image, centred, with a small lime arrow. Then the FAQ and a paired-image block.
- **Room detail (`/fr/chambres/prestige-ibiza`, 3,216px):** **there is no site nav.** A lime circular "×" (Retour) sits top right, so the page reads as a modal sheet. Left: a **sticky, internally scrolling** image column 913px wide (about 64%), holding 8 images at mixed 3:2 and 2:3, plus a 54px thumbnail strip that scroll-syncs with it. Right: a 513px text column with eyebrow (univers), H1 (room name), 2 paragraphs, a full-width lime "Voir les disponibilités" button, then two accordions ("Détails de la prestation", "Informations"). Below: 2 recommended room tiles and the footer CTA.
- **Restaurant and rooftop:** a Swiper hero of looping 731×497 (1.47:1) slides with lime circular arrows and a thumbnail strip, then centred title and intro, then a list of PDF menu links (each row a hairline with a lime ↗ icon), a "Réserver une table" button, the paired-image block, the FAQ, and cross-links to the other venues.
- **Privatisation (6,010px):** video hero, the 50/50 split, then an "offgrid" list: **staggered, off-grid portrait images** (672×903, 557×760 and 442×617 at different x/y offsets). This is the most art-directed layout on the site. Then the FAQ, a full-screen CTA ("Demander un devis") and the footer.
- **FAQ (5,978px):** a single long section with 5 category H2s and about 36 questions in accordions. No sidebar, no anchor navigation, no search.

### 2.6 Z-layering and fixed elements

- The nav is `position: fixed` and transparent over the hero, then gains a beige background and a 0.5px bottom border (§8).
- The Mews iframe is `position: fixed`, full viewport, `z-index: 100000`.
- The offer modal is a native `<dialog>` using `showModal()`.
- Nothing else is sticky on the homepage. **There is no sticky booking bar on any page at any width.**

---

## 3. Type

### 3.1 Families

| Family | Role | Weights used | Source |
|---|---|---|---|
| **Saphion** | Every heading and display line | **300 only** | Self-hosted on the Webflow CDN, one weight. Fallback `"Times New Roman", sans-serif` (the fallback stack is wrong) |
| **Inter Variable** | Body, eyebrows, UI, buttons, FAQ questions, footer | **200 / 300 / 400 / 500** | Self-hosted variable font (100–900 axis), fallback Arial |

Saphion is a light, high-contrast, slightly flared display face with distinctive letterforms, most visibly the R and the W. At weight 300 in caps it reads as fashion or cosmetics rather than hotel.

### 3.2 Scale (shipped tokens, `clamp()` from 320 to 2240)

| Token | 320 → 2240 | At 1440 | At 390 | Where it is actually used |
|---|---|---|---|---|
| `display` | 80 → 128 | 115 | 81 | **Never used** on the captured pages |
| `h1` | 36 → 48 | **42.9** | **36.4** | Hero headline, section H2s on home (intro, rooms), CTA headline, footer CTA |
| `h2` | 32 → 40 | **36.6** | 32.3 | Services and FAQ H2s, room tile names on home |
| `h3` | 28 → 32 | **30.3** | 28.1 | Activity list items, privatisation items, room-detail H1 |
| `h4` | 22 → 24 | **23.2** | 22.1 | Service card titles, room names in the index hover list |
| `h5` | 18 → 20 | **19.2** | — | Room names under index cards |
| `h6` | 16 → 18 | 17.2 | — | — |
| `text-large` | 18 | 18 | 18 | Rare |
| `text-main` / `text-small` | **14** | 14 | 14 | **All body copy**, buttons, FAQ questions |
| `text-smaller` | **12** | 12 | 12 | Eyebrows, link-buttons, nav, footer, captions, occupancy |

**Measured distinct sizes on the homepage at 1440:** 12 / 14 / 23.2 / 30.3 / 36.6 / 42.9.
Adjacent ratios: 1.17, 1.65, 1.31, 1.21, 1.17. The scale runs at about **1.2 through the heading range, with a single 1.65 jump from body to the smallest heading**. There is no step between 14 and 23. Hierarchy comes from the switch of typeface, not from size.

**Tag and size are decoupled.** The homepage hero H1 and the intro H2 are the **same size (42.9)**. The FAQ question is an H3 at 14px, and so is a room name at 36.6px. Size follows the visual role, not the document outline.

### 3.3 Ratios

- **Largest to smallest:** 42.9 / 12 = **3.6×** on desktop, 36.4 / 12 = **3.0×** on mobile. For a luxury site this is **very compressed**. The display token (up to 128px) exists but is never used.
- **Hero heading to body:** 42.9 / 14 = **3.1×**, which is "confident but restrained" territory. The drama comes from the video and the empty space, not from type size.

### 3.4 Line height, tracking and measure

| Role | Line height | Letter-spacing | Case | Weight |
|---|---|---|---|---|
| Saphion headings (all sizes) | `normal` (font metrics, ≈1.15–1.2 *(est.)*) | 0 | **UPPERCASE** | 300 |
| Body, Inter 14 | **21px (1.5)** | **−0.02em (−0.28px)** | sentence | **300 (light)** |
| Muted body (intro, FAQ answers) | 1.5 | −0.02em | sentence | 300, `#484847` |
| Eyebrow, Inter 12 | normal | 0 | **UPPERCASE** | **200 (extra-light)** |
| Link-button / nav, Inter 12 | 1 (12px) | **+0.08em (0.96px)** | **UPPERCASE** | 500 |
| Primary button, Inter 14 | 1 | −0.02em | sentence | 400 |
| FAQ question, Inter 14 | normal | 0 | **UPPERCASE** | 500 |
| FAQ answer lead-in (`<strong>`) | 1.5 | −0.02em | sentence | 500, black |
| Footer and legal, Inter 12 | 18px (1.5) | −0.02em | sentence / caps | 300–500 |

- **Measure:** the centred intro paragraph is about 515px, roughly **80 characters** per line at 14px light. The privatisation paragraph is 344px, about 45 characters. Long, light, grey 14px text is the weakest typographic decision on the site.
- `text-wrap: pretty` is set on body text through a token. Headings are not balanced.
- Headings have **no negative tracking**. Saphion is set loose, in caps, at weight 300.

### 3.5 How hierarchy is signalled

Hierarchy comes almost entirely from **typeface switching** (serif caps against grotesque) and **weight contrast inside Inter** (200 eyebrow, 300 body, 500 label), not from size or colour. The recurring header cluster is:

```
EYEBROW          Inter 12 / 200 / caps / #000 (or #fff)
                 ↓ ≈16–20px (est.)
HEADING          Saphion 36–43 / 300 / caps
                 ↓ ≈40px (est.)
Paragraph        Inter 14 / 300 / #484847 / centred, 515px max
                 ↓ ≈30px (est.)
LINK-BUTTON      Inter 12 / 500 / caps / +0.08em / 1px underline
```

FAQ answers use a **bold lead sentence in black, then the rest in light grey** ("**Oui, le rooftop … est ouvert à tous.** Selon la période…"). That is a good pattern: the answer is legible in the first five words.

---

## 4. Colour

### 4.1 Every colour, by role (shipped swatches)

| Hex | Token | Role |
|---|---|---|
| `#fdf9f4` | `--swatch--beige` | **Page background**, nav background once scrolled, modal and dropdown surfaces |
| `#f3f0e8` | `--swatch--beige-2` | **Second surface**: the FAQ section and footer band |
| `#000000` | `--swatch--black` | Primary text, headings, dark hero and CTA sections |
| `#ffffff` | `--swatch--white` | Text on video and photos, Mews surfaces |
| `#daf092` | `--swatch--brand` | **The only accent**: primary button fill, burger circle once scrolled, FAQ ± icons, arrow icons, active filter chip, active view toggle, link underline on hover, Mews buttons and step dots |
| `#484847` | `--swatch--grey-800` (`text-2`) | Secondary and body text |
| `#7c7c7c` | `--swatch--grey-700` (`text-3`) | Tertiary text: footer links, legal |
| `#c6c6c6` | `--swatch--grey-300` (`border`) | Hairlines, **inactive filter chip text and borders**, dimmed room tags |
| `#e1dcd9` | `--swatch--grey-200` | Defined in tokens, not observed |
| `rgba(0,0,0,.5)` | `--_theme---backdrop` | Modal backdrop, menu backdrop |
| `color-mix(currentColor 10%, transparent)` | `background-skeleton` | Image placeholder before load |
| *(none)* | — | **No semantic colours** (success, warning, error) on the site. Mews has its own |

The neutrals are **warm** (hue ≈ 35°), and the greys are true neutral. The accent is a desaturated yellow-green that has no relationship to the Riviera: it is the brand colour from the logo's secondary lockup (the staff polo in the hero video uses the same lime logo).

### 4.2 Contrast (computed, WCAG 2.x)

| Pair | Ratio | Verdict |
|---|---|---|
| `#000` on `#fdf9f4` | 20.0:1 | Pass |
| `#484847` body on `#fdf9f4` | 8.7:1 | Pass |
| `#484847` on `#f3f0e8` | 8.0:1 | Pass |
| `#7c7c7c` footer links on `#f3f0e8` | **3.7:1** | Fails AA for 12px text |
| `#7c7c7c` on `#fdf9f4` | 4.0:1 | Fails AA for small text |
| `#c6c6c6` inactive filter chips on `#fdf9f4` | **1.6:1** | Fails badly. Chip labels are near-invisible |
| `#000` on `#daf092` (primary button) | 16.9:1 | Pass |
| `#daf092` button against `#fdf9f4` ground | 1.2:1 | The button shape barely separates from the page; the black label carries it |
| White "FR" nav label on the cream heroes of the restaurant and rooftop pages | **1.05:1** | Invisible (screenshot confirmed) |

### 4.3 Colours per screen

Most screens show **3 UI colours plus photography**: beige, black, and either grey-800 or lime. The hero shows white and lime over video. **Lime almost never exceeds about 1% of a screen**: a 32px button, a 45px circle, 24px icons. That restraint is the point.

### 4.4 Background down the homepage

```
hero      #000 under video (black until the video starts; no poster image)
intro     #fdf9f4
rooms     #fdf9f4  (full-bleed photos)
services  #fdf9f4  (full-bleed photos)
activities#fdf9f4
CTA       photo, full screen (u-theme-dark)
privat.   #fdf9f4 + half-bleed photo
FAQ       #f3f0e8   ← the only background change
footer    #f3f0e8
```

The page **does not alternate background colours**. The rhythm alternates between **photo blocks and cream blocks**. Beige-2 is kept for the utilitarian end of the page (FAQ and footer).

---

## 5. Imagery

### 5.1 Treatment

| Property | Value |
|---|---|
| Radius | **0** on every photo (the `--radius--main` token of 8px is used only on the dropdown, the modal and the newsletter input) |
| Border | none |
| Shadow | none, anywhere on the site |
| Scrim on text over images | A flat dark overlay *(est. ≈20–30% black)* on room tiles, service cards and the CTA. The hero video has no visible scrim; the white headline relies on the footage |
| `object-fit` | `cover` everywhere |
| Loading | `loading="lazy"` on almost everything. Room detail images use `eager` with `sizes="100vw"` (over-fetching, since the column is 64% wide) |
| Formats | **AVIF first**, WebP for newer uploads. Webflow CDN responsive variants (`-p-500/800/1080/1600/2000`) |
| Placeholder | `color-mix(currentColor 10%)` skeleton block |

**Aspect ratios in use**, from the image-wrapper variants in CSS and from measured boxes: 1:1 (home room tiles, 711×711), 2:1 (home wide room tile, 1424×711), 3:2 (intro photo, room-detail landscape shots), 2:3 (room-detail portraits), 0.63 ≈ 3.17:5.05 (service cards), 0.78 (room index cards), 0.84 ≈ 3.23:3.83 (activity image), 0.80 and 0.85 (privatisation), 4:5, 5:4 and 16:9 (defined, less used), 1.72 (full-screen hero and CTA crops).

**Photography content:** interiors in warm wood and textiles; pool and garden in hard midday sun; people shown **from behind or cropped at the shoulder** (backs, hands, glasses) so faces are rarely visible; food in close-up at the table. One aerial drone shot (the intro). There is no people-in-robes cliché, but there is plenty of "hand pouring oil on a back".

### 5.2 The paired-image pattern

"Two images per section" is used in **three different ways**:

1. **Paired *in time*: the hover swap.** Every room tile (`card_primary`) and every service card (`card_tertiary`) holds **two stacked images**. The second (`.is-hover`) fades in on hover over **0.3s** (`opacity` driven by `--_trigger---off`). The pairing is deliberate: *room interior at rest, the room's outside space (pool, terrace) on hover*; *spa oil at rest, a treatment room on hover*. On touch devices only the first image is ever seen.
2. **Paired *in space*: the one-third / two-thirds split.** The `images_wrap` block, used on the rooms, restaurant and rooftop pages, is **one portrait (≈473×710, 2:3) beside one landscape (≈949×710, 4:3)**, full-bleed with a 2–3px seam, both the same height. The portrait is usually the detail (a chef, a boules court) and the landscape is the context (the view, the pool).
3. **Paired *by interaction*: the list-driven image.** In activities, privatisation and the menu overlay, **one image slot is driven by a list**. Hovering a list item crossfades the image slot (0.3s). On privatisation, the image reverts to the first on `mouseleave`.

The **2–3px white seam** between full-bleed images is the detail that makes the mosaics feel architectural rather than grid-template.

### 5.3 Video

| Where | Asset | Length | Resolution | Loaded when | Cost |
|---|---|---|---|---|---|
| Homepage hero | Vimeo 1225192387, `?background=1` (muted, looped, no controls) | **34.0s** loop | **1920×1080** | On page load | **≈23.5 MB within the first 10 seconds** (22.9 MB MP4 via Vimeo byte-range requests, plus ≈470 KB player JS). The full file downloads, then loops from cache. Measured on desktop; the mobile run (390px) loaded ≈27.8 MB of declared bytes over a full scroll, so there is **no mobile-specific lighter asset** *(inferred)* |
| "La plage" service card | Vimeo 1197735134, `background=1` | **16.3s** | **1080×1920** portrait | **Only on first `mouseenter`, `focusin` or `touchstart`** of the card (a custom MutationObserver strips `src` into `data-src`) | Not loaded unless hovered. Well done |
| Rooms and privatisation heroes | Vimeo iframes with a static poster `<img>` underneath | not measured | — | On load | Probably similar |

- There is **no poster on the homepage hero**. The first paint (1.37s) is the white H1 over **black**, and the footage arrives later.
- There is **no pause control**. The video moves indefinitely, which fails WCAG 2.2.2 (Pause, Stop, Hide).
- Served through a **Vimeo iframe** (`player.vimeo.com`), not a self-hosted `<video>`. Vimeo bot detection blocks headless browsers, so some crawlers and preview tools see an error page where the hero should be.

### 5.4 How images relate to type

- Type sits **on** images only in a few places: the hero (bottom-centred), room tiles (centred, low), service cards (bottom-left), and the CTA (centred).
- Everywhere else type and image are **kept apart**: centred text above a mosaic, or text on one side of a split.
- Image captions are never used. Room names under the index cards act as captions.

---

## 6. Shape and depth

- **Radius scale:** `--radius--small` 4px (buttons, chips' corners are actually pill-shaped), `--radius--main` 8px (dropdowns, modal, newsletter field), `--radius--round` 100vw (burger, arrow circles, ± icons, filter chips, view toggle). **Photos are square-cornered** (0).
- **Borders:** hairlines are **0.5px** (`--border-width--small: .03125rem`) in `#c6c6c6`, used for list separators (activities, privatisation, FAQ, room-detail accordions, menu). 1px (`--border-width--main`) is used for button outlines, the vertical section thread and link underlines.
- **Shadows:** **none**. Depth comes from overlap (the nav over the hero), the modal backdrop (50% black), and a `backdrop-filter: blur(10px)` on one card variant (`card_focus`, not seen in use).
- **Strategy:** flat, hairline-separated. Consistent with the calm tone.

---

## 7. Motion

### 7.1 Inventory

| Element | Trigger | Property | Duration | Easing | Source |
|---|---|---|---|---|---|
| **Nav condense** | Scroll: second child of `#main` hits the top (`data-scrolltrigger-start="2"`) | `--nav--height` 7rem → 4rem; `.nav_background` opacity 0 → 1; `.nav_logo` scale 1 → 0.6; theme switches dark → light | **0.6s** | `power3.inOut` | GSAP timeline + ScrollTrigger, `toggleActions: play none none reverse` |
| **Image drift (parallax)** | Scroll, **only ≥768px** | `img` `y: 0 → −4rem` while its wrapper travels from `top 70%` to `bottom 30%` | scrubbed | linear (scrub) | GSAP, `[data-img-wrap="animated"]`. **One instance on the homepage** (intro photo) |
| **Smooth scroll** | Always | Scroll interpolation | — | `lerp: 0.08`, `wheelMultiplier: 0.9` | **Lenis 1.1.18** |
| Room and service card hover | `:hover` / `:focus-within` | 2nd image opacity 0 → 1 | **0.3s** | ease | CSS via `--_trigger---off` |
| Card image zoom (Lumos card) | hover | `scale(1.1 → 1)` | 0.3s | ease | CSS (`card_lumos_image`). Defined, not seen used |
| **Activity list hover** | `mouseenter` on a row | Hovered row stays black and gets a **lime arrow circle**; siblings dim to grey *(opacity, est. ≈0.4)*; left image crossfades; hairline colour changes | **0.3s** opacity and border, 0.6s content reveal (`grid-template-rows 0fr → 1fr`) | ease | CSS + small JS |
| Privatisation list hover | `mouseenter` / `mouseleave` | Same dim-siblings pattern, arrow icon fades in, image slot crossfades, **reverts on leave** | 0.3s | ease | CSS + JS |
| Link-button underline | hover / focus | **Underline retracts to the right, then redraws from the left** (`scaleX` 1→0 origin right, then 0→1 origin left) | **1s** | ease-in-out | CSS `@keyframes line-hover` |
| Primary lime button | hover | **Nothing changes.** Background, border and text colours all map `brand → brand`, measured identical at rest and at hover | 0.2s (no-op) | — | Tokens |
| Footer link | hover | Underline `scaleX(0 → 1)` from the left | 0.3s | ease | CSS |
| FAQ accordion | click | Height 0 → auto, ± icon rotates 90° | **0.3s** height (`power1.inOut`), **0.6s** icon | GSAP / CSS | Calls `ScrollTrigger.refresh()` afterwards |
| Booking and language dropdowns | click (`data-hover=false`) | `grid-template-rows 0fr → 1fr`, visibility | **0.4s** | linear default | CSS, Webflow dropdown, 400ms delay |
| Burger → full menu | click | Panel `menuOpen` keyframes, children `menuOpenInner` | **0.6s** panel, **1.2s** children | ease | CSS keyframes (mobile variants too) |
| Menu image | `mouseenter` on a menu item | Right-hand image crossfades | 0.3s | ease | JS + CSS |
| Offer modal | Timer, **7,000ms after DOMContentLoaded**, once per session (`sessionStorage["modal-offer-shown"]`) | Backdrop opacity 0 → 1; content `y: 6rem → 0`, opacity 0 → 1 | **0.3s** | `power1.out` | GSAP + native `<dialog>` |
| Swipers (services on mobile, restaurant hero) | swipe / arrows | slide | 600ms default | Swiper default | Swiper 8 |
| Room-detail gallery | thumbnail click | Internal container `scrollTo` | smooth | native | JS; thumbnails scroll-sync |

### 7.2 Scroll behaviour

- **No pinning.** ScrollTrigger reports **two instances** on the homepage: the nav timeline and one image drift.
- **No reveal-on-scroll.** Text and sections do not fade or slide in; they are simply there. That is a strong choice and part of why the site feels composed rather than busy.
- The one parallax is 4rem (64px) over a long travel, so it is barely perceptible.
- **Lenis** gives the whole page a slightly damped, weighty scroll (`lerp: 0.08` is on the heavy side).

### 7.3 Page load

1. HTML arrives (TTFB ≈0.5–0.8s). **No preloader, no intro animation.**
2. FCP and LCP at **≈1.37s**. The LCP element is the **H1 text on a black background**; the video is not the LCP.
3. The Vimeo player boots and the footage fades in *(est. 2–4s after load)*.
4. Mews Distributor is **not loaded on page load**. It boots on the first `mousemove`, `touchstart`, `scroll`, `keydown` or `click`, or after 10s. That is a good, deliberate performance choice.
5. **At 7s the offer modal opens** over whatever the visitor is reading. It opens once per browser session.

### 7.4 Reduced motion

**Not handled at all.** There is no `prefers-reduced-motion` query in the 293 KB stylesheet or in any of the 46 KB of inline styles, and no `matchMedia('(prefers-reduced-motion…)')` in any inline script. Lenis smooth scroll, the looping hero video, the parallax, the 1s underline animation and the menu keyframes all run for everyone.

---

## 8. Navigation chrome

- **Header (desktop and mobile share one layout):** language code "FR" (left) · KUBE logo (centred, 56px wide) · "RÉSERVER" link (right) · a 45px round burger (right).
  - Over the hero: transparent, white elements, burger as a translucent white circle.
  - Once condensed: beige `#fdf9f4`, 0.5px bottom hairline, black elements, and the **burger turns lime**. After the first screen, the lime burger is the most visible UI element on the page.
- **Burger menu:** a full-screen beige sheet. Left half: 7 primary destinations in Saphion caps, about 30px, separated by hairlines, some with a small Inter caps sub-label ("SPA — MYBLEND", "RESTAURANT ROOFTOP — LE PETIT CÉLESTIN"). Below them, 8 secondary links in 2 columns (Inter 12, caps, +0.08em). Right half: an image that crossfades per hovered item. On mobile: a single column, no image.
- **Footer:** a CTA band ("Séjour / Vivre l'expérience dès maintenant / Réserver"), **15 links** in a single uppercase column, social icons, KUBE and Machefert Collection logos, address and contact, Google Maps, a newsletter field (placeholder `machefert@kube.com`), 3 legal links, **GDS codes** (Amadeus, Sabre, Galileo, Worldspan) for travel agents, and © plus "Made by Digidop".

---

## 9. The booking system

### 9.1 The "Réserver" control

- **Where:** the header, top right. It is a Webflow dropdown (`w-dropdown`, `data-hover="false"`, 400ms delay). It opens on **click or tap, not hover**.
- **Styling:** looks like a link-button (Inter 12/500, caps, +0.08em, 1px underline), not a button. **It is not lime.** The lime is spent on the burger instead.
- **Opens:** a small panel, 135×104px, directly below the trigger. Beige `#fdf9f4`, 8px radius, no shadow, 0.4s grid-row reveal. On mobile the panel is about 135px wide and right-aligned under the link.
- **Contents:** three link-buttons in caps, stacked:
  1. **UNE CHAMBRE**
  2. **UNE TABLE**
  3. **LE SPA MYBLEND**
- **No labels, no descriptions, no icons, no prices.** The words alone carry the choice.
- **Persistence bug:** once opened, the panel **stays open** while you scroll the entire page, until you click elsewhere. It floats over photos, and its background sometimes drops to transparent over imagery (observed in screenshots).
- **Tap targets on mobile:** each item is **20px tall** (99×20, 74×20, 115×20), less than half the 44px guideline.

### 9.2 The three paths

| Path | Mechanism | Destination | On-site? | New tab? | State passed |
|---|---|---|---|---|---|
| **Une chambre** | `<button>` inside a `[data-mews]` wrapper | **Mews Distributor** booking engine, a full-screen iframe overlay on the current page | **Yes, visually** (the iframe sits on the KUBE domain; the engine and payments are Mews) | No | None |
| **Une table** | `<a target="_blank">` | **Zenchef**, `bookings.zenchef.com/results?rid=364375&pid=1001` | **No** | **Yes** | None |
| **Le spa myBlend** | `<a target="_blank">` | **Planity**, `planity.com/spa-kube-hotel-saint-tropez-83580-gassin` | **No** | **Yes** | None |

Three different vendors, three different visual systems, and two of the three leave the site entirely.

**Findings from the other pages:**

- "Une table" goes to **one restaurant only**. The Zenchef ID is the one used on the **rooftop, Le Petit Célestin**, page. The hotel's own **Restaurant & Pool Bar** has "Réserver une table" as a **`mailto:` link** (`kubehotel@machefert.com?subject=Réservation restaurant…`), and the FAQ confirms bookings there are by email or phone. So the header's "Une table" silently means "the rooftop".
- **Private hire is not in the Réserver control.** It lives on `/fr/privatisation` as "Demander un devis", which leads to a **Backyou** request form (`machefertgroup.backyou.app`), a fourth vendor.
- **Every in-page "Réserver" button goes straight to rooms.** The hero "Réserver", the CTA "Réserver maintenant", the footer "Réserver", the offer modal's "Réserver maintenant" and the room page's "Voir les disponibilités" all carry `data-mews`. **Only the header control splits three ways.** In-page buttons assume you want a room.

### 9.3 How Mews is loaded

```
inline script → on first mousemove/touchstart/scroll/keydown/click (or at 10s):
  inject https://api.mews.com/distributor/distributor.min.js
  Mews.Distributor({ configurationIds: ['d803eb49-…'], openElements: '[data-mews]' })
```

- Mews binds every `[data-mews]` element on the page. Clicking one opens a same-origin iframe (`name="mews-distributor…"`) at `position: fixed; inset: 0; z-index: 100000`.
- **The URL never changes** (`/fr` stays `/fr` through all five steps), so no step can be linked to, shared or bookmarked. Back-button behaviour inside the overlay was not tested.
- **No preselection anywhere.** The room detail page's "Voir les disponibilités" opens Mews at **step 1 (Dates)**, with no room category, no dates and no rate preselected. Mews supports category-level deep opens; the site doesn't use them. A visitor who has just chosen "Prestige Ibiza" has to find it again in a list of 12.
- Triptease scripts (`mews.js` integration, meta, paid search, ads) watch the Mews flow for retargeting and price-parity messaging.
- Payload: about 0.36 MB on boot, ≈1.7 MB once the engine assets load.

### 9.4 The room type filter (`#rooms?tags=`)

- **Engine:** **Finsweet Attributes CMS Filter v1** (`@finsweet/attributes-cmsfilter@1`). Tags are Webflow CMS multi-reference items injected into each room card by a small script (`data-room-list="source" / "target"`).
- **UI:** 16 pill-shaped **radio** chips (single-select, not multi-select), in three centred rows. The active chip is filled lime; inactive chips have `#c6c6c6` text and borders on cream (**1.6:1**, nearly unreadable). "VOIR TOUT" resets. A counter on the left updates ("12 chambres" → "3 chambres", with the plural handled in JS). A "Galerie / Liste" toggle on the right switches to a text list with a hover-driven image panel.
- **Tags:** three *univers* (Wood Room, Ibiza Room, Natural Room), four *grades* (Deluxe, Junior, Prestige, Suite) and nine *features* (Vue mer, Balcon/terrasse, Vue jardin, En étage, Rez-de-jardin, Vue piscine, Plain-pied, Jacuzzi privatif, and so on), all in one flat radio group. **You cannot combine "Natural" with "Vue mer".**
- **Two URL forms:**
  - Clicking a chip writes a **query string**: `/fr/chambres?tags=Wood+Room` (Finsweet's own URL sync). Loading that URL cold also works.
  - The homepage room tiles link with a **hash-plus-query**: `/fr/chambres#rooms?tags=Wood+Room`. A custom script parses the part after `#…?`, waits for Finsweet's `cmsfilter` callback, finds the `[fs-cmsfilter-field="tags"]` span whose text matches **exactly** ("Ibiza Room"), and clicks its label. The `#rooms` anchor also scrolls the page to the index (scrollY ≈ 813).
  - Result: the homepage "Découvrir Wood Room" lands on the rooms page scrolled to the grid, filtered to the 3 Wood rooms.
- **It is fragile and French-only.** The match is on the **visible label text**. On `/en`, the homepage tiles link to plain `/en/rooms` with **no filter**, and `/en/rooms#rooms?tags=Ibiza%20Room` checks the chip but **still shows all 12 rooms**. The deep link silently fails outside French.
- **The mental model doesn't carry through.** The site sells *three univers*; Mews sells *twelve categories* in a flat list ("Natural", "Natural Sea", "Prestige Natural", "Prestige Natural Vue Mer"…). Mews has no univers grouping, and its names don't always match the site's ("Prestige Natural Sea" on the site is "Prestige Natural Vue Mer" in Mews).

### 9.5 Every step from landing to a confirmed room

From measured clicks on 24 Sept 2026 (2 adults, 5–7 Oct 2026):

| # | Step | What happens |
|---|---|---|
| 0 | Land on `/fr` | Video hero. At 7s the offer modal interrupts; its CTA also opens Mews |
| 1 | Click hero **Réserver** (or header Réserver → **Une chambre**) | Mews overlay opens full screen: KUBE lime logo, "Kube Hotel Saint-Tropez", language select (Français), currency select (EUR), ×. Progress stepper: **Dates → Catégories → Tarifs → Récapitulatif → Détails et paiement** |
| 2 | **Dates** step: a centred white card over a pool photo | "Sélectionner des dates" field; Adultes stepper (default **2**); **"Adolescent (13–18 ans)"** stepper (no child option); "Ajouter un code promotionnel"; lime "Suivant" |
| 3 | Click the date field | A calendar dialog titled "Arrivée" with **2 months side by side**. Past dates greyed. Dates after 10 Oct 2026 are unavailable (closed season; many earlier ones read "Désolé, ces dates sont complètes") |
| 4 | Click the arrival date, then the departure date | The field shows `05/10/2026 - 07/10/2026` |
| 5 | **Suivant** | **Catégories:** a summary card (2 nights, Mon 05/10 → Wed 07/10, 2 adults, "Modifier") and a 2-column grid of **12 room cards**, each with an image carousel (7–10 photos), name, "Personnes maximum : 2", a description behind "Plus", **"À partir de 328,40 € par chambre/par nuit (hors taxe de séjour, TVA comprise)"**, and a lime "Afficher les tarifs" |
| 6 | **Afficher les tarifs** | **Tarifs:** first **upsells** ("Améliorez votre séjour": Package Spa €250, valet parking €49/night, champagne €100, 60-min massage €180, "Afficher plus"), then occupancy, then **2 rates**: *Tarif Flexible, breakfast included* €359/night (100% charged 5 days before arrival, free cancellation until then, €200/night deposit on arrival) and *Tarif Non Remboursable, breakfast included* €328.40/night (shown with €359 struck through). Each has a "Réserver" button |
| 7 | **Réserver** on a rate | **Récapitulatif:** cart line "Natural + Tarif Flexible", 1 × €718.00, VAT 10% €65.28, **Total €718.00**, "Ajouter d'autres séjours", "Continuer" |
| 8 | **Continuer** | **Détails et paiement:** "Je réserve pour moi-même / pour un autre client"; first name, **last name\***, **email\***, **phone\***, nationality, special requests; **card number\*, expiry\*, CVV\*, name on card\*** ("Sécurisé avec Mews Payments"); **accept terms\***; marketing opt-in (unticked); "Confirmer"; reCAPTCHA notice; a long GDPR paragraph |
| 9 | *(not performed)* **Confirmer** | Booking confirmation. Payment is collected later according to the rate |

**Minimum effort:** about **8 clicks plus 8 required fields plus 1 checkbox** from the hero button to Confirmer, spread over 5 steps. That is 9–10 clicks if you arrive through the header dropdown.

### 9.6 Mobile booking experience

- **Hero:** a full-width lime "Réserver" button pinned to the bottom of the 100svh hero (390 wide, about 40px tall *(est.)*). It is the strongest mobile CTA on the site, and it opens Mews directly.
- **After the hero there is no sticky booking bar.** The only persistent booking affordance is the header "RÉSERVER" text link in the fixed 64px nav (69×52 tap area), which opens the same three-item dropdown with 20px-tall items.
- **Mews on mobile** becomes a full-screen single-column flow. The header compresses to "Kube Hotel …" (truncated), a globe icon for language, currency and ×. The stepper collapses to "1 Dates · 1 of 5 ⌄". The card fields are touch-friendly. The engine is the best-behaved part of the mobile experience.
- **The offer modal also fires on mobile** at 7s and covers about 60% of the screen.

---

## 10. Multi-language

- **Structure:** **Webflow Localization**, one locale per subdirectory: `/fr` (primary and `x-default`), `/en`, `/it`, `/ru`.
- **URLs are localised, not just content:** `/fr/chambres` → `/en/rooms` → `/it/camere` → `/ru/nomera`. CMS item slugs are **not** localised (`/fr/chambres/prestige-ibiza` becomes `/en/rooms/prestige-ibiza`).
- **hreflang:** complete on every page tested, 4 alternates plus `x-default` → FR.
- **Switcher:** top-left of the nav, showing the **current code only** ("FR"). Click (not hover) opens a small 8px-radius panel listing the **other three codes** ("EN / IT / RU"), with no language names and no flags. Each link points to **the same page in that language**, so context is kept.
- **What is translated:** page titles, meta, headings, body, FAQ (checked on the homepage in all four), button aria-labels in EN and IT.
- **What is not translated:**
  - **Image `alt` text stays in French on every locale** (EN, IT and RU homepages all carry "Terrasse de restaurant avec tables dressées…").
  - RU aria-labels are a mix of French ("Espace bien-être"), English ("Go to the homepage", "Home Page") and Russian ("Google Карты").
  - PDF menus are French (not checked per locale).
  - The rooms-filter deep link only works in French (§9.4).
- **Mews** has its own language and currency selectors inside the overlay. It opened in French from `/fr`.

---

## 11. Structure and pacing

### 11.1 Homepage, section by section

| # | Section | Job | Booking prompt? |
|---|---|---|---|
| 1 | **Hero video**, eyebrow "WELLNESS - POOL - ROOFTOP", H1, lime "Réserver" | Mood. Three amenities as an eyebrow, a headline about the view | **Yes, the first prompt, at y ≈ 850px on desktop**, inside the first screen. The header "RÉSERVER" is also visible at y = 56 |
| 2 | **Intro**: "Hôtel 5 étoiles à Saint-Tropez" / "Un luxe expérientiel", two paragraphs, "À propos", aerial photo | Classification (5 stars, location), then brand promise. The aerial shot answers "what is this place" | No |
| 3 | **Rooms**: "Chambres" / "Trois univers, une même expérience", Wood / Ibiza / Natural tiles | **Product, by feeling**: rooms as worlds, not grades or prices | Indirect ("Découvrir" → filtered index) |
| 4 | **Experiences**: spa, rooftop, beach, pools | The resort's four reasons to stay; two link off-site (the beach goes to cybeleramatuelle.com) | No |
| 5 | **Activities**: short text, "Voir plus", 5-item hover list | Things to do, as a quiet list | No |
| 6 | **CTA**: full-screen pool photo, "Votre séjour commence ici", "Réserver maintenant" | Second booking push, after the full product tour | **Yes** (→ Mews) |
| 7 | **Privatisation**: "Le KUBE, rien que pour vous", pro and private events | B2B / events, as a secondary audience | Indirect (→ privatisation pages) |
| 8 | **FAQ**: 8 questions | Objection handling (location, beach, non-residents, children, price, season) | No, though the price answer points to "notre moteur de réservation" |
| 9 | **Footer**: "Vivre l'expérience dès maintenant", "Réserver" | Third booking push, then utility | **Yes** |

**Order of information:** mood → classification → rooms → amenities → activities → **ask** → events → objections → **ask**. Price never appears on the site itself (only inside Mews, and the FAQ refuses to state it). The Day Pass is quoted at "from €399 per person", but only in an FAQ answer.

### 11.2 The FAQ

- **Placement:** an 8-question block at the bottom of the homepage; 6-question blocks on every service page (rooms, restaurant, rooftop, privatisation) scoped to that page; a full `/fr/faq` page with **5 categories and ≈36 questions** (Réservation & séjour, Chambres & hébergements, Services & installations, Sécurité & accessibilité, Évènements & privatisations, Activités).
- **Format:** accordion rows. The question is Inter 14/500 in caps, with a lime ± circle on the right and a 0.5px hairline. Answers are Inter 14/300 grey with a **bold black lead sentence** that answers directly ("Oui, …", "Non, …"). Contact details are inlined in answers.
- **Voice:** factual and a little promotional. The honest-question move, **"Le Kube Saint-Tropez est-il situé à Saint-Tropez même ?"**, is answered with the fact (Gassin, 20 minutes on foot, 10 by bike) and then softened into a benefit (calm, close to the buzz, a chauffeur shuttle).
- **Structural purpose:** written as much for **search engines and LLM answers** as for guests. There is a large `Hotel` / `Organization` / `WebSite` JSON-LD graph on the homepage (70 rooms, 12 amenities, check-in 16:00, 4.2 from 674 reviews, four languages), and the FAQ copy mirrors it.
- **Weaknesses:** the uppercase questions are tiring to scan at 14px. The FAQ page has no category jump-links, no search and no sticky category index, so it is 36 accordions in one 4,750px column. Some answers contain broken contact links (§14).

---

## 12. Technical

| Area | Finding |
|---|---|
| Platform | **Webflow** (site ID `69c122f05101301b0245c7c6`), Webflow CMS, Webflow Localization |
| Framework | **Lumos** (Timothy Ricks) component and token system: `u-*` utilities, `data-trigger` hover and focus variables, `clickable_wrap` overlay buttons, `lumos.modal` |
| Built by | Digidop (footer credit) |
| JS libraries | jQuery 3.5.1 (Webflow), **GSAP 3.15 + ScrollTrigger** (Webflow CDN), **Lenis 1.1.18** (unpkg), **Swiper 8** (jsDelivr), **Finsweet Attributes CMS Filter v1** (jsDelivr) |
| Booking and third parties | **Mews Distributor** (rooms), **Zenchef** (rooftop tables), **Planity** (spa), **Backyou** (event quotes), **Triptease** (Mews integration, meta, paid search, ads, cross-origin tracking) |
| Tracking | Google Tag Manager, GA4, **three** Google Ads conversion IDs, Meta Pixel + Conversions API param builder (S3), Microsoft Clarity, **Cookiebot** (consent mode, GTM implementation) |
| Images | Webflow CDN (`cdn.prod.website-files.com`), **AVIF/WebP**, responsive `-p-500…2000` variants, mostly `loading="lazy"` |
| Video | **Vimeo** iframes, `?background=1`, 1080p MP4 over byte ranges, **no poster on the home hero**, the service-card video lazy-loaded on hover |
| Fonts | Self-hosted **Saphion** (1 weight) and **Inter Variable**. Font transfer ≈0.33 MB |
| HTML | ≈214 KB decoded / **≈51 KB** transferred (homepage), much of it inline styles (46 KB) and JSON-LD |
| CSS | 1 shared Webflow stylesheet, **293 KB** minified (the entire Lumos library plus styleguide rules) |

### Weight and timing (homepage, desktop, fresh profile, European connection)

| Moment | Transferred | Requests |
|---|---|---|
| **Load + 8s idle, no scroll, excluding the Vimeo iframe** | **3.67 MB**: tracking **1.84 MB (50%)**, images 0.91 MB, Mews 0.36 MB, fonts 0.33 MB, scripts 0.15 MB, HTML 0.05 MB, CSS 0.03 MB | 96 |
| **Plus the hero video (first 10s)** | **+23.5 MB** (Vimeo: 22.9 MB video, ≈0.5 MB player) | +32 |
| **After a full scroll, excluding video** | 6.48 MB: images 2.33 MB, tracking 1.86 MB, Mews 1.67 MB… | 155 |
| **Realistic total for one homepage visit** | **≈30 MB** | ≈190 |

| Timing | Value |
|---|---|
| TTFB | 0.54–0.81s |
| FCP / LCP | **1.37s** (the LCP is the H1 over black) |
| DOMContentLoaded | 2.0–2.7s |
| `load` event | 3.4–4.0s |

A 34-second, 23 MB hero loop is about **six times the weight of everything else on the page combined**. On a 4G phone that is a real cost to the visitor.

---

## 13. Accessibility notes

| Check | Result |
|---|---|
| Reduced motion | **Not supported** (§7.4) |
| Autoplaying video | Loops indefinitely, with no pause control |
| Contrast | Filter chips 1.6:1; footer links 3.7:1; white "FR" on cream 1.05:1 on the restaurant and rooftop pages |
| Tap targets | Booking dropdown items 20px tall; FR switcher 17×53 |
| Buttons | Implemented as a full-cover invisible `<button aria-label>` over `aria-hidden` duplicated text. Accessible names are correct, but visible text is not the accessible text, so a translation drift is invisible to QA |
| Heading outline | Tag and visual size disagree (home H1 and H2 the same size; FAQ questions are H3 at 14px) |
| Alt text | Empty on several room tiles and activity images; **French on all locales** |
| Modal | Native `<dialog>` with focus return (good), but the offer modal interrupts at 7s, and the background page **kept scrolling behind it** in capture. The `lenis.stop()` call can't reach Lenis, which is a local `const`, so the fallback `overflow: hidden` fights Lenis |
| Skip link | "Aller au contenu principal" is present |
| Focus rings | Tokens exist (1px, 3px offset); rendering **not verified** |

---

## 14. What it does badly (the evidence list)

1. **The 23.5 MB, 34-second hero loop**, with no poster, no pause, no reduced-motion fallback and no lighter mobile asset. It says "sun, glasses, backs" and nothing about this particular hotel.
2. **The 7-second offer pop-up** interrupts first-time visitors on every entry page, on mobile too, and doesn't lock scroll properly.
3. **The primary button has no hover state.** Lime maps to lime, so the most important control is the one that gives no feedback.
4. **"Une table" means "the rooftop".** The hotel restaurant's booking is a `mailto:`. Private hire isn't in the booking control at all. Four booking vendors, three visual languages, two new tabs.
5. **No context passed into Mews.** Room detail → "Voir les disponibilités" → step 1, choose the room again from 12. The URL never changes during booking.
6. **Univers on the site, categories in the engine.** Wood / Ibiza / Natural do not exist inside Mews, and names drift between the two.
7. **The filter is single-select and label-matched.** You can't pick "Natural + sea view"; the deep link breaks in English; inactive chips are 1.6:1.
8. **The booking dropdown stays open** while you scroll the whole page, and its mobile items are 20px tall.
9. **Broken contact links:** the rooftop phone shown as "+33 (0)7 67 66 09 00" links to `tel:+33(0)616962987` (a different number); another is `tel:33(0)767660900` (malformed); the FAQ beach phone is `tel:+33(0)6858760` (truncated); several emails are `href="#"`.
10. **Nav theming breaks on light heroes:** the white "FR" disappears on the restaurant and rooftop pages.
11. **Policy inconsistency:** the FAQ says guests must be 12 and over; Mews offers "Adolescent (13–18 ans)". Is a 12-year-old allowed?
12. **Long, light, grey body text:** 14px, weight 300, about 80 characters per line, centred. It reads as texture, not as information.
13. **Half the transfer is tracking** (1.84 of 3.67 MB before video): three Google Ads IDs, Meta, Clarity and five Triptease scripts.
14. **The hover-only second image** means touch users never see half the paired photography.
15. **No prices on the site**, not even "from", and the FAQ declines to answer the price question.
16. **Untranslated alt text** and mixed-language aria-labels in RU.
17. **293 KB of framework CSS** for a site that uses a fraction of it, plus jQuery, which the custom code doesn't use.
18. **The Saphion fallback stack** is `"Times New Roman", sans-serif`. If the font fails, the headings fall back to Times.

---

## 15. Verdict and the four questions

### 1. What makes this site feel expensive?

These are decisions, not adjectives:

- **It spends one saturated colour, and spends it at 1% of the screen.** Everything else is warm off-white, black and one grey. The lime is only ever "do something here".
- **One display face, one weight, all caps, loose, light.** Saphion 300 at every heading size. There is no bold anywhere in the display layer, and restraint in weight reads as confidence.
- **A small type scale with nearly no size jumps** (3.6× from largest to smallest). Hierarchy comes from switching typeface, not from shouting. The 128px display token exists and is never used.
- **Photography does the volume.** Full-bleed mosaics with 2–3px seams, zero radius, zero shadow, square crops next to wide crops. The images are architecture; the type is a caption.
- **Nothing animates on scroll.** No fade-ups, no staggered reveals. Only a condensing nav, a 64px drift and a heavy smooth scroll. Stillness reads as money.
- **Generous, fluid vertical space** (86–115px section padding at 1440, only about 25% smaller on mobile) and a centred single thread (the 1px vertical rule) that slows you down between sections.
- **Hairlines, not boxes.** 0.5px rules separate lists; nothing is carded or shadowed.
- **Prices are withheld until the engine.** It is a classic luxury move, and a questionable one (see below).

### 2. One button splitting into three paths: is the pattern good? What would you change?

**The idea is right; KUBE's execution isn't.** One control that asks "what are you booking?" matches how people think about a place with a restaurant. KUBE undermines it in four ways: the paths go to three unrelated vendors (two in new tabs), one of the three silently covers only one of two restaurants, private hire is missing, and nothing you learn on the page is carried into the flow.

For Le Comble I would keep the one-control, three-path structure, and change the rest:

1. **Make it a panel, not a link list.** Three rows, each with a verb and one line of fact: *Une table — Navette, mar–sam, dîner · Une chambre — 19 chambres, dès 190 € · Le bâtiment — privatisation, réponse sous 48 h.* The line tells you what you're committing to before you tap.
2. **Put the table first.** The brief says the guest books a table first and a bed second, and the majority of covers are non-residents. KUBE orders room → table → spa because it's a hotel; Le Comble is a restaurant.
3. **Keep all three flows in one visual language on the site**, even if a vendor sits behind them. At minimum, don't open new tabs and don't hand over to a differently styled engine for two of the three.
4. **Carry context.** "Réserver" on a room page opens the room path with that room selected. "Réserver" on the Navette page opens the table path. Deep-linkable URLs (`?book=table&date=…`) make every step shareable and back-button safe.
5. **Make the control follow the page's subject.** In-page buttons on the restaurant pages should default to the table path, not to rooms as KUBE's do.
6. **Show it on mobile as a sticky bottom bar after the hero**, with 44px targets, one tap to the three-way sheet.
7. **Give it a real hover and focus state**, and never leave the panel open on scroll.
8. **The building is an enquiry, and should look like one:** a form with a promised reply time, not a booking engine with a calendar.

### 3. What transfers to a small restaurant-with-rooms in Lyon, and what would look wrong?

**Transfers (technique, not signature):**

- One warm neutral ground, one dark ink colour, **one accent kept only for action**. For Le Comble the structure is plaster white, indigo and brass (per the brief), with brass taking lime's role.
- A **display-serif / quiet-grotesque split** with hierarchy carried by the typeface switch, and a small, disciplined scale.
- **Paired images per section**: in space (the ⅓ + ⅔ split) and by list-driven swap. For Le Comble it should be **portrait + portrait**, as the brief asks, echoing the two-metre windows.
- **Full-bleed mosaics with hairline seams**, zero radius, no shadow.
- **Hairline-separated lists** for the menu, the rooms and the FAQ.
- **The eyebrow → heading → paragraph → link cluster**, and the vertical-rule "thread" as a section opener, which maps directly onto the warp-and-weft idea in the brief.
- **Rooms named as worlds, not grades.** Mansarde / Trame / Atelier / Grand Atelier is exactly the KUBE "univers" move, and truer, because the names describe the floors.
- **FAQ with a bold, direct first sentence.** "Oui. La colline est raide." would work in that slot.
- **Scoped FAQ blocks per page**, plus a full FAQ page with category anchors.
- **Lazy-booting the booking engine** on first interaction, and **hover-loaded video**, if video is used at all.
- **Localised URLs with complete hreflang** (`/fr/chambres` ↔ `/en/rooms`), FR as `x-default`, and a switcher that keeps you on the same page.
- **Stillness**: no scroll reveals, a condensing nav, one slow drift at most.

**Specific to a 70-room Côte d'Azur resort, and would look wrong:**

- **The full-screen lifestyle video** of backs, glasses and sun. It costs 23 MB and says nothing about the building. The brief already rules it out.
- **The offer pop-up**, the Day Pass at €399, GDS codes, the newsletter with a brand-group logo, and the **Machefert Collection** co-branding: all chain-hotel furniture.
- **The "Wellness - Pool - Rooftop" amenity stack.** Le Comble has no spa, gym or pool, and says so as its position.
- **Lime.** It is KUBE's brand, and on an industrial-hill-town palette it would read as a copied mistake.
- **Saphion**, or any flared, fashion-light caps display face. Le Comble needs a high-contrast *printing* serif, and probably not all caps everywhere. A caps-only light serif reads Riviera boutique, not Lyon.
- **The wellness vocabulary** ("lâcher prise", "se reconnecter à l'essentiel", "luxe expérientiel").
- **Three-plus vendors.** A 19-room house doesn't need Zenchef, Planity and Backyou; it needs one table path, one room path and one form.
- **The resort's pacing**, a tour of amenities before the first real ask. Le Comble's page should lead with the chef and the table, and put rooms second.
- **Aerial drone photography.** Banned in the brief.
- **Fifteen footer links** (the brief says six), and a burger that hides nine destinations. A 13-page site can show its navigation.
- **Withholding prices.** For a €190 room and a single €68 menu, printing the price is a confidence move. Hiding it is a Saint-Tropez affectation.

### 4. What does it do badly?

In short, the full list is §14:

- **It is heavy in the wrong place:** 23.5 MB of generic video, and half the remaining transfer is tracking.
- **It interrupts:** a 7-second pop-up on every first visit.
- **Its booking is fragmented:** four vendors, a `mailto:` for one restaurant, private hire missing from the booking control, and no context passed into the engine.
- **It breaks its own ideas at the seams:** univers on the site but not in the engine; the filter works in French only; the primary button has no hover.
- **It neglects access:** no reduced motion, no video pause, 1.6:1 filter chips, 20px mobile tap targets, alt text untranslated.
- **It has basic content errors:** wrong and malformed phone links, `href="#"` emails, contradictory age rules.
- **Its typography is quieter than it can afford:** 14px, weight 300, grey text at about 80 characters per line, carrying almost all the information.

**Leave-behind list (signature, never reuse):** the lime-on-cream palette, Saphion and its caps-at-300 styling, the KUBE room tile triptych (2 squares + 1 wide) as a direct layout, any copy, all photography and video.

**Adjacent version to build instead:** plaster / indigo / brass. A printing serif in mixed case for headings. Portrait pairs, not landscape ones. A vertical-rule thread drawn as a warp line. The three-path booking panel ordered table → room → building, carrying context, with visible prices.
