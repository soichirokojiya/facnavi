import { NextRequest, NextResponse } from "next/server";

const PARTNER_PUBLIC_PATHS = [
  "/partner/login",
  "/partner/register",
  "/partner/forgot-password",
  "/partner/reset-password",
  "/partner/verify",
];

const ADMIN_PUBLIC_PATHS = ["/admin/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // パートナー認証チェック
  if (pathname.startsWith("/partner")) {
    const isPublic = PARTNER_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    const session = request.cookies.get("partner_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/partner/login", request.url));
    }
  }

  // 管理者認証チェック
  if (pathname.startsWith("/admin")) {
    const isPublic = ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    if (isPublic) return NextResponse.next();

    const session = request.cookies.get("admin_session");
    if (!session?.value) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/partner/:path*", "/admin/:path*"],
};
