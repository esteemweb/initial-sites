import type { NextConfig } from "next";

/* Security headers for every page (SECURITY-AUDIT.md, item 9). The site is
   fully static with no backend, so these only switch on browser protections:
   no embedding in other sites (clickjacking), no file-type guessing, only the
   domain passed on to sites we link to, and no camera/microphone/location.
   Deliberately no full Content-Security-Policy: Next.js would need per-request
   nonces, which would stop the pages being served as static files. */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
