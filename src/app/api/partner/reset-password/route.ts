import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "必要な情報が不足しています。" },
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

    const { data: partner } = await supabase
      .from("partner_companies")
      .select("id, password_reset_expires")
      .eq("password_reset_token", token)
      .single();

    if (!partner) {
      return NextResponse.json(
        { error: "無効なリセットリンクです。" },
        { status: 400 }
      );
    }

    if (new Date(partner.password_reset_expires) < new Date()) {
      return NextResponse.json(
        { error: "リセットリンクの有効期限が切れています。" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from("partner_companies")
      .update({
        password_hash,
        password_reset_token: null,
        password_reset_expires: null,
      })
      .eq("id", partner.id);

    if (error) {
      console.error("Password reset error:", error);
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
