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
import { MitsumoriHeroBanner } from "@/components/banners/MitsumoriHeroBanner";
import { getLatestNews } from "@/lib/news";

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
  const latestNews = getLatestNews(3);
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

        <div className="relative max-w-5xl mx-auto px-4 pt-10 md:pt-16 pb-6 md:pb-8">
          {/* メイン：見出し + バナー */}
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            <div className="flex-1 min-w-0 text-center md:text-left">
              {/* バッジ */}
              <p className="shimmer inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-4 py-1.5 rounded-full mb-5 text-sm shadow-lg shadow-blue-500/20">
                <span className="text-yellow-300">★</span>
                日本最大級 — {companies.length}社掲載
              </p>

              <h1 className="text-[1.6rem] md:text-[2.75rem] font-black leading-[1.25] text-gray-900 tracking-tight">
                口コミ・評判と比較で選ぶ<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">おすすめファクタリング会社</span>
              </h1>

              <p className="text-sm text-gray-500 mt-3 mb-6 leading-relaxed max-w-md mx-auto md:mx-0">
                {companies.length}社の中から口コミ・手数料・入金スピードを比較。<br className="hidden sm:block" />
                あなたに最適なファクタリング会社が見つかります。
              </p>

              {/* CTA */}
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

              {/* 信頼バッジ */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-400 justify-center md:justify-start">
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>完全無料</span>
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>30秒で診断</span>
                <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>登録不要</span>
              </div>
            </div>

            {/* 右：一括見積もりバナー */}
            <div className="flex-shrink-0 w-full md:w-[360px] relative md:mt-14">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-400/15 via-emerald-400/10 to-transparent rounded-3xl blur-2xl pointer-events-none hidden md:block" />
              <Link href="/mitsumori" className="relative block rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 mx-auto md:max-w-none">
                <Image src="/images/mitsumori-banner.png" width={360} height={280} alt="ファクナビ厳選 無料一括見積もり" className="w-full h-auto" />
              </Link>
            </div>
          </div>

          {/* 統計バー — ヒーロー下部に横並び */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-3 md:gap-5">
              {[
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" /></svg>, value: <>{companies.length}<span className="text-lg font-bold">社</span></>, label: "掲載社数", accent: "text-blue-600", iconBg: "bg-blue-50 text-blue-500" },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5l3 4.5m0 0l3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, value: <>0<span className="text-lg font-bold">円</span></>, label: "利用料金", accent: "text-emerald-600", iconBg: "bg-emerald-50 text-emerald-500" },
                { icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, value: <>即日</>, label: "最短入金", accent: "text-orange-600", iconBg: "bg-orange-50 text-orange-500" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-center gap-3 md:gap-4 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl px-4 md:px-6 py-5 md:py-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shrink-0`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className={`text-3xl md:text-4xl font-black leading-none tracking-tighter ${stat.accent}`}>{stat.value}</div>
                    <div className="text-xs md:text-sm font-bold text-gray-400 mt-1">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-300 text-center mt-2">※ <CurrentDate /> 現在</p>
          </div>

          {/* 検索バー + タグ */}
          <div className="mt-5 max-w-[480px] mx-auto">
            <KeywordSearch companies={searchData} />
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
              <span className="text-[10px] text-gray-400 font-bold">人気の検索:</span>
              {[
                { label: "即日入金", href: "/ranking?category=speed" },
                { label: "個人事業主OK", href: "/ranking?category=sole-proprietor" },
                { label: "手数料が安い", href: "/ranking?category=fee" },
                { label: "オンライン完結", href: "/ranking?category=online" },
              ].map((tag) => (
                <Link
                  key={tag.label}
                  href={tag.href}
                  className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full transition-colors"
                >
                  {tag.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 広告 */}
          <div className="text-center mt-5">
            <a href="https://px.a8.net/svt/ejp?a8mat=4AX5KD+9QOC36+4JGG+BXIYP" rel="nofollow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img width="468" height="60" alt="" src="https://www26.a8.net/svt/bgt?aid=260207725589&wid=001&eno=01&mid=s00000021184002004000&mc=1" className="inline-block max-w-full h-auto" />
            </a>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4AX5KD+9QOC36+4JGG+BXIYP" alt="" />
            <p className="text-[9px] text-gray-300 mt-1">PR</p>
          </div>
        </div>
      </section>

      {/* ━━━ おすすめ TOP3 ━━━ */}
      <section className="pt-6 md:pt-8 pb-10 md:pb-14 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHeading sub="RECOMMEND" center>
            おすすめファクタリング会社
          </SectionHeading>
          <p className="text-xs text-gray-400 text-center -mt-6 mb-6">本ページにはプロモーションが含まれています</p>
          {/* --- 1位: 横幅フルの大型カード --- */}
          {companies.slice(0, 1).map((company) => (
            <div
              key={company.slug}
              className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-400 shadow-lg p-6 md:p-8 mb-6"
            >
              <span className="absolute -top-3.5 left-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                👑 No.1
              </span>
              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
                <div className="flex items-center gap-4 md:flex-1">
                  <span className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-extrabold bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md shrink-0">
                    1
                  </span>
                  <div>
                    <Link href={`/ranking/${company.slug}`}>
                      <h3 className="font-bold text-gray-900 text-lg md:text-xl hover:text-blue-600 transition-colors">{displayName(company)}</h3>
                    </Link>
                    <StarRating rating={company.overallRating} size="sm" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 md:flex-1">
                  {company.features.slice(0, 4).map((f) => (
                    <Badge key={f} variant="primary">{f}</Badge>
                  ))}
                </div>
                <a
                  href={`/go/${company.slug}`}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="block text-center py-3 px-8 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-sm rounded-full hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 md:w-auto shrink-0"
                >
                  公式サイトを見る
                </a>
              </div>
            </div>
          ))}

          {/* --- 2位・3位: 2カラム --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {companies.slice(1, 3).map((company, idx) => {
              const i = idx + 1;
              return (
                <div
                  key={company.slug}
                  className={`relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col border ${
                    i === 1
                      ? "border-gray-200 border-l-4 border-l-gray-400"
                      : "border-gray-200 border-l-4 border-l-amber-700"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`rounded-full flex items-center justify-center font-extrabold ${
                      i === 1
                        ? "w-10 h-10 text-base bg-gray-400 text-white"
                        : "w-10 h-10 text-base bg-amber-700 text-white"
                    }`}>
                      {i + 1}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ━━━ 初心者向け記事リンク ━━━ */}
      <section className="py-8 md:py-10 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            href="/column/factoring-nyumon"
            className="group block relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            {/* 背景装飾 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>

            <div className="relative flex items-center gap-5 md:gap-7">
              {/* ろいさんアイコン */}
              <div className="shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-3 ring-white/40 shadow-lg">
                  <Image src="/images/roi-icon.webp" width={80} height={80} alt="ファクタリング専門家 ろい" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* テキスト */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-white/80 bg-white/15 px-2.5 py-0.5 rounded-full">FACTORING GUIDE</span>
                  <span className="text-[10px] font-bold text-amber-200 bg-amber-400/20 px-2.5 py-0.5 rounded-full">寄稿記事</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-white mb-1.5 tracking-tight">ファクタリング入門</h3>
                <p className="text-sm text-white/80 leading-relaxed">30社以上の利用経験を持つ専門家「ろい」氏が、仕組み・手数料・選び方をわかりやすく解説</p>
              </div>

              {/* CTA */}
              <div className="shrink-0 hidden sm:block">
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 bg-white px-5 py-2.5 rounded-full shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                  記事を読む
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
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
                  <div className="space-y-1.5">
                    {top3.map((c, i) => (
                      <div
                        key={c.slug}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                          i === 0 ? "bg-amber-50" : ""
                        }`}
                      >
                        <span className={`shrink-0 rounded-full flex items-center justify-center font-bold ${
                          i === 0
                            ? "w-6 h-6 text-[11px] bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm"
                            : i === 1
                            ? "w-5 h-5 text-[10px] bg-gray-400 text-white"
                            : "w-5 h-5 text-[10px] bg-amber-700 text-white"
                        }`}>
                          {i + 1}
                        </span>
                        <Link
                          href={`/ranking/${c.slug}`}
                          className={`hover:text-blue-600 transition-colors truncate ${
                            i === 0
                              ? "text-sm font-bold text-gray-900"
                              : "text-xs font-bold text-gray-600"
                          }`}
                        >
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
                className={`rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border ${
                  i === 0
                    ? "border-2 border-orange-400 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-l-4 border-l-orange-400 p-5 md:p-6"
                    : i === 1
                    ? "bg-white border-gray-100 border-l-4 border-l-gray-400 p-4 md:p-5"
                    : i === 2
                    ? "bg-white border-gray-100 border-l-4 border-l-amber-700 p-4 md:p-5"
                    : "bg-white border-gray-100 p-4 md:p-5"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className={`flex items-center gap-3 flex-shrink-0 ${i === 0 ? "md:w-56" : "md:w-48"}`}>
                    <span className={`shrink-0 rounded-full flex items-center justify-center font-extrabold ${
                      i === 0
                        ? "w-12 h-12 text-lg bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md"
                        : i === 1
                        ? "w-9 h-9 text-sm bg-gray-400 text-white"
                        : i === 2
                        ? "w-9 h-9 text-sm bg-amber-700 text-white"
                        : "w-8 h-8 text-sm bg-[#0b3d91] text-white"
                    }`}>
                      {i + 1}
                    </span>
                    <div>
                      <Link href={`/ranking/${company.slug}`}>
                        <h3 className={`font-bold text-gray-900 hover:text-blue-600 transition-colors ${
                          i === 0 ? "text-base md:text-lg" : "text-sm"
                        }`}>{displayName(company)}</h3>
                      </Link>
                      <StarRating rating={company.overallRating} size="sm" />
                    </div>
                  </div>
                  <div className={`flex-1 flex flex-wrap gap-x-4 gap-y-1 ${i === 0 ? "text-sm" : "text-xs"}`}>
                    <span><span className="text-gray-400">手数料</span> <span className="font-bold text-blue-600">{formatFeeRange(company.feeRange.min, company.feeRange.max)}</span></span>
                    <span><span className="text-gray-400">上限</span> <span className="font-bold">{formatAmount(company.maxAmount)}</span></span>
                    <span><span className="text-gray-400">法人・個人事業主</span> <span className={`font-bold ${company.soleProprietorOk ? "text-green-600" : "text-gray-300"}`}>{company.soleProprietorOk ? "OK" : ""}</span></span>
                  </div>
                  <div className="flex gap-2 md:w-auto flex-shrink-0">
                    <a
                      href={`/go/${company.slug}`}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className={`bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold rounded-full hover:shadow-lg transition-all ${
                        i === 0 ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"
                      }`}
                    >
                      公式サイト
                    </a>
                    <Link
                      href={`/ranking/${company.slug}`}
                      className={`border border-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-50 transition-colors ${
                        i === 0 ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"
                      }`}
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
          <div className="relative overflow-hidden bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-2xl">
            {/* 背景装飾 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-3xl" />
            </div>
            <div className="relative flex flex-col md:flex-row items-center">
              <div className="md:w-2/5 flex flex-col items-center justify-center p-4">
                <RotationBanner />
                <p className="text-[9px] text-white/50 text-center mt-1">PR</p>
              </div>
              <div className="md:w-3/5 p-6 md:p-8 text-center md:text-left">
                <p className="inline-block text-[10px] font-bold text-amber-200 bg-amber-400/20 border border-amber-300/30 rounded-full px-3 py-0.5 mb-3">
                  2026年4月サービス開始予定
                </p>
                <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight">
                  一括見積もりで最適な1社を
                </h2>
                <p className="text-sm text-white/80 mb-5">
                  複数社にまとめて見積もり依頼。完全無料。
                </p>
                <Link
                  href="/mitsumori"
                  className="inline-block px-7 py-3 bg-white text-blue-600 font-bold text-sm rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  無料で一括見積もりする →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 最新ニュース ━━━ */}
      {latestNews.length > 0 && (
        <section className="py-10 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              sub="NEWS"
              right={
                <Link href="/news" className="text-blue-600 text-sm font-bold hover:underline">
                  すべてのニュースを見る →
                </Link>
              }
            >
              最新ニュース<span className="ml-2 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full align-middle">毎日更新</span>
            </SectionHeading>
            <div className="space-y-3">
              {latestNews.map((news) => (
                <a
                  key={news.slug}
                  href={news.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 p-4 md:p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs text-gray-400">{news.publishedAt}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          news.category === "業界動向" ? "bg-blue-50 text-blue-600" :
                          news.category === "法改正" ? "bg-red-50 text-red-600" :
                          news.category === "サービス" ? "bg-emerald-50 text-emerald-600" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {news.category}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2">{news.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2">{news.summary}</p>
                    </div>
                    <svg className="w-4 h-4 text-gray-300 shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </div>
                  <p className="text-[10px] text-gray-300 mt-2">出典: {news.sourceName}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
