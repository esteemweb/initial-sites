# DESIGN.md — PULP

The design system for pulp.store. Read this before writing any UI code.
This file is the source of truth. Where anything else conflicts with it, this wins.

---

## 1. Visual theme and atmosphere

**The brand in one line:** loud product, plain house.

PULP is a small-run clothing label. Tees, hoodies, trousers, caps — cut boxy and wide, printed in
fluorescent spot colours, made in runs of a few hundred and not made again. The clothes are the
loudest thing in the room. The site around them is deliberately not.

**The idea:** risograph. Riso is the print language of zines, gig posters and club flyers — flat
fluorescent inks, one colour per pass, overprinted to make a third. It is cheap, bright, slightly
misregistered, and it is what youth culture has printed on for forty years. Every colour decision on
this site comes from that press.

**Atmosphere:** bright, flat, graphic, a little rough. Closer to a gig poster stapled to a lamppost
than a fashion editorial. Confident enough to leave space.

**Density:** alternating. One loud full-bleed ink block, then a genuinely quiet white stretch. Loud,
quiet, loud, quiet — never uniformly busy, and never two inks fighting.

**Audience:** 16–26, buys on a phone, follows the drop rather than the season.

---

## 2. Colour palette and roles

Two neutrals and three spot inks. That is the entire palette.

| Token | Hex | Role |
|---|---|---|
| `paper` | `#F4F1E8` | The ground the whole site sits on. Warm, unbleached. |
| `page` | `#FFFFFF` | A sheet lying on that ground — panel, dialog, product shot. |
| `ink` | `#111111` | Body text, marks, borders. Near-black, never pure. |
| `rose` | `#B8566A` | Spot one. Clay pink — an undertone, not a fluorescent. |
| `ultra` | `#1B4DFF` | Spot two. Electric blue. |
| `volt` | `#D9FF00` | Spot three. Acid yellow. |

One utility value only:

| Token | Hex | Role |
|---|---|---|
| `rule` | `#E6E6E6` | Hairline borders, dividers, disabled surfaces. |

### Rules

- **Paper is the ground, not white.** `paper` is the table; `page` is stock lying on it. The
  distinction is load-bearing: catalogue photography is shot on seamless white (§10), so on a
  `paper` ground every product shot reads as a printed sheet rather than as a white box floating on
  a colour. Reversing this — a white ground with `paper` panels — breaks the photography.
- **Ink arrives in large committed blocks**, not scattered accents.
- **One ink per section.** A block is `rose` **or** `ultra` **or** `volt`, never two. This is the
  press rule and it is what keeps three bright colours from becoming noise.
- **Inks are never diluted.** No opacity variants, no tints, no lighter pinks.
- **No gradients anywhere.**
- **`volt` takes `ink` text, never white.** Acid yellow against white is unreadable; it is the one
  ink that inverts.
- **`rose` and `ultra` take `page` text.**
- **Never invent a fourth ink.** Use scale, weight or white space instead.
- **Blocks are full-bleed.** An ink section runs edge to edge. No coloured cards floating on white.

### The plotted sheet

**No ground on this site is a flat fill.** The whole site is drawn on ruled graph paper with marks
plotted on it — grid, connected nodes, loose geometry. It is the surface a garment is actually cut
and a print is actually registered on, so the pattern comes from the trade rather than from
decoration invented to fill space.

| Utility | What it is |
|---|---|
| `plotted-sheet` | The ground: a 720px plot tile over the ruling. Body and full-bleed sections. |
| `grid-paper` | Ruling only, no marks. For a block that wants structure but no drawing. |
| `wash-rose` / `wash-ultra` / `wash-volt` | Re-rules the sheet in that ink and lays a weak tint. |

Rules:

- **Ruling is 96px major, 16px minor**, drawn in `--grid-ink`, which defaults to `ultra`. Blue ruling
  on warm paper is what graph paper has always been, and it is why the ground can carry this much
  drawing without becoming tiring.
- **The plot tile repeats at 720px.** At 360 the repeat reads as wallpaper, because the eye catches
  a motif recurring twice inside one screen width. Two plotted paths at different heights, shapes
  placed off any shared axis, and roughly a third of the density fixes it.
- **A wash re-rules, it does not cover.** A loud section shifts the ink of the ruling and takes a
  4–12% tint, so it still reads as the same sheet of paper rather than a coloured panel dropped on
  top. Washes above about 15% start to fight the type.
- **One ground per element.** `plotted-sheet` and `grid-paper` both set `background-image`, so
  applying both leaves the result to stylesheet order rather than to class order — the trap that once
  made disabled buttons render enabled. Pick one.
