import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const NEWS_DIR = path.join(process.cwd(), "content/news");

const RSS_URL =
  "https://news.google.com/rss/search?q=%E3%83%95%E3%82%A1%E3%82%AF%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0&hl=ja&gl=JP&ceid=JP:ja";

function parseRssItems(xml: string) {
  const items: { title: string; link: string; pubDate: string; source: string }[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const getTag = (tag: string) => {
      const tagMatch = itemXml.match(
        new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
      );
      return tagMatch ? (tagMatch[1] || tagMatch[2] || "").trim() : "";
    };

    const title = getTag("title");
    const link = getTag("link");
    const pubDate = getTag("pubDate");
    const source = getTag("source");

    if (title && link) {
      items.push({
        title,
        link,
        pubDate: pubDate ? new Date(pubDate).toISOString().split("T")[0] : "",
        source: source || "Google News",
      });
    }
  }

  return items;
}

function getExistingUrls(): Set<string> {
  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
    return new Set();
  }
  const urls = new Set<string>();
  for (const file of fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(NEWS_DIR, file), "utf-8"));
    if (data.sourceUrl) urls.add(data.sourceUrl);
  }
  return urls;
}

function generateSlug(title: string): string {
  return title
    .replace(/[^\w\u3000-\u9fffぁ-んァ-ヶー]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
  }

  try {
    // Fetch RSS
    const res = await fetch(RSS_URL);
    if (!res.ok) {
      return NextResponse.json({ error: `RSS fetch failed: ${res.status}` }, { status: 500 });
    }

    const xml = await res.text();
    const rssItems = parseRssItems(xml);

    // Dedup
    const existingUrls = getExistingUrls();
    const newItems = rssItems.filter((item) => !existingUrls.has(item.link));

    if (newItems.length === 0) {
      return NextResponse.json({ added: 0, message: "No new items" });
    }

    const toProcess = newItems.slice(0, 10);

    // Analyze with Claude
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });

    const prompt = `以下のニュース記事リストを分析してください。
各記事について:
1. ファクタリング業界との関連度を判定（high/medium/low）
2. 2-3行の日本語要約を作成
3. カテゴリを判定（業界動向 / 法改正 / サービス / 調査）

関連度が "high" または "medium" のもののみを返してください。

記事リスト:
${toProcess.map((a, i) => `${i + 1}. タイトル: ${a.title}\n   URL: ${a.link}\n   出典: ${a.source}\n   日付: ${a.pubDate}`).join("\n\n")}

以下のJSON配列形式で返してください（コードブロックなし、JSON配列のみ）:
[{"index": 0, "relevance": "high", "summary": "要約テキスト", "category": "業界動向"}]

該当なしの場合は空配列 [] を返してください。`;

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const analyzed: { index: number; summary: string; category: string }[] = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : [];

    let addedCount = 0;

    for (const result of analyzed) {
      const article = toProcess[result.index];
      if (!article) continue;

      const dateStr = article.pubDate || new Date().toISOString().split("T")[0];
      const slug = generateSlug(article.title);
      const filename = `${dateStr}-${slug}.json`;

      const newsItem = {
        title: article.title,
        summary: result.summary,
        sourceUrl: article.link,
        sourceName: article.source,
        publishedAt: dateStr,
        category: result.category || "業界動向",
        isManual: false,
      };

      fs.writeFileSync(
        path.join(NEWS_DIR, filename),
        JSON.stringify(newsItem, null, 2),
        "utf-8"
      );
      addedCount++;
    }

    return NextResponse.json({ added: addedCount, processed: toProcess.length });
  } catch (error) {
    console.error("Cron fetch-news error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
