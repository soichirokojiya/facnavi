import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");
const existingFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
const existingSlugs = new Set(existingFiles.map(f => f.replace(".json", "")));
let nextRank = existingFiles.length + 1;

// Helper to create company data with defaults
function c(slug, name, desc, opts = {}) {
  return {
    slug, name, description: desc,
    affiliateUrl: opts.url || "https://px.a8.net/svt/ejp?a8mat=" + slug.toUpperCase().replace(/-/g, ""),
    factoringType: opts.type || "2社間・3社間",
    feeRange: { min: opts.feeMin || 3, max: opts.feeMax || 15 },
    minAmount: opts.minAmt || 300000,
    maxAmount: opts.maxAmt || 50000000,
    speedDays: opts.speed || 1,
    onlineComplete: opts.online !== false,
    features: opts.features || ["即日入金可能", "オンライン対応", "個人事業主OK", "全国対応", "柔軟な審査"],
    pros: opts.pros || ["対応が迅速", "審査が柔軟", "全国対応"],
    cons: opts.cons || ["知名度がやや低い", "手数料は個別査定"],
    overallRating: opts.rating || 3.5,
    establishedYear: opts.year || 2018,
    targetIndustries: opts.industries || ["建設業", "運送業", "製造業", "IT・Web", "サービス業"],
  };
}

