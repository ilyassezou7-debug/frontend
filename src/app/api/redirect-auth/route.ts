import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "redirect_admin_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function makeToken(password: string): string {
  return btoa(`${password}:atlas-redirect-admin`);
}

// POST /api/redirect-auth  — validate password, set cookie
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { password } = body as { password?: string };

  const expected = process.env.REDIRECT_ADMIN_PASSWORD ?? "secret_redirect_pass";

  if (!password || password !== expected) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, makeToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

// DELETE /api/redirect-auth  — clear cookie (logout)
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
