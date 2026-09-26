import type { NextConfig } from "next";

/**
 * Security headers (SECURITY-AUDIT.md #9).
 *
 * Four headers and one switch. Deliberately no Content-Security-Policy: this
 * site loads no third-party scripts and takes no user input, so a CSP would
 * add almost nothing, while being the classic way to silently break
 * self-hosted fonts and Tailwind's injected styles. Not needed here.
 *
 * `X-Frame-Options: SAMEORIGIN` blocks other sites from loading this one in an
 * iframe. Note for later: if the agency site ever wants to embed this demo in
 * a frame, that is cross-origin and this header will block it — swap to a
 * `Content-Security-Policy: frame-ancestors` naming that origin instead.
 */
const securityHeaders = [
  // Stops any other origin putting this site inside an iframe of their own.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stops browsers second-guessing a file's type from its contents.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the full URL within this site, only the origin when leaving it.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site uses none of these, so switch them off for every frame in it.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  // Serve AVIF to browsers that accept it, then WebP, then the JPEG master.
  // next/image negotiates per request, so the same file is delivered in the
  // best format each visitor's browser supports, with no change on screen.
  images: { formats: ["image/avif", "image/webp"] },

  // Removes the `X-Powered-By: Next.js` header, which tells anyone scanning
  // exactly what framework and therefore which exploits to try.
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
