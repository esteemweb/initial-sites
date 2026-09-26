# Design system — Talay Dao

Synthesised from: `refs/tandjung-sari/autopsy.md` (**one reference**)
Written: 2026-09-22 · Tokens live in: `src/app/globals.css` (`@theme`) · **Tailwind version verified: v4.3.3**

> **Amended 2026-09-22 (phase 3):** the project was scaffolded on Next 15.5 / React 19 / Tailwind v4.3.3, so the tokens moved from `styles/tokens.css` (`:root`) into `src/app/globals.css` (`@theme`) as this document originally specified they would. `styles/tokens.css` was **deleted, not copied** — a token with two homes is worse than no token.
>
> Themeable colour roles use one level of indirection so they can both generate utilities and swap per theme: `@theme { --color-canvas: var(--c-canvas) }`, with `--c-canvas` set on `:root` and `:root[data-theme="night"]`. Role names never change; only values swap. Role overrides stay outside `@theme`.

Every entry carries provenance. `(estimated)` marks values descending from eyeballed measurements. An entry with no provenance is an invention.

**Provenance keys:** `ref` = taken from the reference · `ref→system` = reference value rounded to this system's scale · `divergence` = deliberately different (reason given) · `fix` = corrects a failure the autopsy flagged.

---

## Decisions log

> ## ⚠ Amended: this is now a deliberate close copy of the reference
>
> **On explicit instruction, repeated twice, the divergences below were reverted.** What follows in this document still describes the reasoning behind each original choice, because that reasoning is worth keeping — but where it conflicts with this box, this box is what shipped.
>
> **Now matched to the reference 1:1:**
> - **Palette** — its exact values: canvas `#F1ECDE`, ink `#544F45`, accent `#A62A23`, surface `#FFFBF2`, on-media `#FBF6EC`, wash `rgb(147 131 108 / 0.28)`. The deep water teal is gone.
> - **Day/night removed.** The reference has a single mode; the day→night wash was this project's own concept and has been deleted, along with `DayNight.tsx` and every `data-theme` rule.
> - **Typography** — `"Adobe Caslon Pro", serif` over `Helvetica`, its own declared stack. Verified live: body Helvetica 16px/1.6, heading Caslon 34.13px at −0.01em, UI Helvetica 13.87px at +0.1em uppercase, weight 400 only.
> - **Sizing** — its literal formula, `calc(N / var(--vw) * 100vw)`, with `--vw` a design constant of `1440` desktop / `393` mobile. Numerators are its measured values: 13 / 15 / 32 / 40 / 176. The `clamp()` floors added earlier are gone; the constant swap is what handles mobile, as it does on the reference.
> - **Chrome** — fixed left vertical rail with brand mark, hamburger hairlines and rotated contact tab, plus the top-right BOOK ROOM / BOOK TABLE pair at 46px with pale fill and red text. The bottom booking bar is gone.
> - **Axis** — horizontal filmstrip at its measured panel ratios.
>
> **Still NOT copied, and not negotiable:**
> - Its **photographs** — ours are generated from written prompts, never from its images as references.
> - Its **copy** — every word here is written for this project.
> - Its **logo** — the coral device is a trademark; the mark here is typographic.
> - The **Adobe Caslon Pro font file** — a licensed face that cannot be redistributed. The stack names it first so anyone who has it licensed sees it, and falls back to Libre Caslon Display, a free revival.
>
> **Known cost of the sizing change:** dropping `clamp()` reinstates the reference's WCAG 1.4.4 failure — type no longer responds to browser font-size or zoom. That was a deliberate trade to match it, not an oversight.

> **Amendment (2026-09-22, later): the chrome rail is opaque, and the mark is the full name.**
>
> Two changes on explicit instruction, both away from the reference.
>
> **The rail is no longer transparent.** The reference floats its mark and contact tab straight over the filmstrip, so across eleven panels the brand sits on eleven different grounds and over the dark plates it all but disappears. Here the rail is a solid lacquered spine and is now **the only dark surface on the site**: `--c-lacquer #221B16`, running to `--c-lacquer-deep #16100C` at the head and `--c-lacquer-warm #3C1512` — an oxblood-tinted black — at the foot. Four background layers: an accent thread held 7px off the inner edge, a letterpress rule texture (1px on 7px at 5% cream), a cream sheen down the outer edge, and the gradient itself. Width goes 4rem → **4.5rem** to seat the mark.
>
> **New role: `--color-accent-lifted` `#E0796A`.** The raw accent `#A62A23` on the lacquer computes to **2.40:1** and fails as text — and as a 1px thread it was simply invisible. The lifted tint holds the same hue and computes to **5.74:1**. On-media cream on lacquer is **15.75:1**. All three computed with the WCAG formula, not eyeballed.
>
> **The mark is now the full name.** "TD" is gone. An initialism is brand shorthand and shorthand only works on a name the reader already knows; a twelve-villa hotel has none to spend. `Logo.tsx` carries a drawn seal — a four-point star inside a hairline ring, the star in cream and its minor star in the lifted accent — over **TALAY DAO** set in Cormorant Garamond, `writing-mode: vertical-rl` with `text-orientation: upright` at 0.3em tracking. Two lockups, vertical and horizontal, off one component.
>
> **Upright, deliberately, against the contact tab below it.** The tab stays rotated the way the reference sets it. Two orientations in one 72px column would be sloppy if they were the same kind of thing — they are not, and the split *is* the hierarchy: the brand reads without turning your head, the utility label does not.
>
> **The place line was cut, on a measurement.** Upright vertical setting costs ~1.25em of column per glyph, so "Koh Yao Noi" ran 170px and the whole logo took **495px of the spine's 730px** — 68% of the column for the one element that is on screen at all times, leaving 42px of slack for everything below. The name alone is 317px. `locale` now defaults to `""` and belongs to the horizontal lockup, where the column is not the scarce axis. The colour it was carrying moved into the seal at no cost in height.
>
> **Short-viewport guard.** The rail is `justify-between` with nothing to reflow, so a short viewport would collide the stack. `.rail-tick`, `.logo-rule` and `.logo-locale` hide under `height < 44rem`, which takes the content from 501px to 389px and moves the collision point from ~541px of viewport height to ~429px. The ornament goes first; the name never does.
>
> **Verified:** no text ink on `/`, `/villas` or `/gallery` falls under the rail at any of six scroll positions — measured with `Range.getClientRects()` on the glyph runs, not on element boxes, because a centred full-width `h1` has a box starting at x=0 and reports a false positive.
>
> **Still not copied:** the reference's coral device. This seal is drawn for this project.

