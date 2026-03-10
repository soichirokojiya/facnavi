import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllFreelanceArticles } from "@/lib/freelance";
import { FREELANCE_CATEGORIES } from "@/lib/freelance";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "THE FREELANCE｜フリーランスが、もっと稼ぐためのメディア",
  description:
    "THE FREELANCEは、フリーランスの収入アップ・スキルアップ・案件獲得・税金対策などを徹底解説するWebメディアです。",
  alternates: { canonical: `${SITE_URL}/freelance` },
  openGraph: {
    title: "THE FREELANCE｜フリーランスが、もっと稼ぐためのメディア",
    description:
      "THE FREELANCEは、フリーランスの収入アップ・スキルアップ・案件獲得・税金対策などを徹底解説するWebメディアです。",
    url: `${SITE_URL}/freelance`,
  },
};

export default function FreelanceTopPage() {
  const articles = getAllFreelanceArticles();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "THE FREELANCE", url: `${SITE_URL}/freelance` },
        ]}
      />

      {/* Hero Section */}
      <section className="bg-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            THE FREELANCE
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 font-medium">
            フリーランスが、もっと稼ぐためのメディア
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {FREELANCE_CATEGORIES.map((cat) => (
              <span
                key={cat.slug}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-slate-200 hover:bg-white/20 transition-colors"
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-5xl mx-auto px-4 py-12 md:py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          最新記事
        </h2>

        {articles.length === 0 ? (
          <p className="text-gray-500 text-center py-16">
            記事はまだありません。
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/freelance/${article.slug}`}
                className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
              >
                {/* Card Image */}
                <div className="aspect-[16/9] bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-black text-white/20 tracking-tight">
                        THE FREELANCE
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[#0f172a] text-white mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {article.description}
                  </p>
                  <time className="block text-xs text-gray-400 mt-3">
                    {article.publishedAt}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
