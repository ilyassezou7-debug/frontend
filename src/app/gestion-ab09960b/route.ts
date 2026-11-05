import { createHash, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { APP_HTML } from "@/ops/gestion-html";

// Private management page. Password-protected on the SERVER: the page HTML is only sent after the check.
// The repo is public, so only SHA-256 fingerprints live here - the password itself is not in the code.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PATH = "/gestion-ab09960b";
const CHECK_HASH = "3834b1165063fe7e3bc2bde80fd498aa393972d015d1f19e6cee284a9a95ce3d"; // sha256("gp-check:" + password)
const TOKEN_HASH = "aca216fce3e68d009ea5cba64eec8c0e206f4de3ccfa79f52f9565cf866ec575"; // sha256(sha256("gp-token:" + password)) - the cookie holds the inner hash
const COOKIE = "gp_session";

const HEADERS: Record<string, string> = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
};

const sha = (s: string) => createHash("sha256").update(s).digest("hex");
function same(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function authed(req: NextRequest) {
  const c = req.cookies.get(COOKIE)?.value;
  return !!c && same(sha(c), TOKEN_HASH);
}

function loginPage(error: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow,noarchive"><title>Accès réservé</title>
<style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px;background:radial-gradient(1200px 600px at 20% 0%,#2a3346 0%,#141a26 60%);font:15px/1.45 "Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;color:#1b2333}
.c{background:#fff;border-radius:20px;padding:32px 28px;width:100%;max-width:380px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.35)}
h1{font-size:20px;margin:14px 0 4px}p{color:#7b8496;margin:0 0 22px}
.f{position:relative}input{width:100%;padding:13px 46px 13px 14px;font:inherit;border:1.5px solid #e7e1d7;border-radius:12px;background:#faf8f5;outline:none}
input:focus{border-color:#d9622b;background:#fff;box-shadow:0 0 0 3px #fbe9df}
.eye{position:absolute;right:8px;top:7px;border:0;background:none;cursor:pointer;padding:6px 8px;color:#7b8496;font:inherit;font-size:12.5px;font-weight:600}
button.go{margin-top:14px;width:100%;padding:13px;border:0;border-radius:12px;background:#d9622b;color:#fff;font:inherit;font-weight:700;cursor:pointer}
button.go:hover{background:#b24c1c}.e{color:#c2410c;font-weight:600;min-height:22px;margin-top:10px}.ft{margin-top:14px;font-size:12px;color:#7b8496}
</style></head><body><form class="c" method="post" action="${PATH}">
<svg width="56" height="56" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#d9622b"/><path d="M0 29c6-3 12 2 20-1s14-2 20 0v1.5c0 5.8-4.7 10.5-10.5 10.5h-19C4.7 40 0 35.3 0 29.5z" fill="#b24c1c"/><rect x="8" y="9" width="19" height="8.5" rx="2.5" fill="#fff"/><path d="M27 13.2h4.2v7.4H19.5v3.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><rect x="17.7" y="23.8" width="3.6" height="9.5" rx="1.4" fill="#18202e"/></svg>
<h1>Espace de gestion</h1><p>Accès réservé. Entrez le mot de passe.</p>
<div class="f"><input id="pw" type="password" name="password" autocomplete="current-password" placeholder="Mot de passe" required autofocus><button type="button" class="eye" onclick="var i=document.getElementById('pw');i.type=i.type==='password'?'text':'password';this.textContent=i.type==='password'?'Afficher':'Masquer'">Afficher</button></div>
<button class="go" type="submit">Entrer</button><div class="e">${error}</div><div class="ft">Équipes · Pointage · Paie · Chantiers · Stock</div></form></body></html>`;
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.has("logout")) {
    const res = new NextResponse(loginPage(""), { headers: HEADERS });
    res.cookies.set(COOKIE, "", { path: PATH, maxAge: 0 });
    return res;
  }
  if (authed(req)) {
    return new NextResponse(APP_HTML.replace("<script>", "<script>window.GP_SERVER_AUTH=1;</script><script>"), { headers: HEADERS });
  }
  return new NextResponse(loginPage(""), { headers: HEADERS });
}

export async function POST(req: NextRequest) {
  let pw = "";
  try { pw = String((await req.formData()).get("password") || ""); } catch { /* empty or malformed body */ }
  if (pw && same(sha("gp-check:" + pw), CHECK_HASH)) {
    // relative Location: behind the Easypanel proxy req.url carries the internal host
    const res = new NextResponse(null, { status: 303, headers: { Location: PATH, "Cache-Control": "no-store" } });
    res.cookies.set(COOKIE, sha("gp-token:" + pw), { httpOnly: true, secure: true, sameSite: "lax", path: PATH, maxAge: 60 * 60 * 24 * 30 });
    return res;
  }
  await new Promise((r) => setTimeout(r, 800)); // slow down guessing
  return new NextResponse(loginPage("Mot de passe incorrect."), { status: 401, headers: HEADERS });
}
