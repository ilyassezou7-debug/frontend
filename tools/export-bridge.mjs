// Export the German Amazon bridge pages as fully static HTML (no Next.js framework JavaScript).
//
//   npm run build && npm run start      (in another terminal)
//   node tools/export-bridge.mjs [baseUrl]
//
// Renders each template route under /lp-src/<page>, removes every Next.js runtime script (the page needs none:
// its only logic is the inline Meta sender + click handler from src/app/(bridge)/layout.tsx), and writes
// public/lp/<page>.html, which next.config.mjs serves at /lp/<page>.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PAGES = ["bestie-duell"];
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const page of PAGES) {
  const res = await fetch(`${BASE}/lp-src/${page}`);
  if (!res.ok) throw new Error(`${page}: HTTP ${res.status}`);
  let html = await res.text();
  const before = html.length;
  html = html
    .replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*><\/script>/g, "")                 // framework chunks
    .replace(/<link\b[^>]*rel="(?:preload|modulepreload)"[^>]*as="script"[^>]*\/?>/g, "")   // their preloads
    .replace(/<link\b[^>]*as="script"[^>]*rel="(?:preload|modulepreload)"[^>]*\/?>/g, "")
    .replace(/<script\b[^>]*>(?:(?!<\/script>)[\s\S])*?self\.__next_f[\s\S]*?<\/script>/g, "") // RSC payload
    .replace(/<script\b[^>]*noModule[^>]*><\/script>/gi, "")
    .replace(/\/lp-src\//g, "/lp/");
  if (/_next\/static\/chunks|__next_f/.test(html)) throw new Error(`${page}: framework scripts left in the export`);
  if (!/fbq\('track','ViewContent'/.test(html) || !/a\[data-amz\]/.test(html)) throw new Error(`${page}: tracking script missing`);
  const out = join(ROOT, "public", "lp", `${page}.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`${page}: ${Math.round(before / 1024)} KB -> ${Math.round(html.length / 1024)} KB  ->  ${out}`);
}
