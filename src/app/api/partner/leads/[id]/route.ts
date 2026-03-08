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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // まず基本情報を取得
  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      `
      id,
      status,
      viewed_at,
      created_at,
      mitsumori_requests (
        id,
        company_name,
        contact_name,
        phone,
        email,
        invoice_amount,
        purchase_amount,
        deposit_timing,
        industry,
        business_type,
        message,
        created_at
      )
    `
    )
    .eq("id", id)
    .eq("partner_company_id", partnerId)
    .single();

  if (error || !data) {
    console.error("Lead detail fetch error:", JSON.stringify(error), "id:", id, "partnerId:", partnerId);
    return NextResponse.json(
      { error: "リードが見つかりません。" },
      { status: 404 }
    );
  }

  // 取り下げ依頼を別途取得
  const { data: takedowns } = await supabase
    .from("takedown_requests")
    .select("id, reason, detail, status, created_at")
    .eq("lead_assignment_id", id)
    .order("created_at", { ascending: false });

  const result = { ...data, takedown_requests: takedowns || [] };

  // 未読→既読にする
  if (!data.viewed_at) {
    await supabase
      .from("lead_assignments")
      .update({ viewed_at: new Date().toISOString() })
      .eq("id", id);
  }

  return NextResponse.json({ data: result });
}
