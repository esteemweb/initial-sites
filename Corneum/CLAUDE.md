# Corneum

Scalp-care demo site: Next.js 16 (App Router), fully static, no backend.
The design rules live in `design-system.md`, the content in `BRIEF.md`, and the drafted data in `DATA-NOTES.md`.

## Deployment (Vercel)

- **Set `NEXT_PUBLIC_SITE_URL`** in the Vercel project's environment variables, to the site's real address with no trailing slash (e.g. `https://corneum.example`). Set it for Production, and for Preview too if previews should share correctly.
  - It is **not a secret**: it's the public address, and the `NEXT_PUBLIC_` prefix is correct.
  - It's read at build time (`src/lib/site.ts`) for absolute URLs: share-card images (`og:image`), `sitemap.xml` and the sitemap line in `robots.txt`.
  - If it's missing, those fall back to `http://localhost:3005`, and link previews and the sitemap will point at localhost. After changing it, redeploy so the build picks it up.
- **There are no secrets to configure.** The site has no API keys, database, auth or email.
- **Security headers** are set in `next.config.ts`: no embedding in other sites, `nosniff`, referrer policy and permissions policy. Vercel adds HTTPS enforcement (HSTS) itself. See `SECURITY-AUDIT.md`.
- **Build:** `npm run build`. **Tests:** `npm test`. Both must pass before deploying.
