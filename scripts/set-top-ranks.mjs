import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");

// Top ranks based on multiple comparison sites' rankings
// Sources: faclog.jp, assirobo.com, betrading.jp, access-ticket.com, freeway-keiri.com, growth-partners.co.jp
const topRanks = [
  "betrading",         // 1. ビートレーディング - 累計1745億円、7.1万社、手数料2%~
  "olta",              // 2. OLTA - クラウドファクタリングNo.1、手数料2-9%
  "ququmo",            // 3. QuQuMo - 審査通過率98%、手数料1-14.8%
  "best-factor",       // 4. ベストファクター - 審査通過率92.2%、手数料2%~
  "labol",             // 5. ラボル - フリーランス向け、24時間対応
  "accel-factor",      // 6. アクセルファクター - 審査通過率93%、手数料2%~
  "chusho-support",    // 7. 日本中小企業金融サポート機構 - 手数料1.5%~
  "pay-today",         // 8. PayToday - AI審査、手数料1-9.5%
  "freenance",         // 9. フリーナンス - 手数料3-10%、補償付き
  "paytner",           // 10. ペイトナー - 最短10分、手数料10%固定
  "mf-early-payment",  // 11. マネーフォワード アーリーペイメント
  "gmo-btob",          // 12. GMO BtoB早払い
  "pmg",               // 13. PMG
  "no1",               // 14. No.1
  "anew",              // 15. anew
  "msfj",              // 16. MSFJ
  "goodplus",          // 17. GoodPlus
  "next-one",          // 18. ネクストワン
  "mentor-capital",    // 19. メンターキャピタル
  "top-management",    // 20. トップ・マネジメント
  "factoring-try",     // 21
  "nishi-nihon-factor",// 22
  "trust-gateway",     // 23
  "jtc",               // 24
  "ace-trust",         // 25
  "factoring-zero",    // 26
  "kaisoku",           // 27
  "otti",              // 28
  "ennavi",            // 29
  "factorplan",        // 30
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

// Sort remaining companies by current overallRating desc
const remaining = companies.filter(c => !topSlugs.has(c.slug));
remaining.sort((a, b) => b.overallRating - a.overallRating || a.slug.localeCompare(b.slug));
let nextRank = topRanks.length + 1;
for (const c of remaining) {
  c.rankPosition = nextRank++;
}

// Save all
for (const c of companies) {
  const fp = path.join(companiesDir, c.slug + ".json");
  fs.writeFileSync(fp, JSON.stringify(c, null, 2));
}

console.log("Top 20:");
const all = [...companies].sort((a, b) => a.rankPosition - b.rankPosition);
all.slice(0, 20).forEach(c => {
  console.log(`${c.rankPosition}. ${c.name} (rating: ${c.overallRating})`);
});
console.log(`\nTotal: ${companies.length} companies ranked`);
