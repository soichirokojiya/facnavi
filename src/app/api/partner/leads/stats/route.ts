import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { aggregateByMonth } from "@/lib/billing";

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

  const [leadsResult, partnerResult, taxResult] = await Promise.all([
    supabase
      .from("lead_assignments")
      .select("id, status, created_at, updated_at")
      .eq("partner_company_id", partnerId),
    supabase
      .from("partner_companies")
      .select("fee_per_lead")
      .eq("id", partnerId)
      .single(),
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "tax_rate")
      .single(),
  ]);

  if (leadsResult.error) {
    console.error("Lead stats fetch error:", leadsResult.error);
    return NextResponse.json(
      { error: "データの取得に失敗しました。" },
      { status: 500 }
    );
  }

  const feePerLead = partnerResult.data?.fee_per_lead || 0;
  const taxRate = taxResult.data ? parseInt(taxResult.data.value, 10) : 10;
  const stats = aggregateByMonth(leadsResult.data || []);
  return NextResponse.json({ data: stats, feePerLead, taxRate });
}
