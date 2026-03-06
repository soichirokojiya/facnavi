import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "トークンが指定されていません。" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: partner, error } = await supabase
      .from("partner_companies")
      .select("id, email_verified")
      .eq("email_verification_token", token)
      .single();

    if (error || !partner) {
      return NextResponse.json(
        { error: "無効なトークンです。" },
        { status: 400 }
      );
    }

    if (partner.email_verified) {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    await supabase
      .from("partner_companies")
      .update({
        email_verified: true,
        email_verification_token: null,
      })
      .eq("id", partner.id);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "リクエストの処理に失敗しました。" },
      { status: 500 }
    );
  }
}