- **Washes set only custom properties and a background colour**, so they compose with either ground
  in any order.
- **The quiet zone stays quiet.** Checkout, size guide and small print take the base ground and no
  wash (§11).

### Overprint

Where two inks genuinely must meet — a mark laid over a block — the top one is `ink`. Riso overprint
darkens; it never lightens. There is no blend mode in this system, only flat shapes.

### Garment colours are not palette

Product colourways are **content**. Fluoro, Volt, Ultra, Tangerine, Violet, Lime, Chalk and Jet carry
their own hex values from `data/products.ts`. Volt and Ultra share a name with an interface ink and
that is deliberate — the clothes are printed with the same press. Fluoro does not: the garment is a
true fluorescent because the photographs are, while the interface ink stepped down to `rose` so the
chrome stops competing with the clothes. The five-colour rule governs the interface only. Swatches
render the true garment colour.

---

## 3. Typography

Three faces. Subset and preload from the first commit.

| Face | Use |
|---|---|
| **Bricolage Grotesque** | Display, headlines, buttons. Weight 800. All caps. |
| **Inter** | Body, product detail, checkout, text links. Sentence case. |
| **Space Mono** | Field labels, spec print, order numbers, spec values. Uppercase. |

### Type scale

Seven roles. No sizes exist outside this table.

| Token | ≥1024px | <1024px | Face |
|---|---|---|---|
| `display` \* | 200px | 64px | Bricolage Grotesque |
| `xl` | 96px | 48px | Bricolage Grotesque |
| `lg` | 48px | 32px | Bricolage Grotesque |
| `md` | 24px | 20px | Inter |
| `base` | 16px | 16px | Inter |
| `button` | 16px | 16px | Bricolage Grotesque, uppercase |
| `label` | 13px | 13px | Space Mono, uppercase |

\* **`display` switches at 1174. Every other role switches at 1024.** No intermediate size, at either
threshold.

The odd number is load-bearing, not a rounding error. `display` is capped at seven characters per
word (see Guardrails), and seven characters of a heavy grotesque at 200px measure around 1050px —
wider than a 1024px viewport can hold at any gutter. 1174 is the narrowest viewport where 200px type
clears the 64px gutters on both sides.

### Tracking

`-0.02em` applies at 48px and above only. At `button` size tracking is `0`. Tight negative tracking on
a heavy grotesque at body size hurts legibility.

### Guardrails

- Body text never below 16px.
- Line length capped at 70 characters.
- **`display` only:** never more than six words, and no word longer than seven characters. The size is
  fixed and cannot reflow, so this is a copywriting constraint, not a styling one.
- Product straplines are `lg`, not `display`, and are exempt from the seven-character rule.
- The signature line (§11) is a fixed brand asset, not a heading, and is exempt from the six-word cap.

### A note on two conventions

All-caps labels and a monospace face for small data are ordinarily generic defaults. They are correct
here because a print spec sheet *is* set in caps with technical small print. Do not substitute
alternatives, and do not extend these treatments beyond the roles above.

---

## 4. Components

Square corners throughout. `border-radius: 0` everywhere, no exceptions.

### Buttons

Two types use the `button` type role: Bricolage Grotesque 800, 16px, uppercase, tracking 0. Padding
24px vertical, 40px horizontal.

**Primary** — `rose` fill, `page` text.
**Secondary** — transparent fill, 2px `ink` border, `ink` text.

| State | Behaviour |
|---|---|
| Hover | Primary inverts to `ink` fill; Secondary fills `ink` with `page` text |
| Active | Shifts down 1px |
| Focus | 2px `ultra` outline, 2px offset, always visible |
| Disabled | `rule` fill, `ink` at 60% |
| Loading | Rotating registration mark replaces the label; reduced-motion shows a static mark plus the word "Loading" |

Disabled styles **replace** the variant classes rather than being appended after them. Two utilities
setting the same property are resolved by stylesheet order, not class order, so appending leaves a
disabled button rendering at full `rose`.

### Text link

**Not a button.** Inter, sentence case, `base`, no padding. 1px underline at 2px offset. Turns
`rose` on hover.

### Product card

Grid surfaces only — homepage, shop, related products. **The basket uses its own line item.**

1. Product image, **1:1**, on a `page` or flat-ink ground
2. Product name — Inter, `base`, sentence case, **underlined at rest**
3. Action bar — full-width, `ink` fill, split into a "Choose size" control and a
   divided price cell. Links through to the product page rather than quick-adding,
   because size and colour must both be chosen and stock is held per variant.

