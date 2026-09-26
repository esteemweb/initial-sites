import type { NextConfig } from "next";

/* Security headers — SECURITY-AUDIT.md item 9 (26 Sep 2026). Sent with every
   response. None of them changes what a visitor sees: the site loads nothing
   from other domains, so no content rules are needed beyond framing.
   - nosniff: browsers must trust the declared file type, never guess it;
   - Referrer-Policy: other sites learn only our domain, not the full page
     address (booking steps keep their choices in the address);
   - Permissions-Policy: camera, microphone, location, payment and USB are
     switched off — the site uses none of them;
   - X-Frame-Options + frame-ancestors: no other site may show this one
     inside a frame (clickjacking). */
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  // don't announce the framework in every response (SECURITY-AUDIT.md item 9)
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // French first (brief §10): the bare domain goes to /fr.
  async redirects() {
    return [{ source: "/", destination: "/fr", permanent: false }];
  },
  experimental: {
    // The root layout lives under [lang], so unmatched URLs need a global 404.
    globalNotFound: true,
  },
};

export default nextConfig;
