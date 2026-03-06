import { NextResponse } from "next/server";
import { getAllCompanies } from "@/lib/companies";

export async function GET() {
  const companies = getAllCompanies();
  const list = companies.map((c) => ({ slug: c.slug, name: c.name }));

  return NextResponse.json({ data: list });
}
