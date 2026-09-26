# Talay Dao

## Design pipeline — follow this order, every time

Do not improvise the design. Run these three stages in order for any page,
section, hero, layout, or component. Skipping stage 1 is what produces
generic output.

**1. Direction — before writing any markup**
Read a reference system first, so values are chosen rather than guessed.
- Use the `design-md-library` skill. Read the full
  `references/<brand>/DESIGN.md` for the closest match and lift the *structure*
  (type scale + tracking, surface elevation ladder, spacing rhythm, how
  restrained the accent colour is).
- If the reference the user names isn't in the library, use `reference-autopsy`
  on the live site instead.
- Port the system, not the identity. Re-key palette and fonts to this project.

**2. Build**
- Use the `taste-skill` skill as the primary engine. Set its three dials
  (`DESIGN_VARIANCE`, `MOTION_INTENSITY`, `DENSITY`) explicitly and state them
  before building.
- `soft-skill`, `minimalist-skill`, `brutalist-skill` are *style variants* —
  reach for one only when the brief clearly calls for that register. Default to
  `taste-skill`.
- `redesign-skill` when changing an existing page rather than creating one.

**3. Audit — before calling anything done**
- `web-design-guidelines` for accessibility and UX rule compliance.
- `react-best-practices` for render/bundle/data-fetching performance.

## Modern elements

"Modern" here means motion and interaction that are *earned*, not decorative.

- Page and shared-element transitions: use the `react-view-transitions` skill
  (native View Transition API) before reaching for a library.
- Component animation: Motion, imported as `import { motion } from "motion/react"`.
  Not `framer-motion` in new code.
- Never track continuous input (scroll progress, pointer position, magnetic
  hover) in `useState` — use `useMotionValue` / `useTransform` / `useScroll`.
  `useState` re-renders the tree on every frame and collapses on mobile.
- Anything using motion, scroll listeners or pointer physics must be an
  isolated leaf component with `'use client'`. Server Components render static
  layout only.
- Component architecture: `composition-patterns` when a component starts
  growing boolean props.

## Banned defaults

These are the LLM defaults. Reaching for them means stage 1 was skipped:
AI-purple gradients, a centred hero over a dark mesh, three equal feature
cards, glassmorphism applied everywhere, infinite-loop micro-animations,
Inter + slate-900.

Centred hero/H1 is disallowed whenever `DESIGN_VARIANCE > 4` — use split
screen, left-content/right-asset, asymmetric whitespace, or scroll-pinned
structure instead.

## Housekeeping

- Don't deploy or set up hosting unless asked explicitly.

## Deployment notes (from SECURITY-AUDIT.md, 2026-09-26)

- Static site, no backend: Vercel needs **no environment variables or
  secrets**. Build command `next build`, output handled by Next.
- Security headers and `poweredByHeader: false` live in `next.config.mjs`.
  They apply on Vercel automatically; nothing to configure in the dashboard.
- This folder has its own `.gitignore`; `refs/` (design-reference notes) is
  deliberately never published. To publish the site, the parent repo's
  `.gitignore` at `E:\demo-sites` still needs `!/talay-dao/` added — the
  user does that by hand.
- Do not add `openai` or `sharp` back: neither is used. Next.js carries its
  own optional `sharp`; images are served unoptimised regardless.
- On Next.js 16 (since 2026-09-26): `next build` uses Turbopack by default and
  there is no Webpack config to keep. `npm audit` is clean at 0. Vercel needs
  Node 20.9+ (its default is fine). Running `next dev` will create an
  `AGENTS.md` file that points at Next's bundled docs; that is expected.
- The `<html>` element carries `data-scroll-behavior="smooth"` so client
  navigation still jumps to the top as it did on Next 15. Keep it.
