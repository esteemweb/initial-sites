@AGENTS.md

## Deployment notes (Vercel)

- **No environment variables or secrets are needed.** The site is fully static (every route is
  prerendered): no API routes, server actions, database, auth or third-party API calls.
- Build command `npm run build`, output is the default Next.js output — Vercel's defaults work.
- Security headers and `poweredByHeader: false` are set in `next.config.ts` and apply on Vercel
  as-is. Don't add a full Content-Security-Policy without re-testing fonts, images and the
  loading-screen and scroll animations.
- Contact details on the site are invented demo values (`src/content/site.ts`); the phone number
  is deliberately plain text, not a `tel:` link. Keep it that way.
- `.gitignore` excludes the working folders (`reference/`, `refs/`, `scripts/`,
  `PHASE-1-PLAN.md`). `refs/`, `scripts/` and `PHASE-1-PLAN.md` were committed before that rule
  and stay tracked until untracked with `git rm --cached` — decide that before the repo goes
  public. See `SECURITY-AUDIT.md`.
