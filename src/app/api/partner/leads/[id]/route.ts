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

  const { data, error } = await supabase
    .from("lead_assignments")
    .select(
      `
      id,
      status,
      created_at,
      mitsumori_requests (
        id,
        company_name,
        contact_name,
        phone,
        email,
        amount_range,
        deposit_timing,
        prefecture,
        industry,
        business_type,
        message,
        created_at
      ),
      takedown_requests (
        id,
        reason,
        detail,
        status,
        created_at
      )
    `
    )
    .eq("id", id)
    .eq("partner_company_id", partnerId)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "リードが見つかりません。" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}
