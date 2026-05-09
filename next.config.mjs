/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
  },
  transpilePackages: ["framer-motion", "lucide-react"],
};

export default nextConfig;
