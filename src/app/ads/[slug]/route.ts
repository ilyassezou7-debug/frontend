import { NextRequest, NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";
import { getProductBySlug } from "@/config/products";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const incomingParams = request.nextUrl.searchParams;

  // Use the canonical public domain as the base for absolute redirect URLs.
  // In production the app runs behind a proxy, so request.nextUrl.origin can
  // resolve to the internal host (e.g. http://0.0.0.0:3000) which is not
  // reachable by visitors. Prefer the proxy's forwarded host, then fall back
  // to the configured site URL (https://atlaspure.shop).
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  let baseOrigin: string;
  if (forwardedHost) {
    // Behind a proxy in production: trust the public host it forwards.
    baseOrigin = `${forwardedProto}://${forwardedHost}`;
  } else {
    // No proxy (e.g. local dev): use the request origin, but guard against the
    // unreachable internal bind address (0.0.0.0) by falling back to the domain.
    const reqOrigin = request.nextUrl.origin;
    baseOrigin = /0\.0\.0\.0/.test(reqOrigin)
      ? `https://${SITE_CONFIG.domain}`
      : reqOrigin;
  }

  // Helper: append the incoming query params (utm_*, fbclid, ttclid, ...) onto
  // the destination so ad tracking is preserved through the redirect.
  const withParams = (target: string) => {
    const url = new URL(target);
    incomingParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  };

  try {
    // 1. Admin-configured redirect ALWAYS wins.
    //    The ad link (/ads/<slug>) must stay stable while the destination is
    //    editable from the /redirectkiller admin panel, so a saved redirect
    //    takes priority over the default product auto-routing below.
    const res = await fetch(`${SITE_CONFIG.apiUrl}/api/redirects/${slug}/target`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      let targetUrl = data.target_url as string;

      // Accept both absolute URLs (https://atlaspure.shop/lp) and relative
      // paths (/lp) — normalise a relative path to an absolute URL.
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        if (!targetUrl.startsWith("/")) {
          targetUrl = "/" + targetUrl;
        }
        targetUrl = `${baseOrigin}${targetUrl}`;
      }

      return NextResponse.redirect(withParams(targetUrl), { status: 302 });
    }

    // 2. Fallback: if no admin redirect is saved but the slug matches a real
    //    product, send visitors straight to that product page.
    const product = getProductBySlug(slug);
    if (product) {
      return NextResponse.redirect(
        withParams(`${baseOrigin}/products/${slug}`),
        { status: 302 }
      );
    }

    // 3. Unknown slug → send to the homepage (safest for live ad traffic so a
    //    paid click never lands on an error page).
    return NextResponse.redirect(withParams(`${baseOrigin}/`), { status: 302 });
  } catch (error) {
    console.error("Redirect error:", error);
    // On any unexpected failure, never break the ad click — go home.
    return NextResponse.redirect(`${baseOrigin}/`, { status: 302 });
  }
}
