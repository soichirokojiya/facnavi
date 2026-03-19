import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect vercel.app domain to canonical domain for SEO
  if (host.includes("vercel.app")) {
    const url = new URL(request.url);
    url.host = "facnavi.info";
    url.port = "";
    return NextResponse.redirect(url.toString(), 301);
  }

  return NextResponse.next();
}
