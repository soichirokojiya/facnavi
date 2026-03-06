import Image from "next/image";
import Link from "next/link";
import { getAllCompanies, displayName } from "@/lib/companies";
import { getAllReviewsAsync } from "@/lib/reviews";
import { getAllArticles } from "@/lib/articles";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Logo } from "@/components/layout/Logo";
import { formatFeeRange, formatAmount } from "@/lib/format";
import { KeywordSearch, SearchableCompany } from "@/components/search/KeywordSearch";
import { FAQ_DATA } from "@/lib/faq";
import { CurrentDate } from "@/components/ui/CurrentDate";
import { FixedCTA } from "@/components/layout/FixedCTA";
import { RotationBanner } from "@/components/ads/RotationBanner";

/* セクション見出し */
function SectionHeading({
  children,
  sub,
  right,
  center,
}: {
  children: React.ReactNode;
  sub?: string;
  right?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`${center ? "text-center" : "flex items-end justify-between"} mb-8`}>
      <div>
        {sub && <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-1">{sub}</p>}
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{children}</h2>
        <div className={`w-10 h-1 bg-orange-500 rounded-full mt-2 ${center ? "mx-auto" : ""}`} />
      </div>
      {right}
    </div>
  );
}

export default async function HomePage() {
  const companies = getAllCompanies();
  const reviews = await getAllReviewsAsync();
  const articles = getAllArticles().slice(0, 6);
  const companyMap = Object.fromEntries(companies.map((c) => [c.slug, displayName(c)]));
  const topFaq = FAQ_DATA.slice(0, 5);
  const faqCount = FAQ_DATA.length;
  const searchData: SearchableCompany[] = companies.map((c) => ({
    slug: c.slug,
    name: displayName(c),
    overallRating: c.overallRating,
    features: c.features,
  }));

  return (
    <>
      <OrganizationJsonLd />

      {/* ━━━ Hero ━━━ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50/40">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-8">
            {/* 左：テキスト */}
            <div className="flex-1 text-center md:text-left">
              {/* 4. shimmerエフェクト付き「日本最大級」バッジ */}
              <p className="shimmer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black px-6 py-2.5 rounded-full mb-5 text-lg md:text-xl shadow-lg shadow-blue-500/25">
                <span className="text-yellow-300 text-xl md:text-2xl">★</span>
                日本最大級 — {companies.length}社掲載
              </p>

              <h1 className="text-3xl md:text-[2.5rem] font-black mb-1.5 leading-[1.3] text-gray-900 tracking-tight">
                口コミ・評判と比較で選ぶ
              </h1>
              <p className="text-3xl md:text-[2.5rem] font-black mb-6 leading-[1.3] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">おすすめファクタリング会社</span>
              </p>

              {/* 1. 統計カード3つ（アイコン付き） */}
              <div className="grid grid-cols-3 gap-3 mb-7 max-w-sm mx-auto md:mx-0">
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm p-3 text-center">
                  <svg className="w-5 h-5 mx-auto mb-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <div className="text-2xl md:text-3xl font-black text-blue-600 leading-none tracking-tighter">{companies.length}<span className="text-base">社</span></div>
                  <div className="text-[10px] font-bold text-gray-500 mt-0.5">掲載社数</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm p-3 text-center">
                  <svg className="w-5 h-5 mx-auto mb-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-2xl md:text-3xl font-black text-emerald-500 leading-none">無料</div>
                  <div className="text-[10px] font-bold text-gray-500 mt-0.5">利用料金</div>
                </div>
                <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm p-3 text-center">
                  <svg className="w-5 h-5 mx-auto mb-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-2xl md:text-3xl font-black text-orange-500 leading-none">即日</div>
                  <div className="text-[10px] font-bold text-gray-500 mt-0.5">最短入金</div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 -mt-5 mb-5 text-center md:text-left">※ <CurrentDate /> 現在</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/shindan"
                  className="shimmer inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-base rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  無料で診断する →
                </Link>
                <Link
                  href="/ranking"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold text-base rounded-full border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  ランキングを見る
                </Link>
              </div>

              {/* 2. 信頼バッジ行 */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-gray-500 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>完全無料</span>
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>30秒で診断</span>
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>登録不要</span>
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>全国対応</span>
              </div>
            </div>

            {/* 右：広告バナー */}
            <div className="flex-shrink-0 w-full md:w-[300px]">
              <RotationBanner />
              <p className="text-[9px] text-gray-400 text-center mt-1">PR</p>
            </div>
          </div>

          {/* 検索バー */}
          <div className="mt-8">
            <KeywordSearch companies={searchData} />
          </div>

          {/* 3. 人気キーワードタグ */}
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-center md:justify-start">
            <span className="text-xs text-gray-400 font-bold">人気の検索:</span>
            {[
              { label: "即日入金", href: "/ranking?category=speed" },
              { label: "個人事業主OK", href: "/ranking?category=sole-proprietor" },
              { label: "手数料が安い", href: "/ranking?category=fee" },
              { label: "オンライン完結", href: "/ranking?category=online" },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ おすすめ TOP3 ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading sub="RECOMMEND" center>
            おすすめファクタリング会社
          </SectionHeading>
          <p className="text-xs text-gray-400 text-center -mt-6 mb-6">本ページにはプロモーションが含まれています</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.slice(0, 3).map((company, i) => (
              <div
                key={company.slug}
                className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col border ${
                  i === 0 ? "border-2 border-orange-400" : "border-gray-100"
                }`}
              >
                {i === 0 && (
                  <span className="absolute -top-3 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    No.1
                  </span>
                )}
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-extrabold ${
                    i === 0 ? "bg-orange-500 text-white" : i === 1 ? "bg-gray-300 text-white" : "bg-amber-700 text-white"
                  }`}>
                    {company.rankPosition}
                  </span>
                  <div>
                    <Link href={`/ranking/${company.slug}`}>
                      <h3 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors">{displayName(company)}</h3>
                    </Link>
                    <StarRating rating={company.overallRating} size="sm" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {company.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="primary">{f}</Badge>
                  ))}
                </div>
                <a
                  href={`/go/${company.slug}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="block text-center py-2.5 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-auto"
                >
                  公式サイトを見る
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ カテゴリ別ランキング ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading sub="CATEGORY" center>
            カテゴリ別ランキング
          </SectionHeading>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "総合", key: "overall" as const, emoji: "🏆" },
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
                <div key={cat.key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat.emoji}</span>
                    <h3 className="font-bold text-gray-900 text-sm">{cat.title}</h3>
                  </div>
                  <div className="space-y-2">
                    {top3.map((c, i) => (
                      <div key={c.slug} className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          i === 0 ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"
                        }`}>
                          {i + 1}
                        </span>
                        <Link href={`/ranking/${c.slug}`} className="text-xs font-bold hover:text-blue-600 transition-colors truncate text-gray-800">
                          {displayName(c)}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ 診断CTA: 画像付きスプリット ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/5 flex items-center justify-center p-4">
                <RotationBanner />
                <p className="text-[9px] text-gray-400 text-center mt-1">PR</p>
              </div>
              <div className="md:w-3/5 p-6 md:p-8 text-center md:text-left">
                <p className="text-xs font-bold text-blue-600 mb-1">DIAGNOSIS</p>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  どの業者を選べばいい？
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  5つの質問に答えるだけで最適な業者がわかります
                </p>
                <Link
                  href="/shindan"
                  className="inline-block px-7 py-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  無料診断スタート →
                </Link>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 justify-center md:justify-start">
                  <span>✓ 無料</span>
                  <span>✓ 30秒で完了</span>
                  <span>✓ 登録不要</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ TOP10 詳細リスト ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="TOP 10"
            right={
              <Link href="/ranking" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            口コミ比較ランキング
          </SectionHeading>

          <div className="space-y-3">
            {companies.slice(0, 10).map((company, i) => (
              <div
                key={company.slug}
                className={`bg-white rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  i === 0 ? "border-2 border-orange-400" : "border-gray-100"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex items-center gap-3 md:w-48 flex-shrink-0">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                      i === 0 ? "bg-orange-500 text-white" : i === 1 ? "bg-gray-400 text-white" : i === 2 ? "bg-amber-700 text-white" : "bg-[#0b3d91] text-white"
                    }`}>
                      {company.rankPosition}
                    </span>
                    <div>
                      <Link href={`/ranking/${company.slug}`}>
                        <h3 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors">{displayName(company)}</h3>
                      </Link>
                      <StarRating rating={company.overallRating} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <span><span className="text-gray-400">手数料</span> <span className="font-bold text-blue-600">{formatFeeRange(company.feeRange.min, company.feeRange.max)}</span></span>
                    <span><span className="text-gray-400">上限</span> <span className="font-bold">{formatAmount(company.maxAmount)}</span></span>
                    <span><span className="text-gray-400">法人・個人事業主</span> <span className={`font-bold ${company.soleProprietorOk ? "text-green-600" : "text-gray-300"}`}>{company.soleProprietorOk ? "OK" : ""}</span></span>
                  </div>
                  <div className="flex gap-2 md:w-auto flex-shrink-0">
                    <a
                      href={`/go/${company.slug}`}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="px-4 py-2 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-xs rounded-full hover:shadow-lg transition-all"
                    >
                      公式サイト
                    </a>
                    <Link
                      href={`/ranking/${company.slug}`}
                      className="px-4 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-50 transition-colors"
                    >
                      口コミ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/ranking"
              className="inline-block px-7 py-3 bg-[#0b3d91] text-white font-bold text-sm rounded-full hover:bg-[#0a3580] shadow-lg shadow-blue-900/20 transition-all duration-300"
            >
              全{companies.length}社を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* ━━━ 一括見積もりCTA: 画像付き ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/5 flex items-center justify-center p-4">
                <RotationBanner />
                <p className="text-[9px] text-blue-300 text-center mt-1">PR</p>
              </div>
              <div className="md:w-3/5 p-6 md:p-8 text-center md:text-left">
                <p className="inline-block text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/40 rounded-full px-3 py-0.5 mb-2">
                  2026年4月サービス開始予定
                </p>
                <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                  一括見積もりで最適な1社を
                </h2>
                <p className="text-sm text-blue-200 mb-4">
                  複数社にまとめて見積もり依頼。完全無料。
                </p>
                <Link
                  href="/mitsumori"
                  className="inline-block px-7 py-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  無料で一括見積もりする →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 最新口コミ ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="REVIEWS"
            right={
              <Link href="/kuchikomi" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            最新の口コミ
          </SectionHeading>
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} companyName={companyMap[review.companySlug]} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 実践経営ノート ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading
            sub="NOTE"
            right={
              <Link href="/column" className="text-blue-600 text-sm font-bold hover:underline">
                すべて見る →
              </Link>
            }
          >
            ファクナビ｜実践経営ノート
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ FAQ ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="FAQ">
            よくある質問
          </SectionHeading>
          <div className="space-y-2">
            {topFaq.map((item, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-4 font-bold text-sm text-gray-900 hover:bg-blue-50/50 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-[#0b3d91] text-white text-[10px] font-bold rounded-full shrink-0">Q</span>
                    <span className="text-left">{item.question}</span>
                  </span>
                  <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-[10px] font-bold rounded-full mr-2 align-middle">A</span>
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/faq"
              className="inline-block px-5 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-50 transition-colors"
            >
              もっと見る（{faqCount}件）→
            </Link>
          </div>
        </div>
      </section>

      <FixedCTA />
    </>
  );
}
