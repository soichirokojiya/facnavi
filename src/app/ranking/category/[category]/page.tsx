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

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: cat.title,
    description: cat.metaDescription,
    alternates: { canonical: `${SITE_URL}/ranking/category/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const allCompanies = getAllCompanies();
  let filtered = allCompanies.filter(cat.filter);
  if (cat.sort) {
    filtered = filtered.sort(cat.sort);
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
          itemListElement: filtered.slice(0, 50).map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
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
      </p>

      <div className="space-y-6">
        {filtered.map((company, i) => (
          <CompanyCard
            key={company.slug}
            company={company}
            rank={i + 1}
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
    </div>
  );
}
