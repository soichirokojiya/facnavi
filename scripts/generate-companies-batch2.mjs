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
    slug: "betrading",
    name: "ビートレーディング",
    description: "累計取引社数8.5万社超、累積買取額1,745億円の業界最大手。最短2時間で入金。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=BETRADING",
    factoringType: "2社間・3社間",
    feeRange: { min: 2, max: 12 },
    minAmount: 10000,
    maxAmount: 700000000,
    speedDays: 1,
    onlineComplete: true,
    features: ["最短2時間入金", "累計8.5万社利用", "注文書ファクタリング対応", "オンライン完結", "全国5拠点"],
    pros: ["業界最大手の安心感", "最短2時間のスピード入金", "2者間・3者間の両方に対応"],
    cons: ["大手のため審査がやや厳しい場合も", "3社間は時間がかかる場合あり"],
    overallRating: 4.6,
    establishedYear: 2012,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "卸売業"],
  },
  {
    slug: "ququmo",
    name: "QuQuMo（ククモ）",
    description: "オンライン完結で最速2時間入金。手数料1%～14.8%、個人事業主もOK。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=QUQUMO",
    factoringType: "2社間",
    feeRange: { min: 1, max: 14.8 },
    minAmount: 10000,
    maxAmount: 0,
    speedDays: 1,
    onlineComplete: true,
    features: ["最速2時間入金", "手数料1%〜", "オンライン完結", "個人事業主OK", "金額上限なし"],
    pros: ["業界最安水準の手数料1%〜", "最速2時間で資金化", "必要書類が少ない"],
    cons: ["2者間のみ", "電話サポートの時間が限られる"],
    overallRating: 4.3,
    establishedYear: 2017,
    targetIndustries: ["IT・Web", "建設業", "製造業", "小売業", "サービス業"],
  },
  {
    slug: "gmo-btob",
    name: "GMO BtoB早払い",
    description: "GMOペイメントゲートウェイ運営。注文書・請求書の両方を買取可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=GMOBTOB",
    factoringType: "2社間",
    feeRange: { min: 1, max: 12 },
    minAmount: 1000000,
    maxAmount: 1000000000,
    speedDays: 2,
    onlineComplete: true,
    features: ["東証プライム上場企業運営", "注文書買取対応", "手数料1%〜", "オンライン完結", "法人専用"],
    pros: ["上場企業の信頼性", "注文書段階から買取可能", "大口取引にも対応"],
    cons: ["法人のみ対応（個人事業主不可）", "最短2営業日とやや遅め"],
    overallRating: 4.2,
    establishedYear: 1995,
    targetIndustries: ["製造業", "IT・Web", "卸売業", "建設業", "運送業"],
  },
  {
    slug: "ad-planning",
    name: "アドプランニング",
    description: "手数料2%～10%の業界最安水準。10万円からの少額買取にも対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=ADPLAN",
    factoringType: "2社間・3社間",
    feeRange: { min: 2, max: 10 },
    minAmount: 100000,
    maxAmount: 100000000,
    speedDays: 1,
    onlineComplete: true,
    features: ["手数料2%〜10%", "少額10万円から対応", "最短30分審査", "審査通過率88%", "資金繰りコンサル付き"],
    pros: ["業界最安水準の手数料", "少額からも利用可能", "コンサルティングサービス付き"],
    cons: ["知名度がやや低い", "大口案件は別途相談"],
    overallRating: 4.0,
    establishedYear: 2018,
    targetIndustries: ["IT・Web", "建設業", "小売業", "飲食業", "サービス業"],
  },
  {
    slug: "chusho-support",
    name: "日本中小企業金融サポート機構",
    description: "一般社団法人運営の安心感。手数料1.5%～10%で非営利ならではの低コスト。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=CHUSHO",
    factoringType: "2社間・3社間",
    feeRange: { min: 1.5, max: 10 },
    minAmount: 10000,
    maxAmount: 0,
    speedDays: 1,
    onlineComplete: true,
    features: ["一般社団法人運営", "手数料1.5%〜", "金額制限なし", "オンライン完結", "経営サポート付き"],
    pros: ["非営利法人で信頼性が高い", "低手数料", "経営改善のアドバイスも受けられる"],
    cons: ["知名度がやや低い", "土日祝は対応不可"],
    overallRating: 4.1,
    establishedYear: 2017,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "小売業"],
  },
  {
    slug: "zero-factoring",
    name: "ファクタリングZERO",
    description: "西日本エリアに強いファクタリング会社。手数料が安く地域密着型。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=ZEROFACT",
    factoringType: "2社間・3社間",
    feeRange: { min: 1.5, max: 10 },
    minAmount: 300000,
    maxAmount: 50000000,
    speedDays: 1,
    onlineComplete: true,
    features: ["西日本に強い", "手数料1.5%〜", "最短即日入金", "対面相談可", "個人事業主OK"],
    pros: ["西日本エリアに密着した対応", "手数料が安い", "対面でも相談可能"],
    cons: ["東日本では対面対応が難しい場合も", "大口案件は別途相談"],
    overallRating: 3.9,
    establishedYear: 2018,
    targetIndustries: ["建設業", "運送業", "製造業", "小売業", "飲食業"],
  },
];

let rank = nextRank;
let created = 0;
let skipped = 0;

for (const company of newCompanies) {
  if (existingSlugs.has(company.slug)) {
    console.log(`SKIPPED: ${company.slug} - ${company.name} (already exists)`);
    skipped++;
    continue;
  }
  const data = { ...company, rankPosition: rank };
  const filePath = path.join(companiesDir, `${company.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`CREATED: ${company.slug} - ${company.name}`);
  rank++;
  created++;
}

const total = existingFiles.length + created;
console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
console.log(`Total companies: ${total}`);
