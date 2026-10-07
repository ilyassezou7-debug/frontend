import { NextRequest, NextResponse } from "next/server";

// The redirect admin has no password (owner's choice): the old login page just forwards to the admin.
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/redirectkiller/login") {
    return NextResponse.redirect(new URL("/redirectkiller", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/redirectkiller/:path*", "/redirectkiller"],
};
