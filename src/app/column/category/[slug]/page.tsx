import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getCategoryBySlug } from "@/lib/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, ARTICLE_CATEGORIES } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLE_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: `${category.label}の記事一覧｜ファクナビ`,
    description: category.description,
    alternates: { canonical: `${SITE_URL}/column/category/${slug}` },
    openGraph: {
      title: `${category.label}の記事一覧 | ファクナビ`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = getAllArticles().filter(
    (a) => a.category === category.label
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "実践経営ノート", url: `${SITE_URL}/column` },
          { name: category.label, url: `${SITE_URL}/column/category/${slug}` },
        ]}
      />
      <Breadcrumb
        items={[
          { label: "実践経営ノート", href: "/column" },
          { label: category.label },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {category.emoji} {category.label}
      </h1>
      <p className="text-gray-600 mb-8">{category.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          該当する記事がありません
        </p>
      )}
    </div>
  );
}
