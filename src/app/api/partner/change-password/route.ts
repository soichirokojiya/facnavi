import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const session = request.cookies.get("partner_session");
    if (!session?.value) {
      return NextResponse.json(
        { error: "認証が必要です。" },
        { status: 401 }
      );
    }

    const partnerId = session.value.split(":")[1];
    if (!partnerId) {
      return NextResponse.json(
        { error: "認証が必要です。" },
        { status: 401 }
      );
    }

    const { current_password, new_password } = await request.json();

    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: "現在のパスワードと新しいパスワードを入力してください。" },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { error: "新しいパスワードは8文字以上で設定してください。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: partner } = await supabase
      .from("partner_companies")
      .select("id, password_hash")
      .eq("id", partnerId)
      .single();

    if (!partner) {
      return NextResponse.json(
        { error: "アカウントが見つかりません。" },
        { status: 404 }
      );
    }

    const valid = await bcrypt.compare(current_password, partner.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "現在のパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    const password_hash = await bcrypt.hash(new_password, 10);

    const { error } = await supabase
      .from("partner_companies")
      .update({ password_hash })
      .eq("id", partner.id);

    if (error) {
      console.error("Password change error:", error);
      return NextResponse.json(
        { error: "パスワードの更新に失敗しました。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
