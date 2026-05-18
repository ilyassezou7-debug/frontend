/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Gzip/Brotli all responses
  compress: true,

  // Don't expose the server tech stack in response headers
  poweredByHeader: false,

  images: {
    remotePatterns: [],
    // Serve AVIF first (smallest), then WebP — both vastly smaller than JPEG/PNG
    formats: ["image/avif", "image/webp"],
    // Cache optimised images for 30 days on CDN/browser (default is 60s)
    minimumCacheTTL: 2592000,
  },

  // Only framer-motion still needs CommonJS transpilation in Next.js 14
  // lucide-react is pure ESM and must NOT be here — listing it causes
  // the entire icon set to be bundled instead of tree-shaken
  transpilePackages: ["framer-motion"],

  experimental: {
    // Automatically tree-shakes barrel exports so only the icons / primitives
    // actually used in the app are included in the JS bundle
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-slot",
    ],
    // Restore scroll position when navigating back/forward
    scrollRestoration: true,
  },

  async headers() {
    return [
      {
        // Immutable cache for all Next.js hashed static chunks (_next/static)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Long cache for public images/fonts/svgs
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Fonts cached for 1 year
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
