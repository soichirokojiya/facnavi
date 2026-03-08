import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

async function checkSpam(data: {
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  industry: string;
  business_type: string;
  message?: string;
}): Promise<{ isSpam: boolean; reason?: string }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { isSpam: false };

  try {
    const anthropic = new Anthropic({ apiKey });
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `以下はファクタリングの一括見積もりフォームへの送信内容です。スパム・いたずら・テスト送信かどうか判定してください。

会社名: ${data.company_name}
担当者名: ${data.contact_name}
電話番号: ${data.phone}
メール: ${data.email}
業種: ${data.industry}
事業形態: ${data.business_type}
${data.message ? `相談内容: ${data.message}` : ""}

以下の基準でスパム判定してください:
- 会社名や担当者名が明らかに意味不明な文字列（ランダム文字、"aaa"、"test"等）
- 電話番号が明らかに偽（"000-0000-0000"、桁数不足等）
- メールが明らかに偽（テスト用ドメイン等）
- 相談内容に広告・宣伝・無関係な内容

正当なビジネスの問い合わせは通してください。少しでも正当性がある場合はスパムではないと判断してください。

JSON形式で回答: {"isSpam": true/false, "reason": "理由"}`,
        },
      ],
    });

    const text = msg.content[0].type === "text" ? msg.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return { isSpam: false };
  } catch (err) {
    console.error("Spam check error:", err);
    return { isSpam: false }; // エラー時は通す
  }
}

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
      invoice_amount,
      purchase_amount,
      deposit_timing,
      business_type,
      industry,
      company_name,
      contact_name,
      phone,
      email,
      message,
      selected_companies,
    } = body;

    // バリデーション
    if (
      !invoice_amount ||
      !purchase_amount ||
      !deposit_timing ||
      !business_type ||
      !industry ||
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

    // AIスパム判定
    const spamResult = await checkSpam({
      company_name, contact_name, phone, email, industry, business_type, message,
    });
    if (spamResult.isSpam) {
      console.warn("Spam detected:", spamResult.reason, { company_name, contact_name, email });
      return NextResponse.json(
        { error: "送信内容を確認できませんでした。内容をご確認の上、再度お試しください。" },
        { status: 400 }
      );
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

    const upload_token = crypto.randomBytes(32).toString("hex");

    const { data: insertData, error } = await supabase
      .from("mitsumori_requests")
      .insert({
        invoice_amount,
        purchase_amount,
        deposit_timing,
        business_type,
        industry,
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
                <td style="padding: 8px; color: #6b7280; width: 140px;">請求書の額面</td>
                <td style="padding: 8px;">${Number(invoice_amount).toLocaleString()}円</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">買取希望金額</td>
                <td style="padding: 8px;">${Number(purchase_amount).toLocaleString()}円</td>
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
                  <td style="padding: 8px; color: #6b7280;">請求書の額面</td>
                  <td style="padding: 8px;">${Number(invoice_amount).toLocaleString()}円</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">買取希望金額</td>
                  <td style="padding: 8px;">${Number(purchase_amount).toLocaleString()}円</td>
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
                ${message ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">ご相談内容</td>
                  <td style="padding: 8px;">${message}</td>
                </tr>
                ` : ""}
              </table>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${siteUrl}/admin/mitsumori" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">管理画面を開く</a>
              </div>
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

    // リード割り当て & 業者へのメール送信
    try {
      // selected_companiesに対応する業者をcompany_slugで取得
      const { data: partners } = await supabase
        .from("partner_companies")
        .select("id, name, email, company_slug")
        .eq("is_active", true);

      if (partners && partners.length > 0 && selected_companies && selected_companies.length > 0) {
        // 選択された業者のみをマッチ
        const matchedPartners = partners.filter((p) =>
          selected_companies.includes(p.company_slug)
        );

        if (matchedPartners.length > 0) {
          // リード割り当て
          const assignments = matchedPartners.map((p) => ({
            mitsumori_request_id: insertData.id,
            partner_company_id: p.id,
            status: "active",
          }));

          await supabase.from("lead_assignments").insert(assignments);

          // 各業者にメール送信
          for (const partner of matchedPartners) {
            if (!partner.email) continue;
            try {
              await resend.emails.send({
                from: `ファクナビ <${fromEmail}>`,
                to: partner.email,
                subject: `【ファクナビ】新しい見積もり依頼が届きました`,
                html: `
                  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                      新しい見積もり依頼
                    </h2>
                    <p>${partner.name} 様</p>
                    <p>ファクナビ経由で新しい見積もり依頼が届きました。</p>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280; width: 140px;">会社名</td>
                        <td style="padding: 8px; font-weight: bold;">${company_name}</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280;">担当者名</td>
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
                        <td style="padding: 8px; color: #6b7280;">請求書の額面</td>
                        <td style="padding: 8px;">${Number(invoice_amount).toLocaleString()}円</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280;">買取希望金額</td>
                        <td style="padding: 8px;">${Number(purchase_amount).toLocaleString()}円</td>
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
                      ${message ? `
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280;">ご相談内容</td>
                        <td style="padding: 8px;">${message}</td>
                      </tr>
                      ` : ""}
                    </table>
                    <div style="text-align: center; margin: 24px 0;">
                      <a href="${siteUrl}/partner/leads" style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">リード一覧を確認する</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #9ca3af;">
                      このメールはファクナビの一括見積もりシステムから自動送信されています。
                    </p>
                  </div>
                `,
              });
            } catch (partnerEmailError) {
              console.error(`Failed to send email to partner ${partner.name}:`, partnerEmailError);
            }
          }
        }
      }
    } catch (assignError) {
      console.error("Lead assignment error:", assignError);
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
