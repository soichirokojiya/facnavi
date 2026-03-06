import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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
    .from("partner_companies")
    .select("id, company_slug, name, login_id, email, supported_prefectures, min_amount, max_amount, supported_industries, sole_proprietor_ok, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      company_slug,
      name,
      login_id,
      password,
      supported_prefectures,
      min_amount,
      max_amount,
      supported_industries,
      sole_proprietor_ok,
      is_active,
    } = body;

    if (!name || !login_id || !password) {
      return NextResponse.json(
        { error: "業者名、ログインID、パスワードは必須です。" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("partner_companies")
      .insert({
        company_slug: company_slug || null,
        name,
        login_id,
        password_hash,
        supported_prefectures: supported_prefectures || [],
        min_amount: min_amount || 0,
        max_amount: max_amount || 999999999,
        supported_industries: supported_industries || [],
        sole_proprietor_ok: sole_proprietor_ok ?? true,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "このログインIDは既に使用されています。" },
          { status: 409 }
        );
      }
      console.error("Partner insert error:", error);
      return NextResponse.json(
        { error: "登録に失敗しました。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
