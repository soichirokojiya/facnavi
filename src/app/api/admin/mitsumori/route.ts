import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("mitsumori_requests")
    .select("id, created_at, company_name, contact_name, amount_range, deposit_timing, prefecture")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin mitsumori list error:", error);
    return NextResponse.json({ error: "データ取得に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
