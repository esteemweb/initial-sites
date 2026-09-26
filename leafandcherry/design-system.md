# Design system — Leaf & Cherry

**Brand:** Leaf & Cherry — specialty café and micro-roastery, Colombo (flagship, roaster behind glass) and Ella (hill country). 100% Sri Lankan-grown coffee.
**Personality:** proud but not precious. Colonial coffee history meets third-wave craft. Dry, never cute.
**References synthesised:** 1 — [`refs/cafe-technica/autopsy.md`](refs/cafe-technica/autopsy.md)
**Tokens live in:** `src/app/globals.css` (Tailwind v4 `@theme`). Single source of truth — there is no second copy.

---

## Decisions log

### One reference, so divergence is deliberate

A single reference synthesised faithfully is a copy of that reference. What follows takes Café Technica's **rules** (ratios, proportions, separation strategy, section order) and **rounds every measured instance to a system** — a measured 1521px full-bleed becomes a `clamp()`ed gutter, a measured 39.7px heading becomes the nearest step on a named scale. Three things were changed on purpose:

**1. The declared divergence axis: type families and weight strategy.**
The reference carries every heading in a **monospace display face at a single 400 weight**. That is its entire voice and it is unmistakably *machine shop*. Leaf & Cherry inverts the relationship:

| | Café Technica | Leaf & Cherry |
|---|---|---|
| display | monospace, 400 | **editorial serif (Fraunces), 400 + variable axes** |
| body | geometric sans, 400 | geometric sans (Manrope), **400 + 500** |
| mono | *is* the display face | **demoted to a data role only** (IBM Plex Mono) — lot codes, altitudes, roast dates, dashboard figures |
| weights on the page | 1 | 3 (400 + 500 sans; 400 display) |

Why this axis: it is the reference's signature, so it has to change; and a serif display is what carries "colonial coffee history" without costume. The mono survives as the *third-wave lab* register — it appears only where a number is a fact.

**2. Every §14 *Signature* item gets its adjacent version, written down here as this project's decision.**