> **Amendment (2026-09-22, later still): the mobile artboard.**
>
> The reference's trick — author every size at a 1440 artboard and swap `--vw` to 393 for phones — carries almost the whole system across. Measured at 393px, **four values did not survive the swap**, and the opaque rail is what made three of them visible.
>
> | | was, at 393px | now | desktop, unchanged |
> |---|---|---|---|
> | rail width | 72px = **18.3%** of screen | **44px = 11.2%** | 72px = 5.0% |
> | booking pair | 279px = **70.8%** | **247px = 62.7%** (`px-sm` below `md`) | ~18% |
> | chapter numeral | **176px**, 321px of ink in a 309px column | **112px**, 204px of ink | 176px |
> | rail clearance | `md:ps-rail` — **none below 48rem** | `ps-rail` at every width | unchanged |
>
> **Why the numerator had to become a token.** `--text-chapter` was `calc(176 / var(--vw) * 100vw)`. The 176 is the reference's own era numeral, authored at 1440 — ported unchanged to the 393 artboard it is still 176px, which is 45% of the screen's width in one glyph run. It is now `calc(var(--n-chapter) / var(--vw) * 100vw)`, with `--n-chapter` 176/112. Same for `--n-seal` (34/22) and `--n-wordmark` (17/12), so the mark shrinks with the rail rather than bursting it. This is the **only** size whose numerator differs between artboards; every other one still rides the constant swap exactly as the reference does.
>
> **The clearance was the actual bug.** `Panel` applied the rail offset as `md:ps-rail` — below 48rem the panels fell back to a flat 20px gutter and their content ran underneath the fixed rail. That was invisible while the rail was transparent. Once it became lacquer it amputated the left of every chapter numeral: measured, the numeral's ink began at x=20 with the rail occupying 0–72, so **52px of it sat behind the panel**. `ps-rail` now applies at all widths and only its gutter term changes. The one bleed panel that carries its own padding (`page.tsx`) had to be given it too.
>
> **And one bias nobody would have named.** `hero-title` was `inset-inline: 0`, so a full-bleed panel's title centred on the *viewport* while the reader sees a content area starting at the rail. At 393px the title centre measured 197 against an optical centre of 233 — a 36px leftward bias that reads as "everything is shoved left". Now `inset-inline-start: var(--rail-width)`.
>
> **Verified after:** `/`, `/villas` and `/gallery` at 393px, six scroll positions each — **zero** text ink left of the rail or past the right edge, `scrollWidth === innerWidth`. Re-checked at 700px (between the two breakpoints) and 1440px: clean, and desktop values unchanged at rail 72px / chapter 176px / seal 34px / wordmark 17px.

