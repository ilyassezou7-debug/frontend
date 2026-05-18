import { NextRequest, NextResponse } from "next/server";

function expectedToken(): string {
  const password = process.env.REDIRECT_ADMIN_PASSWORD ?? "123";
  return btoa(`${password}:atlas-redirect-admin`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page and the auth API through unconditionally
  if (
    pathname === "/redirectkiller/login" ||
    pathname.startsWith("/api/redirect-auth")
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/redirectkiller")) {
    const cookie = request.cookies.get("redirect_admin_auth");
    if (!cookie || cookie.value !== expectedToken()) {
      return NextResponse.redirect(new URL("/redirectkiller/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/redirectkiller/:path*", "/redirectkiller"],
};
