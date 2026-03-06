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

  console.log(`Cleanup: ${oldRequests.length} requests processed, ${storageDeletedCount} files deleted`);
  return NextResponse.json({
    requestsProcessed: oldRequests.length,
    filesDeleted: storageDeletedCount,
  });
}
