import Link from "next/link";
import { getAllCompanies } from "@/lib/companies";
import { getAllReviewsAsync } from "@/lib/reviews";
import { getAllArticles } from "@/lib/articles";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Logo } from "@/components/layout/Logo";
import { formatFeeRange, formatAmount } from "@/lib/format";
import { KeywordSearch, SearchableCompany } from "@/components/search/KeywordSearch";
import { FAQ_DATA } from "@/lib/faq";
import { CurrentDate } from "@/components/ui/CurrentDate";
import { FixedCTA } from "@/components/layout/FixedCTA";

/* ─── 装飾SVG ─── */

function WaveDivider({ flip = false, color = "#f8fafc" }: { flip?: boolean; color?: string }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}>
      <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px]">
        <path d="M0,40 C300,80 900,0 1200,40 L1200,80 L0,80 Z" fill={color} />
      </svg>
    </div>
  );
}

/* ヒーロー：ビジネスパーソンがスマホ・PCで比較しているイラスト */
function HeroIllust() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className="w-full max-w-md mx-auto" aria-hidden="true">
      {/* 背景のゆるい雲 */}
      <ellipse cx="80" cy="30" rx="50" ry="14" fill="#bfdbfe" opacity="0.3" />
      <ellipse cx="320" cy="22" rx="40" ry="10" fill="#a7f3d0" opacity="0.3" />
      <ellipse cx="200" cy="16" rx="30" ry="8" fill="#fde68a" opacity="0.25" />

      {/* 左の人物（女性・スマホ） */}
      <circle cx="100" cy="80" r="18" fill="#fbbf24" />
      <circle cx="100" cy="75" r="13" fill="#fef3c7" />
      <circle cx="96" cy="73" r="1.5" fill="#374151" />
      <circle cx="104" cy="73" r="1.5" fill="#374151" />
      <path d="M97 78 Q100 81 103 78" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* 髪 */}
      <path d="M87 72 Q87 58 100 58 Q113 58 113 72" fill="#f59e0b" />
      <rect x="88" y="100" width="24" height="36" rx="8" fill="#60a5fa" />
      {/* 腕・スマホ */}
      <line x1="112" y1="110" x2="128" y2="105" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      <rect x="124" y="96" width="14" height="22" rx="3" fill="#1e3a5f" />
      <rect x="126" y="99" width="10" height="14" rx="1" fill="#93c5fd" />
      {/* 足 */}
      <line x1="95" y1="136" x2="92" y2="165" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
      <line x1="105" y1="136" x2="108" y2="165" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="92" cy="168" rx="8" ry="4" fill="#3b82f6" />
      <ellipse cx="108" cy="168" rx="8" ry="4" fill="#3b82f6" />

      {/* 中央の矢印（比較を表現） */}
      <path d="M155 120 L175 110 L175 115 L225 115 L225 110 L245 120 L225 130 L225 125 L175 125 L175 130 Z" fill="#10b981" opacity="0.2" />
      <text x="200" y="123" textAnchor="middle" fontSize="10" fill="#10b981" fontWeight="bold">比較</text>

      {/* 右の人物（男性・ノートPC） */}
      <circle cx="300" cy="80" r="18" fill="#6366f1" opacity="0.15" />
      <circle cx="300" cy="75" r="13" fill="#fef3c7" />
      <circle cx="296" cy="73" r="1.5" fill="#374151" />
      <circle cx="304" cy="73" r="1.5" fill="#374151" />
      <path d="M297 78 Q300 81 303 78" stroke="#374151" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* 短い髪 */}
      <path d="M287 71 Q288 60 300 59 Q312 60 313 71" fill="#374151" />
      <rect x="288" y="100" width="24" height="36" rx="8" fill="#34d399" />
      {/* 腕・ノートPC */}
      <line x1="288" y1="110" x2="265" y2="118" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      <rect x="248" y="118" width="30" height="20" rx="2" fill="#1e3a5f" />
      <rect x="250" y="120" width="26" height="14" rx="1" fill="#bfdbfe" />
      <line x1="250" y1="127" x2="276" y2="127" stroke="#60a5fa" strokeWidth="1" opacity="0.5" />
      <rect x="245" y="138" width="36" height="3" rx="1" fill="#94a3b8" />
      {/* 足 */}
      <line x1="295" y1="136" x2="292" y2="165" stroke="#34d399" strokeWidth="5" strokeLinecap="round" />
      <line x1="305" y1="136" x2="308" y2="165" stroke="#34d399" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="292" cy="168" rx="8" ry="4" fill="#10b981" />
      <ellipse cx="308" cy="168" rx="8" ry="4" fill="#10b981" />

      {/* キラキラ */}
      <path d="M160 70 L162 64 L164 70 L170 72 L164 74 L162 80 L160 74 L154 72 Z" fill="#fbbf24" opacity="0.5" />
      <path d="M240 65 L241 61 L242 65 L246 66 L242 67 L241 71 L240 67 L236 66 Z" fill="#60a5fa" opacity="0.4" />
      <path d="M50 110 L51 107 L52 110 L55 111 L52 112 L51 115 L50 112 L47 111 Z" fill="#34d399" opacity="0.35" />
      <path d="M350 100 L351 97 L352 100 L355 101 L352 102 L351 105 L350 102 L347 101 Z" fill="#f59e0b" opacity="0.35" />

      {/* 地面 */}
      <line x1="40" y1="175" x2="360" y2="175" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* 吹き出し（左） */}
      <rect x="55" y="40" width="40" height="20" rx="10" fill="white" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="75" y="54" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">安心!</text>
      <path d="M70 60 L75 67 L80 60" fill="white" stroke="#60a5fa" strokeWidth="1.5" />

      {/* 吹き出し（右） */}
      <rect x="305" y="40" width="40" height="20" rx="10" fill="white" stroke="#34d399" strokeWidth="1.5" />
      <text x="325" y="54" textAnchor="middle" fontSize="8" fill="#10b981" fontWeight="bold">簡単!</text>
      <path d="M320 60 L325 67 L330 60" fill="white" stroke="#34d399" strokeWidth="1.5" />
    </svg>
  );
}

