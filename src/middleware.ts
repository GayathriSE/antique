import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  });

  const isLoggedIn = !!token?.sub;
  const role = typeof token?.role === "string" ? token.role : undefined;
  const { nextUrl } = req;

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login?callbackUrl=/admin/dashboard", nextUrl),
      );
    }
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  if (
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/checkout")
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${nextUrl.pathname}`, nextUrl),
      );
    }
  }

  if (isLoggedIn && ["/login", "/register"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
