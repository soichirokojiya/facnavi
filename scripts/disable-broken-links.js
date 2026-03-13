#!/usr/bin/env node
/**
 * リンク切れ会社のaffiliateUrlを空にする（コンテンツは残す）
 */
const fs = require("fs");
const path = require("path");

const companiesDir = path.join(__dirname, "../content/companies");

const brokenSlugs = new Set([
  "chatwork-sakibarai","saison-invoice","factor-com","showa-lease","anew",
  "mufg-factor","actbiz","ag-business","avantia","buy-factor","danbury",
  "dm-company","dmc-factoring","dokenkun","easy-factor","factoring-tokyo",
  "gmmi","jigyou-agent","life-factoring","line-profect","lucia",
  "luxel-partner","mainavy-factoring","next-funding","norikae-plus",
  "plus-line","progress-factoring","protect-one","s-radikal","sanko-factoring",
  "seikyusho-pay","sokuji-online","sokumu","supporter-bank","terasu",
  "tokyo-spc","wadatumi","west-factoring","animo","archier","aslead",
  "belle-system","biz-partner","business-fund","cool-services","crayfish",
  "cs-planning","cuc-factoring","denfac","efc-express","enable-factoring",
  "f-style","facnet","factor-associates","factoring-gold","factoring-north",
  "factors","faith-factoring","fakutarikun","finding-labo","finfin",
  "fps-medical","hamagin-finance","heartful-life","jfs","kensetsu-pay",
  "kkt","lagless","link-japan","mb-pay","minaoshi-honpo","mita-securities",
  "nihon-planner","nikkei-financial","ns-partners","oj-factoring","owl-keizai",
  "regu-pay","replan","rise-factoring","rising-investment","saison-medical",
  "sanctuary","sc-medical","shikin-honpo","shikinchotatsu-direct","shoko-shoji",
  "shukran","sig-solution","sms-financial","sol-support","ssk-factoring",
  "suga-finance","t-and-s","third-eye","tick","transaction-finance","whatever",
  "yamaki-shoji","zaimu-saisei","zaimukaikei-shien","linx-japan","next-style",
  "nx-capital","otti","prosper-consulting","sts-factoring","trusfort",
  "bion","factoring-japan","fukuoka-factoring","invoice-pay","japanfactor",
  "kensetsukun","minnano-factoring","onebank","quick-management","s-factoring",
  "shikin-quick","vistia","witt","alps-finance","central-medience","e-bank",
  "ebis-holdings","fast-factoring","growrize","healthee-one","jsc-factoring",
  "k-support","kosei","kyushu-factor","localworks-payment","make-move",
  "meisei-enterprise","ms-quest","rearth","rising","ryfety","s-com",
  "shikin-plus","sinsia","smart-factor","sokuderu","sokula","sowa-enterprise",
  "taihei-fs","tomin-shinpan","trust-pay","unity-factoring","zen-confiance",
  "zerofac",
]);

// SMBCは除外（WAFブロックの可能性）
const keepSlugs = new Set(["smbc-fs"]);

let updated = 0;
for (const slug of brokenSlugs) {
  if (keepSlugs.has(slug)) continue;
  const filePath = path.join(companiesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  data.affiliateUrl = "";
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  updated++;
}

console.log(`✅ ${updated}社のaffiliateUrlを無効化しました`);