Three slots and nothing else. The card carries no padding, no border, no background
and no shadow — all of its weight is the image and that bar. Ported from
`refs/forsure/autopsy.md` §10.

**Fabric weight, colourway swatches and the spec mark row are not on the card.**
They were, and were removed to match the reference. The cost is that a colourway
cannot be previewed from the grid and weight and spec appear only on the product
page; the shop's colour and spec filters are unaffected, since they never read the
card. Restoring them is additive if the grid later needs to do more work.

**Badge** — conditional overlay on the image, top-left, flush to the corner: `rose` fill, `page`
text, Space Mono `label`. Fires on "Last few left" and sold-out states. An overlay is not a structural
variant.

The card has two targets, both links: the image and the action bar. **No hover-dependent behaviour,
no lift, no shadow, no scale.** Swatch-driven image changing lives on the product page gallery, which
is where a colour is actually chosen.

### Basket line item

Its own component. Image, name, chosen size and colour as text, quantity stepper, line price, remove.
**No swatches, no spec marks** — swatches earn their place where the customer is still choosing; in
the basket they have already chosen.

### Form fields

Square. 2px `ink` border. 16px padding. Inter at `base`. Labels above the field in Space Mono `label`,
uppercase — **everywhere on the site, checkout included**.

| State | Behaviour |
|---|---|
| Focus | Border `ultra`, visible outline offset |
| Error | Border stays `ink`, message below in Inter `base` stating what is wrong and how to fix it |
| Disabled | `rule` border, `ink` at 60% |

### Size selector

Sold-out sizes render disabled, not hidden. Products with a single size `ONE` render a static "One
size" label in the control's slot rather than hiding the control. Structure holds, control disappears.

### Review display

Review count always shows. The fit-distribution bar renders only at **5 or more reviews**; below that,
list the verdicts as text.

### Icons

The spec mark set is the icon library — 11 spec marks plus 3 UI icons (cart, close, chevron). **There
is no search anywhere on this site**, and no account icon, because there are no accounts.

Marks are drawn in the print register: registration targets, crop marks, halftone, flat geometry on a
48-unit grid with a 5-unit limb. Where a UI icon is needed that does not exist in the set, draw it to
match: same limb weight, same square proportion, flat `ink`.

**Spec marks never carry meaning alone.** Visible text where there is room, visually-hidden label
otherwise.

**Card mark order is fixed and deterministic:** fit → print → fabric. The card shows the first three by
that priority. Never slice by array position.

### Component inventory

Buttons, text link, product card, basket line item, size selector, colourway swatch, quantity stepper,
delivery-method radio group, checkout step indicator, free-delivery progress bar, review display,
accordion, form field, badge, navigation, footer, basket slide-over.

This list covers the brand-expressive components. Functional primitives that follow directly from the
spec may be built without asking, provided they use only the tokens, states and rules defined here.
Anything that introduces a new visual pattern needs a deliberate decision.

### Required states

Every component ships with default, hover, active, focus, disabled, loading, error and empty. Empty
and error states are designed, never left to browser defaults.

---

## 5. Layout

**Grid:** 12 columns, 1200px content box. The box edges are the outer column edges — no outer margin.
Gutters 50px at 1024 and above, 30px below. 8 columns at tablet, 4 at mobile.

**Spacing ramp:** every gap, padding and margin value is one of **8, 16, 24, 40, 48, 64, 80, 96, 160**.
Border widths, type sizes and icon dimensions are defined in their own sections and sit off this ramp.

**Section rhythm:** 96px between major sections at 1024+, 80px below. Deliberately tight — the reference this system is ported from runs *zero* section padding and takes all its vertical rhythm from inside components. Literal zero collapses prose sections, so this is the adjacent value.

**Alignment:** left by default. Centre is reserved for full-bleed ink blocks and the 404.

**Breaking the grid:** oversized spec marks, ink blocks and campaign imagery go full-bleed edge to
edge. Predictably, always full width. Never half-off.

**Hierarchy:** one dominant element per screen. Everything else steps down sharply.

**White space:** a loud site needs more empty space than a quiet one, not less.

**Wordmark:** the homepage hero's dominant element is the wordmark, set as **type** — Bricolage
Grotesque 800, all caps, very large. There is no drawn mark and no logo file to source.

---


**The mark is oblique.** The name in the display face, skewed 14° forward, anchored at the left end
of its baseline. That is the entire treatment — speed with no added shape — and it holds from the
13px footer mark to the 200px hero. One component renders it everywhere; the name is never set as
plain text.

