"use client";

import { useState } from "react";
import { ArticleFrontmatter } from "@/types/article";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { ArticleCard } from "./ArticleCard";

interface ColumnListClientProps {
  articles: ArticleFrontmatter[];
}

export function ColumnListClient({ articles }: ColumnListClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  return (
    <>
      {/* Category filter tabs */}
      <div className="mb-8 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            すべて ({articles.length})
          </button>
          {ARTICLE_CATEGORIES.map((cat) => {
            const count = articles.filter((a) => a.category === cat.label).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.label)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.label
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.emoji} {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          該当する記事がありません
        </p>
      )}
    </>
  );
}
