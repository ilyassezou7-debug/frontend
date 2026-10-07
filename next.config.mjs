/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Gzip/Brotli all responses
  compress: true,

  // Don't expose the server tech stack in response headers
  poweredByHeader: false,

  images: {
    // No request-time resizing: next/image points at static WebP sizes pre-built by tools/optimize-images.mjs
    // (npm run images). The runtime optimizer was uncached by Cloudflare, slow (2-3 s/image) and emptied on every
    // deploy, which made images stall or fail on a first visit.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },

  // Next 14 bundles polyfills for Array.at/flat/flatMap, Object.fromEntries/hasOwn, trimStart/trimEnd into every page
  // (Lighthouse "legacy JavaScript"). Every browser that can run this site already has them natively.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "../build/polyfills/polyfill-module": false,
        "next/dist/build/polyfills/polyfill-module": false,
      };
    }
    return config;
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

  // German Amazon bridge pages are served as fully static HTML (no framework JS) - see tools/export-bridge.mjs
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/lp/bestie-duell", destination: "/lp/bestie-duell.html" },
        // Moroccan vitiligo landing page: hand-written static HTML (public/lp/vitiligo.html), no framework JS
        { source: "/lp/vitiligo", destination: "/lp/vitiligo.html" },
        { source: "/lp/vitiligo-2", destination: "/lp/vitiligo-2.html" },
        { source: "/lp/vitiligo-3", destination: "/lp/vitiligo-3.html" },
        { source: "/lp/vitiligo-4", destination: "/lp/vitiligo-4.html" },
        { source: "/lp/vitiligo-5", destination: "/lp/vitiligo-5.html" },
        { source: "/lp/vitiligo-6", destination: "/lp/vitiligo-6.html" },
        { source: "/lp/vitiligo-7", destination: "/lp/vitiligo-7.html" },
        { source: "/lp/vitiligo-8", destination: "/lp/vitiligo-8.html" },
        { source: "/lp/joint", destination: "/lp/joint.html" },
        { source: "/lp/joint-2", destination: "/lp/joint-2.html" },
      ],
    };
  },

  async headers() {
    return [
      {
        // Static bridge pages: short browser cache so edits show up quickly
        source: "/lp/:page*.html",
        headers: [{ key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=3600" }],
      },
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
        // Pre-built image sizes carry a content hash in the file name -> cache forever
        source: "/images/_opt/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
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
