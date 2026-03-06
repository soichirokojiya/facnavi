import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const moderateSecret = process.env.MODERATE_SECRET!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");
  const secret = searchParams.get("secret");

  // 認証チェック
  if (!secret || secret !== moderateSecret) {
    return new NextResponse(html("認証エラー", "不正なリクエストです。"), {
      status: 403,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (!id || !action || !["approved", "rejected"].includes(action)) {
    return new NextResponse(html("エラー", "パラメータが不正です。"), {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // service_roleキーでRLSをバイパス
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabase
    .from("reviews")
    .update({ status: action })
    .eq("id", id);

  if (error) {
    console.error("Moderate error:", error);
    return new NextResponse(html("エラー", "ステータスの更新に失敗しました。"), {
      status: 500,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const label = action === "approved" ? "承認" : "不承認";
  return new NextResponse(
    html(`${label}しました`, `口コミを${label}しました。サイトへの反映は次回デプロイ時に行われます。`),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function html(title: string, message: string) {
  return `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} - ファクナビ</title></head>
<body style="font-family:sans-serif;max-width:500px;margin:40px auto;padding:20px;text-align:center;">
  <h1 style="color:#1e40af;">${title}</h1>
  <p style="color:#374151;">${message}</p>
  <a href="https://facnavi.info" style="color:#1e40af;">ファクナビに戻る</a>
</body>
</html>`;
}
