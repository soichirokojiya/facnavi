#!/usr/bin/env node
/**
 * リンク切れ会社のJSONファイルを削除し、残りの会社のrankPositionを振り直す
 */
const fs = require("fs");
const path = require("path");

const companiesDir = path.join(__dirname, "../content/companies");
const brokenFile = path.join(__dirname, "broken-links.json");

const broken = JSON.parse(fs.readFileSync(brokenFile, "utf-8"));
const brokenSlugs = new Set(broken.map((b) => b.slug));

console.log(`リンク切れ: ${brokenSlugs.size}社`);

// 一部は403やタイムアウトで実際には生きている可能性があるものを除外
const keepSlugs = new Set([
  "smbc-fs", // 403だがSMBCの大手サイト、WAFでブロックされている可能性
]);

// 削除
let deleted = 0;
for (const slug of brokenSlugs) {
  if (keepSlugs.has(slug)) {
    console.log(`⏭ SKIP: ${slug} (除外リストに含まれる)`);
    continue;
  }
  const filePath = path.join(companiesDir, `${slug}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    deleted++;
  }
}
console.log(`\n🗑 ${deleted}社のJSONを削除`);

// 残りの会社のrankPositionを振り直す
const remaining = fs
  .readdirSync(companiesDir)
  .filter((f) => f.endsWith(".json"))
  .map((file) => {
    const raw = fs.readFileSync(path.join(companiesDir, file), "utf-8");
    return { file, data: JSON.parse(raw) };
  })
  .sort((a, b) => a.data.rankPosition - b.data.rankPosition);

remaining.forEach((item, idx) => {
  item.data.rankPosition = idx + 1;
  // 比較データの中に削除された会社への参照があれば除去
  if (item.data.comparisons) {
    item.data.comparisons = item.data.comparisons.filter(
      (c) => !brokenSlugs.has(c.competitorSlug) || keepSlugs.has(c.competitorSlug)
    );
  }
  fs.writeFileSync(
    path.join(companiesDir, item.file),
    JSON.stringify(item.data, null, 2)
  );
});

console.log(`✅ 残り${remaining.length}社のrankPositionを振り直しました`);
