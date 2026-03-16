import type { Metadata } from "next";
import { getAllArticles } from "@/lib/articles";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { ColumnListClient } from "@/components/articles/ColumnListClient";

export const metadata: Metadata = {
  title: "実践経営ノート - 資金繰り・経営改善コラム",
  description:
    "中小企業の資金繰り・経営改善に役立つナレッジを発信。ファクタリング・補助金・助成金など幅広く解説。",
  alternates: { canonical: `${SITE_URL}/column` },
  openGraph: {
    title: "実践経営ノート - 資金繰り・経営改善コラム | ファクナビ",
    description:
      "中小企業の資金繰り・経営改善に役立つナレッジを発信。ファクタリング・補助金・助成金など幅広く解説。",
  },
};

export default function ColumnPage() {
  const articles = getAllArticles();
  const frontmatters = articles.map(({ content, ...fm }) => fm);

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
        中小企業の資金繰り・経営改善に役立つナレッジを発信
      </p>

      <ColumnListClient articles={frontmatters} />
    </div>
  );
}
