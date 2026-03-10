import type { Metadata } from "next";
import Link from "next/link";
import { getAllCompanies, displayName } from "@/lib/companies";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { RankingFilter } from "@/components/ranking/RankingFilter";

const PER_PAGE = 10;

export const metadata: Metadata = {
  title: "ファクタリング業者おすすめランキング",
  description:
    "手数料・入金スピード・口コミを徹底比較！おすすめファクタリング業者ランキング。あなたに最適な業者が見つかります。",
  alternates: { canonical: `${SITE_URL}/ranking` },
  openGraph: {
    title: "ファクタリング業者おすすめランキング",
    description:
      "手数料・入金スピード・口コミを徹底比較！おすすめファクタリング業者ランキング。あなたに最適な業者が見つかります。",
  },
};

export default function RankingPage() {
  const companies = getAllCompanies();
  const topCompanies = companies.slice(0, PER_PAGE);
  const totalPages = Math.ceil(companies.length / PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "ファクタリング業者おすすめランキング",
          itemListElement: topCompanies.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: displayName(c),
            url: `${SITE_URL}/ranking/${c.slug}`,
          })),
        }}
      />

      <Breadcrumb items={[{ label: "ランキング" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ファクタリング業者おすすめランキング
      </h1>
      <p className="text-gray-600 mb-8">
        手数料・入金スピード・口コミ評価を総合的に比較し、おすすめのファクタリング業者をランキング形式でご紹介します。
      </p>

      <RankingFilter companies={topCompanies} />

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-2 mt-10">
          <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            1
          </span>
          {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((p) => (
            <Link
              key={p}
              href={`/ranking/page/${p}`}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
            >
              {p}
            </Link>
          ))}
          <Link
            href="/ranking/page/2"
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
          >
            次へ →
          </Link>
        </nav>
      )}
    </div>
  );
}
