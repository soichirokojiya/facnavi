import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCompanies, displayName } from "@/lib/companies";
import { CompanyCard } from "@/components/ranking/CompanyCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

const PER_PAGE = 10;

interface Props {
  params: Promise<{ page: string }>;
}

export function generateStaticParams() {
  const companies = getAllCompanies();
  const totalPages = Math.ceil(companies.length / PER_PAGE);
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page);
  const startIdx = (pageNum - 1) * PER_PAGE;
  return {
    title: `ファクタリング業者おすすめランキング ${startIdx + 1}〜${startIdx + PER_PAGE}位【${new Date().getFullYear()}年最新】`,
    description: `ファクタリング業者ランキング${startIdx + 1}〜${startIdx + PER_PAGE}位を徹底比較。手数料・入金スピード・口コミ評価であなたに最適な業者が見つかります。条件別・業種別のカテゴリからも検索可能。`,
    alternates: { canonical: `${SITE_URL}/ranking/page/${pageNum}` },
    openGraph: {
      title: `ファクタリング業者おすすめランキング ${startIdx + 1}〜${startIdx + PER_PAGE}位 | ファクナビ`,
      description: `ファクタリング業者ランキング${startIdx + 1}〜${startIdx + PER_PAGE}位を徹底比較。手数料・入金スピード・口コミ評価であなたに最適な業者が見つかります。`,
    },
  };
}

const CONDITION_LINKS = [
  { slug: "same-day", label: "即日入金" },
  { slug: "low-fees", label: "手数料が安い" },
  { slug: "online-complete", label: "オンライン完結" },
  { slug: "sole-proprietor", label: "個人事業主OK" },
  { slug: "small-amount", label: "少額OK" },
  { slug: "large-amount", label: "大口対応" },
  { slug: "weekend", label: "土日対応" },
  { slug: "easy-screening", label: "審査が通りやすい" },
];

const INDUSTRY_LINKS = [
  { slug: "construction", label: "建設業" },
  { slug: "medical", label: "医療・介護" },
  { slug: "transportation", label: "運送業" },
  { slug: "it-web", label: "IT・Web" },
  { slug: "manufacturing", label: "製造業" },
  { slug: "food-service", label: "飲食業" },
  { slug: "staffing", label: "人材派遣" },
];

const TRANSACTION_LINKS = [
  { slug: "two-party", label: "2社間ファクタリング" },
  { slug: "three-party", label: "3社間ファクタリング" },
];

export default async function RankingPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 2) notFound();

  const companies = getAllCompanies();
  const totalPages = Math.ceil(companies.length / PER_PAGE);
  if (pageNum > totalPages) notFound();

  const startIdx = (pageNum - 1) * PER_PAGE;
  const pageCompanies = companies.slice(startIdx, startIdx + PER_PAGE);
  const endIdx = Math.min(startIdx + PER_PAGE, companies.length);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
          { name: `${startIdx + 1}〜${endIdx}位`, url: `${SITE_URL}/ranking/page/${pageNum}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `ファクタリング業者おすすめランキング (${startIdx + 1}〜${endIdx}位)`,
          itemListElement: pageCompanies.map((c, i) => ({
            "@type": "ListItem",
            position: startIdx + i + 1,
            name: displayName(c),
            url: `${SITE_URL}/ranking/${c.slug}`,
          })),
        }}
      />

      <Breadcrumb
        items={[
          { label: "ランキング", href: "/ranking" },
          { label: `${startIdx + 1}〜${endIdx}位` },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ファクタリング業者おすすめランキング {startIdx + 1}〜{endIdx}位
      </h1>
      <p className="text-gray-600 mb-6">
        全{companies.length}社の中から{startIdx + 1}〜{endIdx}位のファクタリング業者を手数料・入金スピード・口コミ評価を総合的に比較してご紹介します。
      </p>

      {/* カテゴリ導線 */}
      <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm font-bold text-gray-700 mb-3">条件・業種で探す</p>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1.5">条件別</p>
            <div className="flex flex-wrap gap-1.5">
              {CONDITION_LINKS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ranking/category/${cat.slug}`}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">業種別</p>
            <div className="flex flex-wrap gap-1.5">
              {INDUSTRY_LINKS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ranking/category/${cat.slug}`}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1.5">取引形態別</p>
            <div className="flex flex-wrap gap-1.5">
              {TRANSACTION_LINKS.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/ranking/category/${cat.slug}`}
                  className="px-3 py-1.5 text-xs rounded-full border border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ランキング一覧 */}
      <section>
        <div className="space-y-6">
          {pageCompanies.map((company, index) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={startIdx + index + 1}
            />
          ))}
        </div>
      </section>

      {/* TOP3への導線 */}
      <div className="mt-10 p-5 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-sm font-bold text-blue-900 mb-2">人気のファクタリング会社もチェック</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {companies.slice(0, 3).map((c, i) => (
            <Link
              key={c.slug}
              href={`/ranking/${c.slug}`}
              className="flex items-center gap-2 p-3 bg-white rounded-lg hover:shadow-md transition-all text-sm"
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                i === 0 ? "bg-amber-500" : i === 1 ? "bg-gray-400" : "bg-amber-700"
              }`}>
                {i + 1}
              </span>
              <span className="font-bold text-gray-900 truncate">{displayName(c)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* 関連リンク */}
      <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm font-bold text-gray-700 mb-3">関連ページ</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          <Link href="/ranking" className="text-blue-600 hover:underline">
            ランキングTOP10
          </Link>
          <Link href="/ranking/category/all-companies" className="text-blue-600 hover:underline">
            全社一覧
          </Link>
          <Link href="/column/factoring-nyumon" className="text-blue-600 hover:underline">
            ファクタリング入門
          </Link>
          <Link href="/kuchikomi" className="text-blue-600 hover:underline">
            口コミ一覧
          </Link>
        </div>
      </div>

      {/* Pagination */}
      <nav className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        {pageNum > 1 && (
          <Link
            href={pageNum === 2 ? "/ranking" : `/ranking/page/${pageNum - 1}`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            ← 前へ
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={p === 1 ? "/ranking" : `/ranking/page/${p}`}
            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm transition-colors ${
              p === pageNum
                ? "bg-blue-600 text-white font-bold"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {p}
          </Link>
        ))}

        {pageNum < totalPages && (
          <Link
            href={`/ranking/page/${pageNum + 1}`}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            次へ →
          </Link>
        )}
      </nav>
    </div>
  );
}
