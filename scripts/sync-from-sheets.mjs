#!/usr/bin/env node
/**
 * Google Sheets → ファクナビ 同期スクリプト
 *
 * 使い方:
 *   1. Google Sheetsで管理用スプレッドシートを作成
 *   2. 「ファイル」→「共有」→「ウェブに公開」→ CSV形式で公開
 *   3. 公開URLをこのスクリプトの SHEET_CSV_URL に設定
 *   4. node scripts/sync-from-sheets.mjs を実行
 *
 * スプレッドシートの列構成 (1行目はヘッダー):
 *   A: slug           - 英数字のID (例: best-factor)
 *   B: name           - 会社名 (例: ベストファクター)
 *   C: description    - 説明文
 *   D: affiliateUrl   - アフィリエイトURL
 *   E: factoringType  - 2社間 / 3社間 / 2社間・3社間
 *   F: feeMin         - 手数料下限 (数値、例: 2)
 *   G: feeMax         - 手数料上限 (数値、例: 20)
 *   H: minAmount      - 最低買取額 (数値)
 *   I: maxAmount      - 最大買取額 (数値、0=制限なし)
 *   J: speedDays      - 最短入金日数 (数値)
 *   K: onlineComplete - オンライン完結 (TRUE/FALSE)
 *   L: features       - 特長 (カンマ区切り)
 *   M: pros           - メリット (カンマ区切り)
 *   N: cons           - デメリット (カンマ区切り)
 *   O: overallRating  - 総合評価 (数値)
 *   P: rankPosition   - ランキング順位 (数値)
 *   Q: establishedYear - 設立年 (数値)
 *   R: targetIndustries - 対象業種 (カンマ区切り)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");

// ============================================================
// ↓↓↓ ここにGoogle SheetsのCSV公開URLを設定 ↓↓↓
// ============================================================
const SHEET_CSV_URL = process.env.SHEET_CSV_URL || "";

if (!SHEET_CSV_URL) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  Google Sheets 同期スクリプト - セットアップガイド          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  1. Google Sheetsで新しいスプレッドシートを作成              ║
║                                                              ║
║  2. 以下のテンプレートシートをコピー:                        ║
║     https://docs.google.com/spreadsheets                     ║
║     (テンプレートは下記コマンドで生成できます)               ║
║                                                              ║
║  3.「ファイル」→「共有」→「ウェブに公開」                  ║
║     → シート1 → CSV形式 → 公開                             ║
║                                                              ║
║  4. 公開URLをコピーして実行:                                 ║
║     SHEET_CSV_URL="https://..." node scripts/sync-from-sheets.mjs ║
║                                                              ║
║  または .env.local ファイルに追記:                           ║
║     SHEET_CSV_URL=https://docs.google.com/...                ║
║                                                              ║
║  現在のデータからテンプレートCSVを生成するには:              ║
║     node scripts/sync-from-sheets.mjs --export               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

  // Check if --export flag is passed
  if (process.argv.includes("--export")) {
    exportCurrentData();
  }
  process.exit(0);
}

// Main sync function
async function main() {
  console.log("Google Sheetsからデータを取得中...");
  const response = await fetch(SHEET_CSV_URL);
  if (!response.ok) {
    console.error(`HTTP Error: ${response.status}`);
    process.exit(1);
  }
  const csv = await response.text();
  const rows = parseCSV(csv);

  if (rows.length < 2) {
    console.error("データが見つかりません");
    process.exit(1);
  }

  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => r[0]?.trim()); // skip empty rows

  console.log(`${dataRows.length} 件の会社データを検出`);

  let created = 0, updated = 0, unchanged = 0;

  for (const row of dataRows) {
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (row[i] || "").trim(); });

    const slug = obj.slug;
    if (!slug) continue;

    const company = {
      slug,
      name: obj.name || slug,
      description: obj.description || "",
      affiliateUrl: obj.affiliateUrl || `https://px.a8.net/svt/ejp?a8mat=${slug.toUpperCase().replace(/-/g, "")}`,
      factoringType: obj.factoringType || "2社間・3社間",
      feeRange: {
        min: parseFloat(obj.feeMin) || 3,
        max: parseFloat(obj.feeMax) || 15,
      },
      minAmount: parseInt(obj.minAmount) || 300000,
      maxAmount: parseInt(obj.maxAmount) || 50000000,
      speedDays: parseInt(obj.speedDays) || 1,
      onlineComplete: obj.onlineComplete?.toUpperCase() !== "FALSE",
      features: splitCSVField(obj.features) || ["即日入金可能", "オンライン対応", "個人事業主OK", "全国対応", "柔軟な審査"],
      pros: splitCSVField(obj.pros) || ["対応が迅速", "審査が柔軟", "全国対応"],
      cons: splitCSVField(obj.cons) || ["知名度がやや低い", "手数料は個別査定"],
      // overallRating and rankPosition are managed by scripts, not spreadsheet
      establishedYear: parseInt(obj.establishedYear) || undefined,
      targetIndustries: splitCSVField(obj.targetIndustries) || ["建設業", "運送業", "製造業", "IT・Web", "サービス業"],
    };

    // Remove undefined fields
    Object.keys(company).forEach(k => company[k] === undefined && delete company[k]);

    const filePath = path.join(companiesDir, `${slug}.json`);
    const exists = fs.existsSync(filePath);

    if (exists) {
      const existing = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      // Preserve rankPosition and overallRating from existing file
      company.overallRating = existing.overallRating;
      company.rankPosition = existing.rankPosition;
      if (JSON.stringify(existing) === JSON.stringify(company)) {
        unchanged++;
        continue;
      }
      updated++;
    } else {
      // New company gets defaults
      company.overallRating = 3.5;
      company.rankPosition = 999;
      created++;
    }

    fs.writeFileSync(filePath, JSON.stringify(company, null, 2));
  }

  console.log(`\n同期完了: 新規 ${created}件, 更新 ${updated}件, 変更なし ${unchanged}件`);
  console.log("\n次のステップ: companiesData.ts を再生成してビルド");
  console.log("  node scripts/regenerate-data.mjs && npm run build");
}

// Export current company data to CSV for importing into Google Sheets
function exportCurrentData() {
  const files = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
  const companies = files.map(f => JSON.parse(fs.readFileSync(path.join(companiesDir, f), "utf-8")));
  companies.sort((a, b) => a.rankPosition - b.rankPosition);

  const headers = [
    "slug", "name", "description", "affiliateUrl", "factoringType",
    "feeMin", "feeMax", "minAmount", "maxAmount", "speedDays",
    "onlineComplete", "features", "pros", "cons",
    "establishedYear", "targetIndustries"
  ];

  const rows = companies.map(c => [
    c.slug,
    c.name,
    c.description,
    c.affiliateUrl,
    c.factoringType,
    c.feeRange?.min || "",
    c.feeRange?.max || "",
    c.minAmount || "",
    c.maxAmount || "",
    c.speedDays || "",
    c.onlineComplete ? "TRUE" : "FALSE",
    (c.features || []).join("、"),
    (c.pros || []).join("、"),
    (c.cons || []).join("、"),
    c.establishedYear || "",
    (c.targetIndustries || []).join("、"),
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const outPath = path.join(__dirname, "..", "companies-export.csv");
  fs.writeFileSync(outPath, "\uFEFF" + csvContent); // BOM for Excel
  console.log(`\nCSVエクスポート完了: ${outPath}`);
  console.log(`${companies.length} 件の会社データを出力しました。`);
  console.log("\nこのCSVをGoogle Sheetsにインポートしてください:");
  console.log("  1. Google Sheetsを開く");
  console.log("  2.「ファイル」→「インポート」→ CSVファイルをアップロード");
  console.log("  3.「ファイル」→「共有」→「ウェブに公開」→ CSV形式で公開");
}

// Simple CSV parser
function parseCSV(text) {
  const rows = [];
  let current = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || (ch === "\r" && text[i + 1] === "\n")) {
        current.push(field);
        field = "";
        rows.push(current);
        current = [];
        if (ch === "\r") i++;
      } else {
        field += ch;
      }
    }
  }
  if (field || current.length) {
    current.push(field);
    rows.push(current);
  }
  return rows;
}

function splitCSVField(val) {
  if (!val) return null;
  return val.split(/[、,]/).map(s => s.trim()).filter(Boolean);
}

main().catch(console.error);
