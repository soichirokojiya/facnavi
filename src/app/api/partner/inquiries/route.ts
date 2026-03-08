import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function getPartnerCompanyId(request: NextRequest): string | null {
  const session = request.cookies.get("partner_session")?.value;
  if (!session) return null;
  const parts = session.split(":");
  return parts.length >= 2 ? parts[1] : null;
}

export async function GET(request: NextRequest) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("partner_inquiries")
    .select("id, subject, message, attachments, reply_message, replied_at, status, created_at")
    .eq("partner_company_id", partnerId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
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

export async function POST(request: NextRequest) {
  const partnerId = getPartnerCompanyId(request);
  if (!partnerId) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "件名と内容は必須です。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 画像アップロード
    const attachmentPaths: string[] = [];
    const files = formData.getAll("files") as File[];

    for (const file of files) {
      if (!(file instanceof File) || file.size === 0) continue;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "JPG・PNG・WebP・PDFファイルのみアップロード可能です。" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "ファイルサイズは5MB以下にしてください。" },
          { status: 400 }
        );
      }

      const ext = file.name.split(".").pop() || "bin";
      const storagePath = `${partnerId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("partner-inquiries")
        .upload(storagePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Inquiry file upload error:", uploadError);
        return NextResponse.json(
          { error: "画像のアップロードに失敗しました。" },
          { status: 500 }
        );
      }

      attachmentPaths.push(storagePath);
    }

    // 業者情報を取得
    const { data: partner } = await supabase
      .from("partner_companies")
      .select("name, login_id, email")
      .eq("id", partnerId)
      .single();

    const { data, error } = await supabase
      .from("partner_inquiries")
      .insert({
        partner_company_id: partnerId,
        subject,
        message,
        attachments: attachmentPaths,
      })
      .select()
      .single();

    if (error) {
      console.error("Inquiry insert error:", error);
      return NextResponse.json(
        { error: "送信に失敗しました。" },
        { status: 500 }
      );
    }

    // admin@facnavi.info にメール通知
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      try {
        await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: "admin@facnavi.info",
          subject: `【ファクナビ】提携業者からの問い合わせ: ${subject}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                提携業者からの問い合わせ
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280; width: 140px;">業者名</td>
                  <td style="padding: 8px; font-weight: bold;">${partner?.name || "不明"}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">ログインID</td>
                  <td style="padding: 8px;">${partner?.login_id || "-"}</td>
                </tr>
                ${partner?.email ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">メール</td>
                  <td style="padding: 8px;">${partner.email}</td>
                </tr>
                ` : ""}
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">件名</td>
                  <td style="padding: 8px; font-weight: bold;">${subject}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">内容</td>
                  <td style="padding: 8px; white-space: pre-wrap;">${message}</td>
                </tr>
                ${attachmentPaths.length > 0 ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">添付ファイル</td>
                  <td style="padding: 8px;">${attachmentPaths.length}件</td>
                </tr>
                ` : ""}
              </table>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send inquiry notification:", emailError);
      }
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
