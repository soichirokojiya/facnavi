import { NextRequest, NextResponse } from "next/server";
import { getCompanyBySlug } from "@/lib/companies";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);

  if (!company || !company.affiliateUrl) {
    return NextResponse.redirect(new URL("/", _request.url));
  }

  return NextResponse.redirect(company.affiliateUrl, 302);
}
