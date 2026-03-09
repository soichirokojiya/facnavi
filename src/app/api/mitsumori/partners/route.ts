import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import companiesData from "@/app/shindan/companiesData";

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("partner_companies")
      .select("name, company_slug, supported_prefectures, min_amount, max_amount, supported_industries, supported_deposit_timing, sole_proprietor_ok")
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json({ partners: [] });
    }

    const { searchParams } = request.nextUrl;
    const prefecture = searchParams.get("prefecture");
    const amount = Number(searchParams.get("amount") || "0");
    const industry = searchParams.get("industry");
    const businessType = searchParams.get("business_type");
    const depositTiming = searchParams.get("deposit_timing");

    const filtered = (data || []).filter((p) => {
      // 都道府県チェック（空配列＝全国対応）
      if (prefecture && p.supported_prefectures?.length > 0) {
        if (!p.supported_prefectures.includes(prefecture)) return false;
      }

      // 金額チェック
      if (amount > 0) {
        if (p.min_amount && amount < p.min_amount) return false;
        if (p.max_amount && amount > p.max_amount) return false;
      }

      // 業種チェック（空配列＝全業種対応）
      if (industry && p.supported_industries?.length > 0) {
        if (!p.supported_industries.includes(industry)) return false;
      }

      // 入金時期チェック（空配列＝全て対応）
      if (depositTiming && p.supported_deposit_timing?.length > 0) {
        if (!p.supported_deposit_timing.includes(depositTiming)) return false;
      }

      // 個人事業主チェック
      if (businessType === "個人事業主" && !p.sole_proprietor_ok) return false;

      return true;
    });

    const partners = filtered.map((p) => {
      const companyInfo = companiesData.find((c) => c.slug === p.company_slug);
      return {
        id: p.company_slug || p.name,
        name: companyInfo?.brandName || p.name,
        slug: p.company_slug,
      };
    });

    return NextResponse.json({ partners });
  } catch {
    return NextResponse.json({ partners: [] });
  }
}
