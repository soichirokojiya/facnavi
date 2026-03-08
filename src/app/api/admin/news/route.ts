import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { NewsItem } from "@/types/news";

const NEWS_DIR = path.join(process.cwd(), "content/news");

function ensureDir() {
  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  ensureDir();
  const files = fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".json"));
  const items: NewsItem[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(NEWS_DIR, file), "utf-8");
    const data = JSON.parse(raw);
    return { ...data, slug: file.replace(/\.json$/, "") };
  });

  items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return NextResponse.json({ data: items });
}

export async function POST(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, summary, sourceUrl, sourceName, publishedAt, category } = body;

    if (!title || !summary || !sourceUrl || !sourceName || !publishedAt || !category) {
      return NextResponse.json({ error: "必須項目が不足しています。" }, { status: 400 });
    }

    ensureDir();

    const slug = title
      .replace(/[^\w\u3000-\u9fffぁ-んァ-ヶー]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
    const filename = `${publishedAt}-${slug}.json`;

    const newsItem = {
      title,
      summary,
      sourceUrl,
      sourceName,
      publishedAt,
      category,
      isManual: true,
    };

    fs.writeFileSync(
      path.join(NEWS_DIR, filename),
      JSON.stringify(newsItem, null, 2),
      "utf-8"
    );

    return NextResponse.json({ success: true, slug: filename.replace(/\.json$/, "") });
  } catch {
    return NextResponse.json({ error: "リクエストの処理に失敗しました。" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  if (!session?.value) {
    return NextResponse.json({ error: "未認証" }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "slugが必要です。" }, { status: 400 });
    }

    const filePath = path.join(NEWS_DIR, `${slug}.json`);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "ニュースが見つかりません。" }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "削除に失敗しました。" }, { status: 500 });
  }
}
