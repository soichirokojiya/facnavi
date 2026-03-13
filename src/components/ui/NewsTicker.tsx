"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NewsTickerItem {
  slug: string;
  title: string;
  publishedAt: string;
  category: string;
}

const categoryColor = (cat: string) => {
  switch (cat) {
    case "業界動向": return "bg-blue-100 text-blue-700";
    case "法改正": return "bg-red-100 text-red-700";
    case "サービス": return "bg-emerald-100 text-emerald-700";
    case "調査": return "bg-amber-100 text-amber-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

export function NewsTicker({ news }: { news: NewsTickerItem[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  if (news.length === 0) return null;

  return (
    <div className="bg-white border-b border-gray-200 relative z-10">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Link
          href="/news"
          className="shrink-0 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded hover:bg-blue-700 transition-colors"
        >
          NEWS
        </Link>
        <div className="flex-1 overflow-hidden relative h-6">
          {news.map((item, i) => (
            <a
              key={item.slug}
              href={`/news`}
              className={`absolute inset-0 flex items-center gap-2 transition-all duration-500 ${
                i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <span className="text-xs text-gray-500 shrink-0">{item.publishedAt}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${categoryColor(item.category)}`}>
                {item.category}
              </span>
              <span className="text-sm font-medium text-gray-800 truncate hover:text-blue-600 transition-colors">
                {item.title}
              </span>
            </a>
          ))}
        </div>
        <Link
          href="/news"
          className="shrink-0 text-xs text-gray-400 hover:text-blue-600 transition-colors hidden sm:block"
        >
          一覧 &rarr;
        </Link>
      </div>
    </div>
  );
}