/* 診断セクション：悩んでいる人→ひらめくイラスト */
function DiagnosisIllust() {
  return (
    <svg viewBox="0 0 200 150" fill="none" className="w-44 md:w-52 mx-auto" aria-hidden="true">
      {/* 人物 */}
      <circle cx="100" cy="50" r="20" fill="#fbbf24" opacity="0.15" />
      <circle cx="100" cy="45" r="15" fill="#fef3c7" />
      <circle cx="95" cy="43" r="1.8" fill="#374151" />
      <circle cx="105" cy="43" r="1.8" fill="#374151" />
      <path d="M96 49 Q100 52 104 49" stroke="#374151" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M85 41 Q86 30 100 29 Q114 30 115 41" fill="#f59e0b" />
      <rect x="88" y="68" width="24" height="34" rx="8" fill="#60a5fa" />
      {/* 右腕を上げてひらめき */}
      <line x1="112" y1="76" x2="130" y2="58" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      <line x1="88" y1="76" x2="72" y2="90" stroke="#fde68a" strokeWidth="5" strokeLinecap="round" />
      {/* 足 */}
      <line x1="95" y1="102" x2="90" y2="128" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
      <line x1="105" y1="102" x2="110" y2="128" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />

      {/* 電球（ひらめき） */}
      <circle cx="140" cy="40" r="14" fill="#fbbf24" opacity="0.2" />
      <circle cx="140" cy="40" r="10" fill="#fef3c7" stroke="#fbbf24" strokeWidth="2" />
      <line x1="140" y1="34" x2="140" y2="42" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <line x1="135" y1="38" x2="145" y2="38" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <rect x="137" y="50" width="6" height="4" rx="1" fill="#fbbf24" />

      {/* 光線 */}
      <line x1="140" y1="20" x2="140" y2="14" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="155" y1="28" x2="160" y2="24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      <line x1="125" y1="28" x2="120" y2="24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />

      {/* チェックマーク群 */}
      <g opacity="0.5">
        <circle cx="50" cy="50" r="8" fill="#ecfdf5" stroke="#10b981" strokeWidth="1.5" />
        <path d="M46 50 L49 53 L55 46" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="60" cy="80" r="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
        <path d="M57 80 L59 82 L63 78" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="155" cy="75" r="6" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
        <path d="M152 75 L154 77 L158 73" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <line x1="30" y1="135" x2="170" y2="135" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5 4" />
    </svg>
  );
}

