@AGENTS.md

# CLAUDE.md — LOUD LAUNDRY

## What this is

A demo ecommerce site for LOUD LAUNDRY, a fictional UK clothing brand selling heavyweight cotton basics to an 18–26 audience. Built as a portfolio piece to demonstrate frontend and ecommerce capability to prospective clients.

Because it is a portfolio piece, **quality of execution matters more than speed**. This site will be shown to people deciding whether to hire the agency that built it.

## Design system

**Read `DESIGN.md` before writing any UI code.** It defines the palette, type scale, spacing, components, motion rules, imagery treatment and voice. It is the source of truth for every visual decision. Do not deviate from it, and do not introduce values it does not define.

If a request conflicts with `DESIGN.md`, say so rather than silently picking one.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React

**No styled component kits, UI libraries, or CSS frameworks.** No shadcn, no MUI, no Chakra, no DaisyUI. Every visual is built from scratch against `DESIGN.md`.

**One carve-out: headless accessibility primitives are permitted** where hand-rolling would mean reimplementing focus trapping and restoration. Approved packages:

- `@radix-ui/react-dialog` — basket slide-over, mobile nav overlay
- `@radix-ui/react-accordion` — product spec accordions

Motion beyond CSS transforms (the basket tumble, the loading drum) may use `framer-motion` if CSS alone gets awkward — ask first.

Behaviour and accessibility only. All visuals still come from `DESIGN.md`. Anything beyond these two needs asking first.

## Data and scope

**Product data lives in `data/products.ts`.** This project has no `src/` directory — everything sits at the project root. No database, no CMS, no backend. Around 14 products with per-size stock levels, multiple colourways, reviews and fabric specs.

**The catalogue is supplied, not invented.** Do not generate placeholder products, prices, colourway names or reviews. If the catalogue file is not present, stop and ask for it.

**The basket is fully functional.** Add, remove, change quantity, change size and colour from within the basket, live subtotal and total, free-delivery threshold with progress, working discount code, stock awareness so sold-out sizes cannot be added, and persistence across sessions.

**Checkout is a complete flow with no payment.** Three steps — delivery details, delivery method, review order — with full form validation, ending on an order confirmation page with a generated order number. There are no card fields anywhere. Do not add a fake payment form.

Commerce values (thresholds, discount code, order number format) are defined in `DESIGN.md` §12.

## Pages

Home, shop, product detail, basket, three-step checkout, order confirmation, The Label (about), Wash Cycle (care guide), size guide, 404.

Plus stub pages with real text but no design effort: delivery and returns, privacy, terms.

## What makes the site feel real

Build these in rather than treating them as polish:

- Stock varies per size, and some variants are genuinely sold out
- Reviews carry names, dates and fit feedback (runs small / true to size / runs large)
- Delivery estimates calculate from the current date
- Order numbers increment
- Some products carry "last few left" or restocked states

## Conventions

- Spacing uses the 8px scale only. No arbitrary pixel values.
- Every component ships with default, hover, active, focus, disabled, loading, error and empty states.
- Nothing may be hover-only. Every interaction works on touch.
- Accessibility is not optional: AA contrast, full keyboard navigation, visible focus states, `prefers-reduced-motion` honoured with meaningful static alternatives, every care symbol paired with a text equivalent.
- Mobile first, base styles at 360px.
- Fonts subset and preloaded from the first commit.
- Keep files small and focused. One component per file.

## Working style

- Work in plan mode first. Propose the approach, wait for approval, then build.
- Build one section at a time and stop for review rather than generating whole pages unprompted.
- Do not add features that were not asked for.
- Do not install packages without saying what they are for first.
- Flag contradictions rather than resolving them silently.

## Out of scope

No payment processing. No user accounts or login. No database. No admin panel. No CMS. No email sending. No analytics.

These are deliberately excluded and belong to other demo sites in the portfolio.
