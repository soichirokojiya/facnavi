import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login はスキップ
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /admin 配下の認証チェック
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");
    if (!session?.value) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // /partner の公開ページはスキップ
  if (
    pathname === "/partner/login" ||
    pathname === "/partner/register" ||
    pathname === "/partner/forgot-password" ||
    pathname === "/partner/reset-password"
  ) {
    return NextResponse.next();
  }

  // /partner 配下の認証チェック
  if (pathname.startsWith("/partner")) {
    const session = request.cookies.get("partner_session");
    if (!session?.value) {
      const loginUrl = new URL("/partner/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partner/:path*"],
};
