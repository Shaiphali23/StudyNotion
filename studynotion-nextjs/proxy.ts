import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/login",
  "/signup",
  "/verify-email",
  "/forgot-password",
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) {
    return true;
  }
  return (
    pathname.startsWith("/update-password/") ||
    pathname.startsWith("/catalog/") ||
    pathname.startsWith("/courses/") ||
    pathname.startsWith("/api/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/view-course");

  if (isProtectedPath) {
    const legacyToken = request.cookies.get("token")?.value;
    // Accept the legacy custom-JWT cookie only if it looks like a JWT
    // (3 dot-separated segments). Real verification happens in Node via
    // lib/auth verifyToken + API requireAuth/requireRole; the edge runtime
    // has no jsonwebtoken access. Anything else falls through to NextAuth.
    if (legacyToken && legacyToken.split(".").length === 3) {
      return NextResponse.next();
    }
    try {
      const sessionToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
      });
      if (sessionToken) return NextResponse.next();
    } catch {
      // fall through to redirect
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets).*)"],
};
