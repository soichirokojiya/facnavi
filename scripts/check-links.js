#!/usr/bin/env node
/**
 * 全社の公式サイトURLをチェックし、リンク切れを検出するスクリプト
 */
const fs = require("fs");
const path = require("path");

const companiesDir = path.join(__dirname, "../content/companies");

async function checkUrl(url, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)" },
    });
    clearTimeout(timer);
    return { status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url };
  } catch (e) {
    clearTimeout(timer);
    // HEAD が拒否される場合 GET で再試行
    try {
      const controller2 = new AbortController();
      const timer2 = setTimeout(() => controller2.abort(), timeout);
      const res = await fetch(url, {
        method: "GET",
        signal: controller2.signal,
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; LinkChecker/1.0)" },
      });
      clearTimeout(timer2);
      return { status: res.status, ok: res.ok, redirected: res.redirected, finalUrl: res.url };
    } catch (e2) {
      return { status: 0, ok: false, error: e2.cause?.code || e2.message };
    }
  }
}

async function main() {
  const files = fs.readdirSync(companiesDir).filter((f) => f.endsWith(".json"));
  const companies = files.map((file) => {
    const raw = fs.readFileSync(path.join(companiesDir, file), "utf-8");
    return JSON.parse(raw);
  }).sort((a, b) => a.rankPosition - b.rankPosition);

  console.log(`Checking ${companies.length} companies...\n`);

  const broken = [];
  const batchSize = 10;

  for (let i = 0; i < companies.length; i += batchSize) {
    const batch = companies.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map(async (c) => {
        const result = await checkUrl(c.affiliateUrl);
        return { company: c, result };
      })
    );

    for (const { company, result } of results) {
      if (!result.ok) {
        broken.push({ rank: company.rankPosition, slug: company.slug, name: company.brandName || company.name, url: company.affiliateUrl, status: result.status, error: result.error });
        console.log(`❌ ${company.rankPosition}. ${company.brandName || company.name} - ${result.status} ${result.error || ""} - ${company.affiliateUrl}`);
      } else {
        process.stdout.write(".");
      }
    }
  }

  console.log(`\n\n=== 結果 ===`);
  console.log(`Total: ${companies.length}`);
  console.log(`Broken: ${broken.length}`);
  if (broken.length > 0) {
    console.log(`\nリンク切れ一覧:`);
    broken.forEach((b) => {
      console.log(`  ${b.rank}. ${b.name} (${b.slug}) - status:${b.status} ${b.error || ""}`);
      console.log(`     ${b.url}`);
    });
  }

  // 結果をJSONで保存
  fs.writeFileSync(path.join(__dirname, "broken-links.json"), JSON.stringify(broken, null, 2));
}

main();
