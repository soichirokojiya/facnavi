import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { name, email, login_id, password, company_slug } = await request.json();

    if (!name || !email || !login_id || !password) {
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

    // login_id重複チェック
    const { data: existingById } = await supabase
      .from("partner_companies")
      .select("id")
      .eq("login_id", login_id)
      .single();

    if (existingById) {
      return NextResponse.json(
        { error: "このログインIDは既に使用されています。" },
        { status: 409 }
      );
    }

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

    const { error } = await supabase.from("partner_companies").insert({
      name,
      email,
      login_id,
      password_hash,
      company_slug: company_slug || null,
      is_active: true,
      supported_prefectures: [],
      supported_industries: [],
      min_amount: 0,
      max_amount: 999999999,
      sole_proprietor_ok: true,
    });

    if (error) {
      console.error("Registration error:", error);
      return NextResponse.json(
        { error: "登録に失敗しました。" },
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
