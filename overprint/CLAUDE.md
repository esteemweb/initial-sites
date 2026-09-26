# Overprint — project notes

Demo website for a fictional Manchester design studio, built for the agency portfolio.
Next.js 16 (App Router) + Tailwind v4. The design source of truth is `design-system.md`;
`SECURITY-AUDIT.md` records the pre-deployment security review.

## Running locally

```
npx next build
npx next start -p 3004
```

`next start` serves the prebuilt bundle: after any source change, rebuild and restart. The
browser caches the static page, so open it with a `?v=N` query after a rebuild. Next's image
cache also keys on the filename: when replacing an image, give it a new filename.

## It is a demo — keep it that way

- **The "Start a project" form sends and stores nothing.** It validates like a real form
  (`src/lib/enquiry.ts`), then shows the confirmation with the line "Demo site: no enquiry was
  sent." There is no API route and no server code. Don't add one unless the owner asks.
- **Contact email is `hello@overprint.example`** (`src/lib/site.ts`). `.example` is reserved and
  can never be a real address. Never replace it with a real-looking domain.
- People, projects and portraits are fictional; portraits and photos are AI-generated.

## Deploying to Vercel

- **Environment variables / secrets: none.** The site uses no API keys and reads no
  environment variables. Nothing needs adding in Vercel's settings.
- **Root directory:** this folder sits inside the parent repo `demo-sites`. In the Vercel
  project settings, set *Root Directory* to `overprint`.
- **Framework preset:** Next.js (auto-detected). Build command `npm run build`, default output.
- **Node.js:** 20 or newer.
- **Fonts** (Tangerine, Jost) come through `next/font/google`, which downloads them **at build
  time** and serves them from the site's own domain. The build machine needs internet access;
  Vercel's does.
- **Security headers** (X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy) and the disabled `X-Powered-By` header are set in `next.config.ts`. They
  apply on Vercel automatically.
- **Not published (git-ignored):** `refs/` (research notes on the reference site) and
  `public/images/hero-editorial-motion.jpg` (unused). If either was committed before the
  `.gitignore` change, untrack it by hand before pushing.
- **Images** are optimised by `next/image`, which counts towards Vercel's image-optimisation
  quota. 16 images, well within the free tier.
