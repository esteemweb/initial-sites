import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* Inline the (10KB, Tailwind-atomic) stylesheet into the HTML: on a slow
       4G phone the separate CSS request was the round trip gating first paint. */
    inlineCss: true,
  },
  /* Browser-safety headers on every route. No Content-Security-Policy: the
     site is static with no user input, and a CSP would need nonces for
     Next's own inline scripts. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
