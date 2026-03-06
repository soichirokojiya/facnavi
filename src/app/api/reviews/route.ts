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
      company_slug,
      author_name,
      email,
      industry,
      prefecture,
      rating,
      funding_amount,
      usage_status,
      fee_rate,
      review_speed,
      deposit_speed,
      title,
      body: reviewBody,
      pros,
      cons,
    } = body;

    // バリデーション
    if (!company_slug || !author_name || !email || !industry || !prefecture || !rating || !title || !reviewBody || !pros || !cons) {
      return NextResponse.json(
        { error: "必須項目が入力されていません。" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "評価は1〜5の範囲で入力してください。" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log("Service key exists:", !!serviceKey, "Key starts with:", serviceKey?.substring(0, 10));
    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        company_slug,
        author_name,
        email,
        industry,
        prefecture,
        rating,
        funding_amount: funding_amount || null,
        usage_status: usage_status || null,
        fee_rate: fee_rate || null,
        review_speed: review_speed || null,
        deposit_speed: deposit_speed || null,
        title,
        body: reviewBody,
        pros,
        cons,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "口コミの投稿に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    const reviewId = data?.id;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

    // 投稿者への受付確認メール
    try {
      await resend.emails.send({
        from: `ファクナビ <${fromEmail}>`,
        to: email,
        subject: "【ファクナビ】口コミ投稿を受け付けました",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
              口コミ投稿の受付確認
            </h2>
            <p>${author_name} 様</p>
            <p>この度は口コミをご投稿いただき、誠にありがとうございます。</p>
            <p>以下の内容で口コミを受け付けました。</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280; width: 120px;">タイトル</td>
                <td style="padding: 8px; font-weight: bold;">${title}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px; color: #6b7280;">評価</td>
                <td style="padding: 8px; font-weight: bold;">${"★".repeat(rating)}${"☆".repeat(5 - rating)}（${rating}.0）</td>
              </tr>
            </table>
            <p>内容を確認の上、承認後にサイトに掲載させていただきます。<br>審査には数日かかる場合がございますので、あらかじめご了承ください。</p>
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

    // 管理者への通知メール（承認/不承認ボタン付き）
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      const moderateSecret = process.env.MODERATE_SECRET;
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://facnavi.info";

      console.log("Admin email debug:", {
        adminEmail: adminEmail ? `${adminEmail.substring(0, 5)}...` : "NOT SET",
        moderateSecret: moderateSecret ? "SET" : "NOT SET",
        reviewId: reviewId || "NOT SET",
        resendApiKey: process.env.RESEND_API_KEY ? "SET" : "NOT SET",
        fromEmail,
      });

      if (adminEmail && moderateSecret && reviewId) {
        const approveUrl = `${siteUrl}/api/reviews/moderate?id=${reviewId}&action=approved&secret=${moderateSecret}`;
        const rejectUrl = `${siteUrl}/api/reviews/moderate?id=${reviewId}&action=rejected&secret=${moderateSecret}`;

        console.log("Sending admin email to:", adminEmail);
        const adminResult = await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: adminEmail,
          subject: `【ファクナビ】新しい口コミが投稿されました（${company_slug}）`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                新しい口コミが投稿されました
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280; width: 120px;">会社</td>
                  <td style="padding: 8px; font-weight: bold;">${company_slug}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">投稿者</td>
                  <td style="padding: 8px;">${author_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">メール</td>
                  <td style="padding: 8px;">${email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">評価</td>
                  <td style="padding: 8px; font-weight: bold;">${"★".repeat(rating)}${"☆".repeat(5 - rating)}（${rating}.0）</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">業種</td>
                  <td style="padding: 8px;">${industry}（${prefecture}）</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">タイトル</td>
                  <td style="padding: 8px; font-weight: bold;">${title}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">良かった点</td>
                  <td style="padding: 8px;">${pros}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">気になった点</td>
                  <td style="padding: 8px;">${cons}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">感想</td>
                  <td style="padding: 8px;">${reviewBody}</td>
                </tr>
              </table>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${approveUrl}" style="display: inline-block; padding: 12px 32px; background: #10b981; color: white; font-weight: bold; text-decoration: none; border-radius: 8px; margin-right: 12px;">
                  承認する
                </a>
                <a href="${rejectUrl}" style="display: inline-block; padding: 12px 32px; background: #ef4444; color: white; font-weight: bold; text-decoration: none; border-radius: 8px;">
                  不承認にする
                </a>
              </div>
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                このメールはファクナビの口コミ管理システムから自動送信されています。
              </p>
            </div>
          `,
        });
        console.log("Admin email sent result:", JSON.stringify(adminResult));
      } else {
        console.log("Admin email SKIPPED - missing:", {
          adminEmail: !adminEmail,
          moderateSecret: !moderateSecret,
          reviewId: !reviewId,
        });
      }
    } catch (adminEmailError) {
      console.error("Failed to send admin notification:", adminEmailError);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Review API error:", e);
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
