import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("mitsumori_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "データが見つかりません。" }, { status: 404 });
  }

  // Storage から書類一覧を取得
  const documents: { name: string; type: string; url: string }[] = [];
  const fileTypes = ["invoice", "identity", "bankbook"];
  const fileLabels: Record<string, string> = {
    invoice: "請求書",
    identity: "本人確認書類",
    bankbook: "通帳コピー",
  };

  for (const fileType of fileTypes) {
    const { data: files } = await supabase.storage
      .from("mitsumori-documents")
      .list(`${id}/${fileType}`);

    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = `${id}/${fileType}/${file.name}`;
        const { data: signedUrlData } = await supabase.storage
          .from("mitsumori-documents")
          .createSignedUrl(filePath, 300); // 5分有効

        if (signedUrlData?.signedUrl) {
          documents.push({
            name: `${fileLabels[fileType]} - ${file.name}`,
            type: fileType,
            url: signedUrlData.signedUrl,
          });
        }
      }
    }
  }

  // リード割り当て（選択された業者）を取得
  const { data: assignments } = await supabase
    .from("lead_assignments")
    .select("partner_company_id, status, partner_companies(name)")
    .eq("mitsumori_request_id", id);

  const partners = (assignments || []).map((a) => ({
    name: (a.partner_companies as unknown as { name: string })?.name || "不明",
    status: a.status,
  }));

  return NextResponse.json({ data, documents, partners });
}