| Reference signature | Leaf & Cherry decision |
|---|---|
| Mono display at one weight | Serif display + sans body, three weights (above) |
| Defocused/motion-blurred photography, unscrimmed text | Sharp warm natural photography; **every text-over-image block carries `--scrim-image`**, no exceptions |
| `01`–`09` numbered catalogue as the page's spine | The `number ⟷ LABEL` row survives as a **component**, used in one section (Origins) and capped at **3 lots**, plus the dashboard's shipment rows |
| Coined `Esprescue™` name as h1 with ™ as a device | Hero headline is the brand's own dry line. **No coined trademarks, no ™ typography** |
| Cream square badge as the site's only CTA | Square cream badge **kept as secondary**; a **solid primary button is added** — the reference has none and the subscription flow needs one |
| `#E44F2F` vermilion accent | Relationship kept (accent = ink's hue at far higher chroma, under 1% of page area), hue changed to **cherry `#A8341F`** |

**3. Every accessibility failure in the reference is fixed at token level, not at build time.** Muted text 3.80:1 → **6.39:1**. Button text 3.85:1 → **6.61:1**. No scrim → a required scrim token. `:focus { outline: none }` → a brand focus ring. 13px mobile gutter → 20px. Sub-44px targets → a 44px minimum enforced on every control.

### Silently adopted from the reference (rules, not instances)

Hero-to-body 2.5x · 1.6 / 1.2 line-height split by family · radius 0 · zero shadows on marketing surfaces · separation by rules only · full-bleed with a viewport gutter · 30/70 split · sticky media + scrolling rail · one accent under 1% of area · left-aligned everything · operational detail set at body size, never as fine print · opacity-only reveals on one curve.

### What was *not* taken, and why

The reference's own numbers — 23 / 30 / 51 / 53 / 90 / 101 / 186 / 258 / 309 — share no base unit. They are drag-positioned instances. Their **proportions** are ported onto an 8px scale below.

---

## 1. Foundations

| Token | Value | Source |
|---|---|---|
| container (page) | **none** — full-bleed, with a `--container-max: 1600px` safety cap on ultrawide | autopsy §2 (no max-width container) |
| container (prose) | `--measure: 62ch` | §2 (54–58ch measured, rounded up to a standard comfortable measure) |
| gutter desktop / tablet / mobile | `clamp(1.25rem, 3vw, 3rem)` → **20 / 32 / 48px** | §2 (30px ≈ 2% of width), with the 13px mobile failure fixed to a 20px floor |
| column system | **12-col**, `--grid-gap: 4rem` (64px) desktop / `2rem` mobile | §2: gap was 25% of a 404px column = 101px; systematised to 64px on a 12-col at our narrower content column |
| base unit | **8px** | §5: the reference has none; imposed |
| section rhythm (sticky sequence) | `--sequence-pitch: 52rem` (832px) | §5 (856px measured, rounded to the 8px grid) |

## 2. Spacing scale

8px base, linear at the bottom, doubling at the top — the hybrid the autopsy's proportions imply.

| Token | px | rem | Used for |
|---|---|---|---|
| `--space-1` | 4 | 0.25 | icon-to-label, rule-to-text hairline gaps |
| `--space-2` | 8 | 0.5 | badge internal, chip internal |
| `--space-3` | 12 | 0.75 | form control internal vertical |
| `--space-4` | 16 | 1 | stack gap inside a text block |
| `--space-6` | 24 | 1.5 | **rule → content inset** (§6, measured 23px) · heading → trailing rule gap (measured 25px) |
| `--space-8` | 32 | 2 | grid gap mobile · card internal gap |
| `--space-12` | 48 | 3 | title → media (§5, measured 51px) |
| `--space-16` | 64 | 4 | grid gap desktop · media → body (measured 74px) |
| `--space-24` | 96 | 6 | sub-section separation |
| `--space-32` | 128 | 8 | **section padding, desktop** |
| `--space-48` | 192 | 12 | hero vertical, statement-section air |

- **Section padding: 128px desktop / 64px mobile → 2:1.** The reference measured 258px, which produced a 12.4-viewport page; rounded down deliberately to keep the homepage near 7 viewports while preserving the airy proportion.
- **Eyebrow cluster (the reference's nine-times component), systematised:**
  `number ⟷ LABEL row` →`--space-24` (96)→ `title` →`--space-12` (48)→ `media` →`--space-16` (64)→ `body`
  (reference measured 186 / 51 / 74; the 186 was an artefact of the stagger and is not a system value.)

## 3. Typography

**Families**

**All three are on Google Fonts** — verified against the CSS2 API, not assumed. There is no Fontshare or self-hosting step.

| Role | Token | Stack | Weights | Source |
|---|---|---|---|---|
| display | `--font-display` | `"Fraunces", "Newsreader", Georgia, serif` | 400 (variable 300–700) | **declared divergence** — replaces the reference's mono display |
| body / UI | `--font-sans` | `"Manrope", "Inter", system-ui, sans-serif` | 400, 500 (variable 200–800) | §3 — measured as the nearest available match to the reference's Switzer |
| data / mono | `--font-mono` | `"IBM Plex Mono", ui-monospace, monospace` | 400, 500 (**static — declare weights explicitly**) | **divergence** — the reference's display face, demoted to lot codes, altitudes, roast dates, dashboard figures |

### Why Manrope, measured

Switzer (the reference's body face) is a Fontshare release and is not on Google Fonts. Candidates were rendered against Switzer at 100px/400 and measured, rather than matched by eye:

| Face | x-height | cap-height | **x/cap** | line width vs Switzer | x-height vs Switzer |
|---|---|---|---|---|---|
| **Switzer** (target) | 53 | 68 | **0.779** | — | — |
| **Manrope** ← chosen | 54 | 72 | **0.750** | **+1.2%** | +1.9% |
| Plus Jakarta Sans | 54 | 75 | 0.720 | +2.6% | +1.9% |
| Inter | 52 | 73 | 0.712 | −3.6% | −1.9% |
| Figtree | 50 | 70 | 0.714 | −1.6% | −5.7% |
| DM Sans | 50 | 70 | 0.714 | −8.6% | −5.7% |

Switzer's distinguishing trait is an unusually **high x-height relative to its caps** (0.779) — it is why the reference's body copy reads large and even at 16px. Manrope is nearest on that ratio *and* nearest on set width, so line breaks and the 54–58ch measure carry over almost unchanged. Inter — the reflex substitution — is the second-worst match on x/cap and runs 3.6% narrower, which would have quietly loosened every measure in the system.

**If you want more personality than accuracy:** Plus Jakarta Sans is the swap. It is warmer and more characterful, at the cost of a taller cap height that will make headings-in-sans (nav, buttons) sit visibly larger. One token change, no other consequences.

### Fraunces: using the variable axes

The display face was previously specified as a flat weight 400, which wastes most of what Fraunces offers. Configured properly:

| Axis | Setting | Why |
|---|---|---|
| `opsz` | `font-optical-sizing: auto` | Lets Fraunces tighten and raise contrast as size grows. This is what gives `--text-3xl` / `--text-4xl` their editorial feel **for free**, with no per-component work. |
| `SOFT` | `30` | Warms the terminals. Keeps "heritage" from reading as "Didone luxury brand". |
| `WONK` | `1` at ≥28px, `0` below | The alternate swashed glyphs are the dry-humour register at display size; at label size they are noise. `h4/h5/h6` and `.u-display-plain` drop to `WONK 0`. |

**Honest note from the specimen:** at 40px the SOFT and WONK deltas are subtle — visible side by side, not obvious in isolation. They earn their place at `--text-3xl` (56px) and above. `opsz` is the axis doing the visible work.

**Display alternatives considered:** Instrument Serif (higher contrast, more elegant, but one weight + italic only — too thin a range for a system) and Newsreader (warmer, more newspaper, less distinctive). Fraunces stays because it is the only candidate that is both variable across the full 23→72px range and characterful enough to carry dry humour.

### IBM Plex Mono over JetBrains Mono

JetBrains Mono is designed for IDEs — tall x-height, wide set, heavy colour. Beside a serif display at 12px label size it reads as a console. IBM Plex Mono is narrower and more humanist at the same px, so `LOT 01 · ELLA · ROASTED 12 SEP` reads as a specimen label rather than terminal output, and it does not compete with Fraunces for attention.

Alternatives if the register needs to move: **DM Mono** (more delicate — check it still holds at 12px against `--color-text-muted`) or **Space Mono** (retro-typewriter, much louder; it would fight the serif).

**Scale** — ratio **1.2 through UI/body**, one **1.4 jump into display**. This reproduces the reference's measured pattern (tight ~1.2 steps, one ~1.4 jump) without inheriting its three near-duplicate display sizes.

| Token | px | Line-height | Tracking | Weight | Family | Used for |
|---|---|---|---|---|---|---|
| `--text-2xs` | 12 | 1.4 | `0.08em` | 500 | mono | lot codes, roast dates, dashboard axis labels |
| `--text-xs` | 14 | 1.6 | `0` | 400 | sans | footer, legal, helper text |
| `--text-sm` | 16 | 1.6 | `0` | 400 | sans | **body default** |
| `--text-base` | 19 | 1.6 | `0` | 400 | sans | lead paragraph, hero support copy |
| `--text-lg` | 23 | 1.3 | `0` | 400 | display | card title |
| `--text-xl` | 28 | 1.3 | `-0.01em` | 400 | display | sequence-item title |
| `--text-2xl` | 40 | **1.2** | `-0.015em` | 400 | display | **h1** and section headings |
| `--text-3xl` | 56 | 1.15 | `-0.02em` | 400 | display | statement / pull-quote section |
| `--text-4xl` | 72 | 1.1 | `-0.025em` | 400 | display | reserved — do not use on the homepage |

- **Eyebrow / label role:** `--text-2xs`, mono, 500, `letter-spacing: 0.08em`, uppercase. The reference used no tracking because its display face was monospace; ours needs it because the label face is now the *only* mono on the page.
- **HERO HEADING ÷ BODY = 40 ÷ 16 = 2.5x.** Matches the reference's measured 2.51x. **Do not vary this per section.** It is the single number that produces the "unhurried, premium" read.
- **Line-height rule (taken wholesale):** `1.6` for everything in `--font-sans`; `1.1–1.3` for everything in `--font-display`; `1.2` at h1; `1.4` for mono labels.
- **Tracking rule:** `0` on body (reference had 0 everywhere) · negative on display ≥28px, scaling with size · `+0.08em` on uppercase mono labels only.
- **Case:** sentence case for all headings. Uppercase **only** on the mono label role.
- **Measure:** 62ch for prose, 56ch inside cards.
- **Prose links:** `color: var(--color-accent)` **plus** `text-decoration: underline; text-underline-offset: 0.2em; text-decoration-thickness: 1px`. Fixes the reference's colour-and-nothing failure (§13).

## 4. Colour

Three-hue discipline, taken directly from the reference: one warm ink, one accent sitting on the ink's own hue at far higher chroma, one badge fill. Two dark surfaces are added because the brief asks for forest and roast.

| Role | Token | Value | Contrast | Source |
|---|---|---|---|---|
| surface | `--color-surface` | `#FBF7F0` linen | — | brief ("crisp off-white / linen"); reference used pure white |
| surface raised | `--color-surface-raised` | `#F3EDE3` | — | the reference's single alt background (`#EEEEEE`), warmed |
| surface forest | `--color-surface-forest` | `#1E3026` | — | brief ("deep forest") |
| surface roast | `--color-surface-roast` | `#241610` | — | brief ("roast"); hue 20°, a near-sibling of the reference's `#230A06` |
| text | `--color-text` | `#1B120C` | **17.27:1** on linen | §4 rule: warm near-black, never `#000` (reference `#230A06` = 18.79:1) |
| text muted | `--color-text-muted` | `#6B5547` | **6.39:1** on linen · 5.86:1 on raised | **fixes** the reference's 3.80:1 failure |
| text on dark | `--color-text-on-dark` | `#F0E6D6` | 11.28:1 on forest · 14.19:1 on roast | §4 (reference used cream on dark, not white) |
| text muted on dark | `--color-text-muted-dark` | `#BFAE97` | 6.45:1 on forest · 8.12:1 on roast | derived |
| hairline | `--color-hairline` | `#DED2C2` | 1.39:1 — **decorative only** | §6 (reference had no hairlines; added for dashboard tables) |
| rule | `--color-rule` | `#A8341F` (= accent) | 6.19:1 on linen | §6 — the 2px accent rule is the site's structural device |
| accent | `--color-accent` | `#A8341F` cherry | **6.19:1** on linen | §4 relationship kept, hue changed (signature divergence) |
| accent hover | `--color-accent-hover` | `#8C2717` | 8.69:1 vs white | **added** — the reference has no hover delta at all |
| accent fg | `--color-accent-fg` | `#FFFFFF` | **6.61:1** on accent | **fixes** the reference's 3.85:1 button pairing |
| badge fill | `--color-amber` | `#E8C87A` | ink on it **11.40:1** | §4 (reference's `#EEDCAA` cream badge) |
| leaf (data only) | `--color-leaf` | `#4E7A4A` | 4.67:1 on linen — **≥16px text and data marks only** | brief; subscription dashboard needs one positive signal |
| scrim | `--scrim-image` | `linear-gradient(to top, rgb(27 18 12 / 0.72) 0%, rgb(27 18 12 / 0.45) 35%, transparent 70%)` | clears 4.5:1 for `--color-text-on-dark` | **fixes** §7 "no scrim" |

**Hard rules, in the system because they are contrast facts:**
- `--color-accent` on `--color-surface-forest` is **2.11:1**. **Never** put cherry text or cherry rules on a forest surface. On dark surfaces the rule/accent role is `--color-amber` (8.61:1); a CTA on dark becomes `--color-amber` fill with `--color-text` on it.
- `--color-hairline` is **never** used for text or for a rule that carries meaning. Meaningful rules use `--color-rule`.
- `--color-leaf` never drops below 16px and never carries meaning alone.

**Other colour decisions:**
- Distinct hues: **three** (ink/roast family, cherry, amber) + forest as a surface. Matches the reference's count.
- Neutral ramp: **warm** — `#1B120C` is hue 25°, `#6B5547` hue 26°. The reference's greys were hue 13–22°; warmth is the transferable decision.
- Accent area budget: **under 1% of page area.** Rules, one primary button per screen, the active nav item. If a page needs more cherry than that, the page is wrong, not the budget.
- Semantic colours: the reference has **none**. The dashboard needs some, so: `--color-leaf` for delivered/active, `--color-amber` (text form `#8A6A18`) for pending, `--color-accent` for failed/paused. Marketing pages use none of them.
- Dark mode: **none.** Light is the only mode, as in the reference. The forest and roast surfaces are *sections*, not a theme.
- Gradients: **only `--scrim-image`.** Nothing else on the site is a gradient.
- Section background sequence (homepage): `linen → roast → linen → linen → forest → linen → raised(footer)`. The reference alternated only at the footer; two dark bands are added to carry the two locations.

## 5. Shape and depth

| Token | Value | Applied to |
|---|---|---|
| `--radius-none` | `0` | **everything** — cards, images, badges, buttons, inputs, sections, media panels |
| `--radius-full` | `9999px` | status dots and the subscription "next delivery" chip **only** |
| `--border-width` | `1px` | badge, input, table hairline |
| `--rule-width` | `2px` | the structural accent rule |
| `--shadow-overlay` | `0 8px 24px rgb(27 18 12 / 0.12), 0 2px 6px rgb(27 18 12 / 0.08)` | **dashboard dropdowns and modals only** |

- **Separation strategy: rule-driven flat.** Taken wholesale from §6. No shadows and no fills on any marketing surface; separation is a 2px `--color-rule` line and whitespace. `--shadow-overlay` exists because a dashboard needs true layering, which the reference never had — it must not appear on a marketing page.
- **Radius 0 is total and deliberate**, exactly as in the reference. The two `--radius-full` exceptions are status affordances, not decoration.
- **The rule component, three jobs (§6):**
  1. **Vertical** — at a column's *leading* edge, full column height, content inset `--space-6` (24px).
  2. **Heading-trailing** — starts `--space-6` after the heading's text ends, runs to the container edge, vertically centred on the heading's cap height.
  3. **Block cap** — a fixed-width horizontal rule above an item in the sequence (`--rule-cap-width: 28rem` / 448px).
- Focus ring: `outline: 2px solid var(--color-accent); outline-offset: 2px`. Brand-coloured, **replacing** the reference's `:focus { outline: none }` + Wix-blue platform ring.

## 5b. Imagery

**Photography, generated with Nano Banana Pro** (`higgsfield generate create nano_banana_pro`). Six frames, one shoot. Prompts are in the commit; the art direction below is the part that must hold if any frame is ever regenerated or replaced.

**The direction, fixed across every frame**

| | |
|---|---|
| register | hyperrealistic 35mm editorial, documentary, unstyled — not a styled advert |
| focus | **deep focus front to back, every surface sharp** |
| light | warm directional tropical daylight, crisp shadows, no flare |
| palette | deep roasted browns, near-black shadows, warm amber highlights, pale linen neutrals |
| excluded | people, text, signage, lens flare, **shallow depth of field, bokeh, blur** |

**Why the blur exclusion is load-bearing.** The autopsy (§14, *Signature*) lists the reference's defocused, motion-blurred photography as a signature to leave behind. It is the single easiest thing to drift back into, because soft-focus coffee photography is the genre default. Every prompt names it as an exclusion three ways. If a replacement frame comes back soft, it is wrong regardless of how good it looks.

**Scrim** — `--scrim-image`, required under every text-over-image block, is **tight rather than tall**: heavy at the bottom (0.92), falling to zero by 55% height. Overlaid text occupies roughly the bottom 15% of a panel, so a gentler gradient spread over the full height reaches the same contrast ratio only by darkening the whole photograph into a near-black rectangle. That was tried and rejected.

**Contrast, measured per-pixel over the composited result** (image → scrim → text), not assumed:

| Block | Before | After | Fix |
|---|---|---|---|
| hero overlay, cream on photo + scrim | 4.60:1 ⚠ | **9.74:1** ✅ | tightened scrim |
| audience band, amber labels over photo | **1.81:1** ❌ | **6.13:1** ✅ | image opacity 60% → 20% |

Real photographs carry blown highlights — sunlit concrete, open sky — that the earlier generated placeholders did not. **Any new photograph must be re-measured, not assumed to pass**, and the audience-band opacity in particular is a measured value rather than a taste call.

**Alt text.** Meaningful frames carry real descriptions. The audience-band frame now carries alt text too: it is shown at full strength as the band's subject (three cups along one counter, for the three audiences), with `u-band-scrim` roast gradients at the top and bottom where the text travels. It used to sit at 20% opacity as texture, which left the pinned band reading as two screens of empty brown.

**Offline fallback.** `scripts/generate_placeholders.py` still generates the procedural "Roast Plate" set — duotone contour plates built from noise, domain warp, a halftone screen and grain, seeded per filename so output is deterministic. It needs no API and no account. Use it when regenerating photography is not possible; mark its output `alt=""`, since a generated plate says nothing about the coffee.

## 6. Motion

| Token | Value | Used for |
|---|---|---|
| `--duration-fast` | `200ms` | scroll reveal (§8, measured) |
| `--duration-base` | `300ms` | hover and focus transitions (§8, measured) |
| `--duration-slow` | `400ms` | colour transitions on large surfaces (§8, measured) |
| `--ease-standard` | `cubic-bezier(0.12, 0, 0.39, 0)` | reveals (§8, measured verbatim) |
| `--ease-hover` | `cubic-bezier(0.4, 0, 0.2, 1)` | interactive state changes |
| `--reveal-delay` | `200ms` | scroll reveal delay (§8, measured) |

- **Intensity: `moderate`** — revised from `subtle` after the 2026-09-23 screen recording (autopsy §15) showed the reference's motion is JS-driven scroll geometry that the computed-style pass could not see. Reveals stay opacity-only; nothing rotates, and the media never scales. See *Scroll-linked geometry* below.
- **Hover deltas are added, because the reference has none** (a §14 weak item):
  - primary button → `background: var(--color-accent-hover)`, `translateY(-1px)`
  - badge → `background: var(--color-text)`, `color: var(--color-amber)` (an inversion, not a tint)
  - card → the leading rule grows from 2px to 4px; the media does **not** scale
  - prose link → `text-decoration-thickness: 2px`
- **Nav on scroll:** hides on scroll down, reveals on scroll up, stays transparent at rest (§8, taken wholesale).
- **Nav on intent** (autopsy §15.2): on hover or keyboard focus inside, the header becomes an outlined frosted linen bar, the menu trigger fills ink, a hidden Account link appears (the reference's cart-on-intent; we have no cart) and Subscribe turns cherry. Hovering Subscribe itself still gives the badge inversion. Not on the dashboard's solid header.
- `@media (prefers-reduced-motion: reduce)` disables reveals and transforms; opacity transitions drop to `1ms`.

### Scroll behaviour — the reference's signature

The reference's strongest structural idea is a full-viewport media panel held
still while a text rail scrolls past it (autopsy §14 #7). What makes it *read*
is not the mechanic but the **distance**: it runs three pinned panels, and its
pinned sequence alone is 4986px — roughly six viewports of a 12.4-viewport
page, about half the scroll.

A first pass implemented the mechanic correctly but gave it only **838px of
travel (1.0 viewport, 14% of the page)**, which is one flick of a wheel. The
effect was present and invisible. Current state:

| | Reference | Leaf & Cherry |
|---|---|---|
| pinned panels | 3 | 2 (`#who`, `#houses`) |
| pinned travel | ~4986px | **2641px** |
| in viewports | ~6 | **3.2** |
| share of page | ~48% | **32%** |

**Rule: a pinned section needs at least one full viewport of travel beyond its
panel.** A 2-viewport section yields exactly one viewport of pin. `--sequence-pitch`
is `160svh` — 1.6 screens per item — because with only two items a 1:1 pitch
(the reference's own ratio, which works across six items) leaves too little
dwell for the pin to register.

**Two measured motion values were deliberately dropped.** Both are recorded in
the autopsy and both are wrong to copy:

- **The 200ms reveal delay.** A delayed opacity transition never completes in
  this project's Chrome — it reports `playState: "running"` indefinitely and
  the element is stranded at opacity 0, so the content is *invisible*, not
  merely un-animated. Even where it completes, delay plus a near-instant curve
  reads as lag then pop.
- **`cubic-bezier(0.12, 0, 0.39, 0)`.** Both y controls sit at 0, so the value
  holds at 0 for the entire duration and snaps at the end. The x controls are
  kept so the timing character matches; y2 is corrected to 1. Duration moved
  from `--duration-fast` to `--duration-slow`, because at 200ms the fade is
  over before the eye registers it mid-scroll.

**Reveals are driven by a rAF-throttled scroll listener plus a 400ms geometry
poll, not IntersectionObserver.** IO was measured broken here — a freshly
constructed observer on a plain element never fired once. An earlier fallback
simply revealed everything after a timeout, which rescued the content but
destroyed the effect: by the time you scrolled to a section it had been visible
for seconds. The poll runs the *same viewport test*, so an element still only
appears when it is genuinely in view.

Each reveal also carries a watchdog: if opacity has not reached 1 shortly after
it should have, the transition is cancelled and opacity forced. A running CSS
transition sits in the animation origin, which outranks inline style — so
cancelling it is the only way to recover a stalled fade. Costs nothing on a
healthy browser; prevents a blank section on a wedged one.

### Scroll-linked geometry (autopsy §15)

**Sequenced, never simultaneous.** A photo edge never uncovers text that is already in place: the slide lands over an empty rail first, then the copy scrolls in. The trade-off on the hero is that the h1 is below the fold at first paint.

`ScrollProgress` writes the element's scroll progress to `--p` (or `--slide`, via `name`) (0 → 1) with the
same rAF scroll listener as the reveals; CSS does the rest. Under reduced motion
`--p` is never written and every `var(--p, X)` falls back to that effect's
resting state. The geometry effects are lg-only, like the pins.

| Effect | Where | Range |
|---|---|---|
| **Step 1:** photo opens full-bleed and its edge slides into the split over an empty rail (`--slide`) | hero | scroll 0 → 0.4 screens |
| **Step 2:** the rail copy rises from the fold (the rail starts one screen down) | hero | 0.4 → 1.2 |
| **Step 3:** bottom edge rises faster than the page into the `--hero-strip` (8rem) label strip; overlay statement rides the edge and fades; the Statement slides up underneath | hero | 1.2 → 1.7 |
| Same slide, then the first item rises from the fold (`u-slide-rail`) | `#houses` | first 0.4 screens of the pin |
| Trailing heading rule draws in from the left | `#origins` | top 95% → 55% of viewport |
| Columns rise into the ladder at 8 / 12 / 4rem offsets; leading rules grow down | `#origins` | top 100% → 35% |
| `number ⟷ LABEL` text-scramble (JS, ~0.3–0.9s, fires on the reveal line) | Origins, Houses | on enter |
| Cherry ↘ corner square on card hover (decorative; the link stays "Tasting notes") | Origins cards | hover |

**Logo** (`LogoMark`, `src/components/ui/logo.tsx`; favicon `src/app/icon.svg`): a coffee cherry in `--color-accent` with a coffee bean's S-crease through it, on a stem with one pointed coffee leaf in `--color-leaf`; crease and leaf rib in linen. 48-unit grid, legible from 16px. Used beside the wordmark in the header, and in the loading screen.

**Loading screen** (`PageLoader`): plays on **every full load / refresh**, never on client navigation. Centred lockup on linen — the one centred thing on the site, because a splash sits outside the page layout. Timeline: stem draws (0–380ms) → cherry swells with a small overshoot (150–650) → leaf unfurls from the stem tip (300–760) → crease and rib draw (520–900) → wordmark rises (640–1100) → holds until loaded (min 1.3s, max 3s) → lifts away as a curtain (700ms). rAF-driven with a removal timer, like every other motion here; hidden without JS or with reduced motion. This is a departure from the reference, which has no loading screen — requested explicitly.

**Blur-up (§15.1):** the reference's hero opens on a heavily blurred poster that sharpens as the video arrives. Here the hero and Two Houses photos show a 20px blurred placeholder instantly (`src/content/placeholders.ts`), then `BlurUp` eases the real photo from `blur(16px)` / 106% scale to sharp over 900ms once it has loaded — and not before the loading screen starts to lift (`onIntroDone`), so it plays in view rather than behind the curtain. A lazy photo below the fold plays it when it loads, as you scroll to it.

Not taken: the reference's hero is **video**. There is no footage for it, so the hero stays a still.

## 7. Page architecture

**Homepage**, adapted from §9's inventory. Nine sections became seven; the reference's six-item numbered spine collapses into one capped Origins section per the signature divergence.

| # | Section | Job | Pattern source |
|---|---|---|---|
| 1 | header | wordmark + menu + badge CTA | §10 nav — 95px, fixed, transparent, hides on scroll down |
| 2 | hero | the dry brand line + where we are | §2 split hero, **30/70**, text rail left, full-bleed photography right, overlay statement bottom-right of the media **with `--scrim-image`** |
| 3 | statement | the brief's dry line, two short paragraphs | §9 statement; `--text-3xl`. **Directly after the hero**, as the reference's manifesto is: it starts at `--hero-rail` (200svh) and slides up under the collapsing strip, so no blank band is left beneath it (autopsy §15.4) |
| 4 | audience band | who this is for — three labels over a dark full-bleed image | §9 audience band |
| 5 | origins | **3 lots**, staggered 3-col grid with leading rules | §2 staggered grid + §10 `number ⟷ LABEL` row, **capped at 3** |
| 6 | the two houses | Colombo + Ella | §6 **sticky full-viewport media + scrolling rail**, `--sequence-pitch` 832px, **2 items not 6** |
| 7 | subscription teaser | one claim, the primary CTA | **added** — the reference has no final CTA, a §14 weak item |
| 8 | footer | address, hours, social, legal + **a repeated CTA** | §10 footer, 2 columns, `--color-surface-raised` |

**Subscription dashboard** — the reference contains no dashboard, so its patterns are extended rather than copied:

| # | Region | Pattern source |
|---|---|---|
| 1 | header | same nav, `--color-surface` background instead of transparent (a dashboard must not float) |
| 2 | account rail | left rail at the `30/70` split ratio, leading rule, `number ⟷ LABEL` rows as nav items |
| 3 | next shipment | full-width panel, `--color-surface-roast`, `--color-amber` chip |
| 4 | roast & grind controls | segmented controls, radius 0, `--rule-width` active indicator |
| 5 | shipment history | table on `--color-hairline` rules, mono figures, `--color-leaf` / amber / cherry status dots |
| 6 | plan controls | primary + badge-secondary pairing |

- **Copy voice (shape only, from §9):** short declarative claims with an operational fact attached; one dry aside per section; 6–20 word sentences; second person; headings are claims, never questions. **Address, hours and origin facts are set at body size, never shrunk into fine print** — the reference's best conversion decision.
- **Total homepage depth target: ~7 viewports** at 1440 (the reference ran 12.4 — deliberately shorter).

## 8. Components

### Buttons

| Variant | Height | Padding | Text | Radius | Bg / fg | Hover | Disabled |
|---|---|---|---|---|---|---|---|
| **primary** | 48 | `0 24px` | `--text-sm`, sans 500 | 0 | `--color-accent` / `--color-accent-fg` (6.61:1) | bg `--color-accent-hover`, `translateY(-1px)`, 300ms | bg `--color-text-muted`, fg `--color-surface`, `cursor: not-allowed` |
| **badge (secondary)** | 48 | `0 20px` | `--text-sm`, sans 400 | 0 | `--color-amber` / `--color-text` (11.40:1), `1px solid --color-text` | bg `--color-text`, fg `--color-amber` (full inversion) | 45% opacity |
| **ghost** | 48 | `0 16px` | `--text-sm`, sans 400 | 0 | transparent / `--color-text`, `1px solid --color-hairline` | border → `--color-rule` | 45% opacity |
| **link** | 24 | `0` | `--text-sm`, sans 400 | — | transparent / `--color-accent`, underline `1px` at `0.2em` offset | thickness → `2px` | 45% opacity |
| **on-dark primary** | 48 | `0 24px` | `--text-sm`, sans 500 | 0 | `--color-amber` / `--color-text` | bg `--color-text-on-dark` | 45% opacity |

- Every variant is **48px tall**, clearing the 44px touch minimum the reference fails at 17 places.
- **Sizes:** `sm` 40px (dashboard rows only, still ≥44px hit area via padding), `md` 48px default, `lg` 56px (hero only).
- Icon spacing: `--space-2` (8px), icon optically centred, never baseline-aligned.
- **The on-dark row exists because `--color-accent` on forest is 2.11:1.** There is no cherry button on a dark surface.

### Feature card — "Origin Lot"

The reference's card, with its measured proportions rounded to the scale and its missing states filled in.

```
┌ 2px --color-rule, full card height, at the column's LEADING edge
│
│  ← --space-6 (24px) inset
│  LOT 01 ⟷ ELLA · 1,340 M          ← eyebrow row: mono 12px/500/+0.08em, --color-text-muted
│  ↓ --space-24 (96px)
│  Bird's-eye Chinna                 ← --text-lg, display, --color-text
│  ↓ --space-12 (48px)
│  ┌──────────────────────────┐
│  │  3:2 image, radius 0      │      ← --aspect-card: 3/2, no border, no shadow
│  └──────────────────────────┘
│  ↓ --space-16 (64px)
│  Washed. Jasmine, tamarind,        ← --text-sm, 1.6, max 56ch
│  and a finish like wet bark.
│  ↓ --space-4 (16px)
│  Tasting notes →                   ← link variant
└
```

- **Aspect ratio is preserved at every width** (`aspect-ratio: 3/2`) — the reference pinned image height and let the ratio drift 1.62 → 1.28 on mobile. Fixed.
- Hover: the leading rule grows `2px → 4px` over `--duration-base`. Nothing scales.
- **Stagger:** at ≥1024px, cards 2 and 3 take `margin-top: var(--space-24)` and `var(--space-48)` — a *systematic* 0 / 96 / 192 ladder, replacing the reference's arbitrary 0 / +90 / +229. The eyebrow rows stay baseline-aligned in a separate grid row above, which is what stops the stagger reading as a bug.
- Whole card is **not** a link; the trailing link is the affordance.

### Roastery badge pill

Three uses, one anatomy. This is the reference's cream header badge, generalised.

| Property | Value |
|---|---|
| height | 28px (inline) / 48px (as the header CTA) |
| padding | `--space-2` `--space-4` (8 / 16), with **1px more top than bottom** for optical centring on the display face — the reference's `8px 16px 7px` trick |
| type | `--text-2xs`, mono, 500, `+0.08em`, uppercase |
| radius | **0** |
| border | `1px solid var(--color-text)` |
| fill / text | `--color-amber` / `--color-text` — **11.40:1** |
| on dark | fill `--color-surface-roast`, border `--color-amber`, text `--color-amber` — **8.61:1** |
| hover (interactive only) | full inversion: fill `--color-text`, text `--color-amber` |

**Variants by content, not by colour** — the colour never changes to encode meaning:
`SINGLE FARM` · `LOT 01` · `ROASTED 12 SEP` · `MEDIUM` · `SUBSCRIBER PRICE`.
A status *dot* (`--radius-full`, 8px, `--color-leaf` / amber / cherry) is prepended when the badge carries state, so colour is never the only signal.

### Subscription interactive widget

The one component with no reference precedent. It is built from the reference's parts: rules for separation, radius 0, the eyebrow row, mono figures, a single accent.

```
┌─ 2px --color-rule, top edge, full width ────────────────────────────┐
   YOUR PLAN ⟷ NEXT SHIP 03 OCT              ← eyebrow row, mono
   ↓ --space-8

   ① COFFEE          Bird's-eye Chinna  ▾     ← ghost select, radius 0, 48px
   ② ROAST           [ Light | Medium | Dark ]← segmented, 48px, active = 2px
                                                 --color-rule underline + 500 weight
   ③ GRIND           [ Whole | Filter | Espresso ]
   ④ SIZE            [ 250 g | 500 g | 1 kg ]
   ⑤ CADENCE         [ 2 wk | 4 wk | 8 wk ]

   ── 1px --color-hairline ──────────────────────────────────────────
   PER SHIPMENT                        LKR 4,800   ← mono --text-xl, tabular
   Subscriber price · free Colombo delivery       ← --text-xs, --color-text-muted
   ↓ --space-8
   [ Start subscription ]  [ Skip next ]          ← primary + ghost
└──────────────────────────────────────────────────────────────────────┘
```

**Specifications**
- Layout: `grid-template-columns: 1fr 2fr` at ≥768px (the 30/70 ratio, applied at component scale); stacked below.
- Every option is a real `<input type="radio">` in a `<fieldset>` with a `<legend>`, visually hidden and styled through its `<label>`. **No div-with-click-handler.**
- Segmented control: 48px tall, radius 0, `1px solid var(--color-hairline)` around the group, `1px` dividers between. Active = `--rule-width` bottom border in `--color-rule` + weight 500. **Never colour alone** — the weight change carries it for colour-blind users.
- All figures use `--font-mono` with `font-variant-numeric: tabular-nums`, so the price does not jitter as options change.
- Price updates are a **200ms opacity transition on `--ease-standard`** — the reference's reveal, reused as a state change. The number never slides.
- `aria-live="polite"` on the price region.
- Focus: `outline: 2px solid var(--color-accent); outline-offset: 2px` on every control.
- Disabled cadence options (e.g. 2 wk on 1 kg) get `aria-disabled` plus a mono helper line, not just a grey-out.

### Nav

Height **80px** (reference 95px, rounded to the 8px scale), `position: fixed`, **transparent on marketing pages**, `--color-surface` on the dashboard. Hides on scroll down, reveals on scroll up. Wordmark left, menu trigger beside it, badge CTA right. **Menu trigger is 48 × 48** (reference: 41 × 41 — fails). Flyout: full-height panel, `--color-surface-roast`, 56px rows, `--text-base`, active item `--color-amber`.

### Footer

Two columns on `--color-surface-raised`. Left: address, hours, "no appointment required"-style operational line, social (48 × 48 hit areas — reference used 26 × 26). Right: legal, credit, right-aligned. **Plus the repeated primary CTA the reference omits.** Type `--text-xs` throughout, 1.6 line-height.

### Form controls

No precedent in the reference (`not present on captured pages`). Defined here: height 48, padding `0 --space-4`, radius 0, `1px solid --color-hairline`, focus `2px solid --color-accent` at `2px` offset, **a real `<label>` above the field** (never placeholder-as-label), helper `--text-xs --color-text-muted`, error `--text-xs --color-accent` **with an icon**, placeholder `--color-text-muted` at 6.39:1.

## 9. Responsive rules

| Breakpoint | Gutter | Columns | Section padding | h1 |
|---|---|---|---|---|
| mobile (<640) | **20px** | 1 | 64px | 28px |
| tablet (640–1024) | 32px | 2 | 96px | 34px (fluid) |
| desktop (>1024) | 48px | 3 (12-col grid) | 128px | **40px** |

- **h1 is a single `clamp()`** — `clamp(1.75rem, 1.2rem + 2.2vw, 2.5rem)` — so the 40 → 28 collapse is one rule, not a per-element decision. This directly fixes the reference's failure where two 39.7px headings landed at 20px and 35px.
- Every display step scales by the same mechanism; body sizes are **fixed**, exactly as in the reference (where 14 / 16 / 18 / 22 did not scale).
- Root font-size stays **16px at every breakpoint** — no stepped rem base (§11, taken).
- Hero collapses **text above media**; the overlay statement moves onto the media and keeps `--color-text-on-dark`, with `--scrim-image` still applied (the reference dropped from cream to white and had no scrim either way).
- Grid collapse **3 → 2 → 1**; the stagger ladder is removed below 1024.
- Sticky sequence: below 768 the media un-sticks and each item becomes a stacked media + text block.
- Nav: **hamburger at every width** (§11 — the reference's one genuinely responsive-proof decision).
- **Minimum touch target 44 × 44 everywhere.** This is a system rule, not a per-component one.
- Images preserve `aspect-ratio` at every width.

## 10. Originality boundary

**Taken (craft):** spacing proportions, the 1.2/1.4 type-scale pattern, the 2.5x hero ratio, the 1.6/1.2 line-height split, radius 0, the no-shadow rule-driven separation strategy, the 30/70 split, full-bleed with a viewport gutter, the sticky-media/scrolling-rail sequence, the staggered grid with a baseline-anchored eyebrow row, the `number ⟷ LABEL` component anatomy, the single-accent-under-1% discipline, warm neutrals, opacity-only reveals on one curve, nav hide-on-scroll, operational detail set at body size.

**Not taken (assets and identity):** all copy, all photography, the brand-logo wall, the logo and wordmark, the coined `Esprescue™` name and its ™ typography, the monospace display voice, the vermilion `#E44F2F`, the defocused photographic treatment, the 01–09 page spine.

**The test:** someone who knows Café Technica should see Leaf & Cherry and think *same school of design* — flat, rule-separated, left-aligned, restrained hero, full-bleed photography. They should not think *that's Café Technica*. The serif display, the linen surface, the cherry accent and the capped three-lot Origins section are what make the difference.

---

## Token audit

Every value above exists as a token in `src/app/globals.css`. If a value is in this document and not in `@theme`, one of the two is wrong. Phase 3 uses `p-32`, not `p-[128px]`; `text-2xl`, not `text-[40px]`.