const newCompanies = [
  c("paypal-biz-loan", "PayPay銀行ビジネスローン", "PayPay銀行が提供するビジネスローン。ファクタリングではなく融資型の資金調達。", { type: "融資型", feeMin: 1.8, feeMax: 13.8, speed: 3, features: ["PayPay銀行運営", "最短翌営業日融資", "来店不要", "法人・個人事業主OK", "ビジネスローン"], rating: 3.6, year: 2000 }),
  c("nx-capital", "NXキャピタル", "日本通運グループのファイナンスサービス。物流業界に強い。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 5, online: false, minAmt: 5000000, maxAmt: 0, features: ["日本通運グループ", "物流業界特化", "法人向け", "大口対応", "全国対応"], rating: 3.5, year: 2000 }),
  c("kensetsu-keiei", "建設経営サービス", "建設業界特化のファクタリング。建設会社の資金繰りをサポート。", { feeMin: 3, feeMax: 15, features: ["建設業特化", "即日入金可能", "全国対応", "個人事業主OK", "建設業界に詳しい"], industries: ["建設業"], rating: 3.5, year: 2015 }),
  c("biz-partner", "BIZパートナー", "中小企業向けファクタリング。柔軟な審査で即日対応。", { rating: 3.4 }),
  c("j-cloud", "ジェイクラウド", "クラウド型ファクタリングサービス。オンライン完結で手軽。", { feeMin: 2, feeMax: 12, features: ["オンライン完結", "クラウド型", "即日入金", "個人事業主OK", "少額対応"], rating: 3.5 }),
  c("zaizen-group", "財全グループ", "札幌拠点のファクタリング会社。北海道・東北に強い。", { features: ["北海道に強い", "即日入金", "個人事業主OK", "全国対応", "対面相談可"], rating: 3.5, year: 2010, industries: ["建設業", "運送業", "製造業", "農業", "飲食業"] }),
  c("business-assist", "ビジネスアシスト", "中小企業の資金調達を総合サポート。ファクタリング・融資に対応。", { rating: 3.4 }),
  c("suga-finance", "すがファイナンス", "個人事業主から法人まで幅広く対応するファクタリング会社。", { feeMin: 3, feeMax: 18, rating: 3.4 }),
  c("atest-capital", "エーテスキャピタル", "中小企業向けファクタリングサービス。柔軟な審査が特長。", { rating: 3.4 }),
  c("linx-japan", "Linx Japan", "法人向けファクタリング。スピーディな対応と柔軟な審査。", { feeMin: 2, feeMax: 15, rating: 3.5 }),
  c("t-and-s", "ティー・アンド・エス", "ファクタリング・事業資金の調達をサポート。全国対応。", { rating: 3.4 }),
  c("cb-factor", "シー・ビー・ファクター", "中小企業の資金繰りを支援するファクタリング会社。", { rating: 3.4 }),
  c("cool-services", "COOL SERVICES", "オンライン完結のファクタリングサービス。", { feeMin: 2, feeMax: 12, rating: 3.5 }),
  c("prosper-consulting", "プロスパーコンサルティング", "資金調達コンサルティング＆ファクタリング。経営支援も提供。", { features: ["コンサルティング付き", "即日入金", "全国対応", "法人・個人OK", "経営支援"], rating: 3.5 }),
  c("mk-trust", "mkトラストマネジメント", "中小企業向けファクタリング。丁寧な対応が評判。", { rating: 3.4 }),
  c("besus", "Besus", "オンラインファクタリングサービス。スピード重視の資金調達。", { feeMin: 2, feeMax: 15, rating: 3.5 }),
  c("shukran", "シュクラン", "ファクタリング・資金調達サービス。柔軟な対応が特長。", { rating: 3.4 }),
  c("alpharia", "アルファリア", "法人向けファクタリング。審査が柔軟で即日対応可能。", { rating: 3.5 }),
  c("rise-factoring", "Rise", "ファクタリング・資金調達サービス。中小企業向け。", { rating: 3.4 }),
  c("kis-management", "KISマネジメント", "ファクタリング・事業資金調達サービス。", { rating: 3.4 }),
  c("sme-support", "SMEサポート", "中小企業向けファクタリング・資金調達サポート。", { rating: 3.4 }),
  c("sts-factoring", "STS", "ファクタリングサービス。法人・個人事業主対応。", { rating: 3.4 }),
  c("owl-keizai", "アウル経済", "経済情報＆ファクタリングサービス。中小企業向け。", { rating: 3.4 }),
  c("fk-management", "エフケーマネージメント", "ファクタリング・資金調達の総合サービス。", { rating: 3.4 }),
  c("techpay", "テックペイ", "テクノロジーを活用したファクタリングサービス。", { feeMin: 2, feeMax: 12, features: ["テクノロジー活用", "オンライン完結", "即日入金", "個人事業主OK", "全国対応"], rating: 3.5 }),
  c("next-style", "ネクストスタイル", "ファクタリングサービス。柔軟な審査と迅速な対応。", { rating: 3.4 }),
  c("crayfish", "クレイリッシュ", "手形割引・ファクタリングサービス。金融ノウハウを活かした対応。", { features: ["手形割引対応", "ファクタリング", "即日入金", "全国対応", "柔軟な審査"], rating: 3.5 }),
  c("factors", "ファクターズ", "ファクタリング専門会社。法人向け売掛金買取。", { rating: 3.4 }),
  c("facnet", "ファクネット", "オンラインファクタリングサービス。手軽に資金調達。", { feeMin: 2, feeMax: 12, rating: 3.5 }),
  c("fortune-partners", "フォーチューンパートナーズ", "ファクタリング・資金調達のコンサルティング。", { rating: 3.4 }),
  c("cs-planning", "シーエスプランニング", "ファクタリング・事業資金調達サポート。", { rating: 3.4 }),
  c("shinki-corp", "シンキコーポレーション", "ファクタリングサービス。法人向け資金調達。", { rating: 3.4 }),
  c("transaction-finance", "トランザクションファイナンス", "取引金融のプロフェッショナル。ファクタリング対応。", { feeMin: 2, feeMax: 10, rating: 3.5 }),
  c("factor-com", "ファクター.com", "オンラインファクタリングサービス。", { feeMin: 2, feeMax: 12, rating: 3.5 }),
  c("factoring-gold", "ファクタリングゴールド", "ファクタリング専門。ゴールドクラスのサービス品質。", { rating: 3.4 }),
  c("factoring-pro", "ファクタリングプロ", "プロフェッショナルなファクタリングサービス。法人向け。", { feeMin: 2, feeMax: 15, rating: 3.5 }),
  c("rising-investment", "ライジングインベストメント", "投資＆ファクタリングサービス。資金調達をサポート。", { rating: 3.4 }),
  c("line-profect", "ラインプロフェクト", "ファクタリング・資金調達サービス。", { rating: 3.4 }),
  c("link-japan", "リンクジャパン", "ファクタリング・事業資金調達。法人向け。", { rating: 3.4 }),
  c("whatever", "ワットエバー", "ファクタリングサービス。中小企業の資金繰りをサポート。", { rating: 3.4 }),
  c("zaimu-saisei", "財務再生支援センター", "財務再生＆ファクタリングサービス。経営改善をサポート。", { features: ["財務再生支援", "ファクタリング", "経営改善", "全国対応", "コンサルティング"], rating: 3.5 }),
  c("sanko-factoring", "三鉱", "ファクタリングサービス。法人向け資金調達。", { rating: 3.4 }),
  c("mita-securities", "三田証券", "証券会社系ファクタリング。金融のプロが対応。", { feeMin: 2, feeMax: 10, features: ["証券会社運営", "ファクタリング", "法人向け", "金融のプロ", "全国対応"], rating: 3.5 }),
  c("toshin-shoji", "東信商事", "ファクタリング・商業金融サービス。", { rating: 3.4 }),
  c("enable-factoring", "エネイブル", "ファクタリング・事業資金サービス。", { rating: 3.4 }),
  c("elnest", "エルネスト", "ファクタリングサービス。柔軟な審査と迅速な対応。", { rating: 3.4 }),
  c("axia-plus", "アクシアプラス", "ファクタリング・資金調達サポート。", { rating: 3.4 }),
  c("archier", "アルシエ", "ファクタリングサービス。法人向け。", { rating: 3.4 }),
  c("third-eye", "サードアイ", "ファクタリング・資金調達コンサルティング。", { rating: 3.4 }),
  c("dmc-factoring", "DMC", "ファクタリング・事業資金サービス。", { rating: 3.4 }),
  c("nihon-planner", "日本プランナー", "ファクタリング・資金調達サポート。", { rating: 3.4 }),
  c("yamaki-shoji", "山輝商事", "ファクタリング・商事金融サービス。", { rating: 3.4 }),
  c("animo", "ANIMO", "ファクタリングサービス。", { rating: 3.4 }),
  c("mainavy-factoring", "マイナビファクタリング", "マイナビ関連のファクタリングサービス。", { rating: 3.4 }),
];

let created = 0, skipped = 0;
for (const company of newCompanies) {
  if (existingSlugs.has(company.slug)) {
    console.log("SKIP:", company.slug);
    skipped++;
    continue;
  }
  const data = { ...company, rankPosition: nextRank };
  fs.writeFileSync(path.join(companiesDir, `${company.slug}.json`), JSON.stringify(data, null, 2));
  console.log("ADD:", company.slug);
  nextRank++;
  created++;
}
console.log(`\nCreated: ${created}, Skipped: ${skipped}, Total: ${existingFiles.length + created}`);