/* 見積もりセクション：書類を比較するイラスト */
function EstimateIllust() {
  return (
    <svg viewBox="0 0 200 140" fill="none" className="w-40 md:w-48 mx-auto" aria-hidden="true">
      {/* 書類A */}
      <rect x="20" y="30" width="55" height="70" rx="6" fill="white" stroke="#93c5fd" strokeWidth="2" />
      <line x1="30" y1="48" x2="65" y2="48" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="58" x2="60" y2="58" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="68" x2="55" y2="68" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="78" x2="50" y2="78" stroke="#bfdbfe" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58" cy="85" r="6" fill="#10b981" opacity="0.3" />
      <path d="M55 85 L57 87 L62 82" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="36" width="20" height="6" rx="3" fill="#3b82f6" opacity="0.2" />

      {/* 書類B */}
      <rect x="125" y="30" width="55" height="70" rx="6" fill="white" stroke="#a7f3d0" strokeWidth="2" />
      <line x1="135" y1="48" x2="170" y2="48" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" />
      <line x1="135" y1="58" x2="165" y2="58" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" />
      <line x1="135" y1="68" x2="160" y2="68" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" />
      <line x1="135" y1="78" x2="155" y2="78" stroke="#bbf7d0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="163" cy="85" r="6" fill="#10b981" opacity="0.3" />
      <path d="M160 85 L162 87 L167 82" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="133" y="36" width="20" height="6" rx="3" fill="#10b981" opacity="0.2" />

      {/* 中央の虫眼鏡 */}
      <circle cx="100" cy="60" r="18" fill="#fef3c7" opacity="0.5" />
      <circle cx="100" cy="58" r="13" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
      <line x1="109" y1="67" x2="118" y2="76" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <path d="M95 55 L98 61 L105 53" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* 矢印 */}
      <path d="M80 65 L88 60" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
      <path d="M120 65 L112 60" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />

      {/* キラキラ */}
      <path d="M45 20 L46 16 L47 20 L51 21 L47 22 L46 26 L45 22 L41 21 Z" fill="#3b82f6" opacity="0.3" />
      <path d="M160 18 L161 15 L162 18 L165 19 L162 20 L161 23 L160 20 L157 19 Z" fill="#10b981" opacity="0.3" />

      <line x1="15" y1="115" x2="185" y2="115" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="5 4" />
    </svg>
  );
}

