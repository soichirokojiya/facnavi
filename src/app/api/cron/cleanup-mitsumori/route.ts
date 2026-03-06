import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Missing service key" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Find requests older than 5 days
  const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();

  const { data: oldRequests, error: fetchError } = await supabase
    .from("mitsumori_requests")
    .select("id")
    .lt("created_at", fiveDaysAgo);

  if (fetchError) {
    console.error("Failed to fetch old requests:", fetchError);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  if (!oldRequests || oldRequests.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  let storageDeletedCount = 0;

  // Delete Storage files for each request
  for (const req of oldRequests) {
    for (const fileType of ["invoice", "identity", "bankbook"]) {
      const folder = `${req.id}/${fileType}`;
      const { data: files } = await supabase.storage
        .from("mitsumori-documents")
        .list(folder);

      if (files && files.length > 0) {
        const paths = files.map((f) => `${folder}/${f.name}`);
        const { error: removeError } = await supabase.storage
          .from("mitsumori-documents")
          .remove(paths);

        if (removeError) {
          console.error(`Storage delete error (${folder}):`, removeError);
        } else {
          storageDeletedCount += paths.length;
        }
      }
    }
  }

  // Delete DB records
  const ids = oldRequests.map((r) => r.id);
  const { error: deleteError } = await supabase
    .from("mitsumori_requests")
    .delete()
    .in("id", ids);

  if (deleteError) {
    console.error("Failed to delete old requests:", deleteError);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  console.log(`Cleanup: deleted ${ids.length} requests, ${storageDeletedCount} files`);
  return NextResponse.json({
    deleted: ids.length,
    filesDeleted: storageDeletedCount,
  });
}
