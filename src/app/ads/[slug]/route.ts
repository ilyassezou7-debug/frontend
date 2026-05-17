import { NextRequest, NextResponse } from "next/server";
import { SITE_CONFIG } from "@/config/site";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const searchParams = request.nextUrl.searchParams.toString();
  
  try {
    const res = await fetch(`${SITE_CONFIG.apiUrl}/api/redirects/${slug}/target`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (res.ok) {
      const data = await res.json();
      let targetUrl = data.target_url;
      
      // If targetUrl is a relative path, make it absolute based on current origin
      if (targetUrl.startsWith('/')) {
        targetUrl = new URL(targetUrl, request.nextUrl.origin).toString();
      }
      
      // Append query parameters if any
      if (searchParams) {
        const url = new URL(targetUrl);
        const targetParams = new URLSearchParams(url.search);
        
        // Merge params
        const incomingParams = new URLSearchParams(searchParams);
        incomingParams.forEach((value, key) => {
          targetParams.set(key, value);
        });
        
        url.search = targetParams.toString();
        targetUrl = url.toString();
      }
      
      return NextResponse.redirect(targetUrl, 302);
    }
  } catch (error) {
    console.error("Redirect error:", error);
  }
  
  // Fallback if redirect not found or error
  return NextResponse.redirect(new URL('/', request.nextUrl.origin), 302);
}