> **Amendment (2026-09-22, last): the booking actions are real, and there is now an input spec.**
>
> BOOK ROOM and BOOK TABLE were `<a href="mailto:reservations@talaydao.example">`. **`.example` is reserved by RFC 2606 precisely so that it can never resolve**, so neither address could receive mail under any circumstance — and on a desktop with no mail client registered a `mailto:` click produces no feedback at all. The site's only two conversion actions were dead links that looked alive. They now open a real enquiry dialog (`src/components/Booking.tsx`).
>
> **Native `<dialog>` + `showModal()`, and the rail is why it is not negotiable.** The track moves panels with a transform, and a transformed ancestor becomes the containing block for its fixed descendants — so a hand-rolled fixed overlay inside the track would be dragged sideways with the panels. `showModal()` puts the element in the **top layer**, outside the document's normal paint order. Verified: with the track translated **−6560px**, the dialog's centre measured 712 against a viewport centre of 713. It also brings the focus trap, Esc, inertness of the page behind, and return of focus to the invoking button, each correct rather than reimplemented.
>
> **Input spec — closes the open item from phase 3.** The reference has no form at all (it books by WhatsApp), so there was nothing to measure and these are OURS, derived from the system: `--field-height: 3rem` (the booking button's 2.875rem rounded to the 8px grid), `--dialog-width: 34rem`, radius 0, and `--color-hairline-strong` as the boundary — the only hairline §4 permits to bound an interactive control. The submit is **the one place the accent is a fill** rather than the chrome's inverted pale-fill-with-red-text; it is the highest-intent control on the site and should not look like the two buttons that merely open it. `accent-fg` on `accent` computes to **5.89:1**.
>
> **Layout.** `.booking-dialog[open]` is a column flex box so the header and the submit footer pin and only the fields scroll. Measured before that: the panel came to 730px in a 770px viewport, putting the one action the dialog exists for below the fold on first open. `min-h-0` on the scroller is load-bearing — a flex child's default `min-height: auto` refuses to shrink below its content, which pushes the footer out of view instead of scrolling the list.
>
> **Verified, by exercising it rather than reading it:**
>
> | Check | Result |
> |---|---|
> | Both buttons open their own intent | villa → arrive/depart/guests · table → date/sitting/party |
> | Every control has a `<label for>` | 0 unlabelled |
> | Empty submit | 3 errors, `aria-invalid` on each, every `aria-describedby` resolves, focus moves to the first failure |
> | Cross-field rule | departure before arrival rejected |
> | Valid submit | summary rendered, 0 errors left |
> | Keyboard open (Tab → Enter) | opens, focus lands on the first field, not the close button |
> | Focus trap | 10 focusables, nothing outside the dialog reachable |
> | Escape | closes, focus returns to the invoking button |
> | Tap targets at 393px | smallest 44px (the close button was 40px and was raised) |
> | Console | no errors or warnings |
>
> **Nothing is sent.** There is no server to post to, so the success state says so in as many words. A confirmation that implies an enquiry was delivered is worse than no confirmation; the details are rendered for copying instead. Wiring a real endpoint is a one-function change in `onSubmit`.

**One reference, so there was nothing to converge and no conflicts to put to you.** The single-reference path applies: extract the rules rather than the instance, diverge on every §14 *Signature* item, and change one load-bearing axis on purpose.

**Taken as craft** (the reference's rules, rounded to a system):
- `font-weight: 400` as the only weight — the strongest discipline on the reference
- `border-radius: 0` universally, zero shadows, 1px hairline separation
- Two-tier motion (120ms micro / 800ms reveal) on `cubic-bezier(0.24, 0.43, 0.15, 0.97)`
- Type scale with a deliberate hole between reading size and architecture
- Three-tier tracking (−0.01em headings / 0 body / +0.1em uppercase UI)
- Bottom-weighted scrim under all text-over-image
- Zero inline CTAs; booking lives in one fixed, never-changing affordance
- Variable panel sizing with exact-1.00 bookends

**Load-bearing axis changed on purpose** (required by the one-reference path — with one reference, divergence has to be introduced deliberately or the output is a recolour):
- **Accent hue and placement.** The reference uses a warm brick red `#A62A23` at hue ~3°, **analogous** to its warm sand ramp, on ~0.4% of page area, in one state. We use a **deep water teal `#1C6E68` at hue ~176°, complementary** to the same warm ramp, and it is the one colour that **persists across both day and night states** (brightening to `#5FD4C4` below). Reason: the reference's accent reads as Balinese earth and terracotta; Talay Dao is water, and the accent has to survive a night wash that a warm red would muddy. **Stated trade:** we give up the reference's analogous harmony — item 7 of its "worth taking" list — in exchange for an accent that reads as water and works in both washes. That is the intended cost of breaking recognisability.

**Decided on your behalf** (low-stakes, or correcting a flagged weakness):
- 8px spacing base and a real scale — the reference has **none** (`padding: 0` on every section)
- Body type at 16px, not the reference's 15px, and never fluid
- Prose measure ~66ch — the reference runs 30–48ch, below comfortable
- `clamp()` floors on all fluid type — the reference has none and fails WCAG 1.4.4
- Focus rings restored; `prefers-reduced-motion` added — both absent from the reference
- Day/night implemented as **one ramp with two washes**, not two palettes

---

## 1. Foundations

| Token | Value | Source |
|---|---|---|
| container (page) | `--container-page` 90rem / 1440px | `ref` — the reference's own design width |
| container (measure) | `--container-measure` 36rem / ~66ch | `fix` — ref runs 30–48ch, too tight. **Not** named `prose`: Tailwind's built-in `max-w-prose` (65ch) silently won over that name and produced a 689px / ~86ch measure. |
| container (narrow) | `--container-narrow` 28rem / ~50ch | `divergence` — for pull quotes |
| gutter desktop | `--spacing-gutter` 4rem / 64px | `divergence` — ref uses 0 |
| gutter mobile | `--spacing-gutter-sm` 1.25rem / 20px | `divergence` |
| column system | none — panels compose freely | `ref` (no grid on the reference) |
| base unit | 8px | `divergence` (ref weakness: no scale at all) |

**Layout rules:** full-bleed media, contained prose. Media defines a panel edge-to-edge (`ref`); text sits inside `--container-measure` (`fix`). Headings and body are left-aligned; only the opening and closing bookend panels centre their title (`ref` — hero is `text-align: center`, everything else left).

**Panel rhythm.**

> **Amended (phase 3): the rail is horizontal after all.** This was first built as a vertical port. It is now the reference's own axis — a flex track of full-height panels moving sideways — with the panel WIDTHS taken straight from the autopsy's measured ratios: bookend 1.00, short 0.67, base 0.93, tall 1.16, long 2.20 viewport-widths. Only the bookends are exactly 1.00.
>
> **Mechanism differs from the reference deliberately.** The reference hijacks the wheel, which §14 flagged as a weakness — no scrollbar, no keyboard paging, no position feedback across an 11-viewport document. Here a tall spacer drives ordinary vertical scrolling and a sticky viewport translates the track sideways in proportion, sized so one pixel of wheel is one pixel of travel. Same filmstrip on screen; scrollbar, keyboard, trackpad and reduced-motion all stay native. Measured: track 8.79 viewport-widths, spacer height exactly `distance + viewport height`.
>
> **Below 40rem the rail turns itself off** and the page reverts to vertical flow — which is exactly what the reference does below its own breakpoint. That is also the no-JS state, so the layout is progressive enhancement rather than JS-dependent.
>
> The vertical `--panel-*` height tokens remain and govern that fallback.

The original vertical port, retained for the mobile fallback:

| Token | Height | Role | Source |
|---|---|---|---|
| `--panel-bookend` | `100dvh` | opening + closing panels **only** | `ref` — its two exact-1.00 bookends |
| `--panel-short` | `75dvh` | 0.75 | `ref→system` (ref 0.67, 0.86) |
| `--panel-base` | `90dvh` | 0.90 | `ref→system` (ref 0.93) |
| `--panel-tall` | `110dvh` | 1.10 | `ref→system` (ref 1.09, 1.16) |
| `--panel-long` | `225dvh` | the long chapter panel | `ref→system` (ref 2.20) |
| `--panel-media-max` | `68dvh` | cap on media inside a split panel | **amended in phase 3** |

**The rule, stated so phase 3 cannot drift from it:** only the first and last panel are exactly one viewport. Every panel between is deliberately *not* one viewport. This is what produces the reference's sense of pacing, and it is the single most transferable structural decision in the autopsy.

> **Amendment (phase 3, 2026-09-22): `--panel-media-max`.** Panel heights are `min-block-size`, so content can exceed them. An uncapped 3:4 portrait in a half-width column drove the 0.90 `base` panel to **1.36** at a 1536×826 viewport — the authored rhythm stopped being what rendered. Media inside a split panel is now capped at `68dvh` via the `max-h-panel-media` utility, so the panel governs the page rather than the asset. Measured after the fix: **0.99**.
>
> **Known drift:** that `base` panel still renders **0.99** rather than 0.90, because its prose column is now the tallest element. It sits within one percent of a bookend, which slightly weakens the “only bookends are 1.00” rule at this viewport. Shortening copy to fit a token would be backwards, so this is recorded rather than quietly “fixed” — revisit if a third panel lands near 1.00.

## 2. Spacing scale

| Token | px | rem | Used for | Source |
|---|---|---|---|---|
| `--spacing-2xs` | 4 | 0.25 | icon gaps | `divergence` |
| `--spacing-xs` | 8 | 0.5 | tight grouping | `divergence` |
| `--spacing-sm` | 16 | 1 | eyebrow → heading | `divergence` |
| `--spacing-md` | 24 | 1.5 | heading → body | `divergence` |
| `--spacing-lg` | 32 | 2 | body → action | `divergence` |
| `--spacing-xl` | 48 | 3 | block separation | `divergence` |
| `--spacing-2xl` | 64 | 4 | mobile section padding | `divergence` |
| `--spacing-3xl` | 96 | 6 | large block separation | `divergence` |
| `--spacing-4xl` | 128 | 8 | desktop section padding | `divergence` |

- Scale rule: **hybrid** — linear at the bottom (4/8/16/24/32), doubling at the top (48/64/96/128).
- `--spacing` (0.25rem) is the Tailwind v4 multiplier base, so `p-4` resolves to 1rem once Tailwind is installed. It is the anchor for the named steps above, not a step itself.
- Section padding: desktop `--spacing-section` 128px · mobile `--spacing-section-sm` 64px — **ratio 2:1**.
- Standard heading cluster gaps: eyebrow `--spacing-cluster-eyebrow` 16 / heading `--spacing-cluster-heading` 24 / body `--spacing-cluster-body` 32.

> The whole of this section is a divergence. The reference measured `padding: 0` on all four sides of all eleven sections and composed by absolute positioning from a design file — flagged in autopsy §14 as *"reproduces a design file exactly and resists every future content change."* We do not inherit it.

## 3. Typography

**Families**

| Role | Token | Family + stack | Source |
|---|---|---|---|
| display / heading | `--font-display` | **Instrument Serif**, ui-serif, Georgia, serif | `divergence` (signature) |
| body / UI | `--font-sans` | **Geist**, ui-sans-serif, system-ui, sans-serif | `divergence` (signature) |
| mono | — | not in the system | `ref` (none present) |

The reference pairs **Adobe Caslon Pro with Helvetica**, flagged in autopsy §14 as a signature move. We keep the *relationship* — a high-contrast display serif against a deliberately plain grotesque, so all the character sits in the serif — with different faces.

> **Revised (phase 3):** Newsreader / Archivo → **Instrument Serif / Geist**. Instrument Serif ships a **single weight**, so it matches this system's weight-400-only rule structurally rather than merely complying with it, and its higher stroke contrast holds at the 176px chapter marker where Newsreader read flat. Geist is a genuinely plain grotesque that recedes — Archivo carried more character than the body role wants. Measured after the swap: h1 42.7px, h2 34.1px, chapter 187.7px, all weight 400; labels Geist 14px at +0.1em.

**Scale — ratio 1.25 between heading steps, with a deliberate 2.0× hole**

| Token | px / rem | Line-height | Tracking | Weight | Used for | Source |
|---|---|---|---|---|---|---|
| `--text-label` | 14 / 0.875rem | 1.0 | **+0.1em** | 400 | uppercase UI, buttons, eyebrows | `ref→system` (ref 13) |
| `--text-body` | 16 / 1rem | 1.6 | 0 | 400 | all body copy | `ref→system` (ref 15) |
| `--text-body-lg` | 18 / 1.125rem | 1.6 | 0 | 400 | lead paragraphs | `divergence` |
| — | *(20, 24 deliberately absent)* | | | | **the hole** | `ref` |
| `--text-heading` | `clamp(28, 32@1440, 36)` | 1.28 | −0.01em | 400 | section headings | `ref→system` (ref 32) |
| `--text-display` | `clamp(32, 40@1440, 48)` | 1.15 | −0.01em | 400 | panel titles | `ref→system` (ref 40) |
| `--text-chapter` | `clamp(80, 176@1440, 208)` | 1.0 | −0.02em | 400 | chapter markers | `ref` (its 176px era numeral) |

- **Weights in the system: 400. Only 400** — `--font-weight-regular`. Taken directly: the reference uses a single weight across both families and carries all hierarchy on size, family, case and colour. Do not introduce 500+.
- Each step's line-height and tracking ship as paired sub-tokens (`--text-display--line-height`, `--text-display--letter-spacing`, and so on for every step), so the pairing cannot drift apart in use.
- **Hero heading ÷ body = 40 ÷ 16 = 2.5×** (`ref→system`; the reference measures 2.67×). Restrained on purpose — the autopsy's finding was that the premium read comes from photography and pacing, *not* type drama. **Do not vary this per section.**
- Prose measure: **~66ch** (`fix`).
- Case rules: sentence case for all headings; **uppercase is reserved exclusively for `--text-label`** (`ref`).
- Link style in prose: `::before` underline, animated on hover (see §6).
- **Fluid sizing:** headings use `clamp(min, calc(N / 1440 * 100vw), max)` — the reference's `--vw` design-constant trick, which rescales a whole design from one number. **The clamp is ours** (`fix`): the reference ships this calc with no floor or ceiling, so it ignores user zoom entirely. Body is fixed at 1rem and never fluid.

## 4. Colour

One warm neutral ramp. Day and night are the **same roles with different values** — not two palettes.

| Role | Token | Day | Night | Contrast (worst surface) | Source |
|---|---|---|---|---|---|
| canvas | `--color-canvas` | `#F2EDE0` | `#0E1A1C` | — | `ref→system` (ref `#F1ECDE`) |
| surface | `--color-surface` | `#FFFCF4` | `#16262A` | — | `ref→system` (ref `#FFFBF2`) |
| surface sunk | `--color-surface-sunk` | `#E8E2D4` | `#0A1416` | — | `ref→system` (ref `#E8E1D3`) |
| ink | `--color-ink` | `#524D44` | `#E4E9E7` | **6.49** / **12.72** | `ref→system` (ref `#544F45`) |
| ink soft | `--color-ink-soft` | `#665F53` | `#A8B5B4` | **4.89** / **7.39** | `fix` — ref has no muted token |
| on media | `--color-on-media` | `#FBF6EC` | `#F2F5F4` | **19.50** / **19.14** | `ref` |
| hairline | `--color-hairline` | `#D6CEBC` | `#2A3E42` | decorative — see note | `ref→system` |
| hairline strong | `--color-hairline-strong` | `#8F8168` | `#547174` | **3.26** / **3.37** | `fix` |
| accent | `--color-accent` | `#1C6E68` | `#5FD4C4` | **4.67** / **8.70** | `divergence` (the changed axis) |
| accent hover | `--color-accent-hover` | `#17605A` | `#7FE0D2` | **6.29** / **11.41** | `divergence` |
| accent fg | `--color-accent-fg` | `#FFFCF4` | `#0E1A1C` | **5.89** / **9.89** | `divergence` |
| placeholder | `--color-placeholder` | `#E8E2D4` | `#0A1416` | — | `divergence` (see §8) |
| placeholder ink | `--color-placeholder-ink` | `#665F53` | `#A8B5B4` | **4.89** / **8.83** | `divergence` |
| success / warning / error | — | — | — | — | `ref` — none present; add only when a form needs them |

- Hue count: **two** — one warm neutral ramp (hue ~40°) and one teal accent (hue ~176°). Neutral temperature: **warm** (`ref` — the autopsy found this doing more work for the "sun-bleached" feel than any other single decision).
- Accent is reserved for: **booking actions, focus rings, and prose link underlines only.** Target ~**0.5% of page area** (`ref` — measured at ~0.4%).
- Dark mode: **yes — `[data-theme="night"]`, a role override, same ramp cooled.** The reference has none (single mode only).
- **All 18 text pairs across both modes were computed** with the WCAG formula, not eyeballed — full audit in the *Token audit* section. Minimum in the system is **4.67:1**. Nothing here is inherited from a failing reference measurement.
- **Hairline note:** `--color-hairline` is **decorative only** (ornamental rules beside headings, as on the reference) and is not required to meet 3:1. Any hairline that is the sole boundary of an interactive control must use `--color-hairline-strong`, which is verified at 3.26:1 / 3.37:1.

**The wash — the day/night device.** `--wash` is a full-panel colour layer over media: `rgb(147 131 108 / 0.28)` by day, `rgb(20 48 58 / 0.42)` at night, transitioning on `--duration-reveal` / `--ease-settle`. This is taken directly from the reference, which ships exactly this layer (`.overlay-solid`, `#93836C`) and never animates it (`ref` + `divergence`). Interpolating the wash — rather than swapping palettes — is what makes "day above, night below" one site instead of two.

## 5. Shape and depth

| Token | Value | Applied to | Source |
|---|---|---|---|
| `--radius-none` | `0px` | **everything** | `ref` |
| `--border-hairline` | `1px` | rules, dividers, control boundaries | `ref` (authored 1px; computed 0.84–1.0 at dpr 1.25) |

- **Separation strategy: hairline-flat.** Zero radii, zero shadows, 1px rules. Taken directly — on the reference this is a major part of why the page reads architectural rather than app-like.
- Shadows: resting `none` · hover `none` · overlay `none`. There is no shadow token in this system, deliberately.
- **Focus ring: `2px solid var(--color-accent)`, `outline-offset: 2px`** (`fix`). The reference sets `outline-style: none` on every focusable element — confirmed properly in autopsy §13 with `hasFocus: true` and `:focus` matching. Verified at 5.16:1 (day) and 9.89:1 (night) against canvas, both above the 3:1 required for non-text.

## 6. Motion

| Token | Value | Used for | Source |
|---|---|---|---|
| `--duration-micro` | `120ms` | hover, background, opacity | `ref→system` (ref 100–150ms) |
| `--duration-base` | `300ms` | state changes, filter | `ref` |
| `--duration-reveal` | `800ms` | scroll reveals, wash transition | `ref` |
| `--ease-settle` | `cubic-bezier(0.24, 0.43, 0.15, 0.97)` | all reveals | `ref` — its exact curve |
| `--ease-standard` | `ease` | micro-interactions | `ref` |
| `--duration-page` | `420ms` | route changes | **added phase 3** |

- Intensity: **`pronounced`** (`ref`).
- **The gap between the two tiers is the point.** 120ms for anything the pointer causes; 800ms for anything the scroll causes. Do not use an intermediate duration for either.
- Hover deltas: **no colour change anywhere** (`ref`). Links use the two-origin underline wipe — `::before` scales `scaleX(1)` from `left center` on hover and `scaleX(0)` to `right center` on exit, so the line travels one direction rather than retracing (`ref`). Buttons use the same idea on Y.
- Scroll reveal: opacity + translate on `--ease-settle` at `--duration-reveal`, staggered by **`--duration-stagger` 90ms** (**chosen in phase 3** — the reference applies its stagger from JS and the autopsy recorded it as `not measurable`, so this value is ours, not inherited). Previously **not specified** — the reference applies it from JS and the autopsy recorded it as `not measurable`. Pick one value in phase 3 and token it then.
- Parallax: **two rates maximum**, not the reference's four (`divergence`, per autopsy §14). Elements opt in with `[data-parallax]`.
**Route transitions (added phase 3).** Chapters cross-fade with a **shared gate morph**: the full-bleed bookend media of one chapter carries the same `view-transition-name` as the hero media of the next, so the browser pairs them and morphs instead of cutting. Names are assigned asymmetrically (a page's hero and its closing bookend never share a name), so each document holds two unique names and both directions pair. The fixed booking bar is named and frozen so it does not travel with the page.

> **Implementation note — this is the NATIVE cross-document API, not React's `<ViewTransition>`.** Verified that Next 15.5.25 ships a compiled React exporting neither `ViewTransition` nor `addTransitionType` (0 occurrences in both its stable and `react-experimental` channels), so the React API is unavailable without a major version bump — the `experimental.viewTransition` flag is accepted but does nothing. `@view-transition { navigation: auto }` needs no framework support and suits a two-page static site better than client routing. **Consequence:** the chapter links are plain `<a>` elements, not `next/link`, because a real document navigation is what triggers the transition. Revisit on Next 16, where `transitionTypes` on `<Link>` would allow directional (forward/back) variants.

- **`prefers-reduced-motion`: honoured** (`fix`) — all transitions collapse to 0.01ms and `[data-parallax]` transforms are removed. The reference ships no such query at all, which autopsy §13 flagged as its most serious failure.

## 7. Page architecture

The reference's homepage **is** a long-form essay: eleven panels, no feature grid, no testimonials, no pricing, no footer element, and **zero inline CTAs**. We take that wholesale — it is the single most appropriate decision in the autopsy for a 12-villa property.

Standard panel order:

1. **Bookend in** — `--panel-bookend`, full-bleed media, title low in frame
2. **Chapter marker** — `--text-chapter`, `--panel-short`
3. **Narrative panels** — alternating `--panel-base` / `--panel-tall`, prose in `--container-measure`
4. **Long chapter** — `--panel-long`, the multi-beat panel
5. *(repeat 3–4 as the story needs)*
6. **Bookend out** — `--panel-bookend`, hand-off to the next chapter

- Section background alternation: **none** (`ref` — panels are either media or canvas; there is no A/B rhythm).
- **CTA repetition rule: zero inline CTAs, ever.** Booking is one fixed, peripheral affordance whose label never changes (`ref`).
- Max panels before a CTA: **not applicable** — the rule above replaces it.
- **Hero anatomy** (`ref`): full-bleed media → `--scrim-media` → title centred horizontally at **80% of viewport height** (`--hero-title-top`, applied by the `hero-title` utility; the reference measures 80.6%). No eyebrow, no subhead, no CTA, no trust line.

## 8. Components

**Media** — one component, two states, identical box.

> **Amendment (phase 3, 2026-09-22):** photography now exists, so the standing "placeholders only" rule below is **superseded**. `Placeholder` was renamed to `Media` and takes an optional `src`: given one it renders the photograph via `next/image`; without one it falls back to the labelled placeholder field. Both states occupy the **same box**, which is what keeps the original promise — a slot with no asset yet still reserves the right space, and swapping one in never moves layout. Eight plates were generated with Higgsfield **Nano Banana Pro** (Google) at 2k, `3:4` for portraits and `16:9` for full-bleed panels, from prompts written against this document's palette. They are **generated plates, not a photoshoot** — for a real client build they are direction references to hand a photographer, not final assets.
>
> **Format amended (phase 3): JPEG q95, and `next/image` optimisation disabled.** The first pass shipped WebP at q82 and left `next/image` on its defaults — which re-encodes every image to WebP at **quality 75 regardless of source format**. That is two lossy passes over the same photograph, and it visibly flattened the hazy gradients these plates are mostly made of. Now: sources are **JPEG q95 with 4:4:4 chroma** (no chroma subsampling, so no colour degradation) via mozjpeg, and `images.unoptimized: true` serves them byte-for-byte. Verified in the browser: no `.webp` and no `_next/image` URL anywhere.
>
> **Cost, accepted deliberately:** no automatic resizing or srcset, so the full file is sent at every viewport. The three full-bleed plates are 4k (5504×3072); the five portraits are 2k, which is already ~4× oversampled for their ~420px rendered width. Total 15.8 MB, down from 104.9 MB as PNG.
>
> **Prompt direction revised.** The first set asked for "flat overcast, diffuse, muted, soft contrast, no HDR" on nearly every frame and came out empty. Every prompt now specifies an explicit **foreground / middle / background**, with a dark tactile object near the lens (carved post, boat hull, rope-wrapped piling, rock shelf, bed post) framing a lit distance, plus **raking directional light** and **deep shadows that retain detail**. That layering is what the reference's photography does and what the first set entirely lacked.

> Rules that now apply because real `<img>` elements exist: every slot with a `src` carries a real `alt` (a description, not the label); `sizes` matches the slot's true rendered width so the browser does not over-download; `priority` is set on the hero only, everything else lazy-loads by default.
>
> **Coupling to watch:** the `sizes` strings hard-code `768px`, which must stay equal to Tailwind's `md` breakpoint. If that breakpoint moves, `sizes` silently diverges and the browser picks the wrong srcset entry. There is no way to reference the token from an HTML attribute, so this one genuinely has two homes — change both together.

**Placeholder fallback** — *retained for any slot without an asset.*

Every image slot renders a placeholder, not a stock photo or an AI image. Anatomy: a `--color-placeholder` block at the slot's aspect ratio, `--radius-none`, a `--border-hairline` in `--color-hairline`, and a centred `--text-label` in `--color-placeholder-ink` naming the intended shot (e.g. `VILLA · DUSK · 3:4`). Aspect tokens: `--aspect-hero` 2.52 (`ref` — its 3100×1231 source), `--aspect-panel` 16/9, `--aspect-portrait` 3/4, `--aspect-square` 1.

The scrim and wash layers still render over placeholders, so the day/night transition is testable before any asset arrives. Swapping in real media must not change layout — the placeholder holds the exact final box.

**Button** — variants: primary, ghost. One size.

| Variant | Height | Padding | Text | Radius | Bg / fg | Hover | Disabled |
|---|---|---|---|---|---|---|---|
| primary | 48px | `--spacing-sm` / `--spacing-md` | `--text-label` | `--radius-none` | `--color-surface` / `--color-accent` | `scaleY` wipe, no colour change | `--color-ink-soft`, no wipe |
| ghost | 48px | `--spacing-sm` / `--spacing-md` | `--text-label` | `--radius-none` | transparent / `--color-ink` | underline wipe | as above |

Height 48px is `ref→system` (reference measures ~46px at 1440) and clears the 44px touch minimum the reference fails. **Note the inversion, taken from the reference:** the pale surface carries the saturated text, rather than a solid accent fill.

**Nav** — a persistent, peripheral affordance, **not** a top bar. Behaviour on scroll: shrinks (`ref`). Mobile: same pattern. All items ≥44px (`fix` — reference measures 39px and 23px).

> **Divergence (signature):** the reference's fixed left vertical rail with a rotated WHATSAPP tab is its identity. We keep the *principle* — a booking affordance that never enters the content column — with a different position and orientation. Decide it in phase 3; do not reproduce a left rail.

**Chapter marker** — `--text-chapter` in `--font-display`, weight 400, on `--color-canvas`. The reference's 176px era numeral, at the same ~4.4× jump above `--text-display`. **Content must not be a date in a serif** (`divergence`, signature) — use a depth, a tide, or a time of day.

**Index entry** — *added phase 3 for `/villas`.*

Twelve villas need a listing, and the system deliberately has no card (the reference's captured page had none, §10). Rather than invent one, this reuses the **three-beat tide pattern already on the homepage**: `Media` (portrait) → `--text-label` identifier → name → one line of body. Same anatomy, different content.

Anatomy and rules:
- No border, no shadow, no radius, no background — the entry is media plus type, nothing else. Consistent with the hairline-flat strategy in §5.
- Entries are **not links** — per-villa detail pages are not built, and the navigation model below forbids linking to a route that does not exist. When detail pages are built, the whole entry becomes the link and the villa name takes `link-wipe`.
- `link-wipe` gets its first real use on the **closing bookend hand-off**, which is a link.
- Grid: 3 columns at `md`, 2 at `sm`, 1 below — gaps from `--spacing-3xl` / `--spacing-xl`, no new token.
- Media uses the placeholder fallback until villa photography exists. That is the `Media` dual state working as designed, not a gap.

**No new tokens were required to build this page.** That is the intended signal: a second page that needs none means the system generalised rather than fitting only the page it was authored against.

**Navigation model** — *added phase 3.*

There is no nav bar, matching the reference (§9: its nav is behind a hamburger on a fixed rail). Pages hand off **chapter to chapter** through the closing bookend panel, which is a link carrying `link-wipe` and the gate morph.

The chain runs **story → villas → gallery → story**. `/dining` and `/cultures` are named in the reference's nav but are **not built** — nothing links to them, so there are no dead ends. Verified: every internal `href` resolves to a real route.

**Radial carousel** — *supplied by the user, added phase 3 on `/gallery`.*

A ring of thumbnails that morphs into a centre card via shared `layoutId`, rotated by a pan gesture on a spring-smoothed motion value. **The motion was kept exactly as supplied.** What changed is the surface treatment, because as written it carried `rounded-[42px]`, `shadow-2xl`, `ring-1`, `bg-white` and `dark:` variants — none of which exist in this system, so it would have read as a bolted-on widget:

| As supplied | Here |
|---|---|
| `rounded-[42px]` / `[32px]` / `[18px]` | `--radius-none` — the universal rule |
| `shadow-2xl`, `ring-1 ring-black/5` | `--border-hairline` in `--color-hairline-strong`, no shadow |
| `bg-white`, `border-neutral-200`, `dark:*` | `--color-surface`, single mode |
| `h-[350px]` / `sm:h-[450px]` | `--carousel-stage` / `--carousel-stage-lg` |

Two additions beyond restyling, matching standards held elsewhere here: **`prefers-reduced-motion` is honoured** (the ring places itself without spring or stagger, the gesture still works), and **thumbnails are real `<button>`s with labels** rather than divs with click handlers, so the gallery is keyboard-reachable.

**Gallery imagery.** Ten square plates, generated to the same direction as the rest (explicit foreground / middle / background, raking light, deep shadow that retains detail). Delivered as 2048px PNGs at ~7.5 MB each — **5x oversampled** for a 400px centre and 110px thumbnails — so they are resized to **800px** (2x the centre display) and encoded as **JPEG q95, 4:4:4**: 72 MB → 2.08 MB. The carousel uses a plain `<img>`, not `next/image`, so build-time resizing is the only lever.

**Cost to note:** `/gallery` is **158 kB first load against 110 kB** for the other routes. Motion is ~48 kB and loads only on that page.

**Panel content must fit its panel** — *layout audit, phase 3.*

A rail panel is a fixed 100dvh box with `overflow: hidden`, so anything taller than its content box is silently cut. A full audit across all three routes found **34 clipped elements**, every one of them from content authored for vertical scroll and then dropped into a fixed-height panel:

| Fault | Where | Cause |
|---|---|---|
| Heading cut off the top, captions cut off the bottom | long tide panel | ~950px of content in a 514px box |
| Captions collapsing to nothing | beat grid | `minmax(0, …)` let the caption column shrink to zero width |
| 29 elements overflowing by up to 1197px | villa index | a 3-column grid wrapping to four rows |
| Eyebrow cut off the top | gallery carousel panel | heading plus a 28rem stage |

Rules that follow:

- **Never `minmax(0, …)` for a text column.** A zero minimum lets it collapse entirely, which drops the caption without any error — an image simply appears to have none. Use a real minimum (`minmax(18rem, …)`).
- **Content-heavy panels take the gutter, not the section padding.** `--spacing-lg` instead of `--spacing-section` on `.panel-long`, `.panel-villas`, `.panel-carousel`.
- **Media inside a multi-item row gets its own cap**, tighter than `--panel-media-max`: `--beat-media-max` 40dvh, `--villa-media-max` 31dvh.
- **A row of many items runs ACROSS the rail, never wraps.** The villa index is one row of twelve `--villa-column` entries and its panel is `inline-size: max-content`, so the panel sizes to the content instead of forcing content into a fixed ratio. Columns have a definite width, so text still wraps normally inside them.

Verified clean afterwards: **16 panels, 70 text elements, 0 clipped, 0 collapsed** across `/`, `/villas` and `/gallery`, plus the 390px vertical fallback with no horizontal overflow.

**Not in this system** — the reference's captured page contains **no card, no feature grid, no testimonial, no pricing card, no stat block, no accordion, no tabs and no footer**. None are specified here. Add one only when content demands it, and spec it from tokens at that point.

**Input** — present on the reference only inside an unopened booking popup; **not measured**. Spec in phase 3 from these tokens: height 48px, `--radius-none`, `--border-hairline` in `--color-hairline-strong`, focus per §5, real `<label>` above the field (never placeholder-as-label).

## 9. Responsive rules

| Breakpoint | Container | Panels | Section padding | Display heading |
|---|---|---|---|---|
| mobile (<640) | fluid, `--spacing-gutter-sm` 20px | vertical stack | `--spacing-section-sm` 64px | 32px (clamp floor) |
| tablet (640–1024) | fluid, 2rem gutter | vertical stack | 96px | fluid |
| desktop (>1024) | `--container-page` 90rem, `--spacing-gutter` 64px | vertical stack | `--spacing-section` 128px | 40px @1440, 48px cap |

- **The axis never changes.** Talay Dao is vertical at every width. The reference switches its track from `display: flex` to `display: block` between desktop and mobile — we have no such switch to make, which removes its single largest responsive risk.
- Type: **fluid with clamp floors** (`fix`), not stepped. Body fixed at 1rem.
- Panel heights at mobile: `dvh` units already adapt. Below `40rem`, `--panel-long` drops to `175dvh` **and `--panel-media-max` drops to `38dvh`** (**amended in phase 3**). The media cap is the lever that actually works: the long panel is *content-driven* at mobile, not minimum-driven — `min-block-size` cannot shrink content, and three 68dvh portraits stacked are 2.04 viewports on their own. Measured at 390px: the long panel went **2.77 → 2.32** and the page **9.59 → 8.98** screens.
- Reordering: media above prose on mobile.
- Nothing hides on mobile.
- **Touch targets ≥44px** — all of them (`fix`; the reference fails at 39px and 23px).

## 10. Originality boundary

**Taken from the reference (structure and craft — fine):**
- Single font weight 400; radius 0; no shadows; 1px hairlines
- Two-tier motion timing and the exact `cubic-bezier(0.24, 0.43, 0.15, 0.97)` reveal curve
- Type scale shape: tight UI cluster, deliberate hole, 1.25 between headings, 2.5× hero ratio
- Three-tier tracking; uppercase reserved to the 14px UI tier
- Bottom-weighted scrim; full-bleed media with contained prose
- Variable panel sizing with exact-1.00 bookends
- Zero inline CTAs; one fixed booking affordance
- The `calc(N / design-width * 100vw)` scaling idea (with our clamp added)
- The wash layer as a device

**Deliberately not taken (signature moves):**
- The 11-viewport **horizontal** filmstrip → we build the same variable-panel rhythm on a **vertical** axis
- **Adobe Caslon Pro + Helvetica** → Newsreader + Archivo, same relationship, different faces
- The **176px Caslon era-numeral** → a chapter marker at the same scale jump, different content type
- The **fixed left rail with rotated WHATSAPP tab** → a peripheral booking affordance, different position
- **Four-rate parallax** → two rates maximum, reduced-motion honoured
- **Warm analogous brick-red accent** → cool complementary water teal (the load-bearing axis change)

**Explicitly rejected weaknesses:** suppressed focus, absent `prefers-reduced-motion`, unclamped viewport type, `padding: 0` sections with no spacing scale, no design tokens, 30–48ch measure, sub-44px touch targets, 2× `h1`, missing `alt` attributes, raster PNG icons.

No copy, image, illustration, icon or logo in this project comes from the reference. **All media renders as a placeholder until real photography exists** (§8).

---

## Token audit

Every value in this document exists in `styles/tokens.css`. Verified: 2026-09-22.

**Contrast — all 18 text pairs, computed with the WCAG formula, not eyeballed:**

| | on canvas | on surface | on sunk |
|---|---|---|---|
| **Day** ink | 7.18 | 8.18 | 6.49 |
| **Day** ink-soft | 5.40 | 6.16 | **4.89** |
| **Day** accent | 5.16 | 5.89 | **4.67** |
| **Night** ink | 14.46 | 12.72 | 15.21 |
| **Night** ink-soft | 8.40 | 7.39 | 8.83 |
| **Night** accent | 9.89 | 8.70 | 10.41 |

System minimum **4.67:1** — above the 4.5:1 AA threshold for normal text at every pairing. Non-text: `--color-hairline-strong` 3.26 (day) / 3.37 (night); focus ring 5.16 / 9.89. Both above 3:1.

**Resolved in phase 3:**
- ~~Scroll-reveal stagger~~ → `--duration-stagger: 90ms`. Ours, not the reference's, which was `not measurable`.
- ~~Booking affordance position~~ → **bottom-anchored, horizontal**, full-width pair on mobile and right-aligned on desktop. Deliberately not the reference's left vertical rail. Buttons 48px tall, clearing the 44px minimum the reference fails.
- Tokens added while building: `--panel-media-max` (68dvh), `--hero-title-top` (80%), `--duration-stagger` (90ms).
- Utilities added, because these namespaces do not generate Tailwind utilities on their own: `transition-micro`, `transition-reveal`, `link-wipe`, `hero-title`, `h-panel-*`, `max-h-panel-media`.

**Audit fixes applied (phase 3, after the web-design-guidelines + react-best-practices pass):**
- New token: `--booking-bar-height` (3rem) — one home for the button height and for html's `scroll-padding-block-end`, so the fixed bar can never hide a focused element.
- New utilities: `skip-link` (off-screen until focused, **deliberately not transitioned** — the keyboard escape hatch must not depend on the animation clock), `pb-safe` (composes `--spacing-gutter-sm` with `env(safe-area-inset-bottom)`), `h-booking-bar`, `transition-wash`.
- `transition-reveal` narrowed to `opacity, transform` only. The day/night wash keeps `background-color` in its own `transition-wash` — the one deliberate exception to "animate transform/opacity only", because the wash *is* a background-color animation.
- `text-wrap: balance` on all headings and `text-wrap: pretty` on `p`, set once in base rather than per-instance.
- `<noscript>` override forces `[data-parallax]` visible. Without it the entire essay shipped at `opacity-0` and was invisible with JS disabled (verified: 12 `opacity-0`, 0 `opacity-100` in the SSR HTML).
- Skip link added — §10 listed "no skip link" as a rejected weakness of the reference and the first build inherited it anyway.
- `meta[name=theme-color]` added, and `DayNight.tsx` rewrites it on theme flip so browser chrome tracks the page.
- `DayNight.tsx` no longer reads `document.body.scrollHeight` inside the scroll handler (forced layout every scroll event); cached and recomputed on resize.
- Booking links were `#reserve` / `#enquire`, matching no element on the page. Now `mailto:` actions that work today; addresses are placeholders, like the imagery.
- `touch-action: manipulation` on the booking buttons; static tide-beat array hoisted to module scope.

**Still open:**
- Input spec — the reference's was behind an unopened popup, so it was never measured. Build from tokens when a real form exists.
- `success` / `warning` / `error` roles — add only when a real form needs them.
- ~~Mobile verification~~ → measured at 390×844: no horizontal overflow, splits stack to one column, touch targets 48px, clamp floors hold (chapter numeral renders 80px where the reference's unclamped formula would give ~11px). Panel rhythm at mobile 1.00 / 0.75 / 0.96 / 1.10 / 2.32 / 0.75 / 1.10 / 1.00, closely tracking desktop.
