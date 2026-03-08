import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { inquiry_type, company_name, name, email, phone, message } = body;

    // バリデーション
    if (!inquiry_type || !name || !email || !message) {
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

    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set. Skipping email send.");
      return NextResponse.json({ success: true });
    }

    const resend = new Resend(resendApiKey);

    // 管理者への通知メール
    if (adminEmail) {
      try {
        await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: adminEmail,
          subject: `【ファクナビ】お問い合わせ（${inquiry_type}）`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                新しいお問い合わせ
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280; width: 140px;">種別</td>
                  <td style="padding: 8px; font-weight: bold;">${inquiry_type}</td>
                </tr>
                ${company_name ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">会社名</td>
                  <td style="padding: 8px;">${company_name}</td>
                </tr>
                ` : ""}
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">お名前</td>
                  <td style="padding: 8px;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">メール</td>
                  <td style="padding: 8px;">${email}</td>
                </tr>
                ${phone ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">電話番号</td>
                  <td style="padding: 8px;">${phone}</td>
                </tr>
                ` : ""}
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">内容</td>
                  <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
                </tr>
              </table>
              <div style="text-align: center; margin: 20px 0;">
                <a href="https://facnavi.info/admin" style="display: inline-block; background: #1e40af; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">管理画面を開く</a>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }
    }

    // 送信者への自動返信
    try {
      await resend.emails.send({
        from: `ファクナビ <${fromEmail}>`,
        to: email,
        subject: "【ファクナビ】お問い合わせを受け付けました",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
              お問い合わせ受付のお知らせ
            </h2>
            <p>${name} 様</p>
            <p>この度はお問い合わせいただき、誠にありがとうございます。</p>
            <p>以下の内容でお問い合わせを受け付けました。通常2営業日以内にご返信いたします。</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f9fafb; border-radius: 8px;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280; width: 140px;">種別</td>
                <td style="padding: 8px;">${inquiry_type}</td>
              </tr>
              <tr>
                <td style="padding: 8px; color: #6b7280;">内容</td>
                <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">
              このメールはファクナビ（https://facnavi.info）から自動送信されています。<br>
              心当たりのない場合は、このメールを破棄してください。
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send auto-reply:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Contact API error:", e);
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
