import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");

const existingFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
const existingSlugs = new Set(existingFiles.map(f => f.replace(".json", "")));
const nextRank = existingFiles.length + 1;

const newCompanies = [
  {
    slug: "vistia",
    name: "VISTIA（ヴィスティア）",
    description: "東京秋葉原拠点のファクタリング会社。法人向け売掛金買取サービスを提供。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=VISTIA",
    factoringType: "2社間・3社間",
    feeRange: { min: 3, max: 15 },
    minAmount: 100000,
    maxAmount: 50000000,
    speedDays: 1,
    onlineComplete: true,
    features: ["即日入金対応", "法人向け", "柔軟な審査", "全国対応", "少額対応"],
    pros: ["柔軟な審査基準", "即日入金可能", "対面でも相談可"],
    cons: ["知名度がやや低い", "手数料上限がやや高い"],
    overallRating: 3.7,
    establishedYear: 2019,
    targetIndustries: ["建設業", "運送業", "IT・Web", "製造業", "サービス業"],
  },
  {
    slug: "finto",
    name: "Finto（フィント）",
    description: "AI審査による最短翌日入金。手数料2%～9.5%。金額上限なし。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=FINTO",
    factoringType: "2社間",
    feeRange: { min: 2, max: 9.5 },
    minAmount: 10000,
    maxAmount: 0,
    speedDays: 2,
    onlineComplete: true,
    features: ["AI審査", "手数料2%〜9.5%", "金額制限なし", "オンライン完結", "カード後払いも対応"],
    pros: ["AI審査で手続きが早い", "手数料上限が低い", "金額制限なし"],
    cons: ["最短翌日と即日ではない", "知名度がやや低い"],
    overallRating: 3.9,
    establishedYear: 2020,
    targetIndustries: ["IT・Web", "小売業", "サービス業", "製造業", "広告業"],
  },
  {
    slug: "factoru",
    name: "FACTOR⁺U（ファクトル）",
    description: "日本中小企業金融サポート機構運営のAIファクタリング。手数料1.5%～、最短40分入金。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=FACTORU",
    factoringType: "2社間",
    feeRange: { min: 1.5, max: 10 },
    minAmount: 10000,
    maxAmount: 0,
    speedDays: 1,
    onlineComplete: true,
    features: ["AI審査", "最短40分入金", "手数料1.5%〜", "非営利法人運営", "必要書類2点のみ"],
    pros: ["非営利法人の安心感", "最短40分の超スピード", "必要書類が少ない"],
    cons: ["知名度がまだ低い", "2者間のみ"],
    overallRating: 4.0,
    establishedYear: 2017,
    targetIndustries: ["建設業", "運送業", "製造業", "IT・Web", "医療・介護"],
  },
];

let rank = nextRank;
let created = 0;
for (const company of newCompanies) {
  if (existingSlugs.has(company.slug)) {
    console.log("SKIPPED:", company.slug);
    continue;
  }
  const data = { ...company, rankPosition: rank };
  fs.writeFileSync(path.join(companiesDir, `${company.slug}.json`), JSON.stringify(data, null, 2));
  console.log("CREATED:", company.slug, "-", company.name);
  rank++;
  created++;
}
console.log(`\nDone! Created: ${created}, Total: ${existingFiles.length + created}`);
