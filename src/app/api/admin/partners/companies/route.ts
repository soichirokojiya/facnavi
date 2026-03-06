import { NextRequest, NextResponse } from "next/server";
import { getAllCompanies } from "@/lib/companies";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const companies = getAllCompanies();
  const list = companies.map((c) => ({ slug: c.slug, name: c.name }));

  return NextResponse.json({ data: list });
}
