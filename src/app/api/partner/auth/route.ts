import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードを入力してください。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: partner, error } = await supabase
      .from("partner_companies")
      .select("id, password_hash, is_active, name, email_verified")
      .eq("email", email)
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    if (!partner.is_active) {
      return NextResponse.json(
        { error: "このアカウントは無効です。" },
        { status: 403 }
      );
    }

    if (!partner.email_verified) {
      return NextResponse.json(
        { error: "メールアドレスが未認証です。登録時に届いたメールのリンクをクリックしてください。" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, partner.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "メールアドレスまたはパスワードが正しくありません。" },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");

    const response = NextResponse.json({
      success: true,
      name: partner.name,
    });
    response.cookies.set(
      "partner_session",
      `${sessionToken}:${partner.id}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24時間
      }
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("partner_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
