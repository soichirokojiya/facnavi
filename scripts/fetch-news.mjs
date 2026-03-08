#!/usr/bin/env node

/**
 * ファクタリング関連ニュース自動取得スクリプト
 *
 * Google News RSSから「ファクタリング」キーワードでフィード取得し、
 * Claude APIで要約・関連度判定を行い、content/news/ にJSON保存する。
 *
 * 使い方: ANTHROPIC_API_KEY=sk-... node scripts/fetch-news.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NEWS_DIR = path.join(__dirname, "..", "content", "news");

// Google News RSS URL for "ファクタリング" keyword
const RSS_URL =
  "https://news.google.com/rss/search?q=%E3%83%95%E3%82%A1%E3%82%AF%E3%82%BF%E3%83%AA%E3%83%B3%E3%82%B0&hl=ja&gl=JP&ceid=JP:ja";

/**
 * RSS XMLをパースしてアイテム配列を返す（軽量パーサー）
 */
function parseRssItems(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const getTag = (tag) => {
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

/**
 * 既存ニュースのURLセットを取得
 */
function getExistingUrls() {
  if (!fs.existsSync(NEWS_DIR)) {
    fs.mkdirSync(NEWS_DIR, { recursive: true });
    return new Set();
  }
  const urls = new Set();
  for (const file of fs.readdirSync(NEWS_DIR).filter((f) => f.endsWith(".json"))) {
    const data = JSON.parse(fs.readFileSync(path.join(NEWS_DIR, file), "utf-8"));
    if (data.sourceUrl) urls.add(data.sourceUrl);
  }
  return urls;
}

/**
 * Claude APIでニュース記事を分析・要約
 */
async function analyzeWithClaude(apiKey, articles) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey });

  const prompt = `以下のニュース記事リストを分析してください。
各記事について:
1. ファクタリング業界との関連度を判定（high/medium/low）
2. 2-3行の日本語要約を作成
3. カテゴリを判定（業界動向 / 法改正 / サービス / 調査）

関連度が "high" または "medium" のもののみを返してください。

記事リスト:
${articles.map((a, i) => `${i + 1}. タイトル: ${a.title}\n   URL: ${a.link}\n   出典: ${a.source}\n   日付: ${a.pubDate}`).join("\n\n")}

以下のJSON配列形式で返してください（コードブロックなし、JSON配列のみ）:
[
  {
    "index": 0,
    "relevance": "high",
    "summary": "要約テキスト",
    "category": "業界動向"
  }
]

関連度の低い記事は含めないでください。該当なしの場合は空配列 [] を返してください。`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // JSON配列を抽出
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    return JSON.parse(jsonMatch[0]);
  } catch {
    console.error("Failed to parse Claude response as JSON");
    return [];
  }
}

/**
 * スラグを生成
 */
function generateSlug(title) {
  return title
    .replace(/[^\w\u3000-\u9fffぁ-んァ-ヶー]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

/**
 * メイン処理
 */
async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY environment variable is required");
    process.exit(1);
  }

  console.log("Fetching Google News RSS...");
  const res = await fetch(RSS_URL);
  if (!res.ok) {
    console.error(`RSS fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const xml = await res.text();
  const rssItems = parseRssItems(xml);
  console.log(`Found ${rssItems.length} RSS items`);

  if (rssItems.length === 0) {
    console.log("No items found, exiting.");
    return { added: 0 };
  }

  // 重複チェック
  const existingUrls = getExistingUrls();
  const newItems = rssItems.filter((item) => !existingUrls.has(item.link));
  console.log(`${newItems.length} new items after dedup`);

  if (newItems.length === 0) {
    console.log("No new items, exiting.");
    return { added: 0 };
  }

  // 最新10件のみ処理
  const toProcess = newItems.slice(0, 10);

  console.log("Analyzing with Claude API...");
  const analyzed = await analyzeWithClaude(apiKey, toProcess);
  console.log(`${analyzed.length} relevant items found`);

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

    const filePath = path.join(NEWS_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(newsItem, null, 2), "utf-8");
    console.log(`Saved: ${filename}`);
    addedCount++;
  }

  console.log(`Done! Added ${addedCount} news items.`);
  return { added: addedCount };
}

// スクリプトとして直接実行された場合
main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

export { main, parseRssItems, getExistingUrls, analyzeWithClaude };
