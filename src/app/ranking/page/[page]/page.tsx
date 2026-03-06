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
  return {
    title: `ファクタリング業者おすすめランキング (${pageNum}ページ目)`,
    description:
      "手数料・入金スピード・口コミを徹底比較！おすすめファクタリング業者ランキング。あなたに最適な業者が見つかります。",
    alternates: { canonical: `${SITE_URL}/ranking/page/${pageNum}` },
  };
}

export default async function RankingPaginatedPage({ params }: Props) {
  const { page } = await params;
  const pageNum = parseInt(page);
  if (isNaN(pageNum) || pageNum < 2) notFound();

  const companies = getAllCompanies();
  const totalPages = Math.ceil(companies.length / PER_PAGE);
  if (pageNum > totalPages) notFound();

  const startIdx = (pageNum - 1) * PER_PAGE;
  const pageCompanies = companies.slice(startIdx, startIdx + PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
          { name: `${pageNum}ページ目`, url: `${SITE_URL}/ranking/page/${pageNum}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `ファクタリング業者おすすめランキング (${pageNum}ページ目)`,
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
          { label: `${pageNum}ページ目` },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ファクタリング業者おすすめランキング
      </h1>
      <p className="text-gray-600 mb-8">
        {startIdx + 1}〜{Math.min(startIdx + PER_PAGE, companies.length)}位 / 全{companies.length}社
      </p>

      <section>
        <div className="space-y-6">
          {pageCompanies.map((company) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={company.rankPosition}
            />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <nav className="flex justify-center items-center gap-2 mt-10">
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
