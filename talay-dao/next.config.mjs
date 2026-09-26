/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Security headers (SECURITY-AUDIT.md item 9). The site serves only its
     own assets, so these four are the whole set that applies: no CSP is
     needed and its inline-style allowances would make it near-empty. */
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  images: {
    /* Serve the source files byte-for-byte.

       next/image otherwise re-encodes every image to WebP at quality=75 by
       default, whatever the source format is — so a lossless PNG still
       reached the browser as a 75-quality WebP. Combined with an earlier
       q82 WebP conversion step that meant two lossy passes over the same
       photograph, which visibly flattened the hazy gradients these plates
       are mostly made of.

       Cost of this setting: no automatic resizing or srcset, so the full
       file is sent at every viewport. Deliberate — quality was chosen over
       weight here. */
    unoptimized: true,
  },
};
export default nextConfig;
