import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { aggregateByMonth } from "@/lib/billing";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("lead_assignments")
    .select("id, status, created_at, updated_at");

  if (error) {
    console.error("Admin lead stats fetch error:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました。" },
      { status: 500 }
    );
  }

  const stats = aggregateByMonth(data || []);
  return NextResponse.json({ data: stats });
}
