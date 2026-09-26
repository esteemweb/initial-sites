import type { NextConfig } from "next";

/* Security headers — see SECURITY-AUDIT.md item 9. Everything the site loads
   (fonts via next/font, images, CSS animation) comes from its own origin, so none
   of these restrict anything the page uses. */
const securityHeaders = [
  // no other site may show this one inside a frame (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // browsers must trust the declared file type, never guess it
  { key: "X-Content-Type-Options", value: "nosniff" },
  // other sites see only the domain a visitor came from, not the full address
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // the site never uses the camera, microphone or location — switch them off
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // don't advertise the framework in every response ("X-Powered-By: Next.js")
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
