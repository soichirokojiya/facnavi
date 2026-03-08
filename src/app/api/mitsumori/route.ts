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
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY is not set, skipping spam check");
    return { isSpam: false };
  }

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

以下の基準で1つでも該当すればスパムと判定してください:
- 会社名や担当者名が1〜2文字の数字・記号のみ、意味不明な文字列、"aaa"、"test"、"テスト"等
- 会社名が実在しなさそうな明らかに適当な名前
- 電話番号が全部同じ数字（000000000等）、桁数が9桁未満、または明らかに偽
- 相談内容が1〜2文字だけ、数字だけ、または広告・宣伝・無関係な内容
- 全体的に入力が適当・テスト送信と思われるパターン

実在する会社名・人名で、まともな電話番号・メールの場合のみ通してください。

JSON形式のみで回答（説明不要）: {"isSpam": true/false, "reason": "理由"}`,
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
    console.error("Spam check error (API key present but call failed):", err);
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
      prefecture,
      address,
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
      !prefecture ||
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

    const digitsOnly = phone.replace(/[-\s]/g, "");
    if (!/^[0-9]+$/.test(digitsOnly) || digitsOnly.length < 10 || digitsOnly.length > 11) {
      return NextResponse.json(
        { error: "正しい電話番号を入力してください（10〜11桁）。" },
        { status: 400 }
      );
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

    // 設定値を取得
    const { data: settingsRows } = await supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["spam_check_enabled", "duplicate_check_enabled", "duplicate_check_months"]);

    const settings: Record<string, string> = {};
    for (const row of settingsRows || []) {
      settings[row.key] = row.value;
    }
    const spamCheckEnabled = settings.spam_check_enabled !== "false";
    const duplicateCheckEnabled = settings.duplicate_check_enabled === "true";
    const duplicateCheckMonths = parseInt(settings.duplicate_check_months || "6", 10) || 6;

    // AIスパム判定
    if (spamCheckEnabled) {
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
    }

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
        prefecture,
        address: address || null,
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
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">都道府県</td>
                <td style="padding: 8px;">${prefecture}</td>
              </tr>
              ${address ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">住所</td>
                <td style="padding: 8px;">${address}</td>
              </tr>
              ` : ""}
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
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">都道府県</td>
                  <td style="padding: 8px;">${prefecture}</td>
                </tr>
                ${address ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">住所</td>
                  <td style="padding: 8px;">${address}</td>
                </tr>
                ` : ""}
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
          // 業者ごとに重複チェックし、割り当て＆メール送信
          for (const partner of matchedPartners) {
            // 重複チェック（業者ごと）
            if (duplicateCheckEnabled) {
              const cutoffDate = new Date();
              cutoffDate.setMonth(cutoffDate.getMonth() - duplicateCheckMonths);

              // 対象期間内の同一メール/電話のリクエストを検索
              const { data: matchingRequests } = await supabase
                .from("mitsumori_requests")
                .select("id")
                .gte("created_at", cutoffDate.toISOString())
                .or(`email.eq.${email},phone.eq.${phone}`);

              let isDuplicate = false;
              if (matchingRequests && matchingRequests.length > 0) {
                const requestIds = matchingRequests.map((r) => r.id);
                const { data: existingAssignments } = await supabase
                  .from("lead_assignments")
                  .select("id")
                  .eq("partner_company_id", partner.id)
                  .neq("status", "removed")
                  .in("mitsumori_request_id", requestIds)
                  .limit(1);
                isDuplicate = !!(existingAssignments && existingAssignments.length > 0);
              }

              if (isDuplicate) {
                console.log(`Duplicate lead skipped for partner ${partner.name} (${partner.id})`);
                await supabase.from("lead_assignments").insert({
                  mitsumori_request_id: insertData.id,
                  partner_company_id: partner.id,
                  status: "duplicate",
                });
                continue;
              }
            }

            // リード割り当て
            await supabase.from("lead_assignments").insert({
              mitsumori_request_id: insertData.id,
              partner_company_id: partner.id,
              status: "active",
            });

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
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280;">都道府県</td>
                        <td style="padding: 8px;">${prefecture}</td>
                      </tr>
                      ${address ? `
                      <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px; color: #6b7280;">住所</td>
                        <td style="padding: 8px;">${address}</td>
                      </tr>
                      ` : ""}
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
