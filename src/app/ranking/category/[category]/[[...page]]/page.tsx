import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCompanies } from "@/lib/companies";
import { CATEGORIES, getCategoryBySlug } from "@/lib/categories";
import { CompanyCard } from "@/components/ranking/CompanyCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

const PER_PAGE = 10;

interface Props {
  params: Promise<{ category: string; page?: string[] }>;
}

export function generateStaticParams() {
  const allCompanies = getAllCompanies();
  const params: { category: string; page?: string[] }[] = [];

  for (const cat of CATEGORIES) {
    const filtered = allCompanies.filter(cat.filter);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);

    // Page 1 (no page param)
    params.push({ category: cat.slug });

    // Page 2+
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
  const { category, page } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const pageNum = page?.[0] ? parseInt(page[0]) : 1;
  if (isNaN(pageNum) || pageNum < 1) notFound();

  const allCompanies = getAllCompanies();
  let filtered = allCompanies.filter(cat.filter);
  if (cat.sort) {
    filtered = filtered.sort(cat.sort);
  }

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  if (pageNum > totalPages && filtered.length > 0) notFound();

  const startIdx = (pageNum - 1) * PER_PAGE;
  const pageCompanies = filtered.slice(startIdx, startIdx + PER_PAGE);

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
          itemListElement: pageCompanies.map((c, i) => ({
            "@type": "ListItem",
            position: startIdx + i + 1,
            name: c.name,
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
      <p className="text-gray-600 mb-6">{cat.description}</p>

      {/* Category navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/ranking/category/${c.slug}`}>
            <Badge variant={c.slug === cat.slug ? "primary" : "gray"}>
              {c.title.replace("ファクタリング会社", "").replace("の", "")}
            </Badge>
          </Link>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        該当する会社: <span className="font-bold text-primary">{filtered.length}社</span>
        {totalPages > 1 && (
          <span className="ml-2">（{pageNum} / {totalPages} ページ）</span>
        )}
      </p>

      <div className="space-y-6">
        {pageCompanies.map((company, i) => (
          <CompanyCard
            key={company.slug}
            company={company}
            rank={startIdx + i + 1}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>該当する会社が見つかりませんでした。</p>
          <Link href="/ranking" className="text-primary hover:underline mt-2 inline-block">
            すべてのランキングを見る →
          </Link>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-2 mt-10">
          {pageNum > 1 && (
            <Link
              href={pageNum === 2
                ? `/ranking/category/${cat.slug}`
                : `/ranking/category/${cat.slug}/${pageNum - 1}`}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
            >
              ← 前へ
            </Link>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={p === 1
                ? `/ranking/category/${cat.slug}`
                : `/ranking/category/${cat.slug}/${p}`}
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
              href={`/ranking/category/${cat.slug}/${pageNum + 1}`}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition-colors"
            >
              次へ →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
