import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ファクナビ｜実践経営ノート",
  description:
    "ファクタリングの基礎知識、業者の選び方、業種別活用法など、役立つ情報をお届けします。",
  alternates: { canonical: `${SITE_URL}/column` },
};

export default function ColumnPage() {
  const articles = getAllArticles();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "実践経営ノート", url: `${SITE_URL}/column` },
        ]}
      />
      <Breadcrumb items={[{ label: "実践経営ノート" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        ファクナビ｜実践経営ノート
      </h1>
      <p className="text-gray-600 mb-8">
        ファクタリングに関する基礎知識や選び方のポイントを解説します。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
