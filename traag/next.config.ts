import type { NextConfig } from "next";

// Protective headers on every response. Kept deliberately narrow: they
// block framing, MIME guessing and needless referrer leaks, and switch off
// device features the site never uses. No full Content-Security-Policy,
// which would need tuning for the inline motion script and fonts.
const SECURITY_HEADERS = [
  // nobody may load the site inside a frame (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // browsers must trust the declared file type, not guess it
  { key: "X-Content-Type-Options", value: "nosniff" },
  // other sites see only the domain a visitor came from, not the full path
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // the site never needs these
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  // don't announce the framework in every response
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Breakpoints are 390 / 768 / 1024 / 1440. Each at 1x and 2x, capped by
    // the 1536px source width for anything full-bleed.
    deviceSizes: [390, 768, 1024, 1440, 1536, 2048, 2880],
    imageSizes: [96, 160, 240, 320, 480, 640],
    // Hero layers ask for 70; everything else takes the default 75.
    qualities: [50, 60, 70, 75],
  },
  // the old page names from the first version of the site
  async redirects() {
    return [
      { source: "/about", destination: "/biography", permanent: true },
      { source: "/releases", destination: "/music", permanent: true },
    ];
  },
  experimental: {
    // The stylesheet is small and hand-written; inlining it removes the one
    // request that gates first paint on 4G.
    inlineCss: true,
  },
};

export default nextConfig;
