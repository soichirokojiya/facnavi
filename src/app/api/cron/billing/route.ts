import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { aggregateForMonth } from "@/lib/billing";
import {
  DEFAULT_BILLING_SUBJECT,
  DEFAULT_BILLING_BODY,
  renderBillingTemplate,
} from "@/lib/billing-template";
import { generateInvoicePdf } from "@/lib/billing-pdf";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

interface BillingResult {
  partnerId: string;
  name: string;
  success: boolean;
  invoiceNumber?: string;
  error?: string;
}

async function processBilling(
  serviceKey: string,
  resendApiKey: string,
  targetKey: string,
  overrideEmail?: string
) {
  const supabase = createClient(supabaseUrl, serviceKey);
  const resend = new Resend(resendApiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";
  const adminEmail = process.env.ADMIN_EMAIL || fromEmail;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";

  const [targetYear, targetMonthStr] = targetKey.split("-");
  const targetMonth = parseInt(targetMonthStr, 10);
  const lastDay = new Date(parseInt(targetYear), targetMonth, 0).getDate();

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

  // 請求元情報
  const billingCompanyName = settings.billing_company_name || "Common Future & Co.株式会社";
  const billingCompanyAddress =
    settings.billing_company_address || "〒810-0001 福岡県福岡市中央区天神4-6-28 いちご天神ノースビル7階";
  const billingInvoiceNumber = settings.billing_invoice_number || "T9011001105902";
  const bankInfo =
    settings.billing_bank_info || "楽天銀行 第二営業支店（252）\n普通 7671151\nCommon Future & Co.株式会社";
  const billingNotes =
    settings.billing_notes || "振込手数料はお客様ご負担にてお願いいたします";

  // アクティブなパートナーを全件取得
  const { data: partners, error: partnersError } = await supabase
    .from("partner_companies")
    .select("id, name, email, fee_per_lead")
    .eq("is_active", true);

  if (partnersError) {
    console.error("Partners fetch error:", partnersError);
    throw new Error("Failed to fetch partners");
  }

  // 既存の billing_logs から連番を算出
  const { count: existingLogsCount } = await supabase
    .from("billing_logs")
    .select("id", { count: "exact", head: true })
    .like("invoice_number", `${targetYear}-%`);

  let seqCounter = (existingLogsCount || 0) + 1;

  // 発行日
  const now = new Date();
  const issueDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;

  // 支払期限（翌月末日）
  const paymentDeadlineDate = new Date(parseInt(targetYear), targetMonth + 1, 0);
  const paymentDeadline = `${paymentDeadlineDate.getFullYear()}年${paymentDeadlineDate.getMonth() + 1}月${paymentDeadlineDate.getDate()}日`;

  const results: BillingResult[] = [];

  for (let pi = 0; pi < (partners || []).length; pi++) {
    const partner = partners![pi];
    const sendTo = overrideEmail || partner.email;

    if (!sendTo) {
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
    const taxAmount = Math.floor((amountExclTax * taxRate) / 100);
    const amountInclTax = amountExclTax + taxAmount;

    // 請求書番号生成
    const partnerNum = pi + 1;
    const invoiceNumber = `${targetYear}-${String(partnerNum).padStart(3, "0")}-${String(seqCounter).padStart(3, "0")}`;
    seqCounter++;

    // メールテンプレート変数
    const vars = {
      YYYY: targetYear,
      MM: targetMonthStr,
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

    // PDF生成
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = generateInvoicePdf({
        invoiceNumber,
        issueDate,
        companyName: partner.name,
        billingCompanyName,
        billingCompanyAddress,
        billingInvoiceNumber,
        bankInfo,
        notes: billingNotes,
        targetYear,
        targetMonth: targetMonthStr,
        lastDay: String(lastDay),
        confirmedCount: stats.confirmedCount,
        feePerLead,
        subtotal: amountExclTax,
        taxRate,
        taxAmount,
        totalAmount: amountInclTax,
        siteUrl,
        paymentDeadline,
      });
    } catch (err) {
      console.error(`PDF generation error for ${partner.name}:`, err);
      results.push({ partnerId: partner.id, name: partner.name, success: false, error: "PDF generation failed" });
      continue;
    }

    const pdfFilename = `ファクナビ_請求書_${targetYear}年${targetMonthStr}月_${partner.name}.pdf`;

    try {
      await resend.emails.send({
        from: `ファクナビ <${fromEmail}>`,
        to: sendTo,
        subject: overrideEmail ? `【テスト】${subject}` : subject,
        text: body,
        attachments: [
          {
            filename: pdfFilename,
            content: pdfBuffer,
          },
        ],
      });

      // billing_logs に記録（テスト送信時はログしない）
      if (!overrideEmail) {
        await supabase.from("billing_logs").upsert(
          {
            invoice_number: invoiceNumber,
            partner_company_id: partner.id,
            target_month: targetKey,
            confirmed_count: stats.confirmedCount,
            amount_excl_tax: amountExclTax,
            tax_amount: taxAmount,
            amount_incl_tax: amountInclTax,
            email_sent: true,
            sent_at: new Date().toISOString(),
          },
          { onConflict: "invoice_number" }
        );
      }

      results.push({
        partnerId: partner.id,
        name: partner.name,
        success: true,
        invoiceNumber,
      });
    } catch (err) {
      console.error(`Email send error for ${partner.name}:`, err);

      // 送信失敗もログ記録
      if (!overrideEmail) {
        await supabase.from("billing_logs").upsert(
          {
            invoice_number: invoiceNumber,
            partner_company_id: partner.id,
            target_month: targetKey,
            confirmed_count: stats.confirmedCount,
            amount_excl_tax: amountExclTax,
            tax_amount: taxAmount,
            amount_incl_tax: amountInclTax,
            email_sent: false,
            error_message: String(err),
          },
          { onConflict: "invoice_number" }
        );
      }

      results.push({
        partnerId: partner.id,
        name: partner.name,
        success: false,
        invoiceNumber,
        error: "Email send failed",
      });
    }
  }

  return results;
}

// Cron自動実行（毎月11日）
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

  // 前月を算出
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const targetYear = targetDate.getFullYear();
  const targetMonth = targetDate.getMonth() + 1;
  const targetKey = `${targetYear}-${String(targetMonth).padStart(2, "0")}`;

  try {
    const results = await processBilling(serviceKey, resendApiKey, targetKey);
    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`Billing cron completed: ${sent} sent, ${failed} failed for ${targetKey}`);

    return NextResponse.json({ targetMonth: targetKey, sent, failed, details: results });
  } catch (err) {
    console.error("Billing cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// 管理画面からの手動再送（テスト送信対応）
export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Missing service key" }, { status: 500 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json({ error: "Missing Resend API key" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { month, testEmail } = body as { month: string; testEmail?: string };

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Invalid month format (YYYY-MM)" }, { status: 400 });
    }

    const results = await processBilling(serviceKey, resendApiKey, month, testEmail || undefined);
    const sent = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      targetMonth: month,
      testEmail: testEmail || null,
      sent,
      failed,
      details: results,
    });
  } catch (err) {
    console.error("Manual billing error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
