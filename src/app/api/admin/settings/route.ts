import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
    .from("site_settings")
    .select("key, value");

  if (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }

  const settings: Record<string, string> = {};
  for (const row of data || []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({ data: settings });
}

export async function PATCH(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseKey);

    // パスワード変更
    if (body._change_password) {
      const { current_password, new_password } = body;

      // 現在のパスワードを検証（site_settings優先、なければ環境変数）
      const { data: pwRow } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "admin_password")
        .single();

      const currentAdminPassword = pwRow?.value || process.env.ADMIN_PASSWORD;

      if (current_password !== currentAdminPassword) {
        return NextResponse.json({ error: "現在のパスワードが正しくありません。" }, { status: 400 });
      }

      if (!new_password || new_password.length < 8) {
        return NextResponse.json({ error: "新しいパスワードは8文字以上で設定してください。" }, { status: 400 });
      }

      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "admin_password", value: new_password }, { onConflict: "key" });

      if (error) {
        return NextResponse.json({ error: "パスワードの保存に失敗しました。" }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    for (const [key, value] of Object.entries(body)) {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key, value: String(value) }, { onConflict: "key" });

      if (error) {
        console.error(`Settings update error (${key}):`, error);
        return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "リクエストの処理に失敗しました。" }, { status: 500 });
  }
}
