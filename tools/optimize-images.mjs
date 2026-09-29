// Pre-builds every image the store renders through next/image as static WebP files at fixed widths:
//   public/images/_opt/<path>.<hash>.<width>.webp   +   src/lib/image-manifest.json
// src/lib/image-loader.ts maps next/image requests onto these files, so NO image is resized at request time.
// Why: the runtime optimizer (/_next/image) is never cached by Cloudflare (cf-cache-status DYNAMIC), took 2-3 s per image
// even when warm, and its cache is wiped on every deploy -> images failed/stalled on first visit.
// Run after adding or changing an image:   npm run images
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { join, dirname, relative, extname } from "node:path";

const ROOT = process.cwd();
const PUB = join(ROOT, "public");
const OUT = join(PUB, "images", "_opt");
const SOURCES = ["images/home", "images/products", "images/lp/joint-product.png", "logo.png", "logo-light.png"];
const WIDTHS = [96, 192, 384, 640, 750, 828, 1080, 1200];
const QUALITY = 74;

function walk(p) {
  const abs = join(PUB, p);
  if (!existsSync(abs)) return [];
  if (statSync(abs).isFile()) return [abs];
  return readdirSync(abs).flatMap((f) => walk(join(p, f)));
}

const files = SOURCES.flatMap(walk).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
rmSync(OUT, { recursive: true, force: true });
const manifest = {};
for (const abs of files) {
  const src = "/" + relative(PUB, abs).split("\\").join("/");
  const buf = readFileSync(abs);
  const hash = createHash("sha1").update(buf).digest("hex").slice(0, 8);
  const { width: orig } = await sharp(buf).metadata();
  const widths = [...new Set([...WIDTHS.filter((w) => w < orig), Math.min(orig, 1200)])].sort((a, b) => a - b);
  const base = src.slice(1, -extname(src).length);
  for (const w of widths) {
    const out = join(OUT, `${base}.${hash}.${w}.webp`);
    mkdirSync(dirname(out), { recursive: true });
    await sharp(buf).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY, effort: 5 }).toFile(out);
  }
  manifest[src] = { h: hash, w: widths };
  console.log(src, widths.join(","));
}
writeFileSync(join(ROOT, "src", "lib", "image-manifest.json"), JSON.stringify(manifest, null, 1) + "\n");
console.log(`${files.length} images -> public/images/_opt`);
