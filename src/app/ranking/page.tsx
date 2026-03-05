import type { Metadata } from "next";
import { getAllCompanies } from "@/lib/companies";
import { CompanyCard } from "@/components/ranking/CompanyCard";
import { ComparisonTable } from "@/components/ranking/ComparisonTable";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ファクタリング業者おすすめランキング",
  description:
    "手数料・入金スピード・口コミを徹底比較！おすすめファクタリング業者ランキング。あなたに最適な業者が見つかります。",
  alternates: { canonical: `${SITE_URL}/ranking` },
};

export default function RankingPage() {
  const companies = getAllCompanies();

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
          itemListElement: companies.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
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

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          比較表で一覧チェック
        </h2>
        <ComparisonTable companies={companies} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          各社の詳細
        </h2>
        <div className="space-y-6">
          {companies.map((company) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={company.rankPosition}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
