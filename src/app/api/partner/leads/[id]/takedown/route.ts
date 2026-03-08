import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const VALID_REASONS = [
  "虚偽情報（氏名・電話番号・メールアドレス）",
  "連絡不通（番号不存在・別会社・該当社員なし・FAX）",
  "メール不達",
  "競合企業からの依頼",
  "重複（ファクナビ内での同一ユーザー）",
  "対象外ユーザー（個人・給与ファクタリング等）",
];

function getPartnerCompanyId(request: NextRequest): string | null {
  const session = request.cookies.get("partner_session")?.value;
  if (!session) return null;
  const parts = session.split(":");
  return parts.length >= 2 ? parts[1] : null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const { id } = await params;
  const { reason, detail } = await request.json();

  if (!reason || !VALID_REASONS.includes(reason)) {
    return NextResponse.json(
      { error: "有効な理由を選択してください。" },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 割り当てが存在し、自社のものであるか確認
  const { data: assignment, error: assignError } = await supabase
    .from("lead_assignments")
    .select("id, status")
    .eq("id", id)
    .eq("partner_company_id", partnerId)
    .single();

  if (assignError || !assignment) {
    return NextResponse.json(
      { error: "リード割り当てが見つかりません。" },
      { status: 404 }
    );
  }

  if (assignment.status !== "active") {
    return NextResponse.json(
      { error: "このリードは既に取り下げ済みまたは依頼中です。" },
      { status: 400 }
    );
  }

  // 取り下げ依頼を作成
  const { error: insertError } = await supabase
    .from("takedown_requests")
    .insert({
      lead_assignment_id: id,
      partner_company_id: partnerId,
      reason,
      detail: detail || null,
      status: "pending",
    });

  if (insertError) {
    console.error("Takedown request insert error:", insertError);
    return NextResponse.json(
      { error: "取り下げ依頼の送信に失敗しました。" },
      { status: 500 }
    );
  }

  // リード割り当てのステータスを更新
  await supabase
    .from("lead_assignments")
    .update({ status: "takedown_requested" })
    .eq("id", id);

  return NextResponse.json({ success: true });
}
