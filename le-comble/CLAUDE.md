# Le Comble — project notes

A finished demo site for the agency portfolio: a static Next.js 16 site (FR/EN), no backend.
Design rules: `design-system.md`. Content brief: `BRIEF.md`. Security review: `SECURITY-AUDIT.md`.
Keep any further change small and only what is asked.

## Deploying to Vercel

- **No environment variables or secrets are needed.** The site reads none and calls no outside
  services.
- **Official address (canonical and hreflang links)** comes from `VERCEL_PROJECT_PRODUCTION_URL`,
  which Vercel sets by itself at build time (`src/app/[lang]/layout.tsx`). Nothing to configure,
  as long as the project setting *Automatically expose System Environment Variables* stays on
  (it is on by default). Without it the links fall back to `http://localhost:3006`. If a custom
  domain is added later, Vercel's production URL follows it automatically.
- **Security headers** are set in `next.config.ts` (nosniff, Referrer-Policy, Permissions-Policy,
  no framing, no `X-Powered-By`). Vercel adds HTTPS (HSTS) itself. Don't add a stricter
  Content-Security-Policy without re-testing the hero video, the WebGL velvet
  (`src/components/ui/cloth.tsx`) and the fonts.
- **Never commit** `.env*`, `.next`, `node_modules` or `.vercel`; `.gitignore` covers them.
- Run `npm audit` before deploying (it can't reach the registry from the build machine).
- Build check: `npm run build` must pass with no errors.

## Demo safeguards (SECURITY-AUDIT.md, 26 Sep 2026)

- **Contact details are never-real on purpose** (`src/content/site.ts`): emails on
  `lecomble.example` (a reserved domain), phone `+33 4 65 71 18 31` from the 04 block ARCEP
  reserves for fiction — confirm that range on arcep.fr before launch. Don't swap in anything
  that could reach a real person.
- **Every booking confirmation ends with a quiet "demo site" line** (`COMMON.demo` in
  `src/content/booking.ts`), FR and EN. The forms send and store nothing.