## 6. Depth

**There is none.** No shadows, no elevation, no layering, no blur. This governs **UI elevation**;
shadows inside a photograph are content, not elevation.

Separation comes from flat ink blocks and 2px `ink` rules.

Single exception: the basket slide-over sits above the page with a plain `ink` overlay at 40% behind
it. No shadow on the panel.

---

## 7. Do's and don'ts

### Do
- Set display type enormous. 200px is not a mistake.
- Use full-bleed ink blocks to break the page.
- Render spec marks at three scales: 16px UI, 64px section markers, 400px+ page graphics.
- Keep checkout, sizing, delivery and returns written plainly.
- Give every spec mark a text equivalent.
- Build the reduced-motion path at the same time as the animation.

### Don't
- Don't use rounded corners. Anywhere.
- Don't add shadows, gradients or glow to UI.
- Don't put two inks in the same block.
- Don't set `volt` under white text.
- Don't write the buy button in brand voice — it says `ADD TO BASKET`.
- Don't animate on scroll by default. Fade-and-slide-up on every section reads as AI-generated.
- Don't build any interaction that only works on hover.
- Don't use numbered markers (01 / 02 / 03) unless the content is a sequence.
- Don't use the em dash as a decorative separator in UI copy.
- Don't set body copy in all caps.

---

## 8. Responsive

Mobile first. Base styles written at 360px.

**Breakpoints:** 360, 768, 1024, 1440.

**Touch targets:** minimum 48px. Colourway swatches at 24px with 24px gaps give a 48px pitch and a
48px hit area without overlap.

**Navigation:** full-screen overlay menu on mobile from a bottom-reachable control. Basket accessible
from any screen.

**Collapsing:** 12 → 8 → 4 columns. Product grid **2-up at every breakpoint**, gap 16px desktop / 8px mobile. Full-bleed stays
full-bleed. Type scale switches at 1024, except `display`, which switches at 1174 (§3).

**Performance:** under 2s to first meaningful paint on 4G, Lighthouse above 90, homepage under 1MB.
All images through `next/image` — no raw `<img>` anywhere.

---

## 9. Motion

Things behave like they are coming off a press.

| Moment | Behaviour | Duration |
|---|---|---|
| Add to basket | Item stamps into the basket icon | 400ms |
| Loading | Rotating registration mark | loops |
| Accordion open | Content unfolds downward | 200ms |
| Colourway change | Image cross-fades | 150ms |
| Nav link hover / focus | Label rolls up, a `rose` copy rolls in beneath | 200ms |
| Wordmark hover | Lean deepens, 14° to 20°, and back | 200ms |
| Header, always | A ten-second film of folded garments gliding across the paper runs behind the chrome | 10s, loops |
| Header, always | A `rose` print head travels the bottom rule end to end and back | 6s, loops |
| Header, always | The registration mark beside the wordmark turns | 12s, loops |

**There are no page transitions.** Route changes are instant.

### Rules
- Nothing animates longer than 600ms.
- Nothing loops forever except the loading mark, the hero film, and the header's two ambient
  motions — the print head and the registration mark, which together say the press is running.
  They are slow enough to be felt rather than watched, and both are static under reduced motion.
- Every animation answers a user action. Decorative motion gets cut.
- One orchestrated moment per page maximum.
- `prefers-reduced-motion` replaces rotation and travel with static equivalents that still communicate
  state — never a bare fade with no progress signal.

### The one exception: the hero film

The homepage hero carries a single ambient film, and it is the only thing on the site allowed to
break the three rules above. It exists because a print shop that never shows anything being printed
is a claim without evidence.

The terms on which it is allowed:

- **Two films, and only two.** The hero's, on the homepage behind the wordmark; and the header's, a
  ten-second conveyor of folded garments that runs behind the chrome on every page because the
  header does. No third. The header film keeps all its action in the centre band, because that is
  the slice an 80px header shows of a 21:9 frame, and the chrome over it sits on `paper` sheets so
  legibility never depends on what the film is doing.
- **Locked-off, overhead, on the same graph paper as the site.** It is the ground coming alive, not a
  cutaway to somewhere else. Palette limited to the site's paper, inks and garment colours.
- **An exact loop, not an approximate one.** Generated with the empty sheet pinned as both first and
  last frame, so the seam is invisible rather than merely quick.
- **Silent, inline, never controls.** `muted`, `playsinline`, no chrome. It is a ground, not content.
- **The left third stays calm.** That is where the type sits at every width, and the film is
  composed to leave it alone.
