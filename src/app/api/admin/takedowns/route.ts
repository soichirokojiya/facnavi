import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    .from("takedown_requests")
    .select(
      `
      id,
      reason,
      detail,
      status,
      created_at,
      partner_companies!fk_takedown_partner_company (
        id,
        name
      ),
      lead_assignments!fk_takedown_lead_assignment (
        id,
        status,
        mitsumori_requests (
          id,
          company_name,
          contact_name,
          purchase_amount,
          prefecture
        )
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Takedown requests fetch error:", JSON.stringify(error));
    return NextResponse.json(
      { error: "取得に失敗しました。" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "無効なリクエストです。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 取り下げ依頼を取得
    const { data: takedown, error: fetchError } = await supabase
      .from("takedown_requests")
      .select("id, lead_assignment_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !takedown) {
      return NextResponse.json(
        { error: "取り下げ依頼が見つかりません。" },
        { status: 404 }
      );
    }

    if (takedown.status !== "pending") {
      return NextResponse.json(
        { error: "この依頼は既に処理済みです。" },
        { status: 400 }
      );
    }

    // 取り下げ依頼のステータスを更新
    const { error: updateError } = await supabase
      .from("takedown_requests")
      .update({ status })
      .eq("id", id);

    if (updateError) {
      return NextResponse.json(
        { error: "更新に失敗しました。" },
        { status: 500 }
      );
    }

    // 承認の場合、リード割り当てのステータスも更新
    if (status === "approved") {
      await supabase
        .from("lead_assignments")
        .update({ status: "removed" })
        .eq("id", takedown.lead_assignment_id);
    } else {
      // 却下の場合、リード割り当てをactiveに戻す
      await supabase
        .from("lead_assignments")
        .update({ status: "active" })
        .eq("id", takedown.lead_assignment_id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
