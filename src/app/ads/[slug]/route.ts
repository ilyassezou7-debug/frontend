import { NextRequest, NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const incomingParams = request.nextUrl.searchParams;

  try {
    const res = await fetch(`${SITE_CONFIG.apiUrl}/api/redirects/${slug}/target`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      let targetUrl = data.target_url as string;

      // Make relative paths absolute
      if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
        if (!targetUrl.startsWith("/")) {
          targetUrl = "/" + targetUrl;
        }
        targetUrl = `${request.nextUrl.origin}${targetUrl}`;
      }

      // Merge incoming query params onto the target URL
      const url = new URL(targetUrl);
      incomingParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });

      return NextResponse.redirect(url.toString(), { status: 302 });
    }

    // Slug exists in the path but not in DB → clean 404
    return new NextResponse("Redirect not found", { status: 404 });
  } catch (error) {
    console.error("Redirect error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
