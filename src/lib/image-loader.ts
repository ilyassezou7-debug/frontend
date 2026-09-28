// next/image loader: serves the static WebP sizes pre-built by tools/optimize-images.mjs (npm run images)
// instead of resizing at request time. Unknown images fall back to the original file.
import manifest from "./image-manifest.json";

const M = manifest as Record<string, { h: string; w: number[] }>;

export default function atlasImageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  const e = M[src];
  if (!e) return src;
  const w = e.w.find((x) => x >= width) ?? e.w[e.w.length - 1];
  return `/images/_opt/${src.slice(1).replace(/\.[a-z0-9]+$/i, "")}.${e.h}.${w}.webp`;
}
