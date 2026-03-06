import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: partner } = await supabase
      .from("partner_companies")
      .select("id")
      .eq("email", email)
      .single();

    // メールが存在しなくても同じレスポンスを返す（情報漏洩防止）
    if (!partner) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1時間

    const { error } = await supabase
      .from("partner_companies")
      .update({
        password_reset_token: token,
        password_reset_expires: expires,
      })
      .eq("id", partner.id);

    if (error) {
      console.error("Token save error:", error);
      return NextResponse.json(
        { error: "処理に失敗しました。" },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";
    const resetUrl = `${siteUrl}/partner/reset-password?token=${token}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

    await resend.emails.send({
      from: `ファクナビ <${fromEmail}>`,
      to: email,
      subject: "【ファクナビ】パスワードリセットのご案内",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">パスワードリセット</h2>
          <p>以下のリンクからパスワードを再設定してください。</p>
          <p>このリンクは1時間有効です。</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">
              パスワードを再設定する
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">このメールに心当たりがない場合は、無視してください。</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