/* セクション見出し */
function SectionHeading({
  children,
  sub,
  right,
}: {
  children: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        {sub && <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-1">{sub}</p>}
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{children}</h2>
        <div className="w-10 h-1 bg-orange-500 rounded-full mt-2" />
      </div>
      {right}
    </div>
  );
}

export default async function HomePage() {
  const companies = getAllCompanies();
  const reviews = await getAllReviewsAsync();
  const articles = getAllArticles().slice(0, 6);
  const companyMap = Object.fromEntries(companies.map((c) => [c.slug, c.name]));
  const topFaq = FAQ_DATA.slice(0, 5);
  const faqCount = FAQ_DATA.length;
  const searchData: SearchableCompany[] = companies.map((c) => ({
    slug: c.slug,
    name: c.name,
    overallRating: c.overallRating,
    features: c.features,
  }));

  return (
    <>
      <OrganizationJsonLd />

      {/* ━━━ Hero ━━━ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
        {/* 装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-72 h-72 bg-emerald-200/25 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute top-16 left-[15%] w-3 h-3 bg-blue-400/40 rounded-full" />
          <div className="absolute top-32 right-[20%] w-2 h-2 bg-emerald-400/40 rounded-full" />
          <div className="absolute bottom-24 left-[10%] w-4 h-4 bg-orange-400/30 rounded-full" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-14 md:pt-14 md:pb-18 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>

          <p className="inline-block bg-blue-600 text-white font-bold px-5 py-2 rounded-full mb-4 text-sm md:text-base shadow-md shadow-blue-600/20">
            <span className="text-base md:text-lg">日本最大級</span>
            <span className="text-xs md:text-sm ml-2 opacity-90">— ファクタリング会社{companies.length}社掲載</span>
          </p>

          <h1 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight text-gray-900 tracking-tight">
            口コミと比較で選ぶ
            <br />
            <span className="text-blue-600">本当に良いファクタリング会社</span>に出会える
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            ファクタリング会社{companies.length}社の口コミ・評判を徹底比較。<br className="hidden sm:block" />
            手数料・スピード・口コミで選ぶおすすめランキング。
          </p>

          {/* イラスト */}
          <div className="mb-6">
            <HeroIllust />
          </div>

          {/* Stats */}
          <div className="inline-flex bg-white rounded-2xl shadow-lg shadow-blue-900/8 divide-x divide-gray-100 mb-4">
            <div className="px-8 py-4 text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600">{companies.length}</div>
              <div className="text-sm font-medium text-gray-500 mt-1">掲載社数</div>
            </div>
            <div className="px-8 py-4 text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-600">{reviews.length.toLocaleString()}</div>
              <div className="text-sm font-medium text-gray-500 mt-1">口コミ件数</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 font-medium mb-6">※ <CurrentDate /> 現在</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shindan"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-base rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              無料で診断する
            </Link>
            <Link
              href="/ranking"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-800 font-bold text-base rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              ランキングを見る
            </Link>
          </div>

          <div className="mt-8">
            <KeywordSearch companies={searchData} />
          </div>
        </div>
      </section>

      {/* ━━━ 3つの特徴ストリップ ━━━ */}
      <section className="bg-white py-10 md:py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                color: "blue",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <circle cx="24" cy="24" r="22" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                    <path d="M16 25 L22 31 L33 18" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "厳選された優良業者",
                desc: "独自審査をクリアした信頼性の高い業者のみ掲載",
              },
              {
                color: "emerald",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <circle cx="24" cy="24" r="22" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
                    <path d="M15 24 L20 20 L24 28 L28 16 L33 24" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "口コミで透明に比較",
                desc: "実際の利用者による口コミ・評判で公平に比較",
              },
              {
                color: "orange",
                icon: (
                  <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                    <circle cx="24" cy="24" r="22" fill="#fff7ed" stroke="#f59e0b" strokeWidth="2" />
                    <circle cx="24" cy="20" r="6" stroke="#f59e0b" strokeWidth="2.5" />
                    <path d="M14 36 C14 30 20 27 24 27 C28 27 34 30 34 36" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                ),
                title: "あなたに最適な1社",
                desc: "診断ツールで条件にピッタリの業者が見つかる",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ おすすめ TOP3 ━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-1">RECOMMEND</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">おすすめのファクタリング会社を比較</h2>
            <div className="w-10 h-1 bg-orange-500 rounded-full mt-2 mx-auto" />
            <p className="text-sm text-gray-500 mt-3">口コミ・評判で選ばれた厳選業者をご紹介</p>
            <p className="text-xs text-gray-400 mt-1">本ページにはプロモーションが含まれています</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.slice(0, 3).map((company, i) => (
              <div
                key={company.slug}
                className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col border ${
                  i === 0 ? "border-2 border-orange-400" : "border-gray-100"
                }`}
              >
                {i === 0 && (
                  <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    おすすめNo.1
                  </span>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-extrabold ${
                    i === 0 ? "bg-orange-500 text-white" : i === 1 ? "bg-gray-300 text-white" : "bg-amber-700 text-white"
                  }`}>
                    {company.rankPosition}
                  </span>
                  <div>
                    <Link href={`/ranking/${company.slug}`}>
                      <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        {company.name}
                      </h3>
                    </Link>
                    <StarRating rating={company.overallRating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1 leading-relaxed">
                  {company.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {company.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="primary">{f}</Badge>
                  ))}
                </div>
                <a
                  href={`/go/${company.slug}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="block text-center py-3 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  公式サイトを見る
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#f8fafc" />

      {/* ━━━ カテゴリ別ランキング ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-1">CATEGORY</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">カテゴリ別に比較・ランキング</h2>
            <div className="w-10 h-1 bg-orange-500 rounded-full mt-2 mx-auto" />
            <p className="text-sm text-gray-500 mt-3">重視するポイントで比較</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "総合ランキング", key: "overall" as const, emoji: "🏆" },
              { title: "手数料が安い", key: "fee" as const, emoji: "💰" },
              { title: "入金が早い", key: "speed" as const, emoji: "⚡" },
              { title: "口コミ人気", key: "review" as const, emoji: "⭐" },
            ].map((cat) => {
              const sorted = [...companies].sort((a, b) => {
                if (cat.key === "fee") return (a.feeRange.min + a.feeRange.max) / 2 - (b.feeRange.min + b.feeRange.max) / 2 || a.rankPosition - b.rankPosition;
                if (cat.key === "speed") return a.speedDays - b.speedDays || a.rankPosition - b.rankPosition;
                return a.rankPosition - b.rankPosition;
              });
              const top3 = sorted.slice(0, 3);
              return (
                <div key={cat.key} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">{cat.emoji}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{cat.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {top3.map((c, i) => (
                      <div key={c.slug} className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? "bg-orange-500 text-white" : i === 1 ? "bg-gray-300 text-white" : "bg-amber-700 text-white"
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Link href={`/ranking/${c.slug}`} className="text-sm font-bold hover:text-blue-600 transition-colors truncate block text-gray-800">
                            {c.name}
                          </Link>
                          <StarRating rating={c.overallRating} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDivider flip color="#f8fafc" />

      {/* ━━━ TOP10 詳細リスト ━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="TOP 10"
            right={
              <Link href="/ranking" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            ファクタリング会社 口コミ比較
          </SectionHeading>

          <div className="space-y-4">
            {companies.slice(0, 10).map((company, i) => (
              <div
                key={company.slug}
                className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 border ${
                  i === 0 ? "border-2 border-orange-400" : "border-gray-100"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center gap-3 md:w-56 flex-shrink-0">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-lg ${
                      i === 0 ? "bg-orange-500 text-white" : i === 1 ? "bg-gray-400 text-white" : i === 2 ? "bg-amber-700 text-white" : "bg-[#0b3d91] text-white"
                    }`}>
                      {company.rankPosition}
                    </span>
                    <div>
                      <Link href={`/ranking/${company.slug}`}>
                        <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
                          {company.name}
                        </h3>
                      </Link>
                      <StarRating rating={company.overallRating} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{company.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-400 text-xs block">手数料</span>
                        <span className="font-bold text-blue-600">{formatFeeRange(company.feeRange.min, company.feeRange.max)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">上限</span>
                        <span className="font-bold text-gray-900">{formatAmount(company.maxAmount)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">個人事業主</span>
                        <span className={`font-bold ${company.soleProprietorOk ? "text-green-600" : "text-gray-300"}`}>{company.soleProprietorOk ? "対応" : "−"}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs block">土日入金</span>
                        <span className={`font-bold ${company.weekendPayment ? "text-green-600" : "text-gray-300"}`}>{company.weekendPayment ? "対応" : "−"}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {company.features.slice(0, 4).map((f) => (
                        <Badge key={f} variant="gray">{f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:w-36 flex-shrink-0">
                    <a
                      href={`/go/${company.slug}`}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="block text-center py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                    >
                      公式サイトを見る
                    </a>
                    <Link
                      href={`/ranking/${company.slug}`}
                      className="block text-center py-2.5 border-2 border-gray-200 text-gray-700 font-bold text-sm rounded-full hover:bg-gray-50 transition-colors"
                    >
                      詳細・口コミ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/ranking"
              className="inline-block px-8 py-3.5 bg-[#0b3d91] text-white font-bold rounded-full hover:bg-[#0a3580] shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all duration-300"
            >
              すべてのファクタリング会社を見る（{companies.length}社）→
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 診断CTA（イラスト付き） ━━━ */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-blue-50 via-sky-50 to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <DiagnosisIllust />
          <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-2 mt-6">DIAGNOSIS</p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
            どの業者を選べばいい？
          </h2>
          <div className="w-10 h-1 bg-orange-500 rounded-full mt-2 mx-auto mb-6" />
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            5つの質問に答えるだけで<br className="sm:hidden" />あなたに最適な業者がわかります
          </p>
          <Link
            href="/shindan"
            className="inline-block px-10 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            無料診断スタート →
          </Link>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><span className="text-emerald-500">&#10003;</span> 無料</span>
            <span className="flex items-center gap-1"><span className="text-emerald-500">&#10003;</span> 30秒で完了</span>
            <span className="flex items-center gap-1"><span className="text-emerald-500">&#10003;</span> 登録不要</span>
          </div>
        </div>
      </section>

      {/* ━━━ 一括見積もりCTA（イラスト付き） ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden border border-gray-100 shadow-lg">
            {/* 背景装飾 */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-blue-50 rounded-full" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-50 rounded-full" />

            <div className="relative">
              <EstimateIllust />
              <p className="inline-block text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4 mt-4">
                2026年4月サービス開始予定
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                一括見積もりで最適な1社を見つける
              </h2>
              <div className="w-10 h-1 bg-orange-500 rounded-full mt-2 mx-auto mb-6" />
              <p className="text-gray-600 mb-8 leading-relaxed">
                複数のファクタリング会社にまとめて見積もり依頼。<br className="hidden sm:block" />
                完全無料で手数料を最安に抑えられます。
              </p>
              <Link
                href="/mitsumori"
                className="inline-block px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                一括見積もりの詳細を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 最新口コミ ━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="REVIEWS"
            right={
              <Link href="/kuchikomi" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            最新の口コミ・評判
          </SectionHeading>
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} companyName={companyMap[review.companySlug]} />
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#f8fafc" />

      {/* ━━━ コラム ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="COLUMN"
            right={
              <Link href="/column" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            コラム・お役立ち記事
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <WaveDivider flip color="#f8fafc" />

      {/* ━━━ FAQ ━━━ */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="FAQ"
            right={
              <Link href="/faq" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            よくある質問
          </SectionHeading>
          <div className="space-y-3">
            {topFaq.map((item, i) => (
              <details key={i} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-gray-900 hover:bg-blue-50/50 transition-colors">
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 flex items-center justify-center bg-[#0b3d91] text-white text-xs font-bold rounded-full shrink-0">Q</span>
                    <span className="text-left">{item.question}</span>
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180 shrink-0 ml-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full mr-2 align-middle">A</span>
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-block px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-bold text-sm rounded-full hover:bg-gray-50 transition-colors"
            >
              よくある質問をもっと見る（{faqCount}件）→
            </Link>
          </div>
        </div>
      </section>

      {/* 固定追従CTAバー */}
      <FixedCTA />
    </>
  );
}
