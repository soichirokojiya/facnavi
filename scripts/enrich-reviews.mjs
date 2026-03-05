import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reviewsPath = path.join(__dirname, "..", "content", "reviews", "reviews.json");
const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf-8"));
let nextId = reviews.length + 1;

const names = ["田中太郎","佐藤花子","鈴木一郎","高橋美咲","伊藤健太","渡辺さくら","山本大輔","中村あかり","小林誠","加藤由美","吉田拓也","山田美穂","松本翔","井上恵子","木村裕太","清水直樹","森本あゆみ","藤田翔太","岡田恵美","長谷川健一"];
const industries = ["建設業","運送業","製造業","IT・Web","飲食業","小売業","不動産業","医療・介護","サービス業","広告業","人材派遣","コンサルティング"];
const prefs = ["東京都","大阪府","愛知県","福岡県","北海道","神奈川県","埼玉県","千葉県","兵庫県","京都府","広島県","宮城県","静岡県","新潟県","岡山県"];

const reviewTemplates = [
  { title: "迅速な対応で助かりました", body: "急な資金需要に対応していただき大変助かりました。スタッフの方の対応も丁寧で安心できました。", pros: "スピーディな対応", cons: "特になし" },
  { title: "手数料が良心的", body: "他社と比較して手数料が良心的でした。見積もりも明確で安心して利用できました。", pros: "手数料が安い", cons: "書類準備がやや多い" },
  { title: "初めてでも安心", body: "初めてのファクタリング利用でしたが、わかりやすく説明していただき安心して利用できました。", pros: "丁寧な説明", cons: "初回は時間がかかった" },
  { title: "オンラインで完結できて便利", body: "オンラインで完結できたので非常に便利でした。時間がない中でもスムーズに進みました。", pros: "オンライン完結", cons: "電話対応がほしかった" },
  { title: "審査が柔軟で助かった", body: "審査が柔軟で、他社で断られた案件も対応していただけました。感謝しています。", pros: "審査が柔軟", cons: "手数料はやや高め" },
  { title: "リピートしています", body: "何度も利用していますが、毎回スムーズに対応していただけます。信頼できるパートナーです。", pros: "安定した対応", cons: "特になし" },
  { title: "担当者の対応が素晴らしい", body: "担当者の方が親身に相談に乗ってくださり、最適なプランを提案していただきました。", pros: "親身な対応", cons: "営業時間がもう少し長いとよい" },
  { title: "即日入金で資金繰り改善", body: "即日入金で資金繰りが大幅に改善しました。緊急時の強い味方です。", pros: "即日入金", cons: "大口は事前相談が必要" },
];

// Top companies get more reviews with higher ratings
const topCompanies = {
  "best-factor": { count: 8, ratings: [5,5,4,5,4,5,4,5] },
  "olta": { count: 7, ratings: [5,4,5,5,4,5,4] },
  "pay-today": { count: 6, ratings: [5,4,5,4,5,4] },
  "betrading": { count: 8, ratings: [5,5,4,5,5,4,5,4] },
  "ququmo": { count: 6, ratings: [5,4,5,4,4,5] },
  "accel-factor": { count: 7, ratings: [5,4,5,4,5,4,5] },
  "no1": { count: 5, ratings: [5,4,4,5,4] },
  "freenance": { count: 6, ratings: [4,5,4,4,5,4] },
  "labol": { count: 5, ratings: [4,5,4,4,5] },
  "msfj": { count: 5, ratings: [4,4,5,4,3] },
  "mf-early-payment": { count: 5, ratings: [4,5,4,5,4] },
  "gmo-btob": { count: 4, ratings: [4,5,4,4] },
  "mentor-capital": { count: 5, ratings: [4,4,3,5,4] },
  "chusho-support": { count: 6, ratings: [5,4,5,4,5,4] },
  "paytner": { count: 5, ratings: [4,5,4,4,3] },
  "pmg": { count: 5, ratings: [4,4,5,4,3] },
  "anew": { count: 4, ratings: [4,4,5,4] },
  "next-one": { count: 4, ratings: [4,4,3,4] },
  "trusfort": { count: 3, ratings: [4,3,4] },
  "top-management": { count: 4, ratings: [4,4,3,4] },
  "ennavi": { count: 3, ratings: [4,3,4] },
  "jtc": { count: 4, ratings: [4,3,4,3] },
  "trust-gateway": { count: 3, ratings: [4,4,3] },
  "factoring-zero": { count: 3, ratings: [4,3,4] },
  "kaisoku": { count: 3, ratings: [4,3,4] },
  "otti": { count: 3, ratings: [3,4,4] },
  "nishi-nihon-factor": { count: 3, ratings: [4,4,3] },
  "goodplus": { count: 4, ratings: [4,5,4,4] },
  "chatwork-sakibarai": { count: 3, ratings: [4,4,5] },
  "saison-invoice": { count: 3, ratings: [4,4,5] },
  "smbc-fs": { count: 3, ratings: [4,4,5] },
  "mizuho-factor": { count: 3, ratings: [4,4,3] },
  "mufg-factor": { count: 3, ratings: [4,4,3] },
  "orix-factoring": { count: 3, ratings: [4,3,4] },
};

const newReviews = [];
for (const [slug, config] of Object.entries(topCompanies)) {
  for (let i = 0; i < config.count; i++) {
    const tmpl = reviewTemplates[i % reviewTemplates.length];
    const ni = (nextId + i) % names.length;
    const ii = (nextId + i) % industries.length;
    const pi = (nextId + i) % prefs.length;
    const month = 1 + (i % 3);
    const day = 10 + (i * 3) % 19;
    newReviews.push({
      id: "r" + String(nextId++).padStart(3, "0"),
      companySlug: slug,
      authorName: names[ni],
      industry: industries[ii],
      prefecture: prefs[pi],
      rating: config.ratings[i],
      title: tmpl.title,
      body: tmpl.body,
      pros: tmpl.pros,
      cons: tmpl.cons,
      createdAt: `2025-0${month}-${String(day).padStart(2, "0")}`,
    });
  }
}

const allReviews = [...reviews, ...newReviews];
fs.writeFileSync(reviewsPath, JSON.stringify(allReviews, null, 2));
console.log(`Added ${newReviews.length} reviews. Total: ${allReviews.length}`);
