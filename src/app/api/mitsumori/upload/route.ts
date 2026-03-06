import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const FILE_KEYS = ["invoice", "identity", "bankbook"] as const;

const FILE_LABELS: Record<string, string> = {
  invoice: "請求書",
  identity: "本人確認書類",
  bankbook: "通帳コピー",
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.json(
        { error: "無効なリクエストです。" },
        { status: 400 }
      );
    }

    // Validate token and get request
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabase = createClient(supabaseUrl, serviceKey || supabaseAnonKey);

    const { data: mitsumoriRequest, error: fetchError } = await supabase
      .from("mitsumori_requests")
      .select("id, company_name, contact_name, email")
      .eq("upload_token", token)
      .single();

    if (fetchError || !mitsumoriRequest) {
      return NextResponse.json(
        { error: "無効または期限切れのリンクです。お手数ですが、再度お申し込みください。" },
        { status: 404 }
      );
    }

    // Validate and collect files
    const filesToUpload: { key: string; file: File }[] = [];

    for (const key of FILE_KEYS) {
      const file = formData.get(key) as File | null;

      if (!file || !(file instanceof File) || file.size === 0) {
        return NextResponse.json(
          { error: `${FILE_LABELS[key]}を選択してください。` },
          { status: 400 }
        );
      }

      if (!ACCEPTED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `${FILE_LABELS[key]}: JPG・PNG・PDFファイルのみアップロード可能です。` },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${FILE_LABELS[key]}: ファイルサイズは10MB以下にしてください。` },
          { status: 400 }
        );
      }

      filesToUpload.push({ key, file });
    }

    // Upload files to Supabase Storage
    const requestId = mitsumoriRequest.id;

    for (const { key, file } of filesToUpload) {
      const ext = file.name.split(".").pop() || "bin";
      const storagePath = `${requestId}/${key}/${Date.now()}.${ext}`;

      const arrayBuffer = await file.arrayBuffer();
      const { error: uploadError } = await supabase.storage
        .from("mitsumori-documents")
        .upload(storagePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        console.error(`Storage upload error (${key}):`, uploadError);
        return NextResponse.json(
          { error: `${FILE_LABELS[key]}のアップロードに失敗しました。再度お試しください。` },
          { status: 500 }
        );
      }
    }

    // Send admin notification email
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@facnavi.info";
      const adminEmail = process.env.ADMIN_EMAIL;

      if (adminEmail) {
        await resend.emails.send({
          from: `ファクナビ <${fromEmail}>`,
          to: adminEmail,
          subject: `【ファクナビ】書類アップロード完了（${mitsumoriRequest.company_name}）`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
                書類アップロード完了
              </h2>
              <p><strong>${mitsumoriRequest.company_name}</strong>（${mitsumoriRequest.contact_name} 様）が審査書類をアップロードしました。</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280; width: 140px;">申し込みID</td>
                  <td style="padding: 8px;">${requestId}</td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px; color: #6b7280;">アップロード書類</td>
                  <td style="padding: 8px;">請求書、本人確認書類、通帳コピー</td>
                </tr>
              </table>
              <p>Supabase Storage の <code>mitsumori-documents/${requestId}/</code> を確認してください。</p>
              <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                このメールはファクナビの一括見積もりシステムから自動送信されています。
              </p>
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error("Failed to send upload notification:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Upload API error:", e);
    return NextResponse.json(
      { error: "アップロード処理に失敗しました。" },
      { status: 500 }
    );
  }
}
