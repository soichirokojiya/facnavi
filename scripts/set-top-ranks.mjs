import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");

// 固定上位ランク（手動設定）
// ペイトナー・ラボルは常に上位に
const topRanks = [
  "labol",             // 1. ラボル - フリーランス向け、24時間対応
  "paytner",           // 2. ペイトナー - 最短10分、手数料10%固定
  "betrading",         // 3. ビートレーディング - 累計1745億円、7.1万社
  "olta",              // 4. OLTA - クラウドファクタリングNo.1
  "ququmo",            // 5. QuQuMo - 審査通過率98%
  "freenance",         // 6. フリーナンス - 手数料3-10%、補償付き
  "best-factor",       // 7. ベストファクター - 審査通過率92.2%
  "accel-factor",      // 8. アクセルファクター - 審査通過率93%
  "pay-today",         // 9. PayToday - AI審査
  "chusho-support",    // 10. 日本中小企業金融サポート機構
];

// Load all companies
const files = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
const companies = files.map(f => {
  return JSON.parse(fs.readFileSync(path.join(companiesDir, f), "utf-8"));
});

// Set ranks for top companies
const topSlugs = new Set(topRanks);
for (const company of companies) {
  const idx = topRanks.indexOf(company.slug);
  if (idx !== -1) {
    company.rankPosition = idx + 1;
  }
}

// Remaining companies: A8リンクありを優先、その中でoverallRating順
const remaining = companies.filter(c => !topSlugs.has(c.slug));
const hasA8 = remaining.filter(c => c.affiliateUrl && c.affiliateUrl.includes("a8.net"));
const noA8 = remaining.filter(c => !c.affiliateUrl || !c.affiliateUrl.includes("a8.net"));

hasA8.sort((a, b) => b.overallRating - a.overallRating || a.slug.localeCompare(b.slug));
noA8.sort((a, b) => b.overallRating - a.overallRating || a.slug.localeCompare(b.slug));

let nextRank = topRanks.length + 1;
for (const c of hasA8) {
  c.rankPosition = nextRank++;
}
for (const c of noA8) {
  c.rankPosition = nextRank++;
}

// Save all
for (const c of companies) {
  const fp = path.join(companiesDir, c.slug + ".json");
  fs.writeFileSync(fp, JSON.stringify(c, null, 2));
}

console.log("Top 20:");
const all = [...companies].sort((a, b) => a.rankPosition - b.rankPosition);
all.slice(0, 30).forEach(c => {
  const a8 = c.affiliateUrl?.includes("a8.net") ? " [A8]" : "";
  console.log(`${c.rankPosition}. ${c.name} (rating: ${c.overallRating})${a8}`);
});
console.log(`\nA8リンクあり: ${hasA8.length + topRanks.filter(s => companies.find(c => c.slug === s)?.affiliateUrl?.includes("a8.net")).length}社`);
console.log(`Total: ${companies.length} companies ranked`);
