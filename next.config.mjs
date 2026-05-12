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
  },
};

export default nextConfig;
