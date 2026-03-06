import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || supabaseUrl.includes("xxxxx")) {
      return NextResponse.json(
        { error: "Supabaseの環境変数が設定されていません。管理者にお問い合わせください。" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      amount_range,
      deposit_timing,
      business_type,
      industry,
      prefecture,
      company_name,
      contact_name,
      phone,
      email,
      message,
    } = body;

    // バリデーション
    if (
      !amount_range ||
      !deposit_timing ||
      !business_type ||
      !industry ||
      !prefecture ||
      !company_name ||
      !contact_name ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        { error: "必須項目が入力されていません。" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    if (!/^[0-9\-]+$/.test(phone)) {
      return NextResponse.json(
        { error: "正しい電話番号を入力してください。" },
        { status: 400 }
      );
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

    const upload_token = crypto.randomBytes(32).toString("hex");

    const { data: insertData, error } = await supabase
      .from("mitsumori_requests")
      .insert({
        amount_range,
        deposit_timing,
        business_type,
        industry,
        prefecture,
        company_name,
        contact_name,
        phone,
        email,
        message: message || null,
        upload_token,
      })
      .select("id, upload_token")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";
    const uploadUrl = `${siteUrl}/mitsumori/upload/${insertData.upload_token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

    // 利用者への受付確認メール
    try {
      await resend.emails.send({
        from: `ファクナビ <${fromEmail}>`,
        to: email,
        subject: "【ファクナビ】一括見積もりのお申し込みを受け付けました",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
              一括見積もりのお申し込み受付
            </h2>
            <p>${contact_name} 様</p>
            <p>この度は一括見積もりサービスをご利用いただき、誠にありがとうございます。</p>
            <p>以下の内容でお申し込みを受け付けました。</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280; width: 140px;">請求書金額帯</td>
                <td style="padding: 8px;">${amount_range}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">入金希望時期</td>
                <td style="padding: 8px;">${deposit_timing}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">事業形態</td>
                <td style="padding: 8px;">${business_type}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">業種</td>
                <td style="padding: 8px;">${industry}</td>
              </tr>
            </table>
            <p>提携業者より順次お電話にてご連絡いたしますので、今しばらくお待ちください。</p>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 16px;">📄 審査書類のアップロードをお願いします</h3>
              <p style="margin: 0 0 12px 0;">スムーズな審査のため、以下の書類をアップロードしてください。</p>
              <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                <li>売却予定の請求書</li>
                <li>本人確認書類（運転免許証・マイナンバーカード・保険証のいずれか）</li>
                <li>通帳コピー・入出金明細（直近3ヶ月分）</li>
              </ul>
              <a href="${uploadUrl}" style="display: inline-block; background: #1e40af; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                書類をアップロードする
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              このメールはファクナビ（https://facnavi.info）から自動送信されています。<br>
              心当たりのない場合は、このメールを破棄してください。
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send user confirmation email:", emailError);
    }

    // 管理者への通知メール
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: adminEmail,
          subject: `【ファクナビ】新しい一括見積もり申し込み（${company_name}）`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                新しい一括見積もり申し込み
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280; width: 140px;">会社名</td>
                  <td style="padding: 8px; font-weight: bold;">${company_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">お名前</td>
                  <td style="padding: 8px;">${contact_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">電話番号</td>
                  <td style="padding: 8px;">${phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">メール</td>
                  <td style="padding: 8px;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">請求書金額帯</td>
                  <td style="padding: 8px;">${amount_range}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">入金希望時期</td>
                  <td style="padding: 8px;">${deposit_timing}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">事業形態</td>
                  <td style="padding: 8px;">${business_type}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">業種</td>
                  <td style="padding: 8px;">${industry}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">都道府県</td>
                  <td style="padding: 8px;">${prefecture}</td>
                </tr>
                ${message ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">ご相談内容</td>
                  <td style="padding: 8px;">${message}</td>
                </tr>
                ` : ""}
              </table>
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                このメールはファクナビの一括見積もりシステムから自動送信されています。
              </p>
            </div>
          `,
        });
      }
    } catch (adminEmailError) {
      console.error("Failed to send admin notification:", adminEmailError);
    }

    // リード自動割り当て
    try {
      const { data: partners } = await supabase
        .from("partner_companies")
        .select("id, supported_prefectures, min_amount, max_amount, supported_industries, sole_proprietor_ok")
        .eq("is_active", true);

      if (partners && partners.length > 0) {
        // 金額帯→数値変換
        const amountRangeMap: Record<string, { min: number; max: number }> = {
          "100万円以下": { min: 0, max: 1000000 },
          "100万円〜500万円": { min: 1000000, max: 5000000 },
          "500万円〜1,000万円": { min: 5000000, max: 10000000 },
          "1,000万円〜3,000万円": { min: 10000000, max: 30000000 },
          "3,000万円以上": { min: 30000000, max: 999999999 },
        };

        const requestAmount = amountRangeMap[amount_range];
        const isSoleProprietor = business_type === "個人事業主・フリーランス";

        const matchedPartners = partners.filter((p) => {
          // 都道府県チェック
          if (
            p.supported_prefectures &&
            p.supported_prefectures.length > 0 &&
            !p.supported_prefectures.includes(prefecture)
          ) {
            return false;
          }

          // 金額チェック
          if (requestAmount) {
            if (requestAmount.max < p.min_amount || requestAmount.min > p.max_amount) {
              return false;
            }
          }

          // 業種チェック
          if (
            p.supported_industries &&
            p.supported_industries.length > 0 &&
            !p.supported_industries.includes(industry)
          ) {
            return false;
          }

          // 個人事業主チェック
          if (isSoleProprietor && !p.sole_proprietor_ok) {
            return false;
          }

          return true;
        });

        if (matchedPartners.length > 0) {
          const assignments = matchedPartners.map((p) => ({
            mitsumori_request_id: insertData.id,
            partner_company_id: p.id,
            status: "active",
          }));

          await supabase.from("lead_assignments").insert(assignments);
        }
      }
    } catch (assignError) {
      console.error("Lead assignment error:", assignError);
      // 割り当てエラーは申し込み自体は成功とする
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Mitsumori API error:", e);
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
