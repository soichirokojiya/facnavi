import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllCompanies, displayName } from "@/lib/companies";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { CategoryFilterClient } from "@/components/ranking/CategoryFilterClient";

interface Props {
  params: Promise<{ category: string; page?: string[] }>;
}

export function generateStaticParams() {
  const allCompanies = getAllCompanies();
  const params: { category: string; page?: string[] }[] = [];

  for (const cat of CATEGORIES) {
    const filtered = allCompanies.filter(cat.filter);
    const totalPages = Math.ceil(filtered.length / 10);

    params.push({ category: cat.slug });

    for (let p = 2; p <= totalPages; p++) {
      params.push({ category: cat.slug, page: [String(p)] });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, page } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  const pageNum = page?.[0] ? parseInt(page[0]) : 1;
  const pageLabel = pageNum > 1 ? ` (${pageNum}ページ目)` : "";
  return {
    title: `${cat.title}${pageLabel}`,
    description: cat.metaDescription,
    alternates: {
      canonical: pageNum === 1
        ? `${SITE_URL}/ranking/category/${cat.slug}`
        : `${SITE_URL}/ranking/category/${cat.slug}/${pageNum}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const allCompanies = getAllCompanies();

  // SEO用：初期表示のフィルタ結果（サーバーレンダリング＋JSON-LD）
  let initialFiltered = allCompanies.filter(cat.filter);
  if (cat.sort) {
    initialFiltered = initialFiltered.sort(cat.sort);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
          { name: cat.title, url: `${SITE_URL}/ranking/category/${cat.slug}` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: cat.h1,
          itemListElement: initialFiltered.slice(0, 10).map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: displayName(c),
            url: `${SITE_URL}/ranking/${c.slug}`,
          })),
        }}
      />

      <Breadcrumb
        items={[
          { label: "ランキング", href: "/ranking" },
          { label: cat.title },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat.h1}</h1>
      <p className="text-gray-600 mb-4">{cat.description}</p>

      {cat.intro && (
        <div className="bg-green-50 border-l-4 border-[#43a047] rounded-r-lg p-5 mb-8">
          <p className="text-gray-700 text-sm leading-relaxed">{cat.intro}</p>
        </div>
      )}

      <CategoryFilterClient
        allCompanies={allCompanies}
        initialCategorySlug={cat.slug}
      />
    </div>
  );
}
