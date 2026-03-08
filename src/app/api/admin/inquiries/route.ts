import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("partner_inquiries")
    .select(
      `
      id,
      subject,
      message,
      attachments,
      reply_message,
      replied_at,
      status,
      created_at,
      partner_companies (
        id,
        name,
        login_id,
        email
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin inquiries fetch error:", error);
    return NextResponse.json(
      { error: "取得に失敗しました。" },
      { status: 500 }
    );
  }

  // 添付画像のpublic URLを生成
  const dataWithUrls = (data || []).map((item) => ({
    ...item,
    attachment_urls: (item.attachments || []).map((path: string) => {
      const { data: urlData } = supabase.storage
        .from("partner-inquiries")
        .getPublicUrl(path);
      return urlData.publicUrl;
    }),
  }));

  return NextResponse.json({ data: dataWithUrls });
}

export async function PATCH(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, reply_message } = body;

    if (!id) {
      return NextResponse.json(
        { error: "IDは必須です。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 返信の場合
    if (reply_message) {
      // 問い合わせ情報と業者情報を取得
      const { data: inquiry } = await supabase
        .from("partner_inquiries")
        .select("subject, message, partner_companies (name, email)")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("partner_inquiries")
        .update({
          status: "replied",
          reply_message,
          replied_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: "返信の保存に失敗しました。" },
          { status: 500 }
        );
      }

      // 業者にメール通知
      const partner = inquiry?.partner_companies as unknown as { name: string; email: string | null } | null;
      const partnerEmail = partner?.email;
      const resendApiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

      if (resendApiKey && partnerEmail) {
        const resend = new Resend(resendApiKey);
        try {
          await resend.emails.send({
            from: `ファクナビ <${fromEmail}>`,
            to: partnerEmail,
            subject: `【ファクナビ】お問い合わせへの回答: ${inquiry?.subject || ""}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                  お問い合わせへの回答
                </h2>
                <p>${partner?.name || ""} 様</p>
                <p>お問い合わせいただきありがとうございます。以下の通り回答いたします。</p>

                <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
                  <p style="font-size: 12px; color: #6b7280; margin: 0 0 4px;">お問い合わせ内容:</p>
                  <p style="margin: 0; font-size: 14px;">${inquiry?.message || ""}</p>
                </div>

                <div style="background: #eff6ff; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 4px solid #1e40af;">
                  <p style="font-size: 12px; color: #1e40af; margin: 0 0 4px; font-weight: bold;">回答:</p>
                  <p style="margin: 0; font-size: 14px; white-space: pre-wrap;">${reply_message}</p>
                </div>

                <div style="text-align: center; margin: 20px 0;">
                  <a href="https://facnavi.info/partner/inquiries" style="display: inline-block; background: #1e40af; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">管理画面で確認する</a>
                </div>

                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
                <p style="font-size: 12px; color: #9ca3af;">
                  このメールはファクナビ（https://facnavi.info）から自動送信されています。<br>
                  ご不明な点がございましたら、管理画面のお問い合わせよりご連絡ください。
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error("Failed to send reply notification:", emailError);
        }
      }

      return NextResponse.json({ success: true });
    }

    // ステータス変更のみ
    if (status) {
      const { error } = await supabase
        .from("partner_inquiries")
        .update({ status })
        .eq("id", id);

      if (error) {
        return NextResponse.json(
          { error: "更新に失敗しました。" },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "更新内容がありません。" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
