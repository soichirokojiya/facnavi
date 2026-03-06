import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

    const { error } = await supabase.from("mitsumori_requests").insert({
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
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

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
            <p>提携業者より順次ご連絡いたしますので、今しばらくお待ちください。</p>
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

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Mitsumori API error:", e);
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
