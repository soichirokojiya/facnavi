import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");

// 固定上位ランク（手動設定）
// ペイトナー・ラボルは常にTOP5内でランダムに配置
const priorityPair = Math.random() < 0.5
  ? ["paytner", "labol"]
  : ["labol", "paytner"];

const topRanks = [
  priorityPair[0],     // 1. ペイトナー or ラボル（ランダム）[A8]
  "betrading",         // 2. ビートレーディング
  priorityPair[1],     // 3. ラボル or ペイトナー（ランダム）[A8]
  "olta",              // 4. OLTA
  "ququmo",            // 5. QuQuMo [A8]
  "freenance",         // 6. フリーナンス [A8]
  "no1",               // 7. No.1ファクタリング [A8]
  "goodplus",          // 8. GoodPlus [A8]
  "msfj",              // 9. MSFJ [A8]
  "best-factor",       // 10. ベストファクター
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
