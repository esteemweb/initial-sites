/* The public origin, used for absolute URLs in share cards, the sitemap and
   robots.txt. Set NEXT_PUBLIC_SITE_URL when the site is deployed; until then
   it falls back to the local server. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3005").replace(/\/$/, "");
