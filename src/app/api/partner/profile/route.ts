import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getPartnerCompanyId(request: NextRequest): string | null {
  const session = request.cookies.get("partner_session")?.value;
  if (!session) return null;
  const parts = session.split(":");
  return parts.length >= 2 ? parts[1] : null;
}

export async function GET(request: NextRequest) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("partner_companies")
    .select("id, name")
    .eq("id", partnerId)
    .single();

  if (error) {
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ name: data.name });
}
