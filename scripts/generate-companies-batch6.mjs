import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");
const existingFiles = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
const existingSlugs = new Set(existingFiles.map(f => f.replace(".json", "")));
let nextRank = existingFiles.length + 1;

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
    overallRating: opts.rating || 3.3,
    establishedYear: opts.year || 2018,
    targetIndustries: opts.industries || ["建設業", "運送業", "製造業", "IT・Web", "サービス業"],
  };
}

const newCompanies = [
  // Page 3
  c("cool-pay", "CoolPay", "クールペイはAIを活用したオンラインファクタリング。即日資金調達が可能。", { feeMin: 2, feeMax: 12, features: ["AI審査", "即日入金", "オンライン完結", "個人事業主OK", "全国対応"], rating: 3.5, year: 2020 }),
  c("active-support", "アクティブサポート", "中小企業の資金繰りを積極的にサポートするファクタリング会社。柔軟な審査が特長。", { rating: 3.3 }),

  // Page 4
  c("sokuderu", "ソクデル", "即日入金に特化したファクタリングサービス。スピード重視の資金調達。", { feeMin: 3, feeMax: 18, features: ["即日入金特化", "スピード対応", "個人事業主OK", "全国対応", "少額OK"], rating: 3.4 }),
  c("progress-factoring", "Progress", "売掛金買取のファクタリングサービス。中小企業・個人事業主向け。", { rating: 3.3 }),
  c("dokenkun", "土建くん", "建設業界専門のファクタリングサービス。工事代金の早期資金化に対応。", { feeMin: 3, feeMax: 15, features: ["建設業特化", "即日入金", "個人事業主OK", "全国対応", "工事代金対応"], industries: ["建設業"], rating: 3.4, year: 2019 }),
  c("kaipoke-early", "カイポケ早期入金", "エス・エム・エスが提供する介護事業者向けファクタリング。介護報酬の早期入金。", { type: "3社間", feeMin: 0.8, feeMax: 3, speed: 3, features: ["介護事業者特化", "低手数料", "介護報酬対応", "大手運営", "安心のサービス"], industries: ["医療・介護"], rating: 3.6, year: 2015 }),

  // Page 5
  c("3s-factoring", "3S", "スリーエスのファクタリングサービス。少額から大口まで対応。", { rating: 3.3 }),
  c("quick-factor", "クイックファクター", "その名の通りスピード重視のファクタリング。即日対応可能。", { feeMin: 3, feeMax: 15, features: ["即日入金", "スピード審査", "個人事業主OK", "全国対応", "オンライン対応"], rating: 3.4 }),
  c("shikin-honpo", "資金調達本舗", "資金調達の専門サービス。ファクタリングを中心とした資金繰り支援。", { rating: 3.3 }),
  c("s-com", "S-COM", "エスコムのファクタリングサービス。法人向け売掛金買取。", { rating: 3.3 }),

  // Page 6
  c("urikakekin-pay", "売掛金PAY JBL", "JBLが提供する売掛金買取サービス。法人・個人事業主対応。", { rating: 3.3, features: ["売掛金買取", "法人対応", "個人事業主OK", "全国対応", "柔軟な審査"] }),
  c("e-bank", "いーばんく", "オンライン特化のファクタリングサービス。手軽に資金調達が可能。", { feeMin: 3, feeMax: 15, features: ["オンライン完結", "即日入金", "個人事業主OK", "全国対応", "簡単手続き"], rating: 3.4, year: 2019 }),
  c("sokula", "SOKULA", "ソクラのファクタリングサービス。迅速な審査と入金が特長。", { feeMin: 2, feeMax: 15, features: ["迅速な審査", "即日入金", "オンライン対応", "個人事業主OK", "全国対応"], rating: 3.5 }),

  // Page 7
  c("global-service", "グローバルサービス", "ファクタリング・資金調達サービス。中小企業向けの柔軟な対応。", { rating: 3.3 }),
  c("shikin-plus", "SHIKIN+", "資金プラスのファクタリングサービス。中小企業・個人事業主の資金繰りを支援。", { feeMin: 3, feeMax: 15, features: ["即日入金", "個人事業主OK", "オンライン対応", "全国対応", "少額対応"], rating: 3.4 }),
  c("resona-ks", "りそな決済サービス", "りそなグループの決済サービス。ファクタリング・電子記録債権の買取に対応。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, online: false, minAmt: 5000000, maxAmt: 0, features: ["りそなグループ", "大手金融機関", "法人向け", "大口対応", "全国対応"], rating: 3.5, year: 2001 }),
  c("avantia", "アバンティア", "ファクタリングサービス。中小企業の資金調達をサポート。", { rating: 3.3 }),
  c("japan-trust", "日本トラスト", "法人向けファクタリング・資金調達サービス。信頼性の高い運営。", { rating: 3.4 }),

  // Page 8
  c("f-style", "F-style", "ファクタリング・資金調達サービス。個人事業主から法人まで対応。", { rating: 3.3 }),
  c("onfact", "onfact", "オンファクトのファクタリングサービス。オンラインで手軽に資金調達。", { feeMin: 2, feeMax: 12, features: ["オンライン完結", "即日入金", "個人事業主OK", "全国対応", "手軽な手続き"], rating: 3.5, year: 2020 }),
  c("fps-medical", "FPSメディカル", "医療・介護業界向けファクタリング。診療報酬・介護報酬の早期資金化。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["医療業界特化", "診療報酬対応", "介護報酬対応", "低手数料", "全国対応"], industries: ["医療・介護"], rating: 3.5, year: 2010 }),
  c("zist", "ZIST", "ファクタリングサービス。スピード審査と柔軟な対応。", { rating: 3.3 }),

  // Page 9
  c("aslead", "アスリード", "中小企業向けファクタリング会社。資金繰り改善をサポート。", { rating: 3.3 }),
  c("finfin", "FinFin", "FinFinファクタリング。個人事業主・中小企業向けの資金調達サービス。", { feeMin: 3, feeMax: 15, features: ["個人事業主OK", "即日入金", "オンライン対応", "全国対応", "柔軟な審査"], rating: 3.4 }),
  c("dm-company", "D&Mカンパニー", "ファクタリング・資金調達のコンサルティング会社。", { rating: 3.3 }),
  c("easy-factor", "Easy factor", "イージーファクターのファクタリングサービス。簡単・手軽な資金調達。", { feeMin: 2, feeMax: 14, features: ["簡単手続き", "即日入金", "オンライン完結", "個人事業主OK", "全国対応"], rating: 3.4, year: 2020 }),
  c("seikyusho-pay", "請求書買取Pay", "請求書を買い取るファクタリングサービス。中小企業・フリーランス向け。", { feeMin: 3, feeMax: 15, features: ["請求書買取", "即日入金", "個人事業主OK", "フリーランス対応", "全国対応"], rating: 3.4 }),
  c("kensetsu-pay", "建設Pay", "建設業界向けファクタリングサービス。工事代金の早期資金化に対応。", { feeMin: 3, feeMax: 15, features: ["建設業特化", "即日入金", "個人事業主OK", "全国対応", "工事代金対応"], industries: ["建設業"], rating: 3.4, year: 2019 }),
  c("factor-associates", "ファクターアソシエイツ", "ファクタリング専門会社。法人向け売掛金の買取サービス。", { rating: 3.3 }),
  c("sokuji-online", "即日オンラインファクタリング", "即日・オンライン完結のファクタリングサービス。スピード重視。", { feeMin: 3, feeMax: 18, features: ["即日入金", "オンライン完結", "スピード審査", "個人事業主OK", "全国対応"], rating: 3.4 }),

  // Page 10
  c("sol-support", "SOL support", "ファクタリング・資金調達サービス。中小企業をサポート。", { rating: 3.3 }),
  c("buy-factor", "BuyFactor", "売掛金の買取に特化したファクタリングサービス。", { feeMin: 3, feeMax: 15, features: ["売掛金買取", "即日入金", "オンライン対応", "個人事業主OK", "全国対応"], rating: 3.4 }),
  c("protect-one", "プロテクト・ワン", "ファクタリング・資金調達サービス。安心の対応。", { rating: 3.3 }),
  c("terasu", "Terasu", "ファクタリングサービス。中小企業の資金繰りを照らす。", { rating: 3.3 }),
  c("fast-factoring", "ファストファクタリング", "スピード重視のファクタリング会社。最短即日入金。", { feeMin: 3, feeMax: 18, features: ["最短即日", "スピード審査", "オンライン対応", "個人事業主OK", "全国対応"], rating: 3.4 }),
  c("chatwork-sakibarai", "Chatwork先払い", "Chatworkが提供する先払いサービス。請求書の早期資金化。", { feeMin: 1, feeMax: 10, features: ["Chatwork連携", "オンライン完結", "請求書買取", "法人向け", "テクノロジー活用"], rating: 3.5, year: 2020 }),
  c("mb-pay", "MBpay", "ファクタリングサービス。中小企業・個人事業主向け。", { rating: 3.3 }),
  c("medley-fs", "メドレーフィナンシャルサービス", "医療・介護業界向けファイナンスサービス。診療報酬ファクタリング。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["医療業界特化", "診療報酬対応", "低手数料", "法人向け", "全国対応"], industries: ["医療・介護"], rating: 3.5, year: 2015 }),

  // Page 11
  c("central-medience", "セントラルメディエンスペイメンツ", "医療・調剤報酬ファクタリング。医療機関向けの資金調達。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["医療機関向け", "調剤報酬対応", "低手数料", "全国対応", "専門スタッフ"], industries: ["医療・介護"], rating: 3.4 }),
  c("actbiz", "アクトビズ", "ファクタリング・資金調達サービス。中小企業向け。", { rating: 3.3 }),
  c("trust-pay", "トラストペイ", "メディアプロが運営するトラストペイ。ファクタリングサービス。", { rating: 3.3 }),
  c("cuc-factoring", "CUC", "ファクタリングサービス。法人向けの資金調達。", { rating: 3.3 }),
  c("sfi-leasing", "SFIリーシング", "リース・ファクタリングサービス。法人向け資金調達。", { type: "3社間", feeMin: 1, feeMax: 8, speed: 3, online: false, features: ["リース対応", "ファクタリング", "法人向け", "全国対応", "大口対応"], rating: 3.3, year: 2005 }),
  c("minaoshi-honpo", "ファクタリング見直し本舗", "ファクタリングの乗り換え・見直しに特化したサービス。", { feeMin: 2, feeMax: 12, features: ["乗り換え特化", "手数料改善", "無料相談", "全国対応", "個人事業主OK"], rating: 3.4 }),
  c("rising", "ライジング", "ファクタリングサービス。中小企業の資金調達をサポート。", { rating: 3.3 }),
  c("saison-invoice", "SAISON INVOICE", "セゾンが提供するインボイスファクタリング。大手の安心感。", { feeMin: 1, feeMax: 8, speed: 2, features: ["セゾングループ", "大手運営", "法人向け", "オンライン対応", "全国対応"], rating: 3.6, year: 2019 }),

  // Page 12
  c("paybridge", "PAYBRIDGE", "ファクタリング・決済サービス。中小企業の資金調達に対応。", { rating: 3.3 }),
  c("yamato-credit", "ヤマトクレジットファイナンス", "ヤマトグループのクレジット・ファクタリングサービス。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["ヤマトグループ", "大手運営", "法人向け", "安心のサービス", "全国対応"], rating: 3.5, year: 2002 }),
  c("life-factoring", "ライフ", "ファクタリングサービス。中小企業の資金繰り改善をサポート。", { rating: 3.3 }),
  c("smbc-fs", "SMBCファイナンスサービス", "三井住友銀行グループのファイナンスサービス。ファクタリング対応。", { type: "3社間", feeMin: 0.5, feeMax: 3, speed: 5, online: false, minAmt: 10000000, maxAmt: 0, features: ["三井住友グループ", "大手金融機関", "低手数料", "法人向け", "大口対応"], rating: 3.7, year: 1988 }),
  c("ns-partners", "NS PARTNERS", "ファクタリング・コンサルティングサービス。", { rating: 3.3 }),
  c("factoring-north", "ファクタリングノース", "北海道拠点のファクタリング会社。地元密着の対応。", { features: ["北海道拠点", "地域密着", "即日入金", "個人事業主OK", "対面相談可"], industries: ["建設業", "運送業", "農業", "水産業", "サービス業"], rating: 3.4 }),
  c("sms-financial", "SMSフィナンシャル", "ファイナンシャルサービス。ファクタリング対応。", { rating: 3.3 }),
  c("taihei-fs", "太平フィナンシャルサービス", "ファクタリング・リースのファイナンスサービス。", { type: "3社間", feeMin: 1, feeMax: 8, speed: 3, features: ["リース対応", "ファクタリング", "法人向け", "全国対応", "安定経営"], rating: 3.4, year: 2000 }),

  // Page 13
  c("factbank", "ファクトバンク", "ファクタリングの比較・マッチングサービス。最適な会社を紹介。", { feeMin: 2, feeMax: 15, features: ["比較サービス", "マッチング", "複数社提案", "無料相談", "全国対応"], rating: 3.4 }),
  c("denshi-hayabarai", "電子請求書早払い", "電子請求書の早払いサービス。オンライン完結のファクタリング。", { feeMin: 1, feeMax: 8, features: ["電子請求書対応", "オンライン完結", "即日入金", "法人向け", "テクノロジー活用"], rating: 3.5, year: 2020 }),
  c("localworks-payment", "ローカルワークスペイメント", "地域密着型のファクタリングサービス。建設業界に強い。", { features: ["地域密着", "建設業界に強い", "即日入金", "個人事業主OK", "柔軟な審査"], industries: ["建設業", "運送業"], rating: 3.3 }),
  c("tranzax", "Tranzax", "電子記録債権を活用したファクタリングサービス。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["電子記録債権", "テクノロジー活用", "法人向け", "全国対応", "低手数料"], rating: 3.5, year: 2016 }),

  // Page 14
  c("growrize", "グローライズ", "ファクタリング・資金調達サービス。成長企業をサポート。", { rating: 3.3 }),
  c("ryfety", "ライフティ", "ファクタリングサービス。個人事業主・法人向け資金調達。", { rating: 3.3 }),
  c("faith-factoring", "faith", "ファクタリングサービス。中小企業の資金繰りをサポート。", { rating: 3.3 }),
  c("finding-labo", "ファインディングラボ", "ファクタリング会社の比較・検索サービス。最適な業者を見つける。", { feeMin: 2, feeMax: 15, features: ["比較サービス", "無料相談", "複数社提案", "全国対応", "個人事業主OK"], rating: 3.4 }),
  c("fukuoka-bank-ep", "福岡銀行アーリーペイメント", "福岡銀行グループのファクタリングサービス。九州地域に強い。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["福岡銀行グループ", "九州に強い", "法人向け", "大手金融機関", "安心のサービス"], industries: ["建設業", "運送業", "製造業", "サービス業", "小売業"], rating: 3.5, year: 2018 }),
  c("regu-pay", "レグペイ", "ファクタリングサービス。法人向けの資金調達。", { rating: 3.3 }),

  // Page 15
  c("ssk-factoring", "SSKファクタリング", "SSKホールディングスのファクタリングサービス。", { rating: 3.3 }),
  c("ebis-holdings", "エビスホールディングス", "ファクタリング・資金調達を提供するホールディングス会社。", { rating: 3.3 }),
  c("next-funding", "NEXTFUNDING", "ファクタリングサービス。次世代の資金調達を提供。", { feeMin: 3, feeMax: 15, features: ["即日入金", "オンライン対応", "個人事業主OK", "全国対応", "柔軟な審査"], rating: 3.4 }),
  c("factoring-tokyo", "ファクタリング東京", "東京拠点のファクタリング会社。首都圏に強い。", { features: ["東京拠点", "首都圏に強い", "即日入金", "個人事業主OK", "対面相談可"], rating: 3.4 }),
  c("make-move", "メイク・ムーヴ", "ファクタリングサービス。中小企業の資金調達をサポート。", { rating: 3.3 }),
  c("ntt-tc-lease", "NTT・TCリース", "NTTグループのリース・ファクタリングサービス。", { type: "3社間", feeMin: 0.5, feeMax: 5, speed: 5, online: false, minAmt: 10000000, maxAmt: 0, features: ["NTTグループ", "大手運営", "法人向け", "リース対応", "全国対応"], rating: 3.6, year: 1985 }),
  c("unity-factoring", "UNITY", "ファクタリングサービス。法人・個人事業主対応。", { rating: 3.3 }),
  c("supporter-bank", "サポートバンク", "中小企業の資金調達をサポートするファクタリング会社。", { rating: 3.3 }),
  c("heartful-life", "ハートフルライフ", "ファクタリング・資金調達サービス。親身な対応が特長。", { features: ["親身な対応", "即日入金", "個人事業主OK", "全国対応", "柔軟な審査"], rating: 3.3 }),

  // Page 16
  c("danbury", "ダンバリコンサルティング", "ファクタリング・コンサルティングサービス。", { rating: 3.3 }),
  c("business-fund", "ビジネスファンド", "ファクタリング・事業資金調達サービス。中小企業向け。", { rating: 3.3 }),
  c("belle-system", "ベルシステム", "ファクタリングサービス。法人向け資金調達。", { rating: 3.3 }),
  c("zaimukaikei-shien", "財務会計支援機構", "ファクタリング・財務コンサルティングサービス。", { features: ["財務コンサル", "ファクタリング", "経営支援", "全国対応", "法人向け"], rating: 3.3 }),
  c("shoko-shoji", "晶光商事", "ファクタリング・金融サービス。中小企業の資金繰り支援。", { rating: 3.3, year: 2005 }),
  c("saison-medical", "セゾン診療報酬ファクタリング", "セゾンが提供する診療・介護・調剤報酬ファクタリング。", { type: "3社間", feeMin: 0.5, feeMax: 3, speed: 5, features: ["セゾングループ", "医療機関向け", "診療報酬対応", "介護報酬対応", "調剤報酬対応"], industries: ["医療・介護"], rating: 3.6, year: 2000 }),

  // Page 17
  c("tick", "ティック", "ファクタリングサービス。迅速な対応で中小企業をサポート。", { rating: 3.3 }),
  c("ms-quest", "エムズクエスト", "ファクタリング・資金調達コンサルティング。", { rating: 3.3 }),
  c("zen-confiance", "善コンフィアンス", "ファクタリングサービス。中小企業向け資金調達。", { rating: 3.3 }),
  c("shikinchotatsu-direct", "資金調達ダイレクト", "ファクタリングの直接取引サービス。中間マージンなし。", { feeMin: 2, feeMax: 12, features: ["直接取引", "中間マージンなし", "即日入金", "個人事業主OK", "全国対応"], rating: 3.4 }),
  c("oj-factoring", "オージェイ", "ファクタリング・資金調達サービス。大阪拠点。", { features: ["大阪拠点", "関西に強い", "即日入金", "個人事業主OK", "対面相談可"], rating: 3.3 }),
  c("healthee-one", "HealtheeOne", "医療・ヘルスケア業界向けファクタリングサービス。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["医療業界特化", "ヘルスケア対応", "法人向け", "全国対応", "専門スタッフ"], industries: ["医療・介護"], rating: 3.4 }),
  c("k-support", "Kサポート", "ファクタリング・資金調達のサポートサービス。", { rating: 3.3 }),
  c("gmmi", "喜望大地", "ファクタリングサービス。中小企業の成長を支援。", { rating: 3.3 }),

  // Page 18
  c("tomin-shinpan", "トミンシンパン", "東京・都民信販のファクタリングサービス。首都圏に強い。", { features: ["東京拠点", "首都圏に強い", "即日入金", "個人事業主OK", "対面相談可"], rating: 3.3, year: 2000 }),
  c("meisei-enterprise", "明成エンタープライズ", "ファクタリング・資金調達サービス。中小企業向け。", { rating: 3.3 }),
  c("i-service", "iサービス", "ファクタリングサービス。オンライン対応の資金調達。", { feeMin: 3, feeMax: 15, features: ["オンライン対応", "即日入金", "個人事業主OK", "全国対応", "柔軟な審査"], rating: 3.3 }),
  c("seino-financial", "セイノーフィナンシャル", "セイノーグループのファイナンスサービス。物流業界に強い。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["セイノーグループ", "物流業界に強い", "法人向け", "大手運営", "全国対応"], industries: ["運送業", "物流", "製造業"], rating: 3.5, year: 2000 }),
  c("sanctuary", "サンクチュアリ", "ファクタリングサービス。中小企業の資金繰り改善。", { rating: 3.3 }),
  c("lagless", "ラグレス", "ファクタリングサービス。タイムラグのない資金調達を目指す。", { feeMin: 3, feeMax: 15, features: ["即日入金", "スピード重視", "個人事業主OK", "全国対応", "オンライン対応"], rating: 3.4 }),
  c("sinsia", "シンシア", "ファクタリング・資金調達サービス。真摯な対応。", { rating: 3.3 }),
  c("s-radikal", "S-radikal", "ファクタリングサービス。中小企業向け資金調達。", { rating: 3.3 }),
  c("fakutarikun", "ふぁくたりくん", "手軽にファクタリングが利用できるサービス。個人事業主OK。", { feeMin: 3, feeMax: 18, features: ["手軽に利用", "個人事業主OK", "即日入金", "全国対応", "オンライン対応"], rating: 3.4 }),

  // Page 19
  c("sk-service", "SKサービス", "ファクタリング・資金調達サービス。中小企業向け。", { rating: 3.3 }),
  c("zerofac", "ZEROファク", "手数料の低さが特長のファクタリングサービス。", { feeMin: 1, feeMax: 10, features: ["低手数料", "即日入金", "オンライン対応", "個人事業主OK", "全国対応"], rating: 3.5 }),
  c("smfl", "SMFL", "三井住友ファイナンス＆リースのファクタリングサービス。", { type: "3社間", feeMin: 0.5, feeMax: 3, speed: 5, online: false, minAmt: 10000000, maxAmt: 0, features: ["三井住友グループ", "大手金融機関", "法人向け", "大口対応", "リース対応"], rating: 3.7, year: 1963 }),
  c("luxel-partner", "ラクセルパートナー", "ファクタリングサービス。中小企業の資金繰りをサポート。", { rating: 3.3 }),
  c("kosei", "コーセイ", "ファクタリング・資金調達サービス。", { rating: 3.3 }),

  // Page 20
  c("west-factoring", "WEST", "ファクタリングサービス。西日本を中心に対応。", { features: ["西日本中心", "即日入金", "個人事業主OK", "全国対応", "対面相談可"], rating: 3.3 }),
  c("denfac", "電ふぁく", "電子ファクタリングサービス。オンライン完結。", { feeMin: 2, feeMax: 12, features: ["電子対応", "オンライン完結", "即日入金", "個人事業主OK", "全国対応"], rating: 3.4 }),
  c("lucia", "ルシア", "ファクタリングサービス。柔軟な対応。", { rating: 3.3 }),
  c("replan", "リプラン", "ファクタリングの乗り換え・再プランニングサービス。", { feeMin: 2, feeMax: 12, features: ["乗り換え対応", "手数料改善", "無料相談", "個人事業主OK", "全国対応"], rating: 3.4 }),
  c("ichifuku", "一福", "ファクタリングサービス。中小企業向け資金調達。", { rating: 3.3 }),
  c("nec-capital", "NECキャピタルソリューション", "NECグループのファイナンスサービス。リース・ファクタリング。", { type: "3社間", feeMin: 0.5, feeMax: 3, speed: 5, online: false, minAmt: 10000000, maxAmt: 0, features: ["NECグループ", "大手運営", "法人向け", "リース対応", "全国対応"], rating: 3.6, year: 1978 }),
  c("alps-finance", "アルプスファイナンスサービス", "ファクタリング・金融サービス。地域密着型。", { rating: 3.3 }),
  c("tokyo-century", "東京センチュリー", "伊藤忠・みずほグループのリース・ファクタリング。大手の安心感。", { type: "3社間", feeMin: 0.5, feeMax: 3, speed: 5, online: false, minAmt: 10000000, maxAmt: 0, features: ["伊藤忠・みずほグループ", "大手金融機関", "法人向け", "リース対応", "全国対応"], rating: 3.7, year: 1969 }),

  // Page 21
  c("jsc-factoring", "JSC", "ファクタリング・資金調達サービス。法人向け。", { rating: 3.3 }),
  c("sc-medical", "SCメディカル", "医療業界向けファクタリング。診療報酬の早期資金化。", { type: "3社間", feeMin: 1, feeMax: 5, speed: 3, features: ["医療業界特化", "診療報酬対応", "法人向け", "全国対応", "専門スタッフ"], industries: ["医療・介護"], rating: 3.4 }),
  c("smart-factor", "スマートファクター", "スマートなファクタリングサービス。オンラインで簡単手続き。", { feeMin: 2, feeMax: 12, features: ["オンライン完結", "スマート審査", "即日入金", "個人事業主OK", "全国対応"], rating: 3.5, year: 2020 }),
  c("plus-line", "プラスライン", "ファクタリング・資金調達サービス。中小企業向け。", { rating: 3.3 }),
  c("wadatumi", "ワダツミ", "ファクタリングサービス。中小企業の資金繰りを改善。", { rating: 3.3 }),
  c("efc-express", "資金調達特急便EFC", "EFCの資金調達特急便。即日ファクタリングに対応。", { feeMin: 3, feeMax: 18, features: ["即日入金", "スピード重視", "個人事業主OK", "全国対応", "オンライン対応"], rating: 3.4 }),
  c("sowa-enterprise", "創和エンタープライズ", "ファクタリング・経営コンサルティング。中小企業向け。", { features: ["経営コンサル", "ファクタリング", "中小企業向け", "全国対応", "柔軟な審査"], rating: 3.3 }),

  // Page 22
  c("sig-solution", "SIGソリューション", "ファクタリング・ソリューションサービス。法人向け。", { rating: 3.3 }),
  c("nikkei-financial", "日経フィナンシャルトライ東京", "ファクタリング・ファイナンスサービス。東京拠点。", { features: ["東京拠点", "ファイナンス", "法人向け", "全国対応", "即日対応"], rating: 3.3 }),
  c("kyushu-factor", "九州ファクター", "九州拠点のファクタリング会社。九州地域に密着。", { features: ["九州拠点", "地域密着", "即日入金", "個人事業主OK", "対面相談可"], industries: ["建設業", "運送業", "製造業", "農業", "サービス業"], rating: 3.4 }),
  c("rearth", "REARTH", "ファクタリングサービス。リアースの資金調達。", { rating: 3.3 }),
  c("ys-corporation", "Y's Corporation", "ファクタリングサービス。法人向け資金調達。", { rating: 3.3 }),
];

let added = 0;
let skipped = 0;
for (const company of newCompanies) {
  if (existingSlugs.has(company.slug)) {
    console.log(`SKIP (exists): ${company.slug}`);
    skipped++;
    continue;
  }
  company.rankPosition = nextRank++;
  const filePath = path.join(companiesDir, `${company.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(company, null, 2));
  console.log(`Created: ${company.slug} (rank ${company.rankPosition})`);
  added++;
}

console.log(`\nDone! Added ${added}, skipped ${skipped}. Total: ${nextRank - 1} companies.`);
