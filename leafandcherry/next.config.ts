import type { NextConfig } from "next";

/* Baseline browser security headers (SECURITY-AUDIT.md item 9a). The site is
   fully static with no logins or forms that send data, so this is the
   standard baseline, not a hardening layer:
   - nosniff: the browser must not guess a file's type from its contents;
   - Referrer-Policy: other sites see only our domain, never full page URLs;
   - Permissions-Policy: the site can never ask for camera, mic or location;
   - X-Frame-Options + CSP frame-ancestors: no other site may embed this one
     in a frame (clickjacking). Deliberately NOT a full Content-Security-Policy:
     nothing here needs one, and it is the header most likely to break styles
     or scripts. frame-ancestors is its only directive, and touches neither. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  // Don't announce the framework on every response (audit item 9b).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
