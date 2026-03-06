import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, company_slug, company_name } = await request.json();

    if (!email || !password || !company_slug) {
      return NextResponse.json(
        { error: "すべての項目を入力してください。" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "パスワードは8文字以上で設定してください。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // email重複チェック
    const { data: existingByEmail } = await supabase
      .from("partner_companies")
      .select("id")
      .eq("email", email)
      .single();

    if (existingByEmail) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています。" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const { error } = await supabase.from("partner_companies").insert({
      name: company_name || email,
      email,
      login_id: email,
      password_hash,
      company_slug,
      is_active: true,
      email_verified: false,
      email_verification_token: verificationToken,
      supported_prefectures: [],
      supported_industries: [],
      min_amount: 0,
      max_amount: 999999999,
      sole_proprietor_ok: true,
    });

    if (error) {
      console.error("Registration error:", error);
      return NextResponse.json(
        { error: `登録に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    // 認証メール送信
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";

    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        const verifyUrl = `${siteUrl}/partner/verify?token=${verificationToken}`;

        await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: email,
          subject: "【ファクナビ】メールアドレスの確認",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                メールアドレスの確認
              </h2>
              <p>${company_name || email} 様</p>
              <p>ファクナビへのご登録ありがとうございます。</p>
              <p>以下のボタンをクリックして、メールアドレスの確認を完了してください。</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background: #1e40af; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
                  メールアドレスを確認する
                </a>
              </div>
              <p style="font-size: 12px; color: #9ca3af;">
                このリンクは24時間有効です。<br>
                心当たりのない場合は、このメールを破棄してください。
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }
    }

    return NextResponse.json({ success: true, needsVerification: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
