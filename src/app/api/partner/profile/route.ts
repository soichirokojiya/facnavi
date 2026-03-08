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
    .select("id, name, login_id, email, supported_prefectures, min_amount, max_amount, supported_industries, supported_deposit_timing, fee_per_lead, sole_proprietor_ok, is_active, company_slug")
    .eq("id", partnerId)
    .single();

  if (error) {
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ name: data.name, data });
}

export async function PATCH(request: NextRequest) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const body = await request.json();

  // パートナーが編集できるフィールドのみ（fee_per_lead, is_active, login_id は除外）
  const updateData: Record<string, unknown> = {};

  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.supported_prefectures !== undefined) updateData.supported_prefectures = body.supported_prefectures;
  if (body.min_amount !== undefined) updateData.min_amount = body.min_amount;
  if (body.max_amount !== undefined) updateData.max_amount = body.max_amount;
  if (body.supported_industries !== undefined) updateData.supported_industries = body.supported_industries;
  if (body.supported_deposit_timing !== undefined) updateData.supported_deposit_timing = body.supported_deposit_timing;
  if (body.sole_proprietor_ok !== undefined) updateData.sole_proprietor_ok = body.sole_proprietor_ok;
  if (body.is_active !== undefined) updateData.is_active = body.is_active;

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "更新するデータがありません。" }, { status: 400 });
  }

  const { error } = await supabase
    .from("partner_companies")
    .update(updateData)
    .eq("id", partnerId);

  if (error) {
    console.error("Partner profile update error:", error);
    return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