- **`prefers-reduced-motion` shows the poster.** The film's own first frame — the empty sheet — stands
  in as a plain image. Because the loop starts and ends on that frame, the static version is a true
  state of the section, not a substitute for it.
- **Text on it keeps AA against the paper, not the garments.** The film's garments never enter the
  left third, so type is always measured against blush paper.

---

## 10. Imagery

Two categories, treated differently.

### Product photography — full colour
Garments shot flat and square on, like print documentation. No models, no interiors, no lifestyle. True colour, because swatches promise a
colour the photograph must deliver. Hard shadows, `page` or flat-ink grounds only. No models, no
interiors, no lifestyle. **1:1 for product shots and for detail macros alike** — the grid is square
at every breakpoint (§8), so a 4:5 shot would letterbox inside it.

### Campaign imagery — two-ink riso duotone
Everything that is not a product shot receives a hard duotone built from **two** of the three inks,
high contrast, blown highlights, visible halftone. This is what makes images from different sources
look like one brand, and why product shots are excluded: their job is accuracy, not atmosphere.

### Avoid
Soft natural light, moody editorial, models mid-movement, anything that reads as a stock lifestyle
library.

---

## 11. Voice

Zine register: short, declarative, a bit shouty, never trying to be clever twice in one sentence.

**Signature line:** `SMALL RUNS. LOUD COLOURS.`
A named component, not a heading.

### Loud
Headlines, section markers, 404, empty states, newsletter signup, footer, **and the basket**.

### Quiet
Checkout, sizing, delivery, returns, error messages, the care guide.

The quiet zone is defined **by page, not by element type**. Form fields on a loud page — the basket's
discount code, the footer's newsletter input — take plain functional labels, because a label's only
job is to be understood.

**Typography does not change between zones.** §11's "sentence case, Inter" governs *sentences*: help
text, error messages, headings, body copy, button copy. Field labels remain Space Mono uppercase
everywhere, including checkout, the size guide and delivery/returns. There is no page-scoped
typographic exception anywhere on the site.

### Copy rules
- Active voice. A CTA states what happens: "Add to basket", not "Submit".
- An action keeps its name through the flow. "Place order" produces "Order placed".
- Errors explain what went wrong and how to fix it. No apologies, never vague.
- Empty states invite action.

---

## 12. Commerce values

| Value | Setting |
|---|---|
| Free delivery threshold | £75 |
| Discount code | `WASHDAY` — 10% off subtotal, before delivery |
| Standard delivery | £4.95, 3–5 working days, free over the threshold |
| Express delivery | £9.95, next working day, never free |
| "Last few left" | Fewer than 4 remaining — scoped by surface, see below |
| Order number | `PL-` plus five digits, sequential, first order `PL-10847` |

### "Last few left" is scoped by surface

The threshold is always **fewer than 4**. What it counts depends on where it is shown, and the two must
not be merged.

| Surface | Counts | Why |
|---|---|---|
| **Product card badge** | The whole colourway, every size added together | A card shows one badge for one colour and cannot represent a single size. |
| **Size selector on the product page** | One size in one colourway | This is where the choice is made. |

Both rules live in `lib/stock.ts` as `isColourwayLastFew` and `isSizeLastFew`. They are separate
functions on purpose. Do not collapse them.

**Basket presentation:** the slide-over panel is primary. A `/basket` route exists as a full-page
fallback for direct links and no-JS access. Both render the same line item.

---

## 13. Agent prompt guide

```
Background:      #FFFFFF
Text:            #111111
Spot one:        #FF2D6F  (rose pink, page text on it)
Spot two:        #1B4DFF  (electric blue, page text on it)
Spot three:      #D9FF00  (acid yellow, INK text on it)
Border:          #E6E6E6

Display font:    Bricolage Grotesque 800, uppercase, -0.02em at 48px+
Body font:       Inter, sentence case
Label font:      Space Mono, 13px, uppercase
Button font:     Bricolage Grotesque 800, 16px, uppercase, tracking 0

Display switch:  1174 (display only; every other role switches at 1024)
Border radius:   0 everywhere
Shadows:         none (UI only — photo shadows are content)
Gradients:       none
Inks per block:  exactly one
Page transition: none
Spacing ramp:    8/16/24/40/48/64/80/96/160
Gutters:         64px ≥1024, 24px below
Touch target:    48px minimum
Breakpoints:     360 / 768 / 1024 / 1440
```

Before building any page, confirm: one dominant element, one ink in the section, square corners, no
shadow, nothing hover-only, reduced-motion path handled, every spec mark has a text equivalent.
