import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { aggregateForMonth } from "@/lib/billing";
import {
  DEFAULT_BILLING_SUBJECT,
  DEFAULT_BILLING_BODY,
  renderBillingTemplate,
} from "@/lib/billing-template";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Missing service key" }, { status: 500 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Missing Resend API key" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const resend = new Resend(resendApiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";
  const adminEmail = process.env.ADMIN_EMAIL || fromEmail;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";

  // 前月を算出
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetKey = `${targetYear}-${String(targetMonth).padStart(2, "0")}`;

  // site_settings を一括取得
  const { data: settingsRows } = await supabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, string> = {};
  for (const row of settingsRows || []) {
    settings[row.key] = row.value;
  }

  const taxRate = parseInt(settings.tax_rate || "10", 10);
  const subjectTemplate = settings.billing_email_subject || DEFAULT_BILLING_SUBJECT;
  const bodyTemplate = settings.billing_email_body || DEFAULT_BILLING_BODY;

  // アクティブなパートナーを全件取得
  const { data: partners, error: partnersError } = await supabase
    .from("partner_companies")
    .select("id, name, email, fee_per_lead")
    .eq("is_active", true);

  if (partnersError) {
    console.error("Partners fetch error:", partnersError);
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 });
  }

  const results: { partnerId: string; name: string; success: boolean; error?: string }[] = [];

  for (const partner of partners || []) {
    // メールアドレスがないパートナーはスキップ
    if (!partner.email) {
      results.push({ partnerId: partner.id, name: partner.name, success: false, error: "No email" });
      continue;
    }

    // パートナーのリードを取得
    const { data: leads, error: leadsError } = await supabase
      .from("lead_assignments")
      .select("id, status, created_at, updated_at")
      .eq("partner_company_id", partner.id);

    if (leadsError) {
      console.error(`Leads fetch error for ${partner.name}:`, leadsError);
      results.push({ partnerId: partner.id, name: partner.name, success: false, error: "Leads fetch failed" });
      continue;
    }

    const stats = aggregateForMonth(leads || [], targetKey);
    const feePerLead = partner.fee_per_lead || 0;
    const amountExclTax = stats.confirmedCount * feePerLead;
    const taxAmount = Math.floor(amountExclTax * taxRate / 100);
    const amountInclTax = amountExclTax + taxAmount;

    const lastDay = new Date(targetYear, targetMonth, 0).getDate();

    const vars = {
      YYYY: String(targetYear),
      MM: String(targetMonth).padStart(2, "0"),
      lastDay: String(lastDay),
      会社名: partner.name,
      total: String(stats.total),
      removed: String(stats.removed),
      billable: String(stats.confirmedCount),
      fee_per_lead: feePerLead.toLocaleString(),
      subtotal: amountExclTax.toLocaleString(),
      tax_rate: String(taxRate),
      tax_amount: taxAmount.toLocaleString(),
      amount: amountInclTax.toLocaleString(),
      siteUrl,
      adminEmail,
    };

    const subject = renderBillingTemplate(subjectTemplate, vars);
    const body = renderBillingTemplate(bodyTemplate, vars);

    try {
      await resend.emails.send({
        from: `ファクナビ <${fromEmail}>`,
        to: partner.email,
        subject,
        text: body,
      });
      results.push({ partnerId: partner.id, name: partner.name, success: true });
    } catch (err) {
      console.error(`Email send error for ${partner.name}:`, err);
      results.push({ partnerId: partner.id, name: partner.name, success: false, error: "Email send failed" });
    }
  }

  const sent = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`Billing cron completed: ${sent} sent, ${failed} failed for ${targetKey}`);

  return NextResponse.json({
    targetMonth: targetKey,
    sent,
    failed,
    details: results,
  });
}
