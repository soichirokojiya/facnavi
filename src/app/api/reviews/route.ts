import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

export async function POST(request: NextRequest) {
  try {
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

    // メールアドレスの簡易バリデーション
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("reviews").insert({
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
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "口コミの投稿に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    // 受付確認メール送信
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
      // メール送信失敗は口コミ投稿自体の失敗にはしない
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
