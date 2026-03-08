import Link from "next/link";
import { getAllNews } from "@/lib/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ファクタリング最新ニュース | ファクナビ",
  description:
    "ファクタリング業界の最新ニュース・動向をお届け。法改正、新サービス、市場調査など、資金調達に役立つ情報を随時更新。",
};

export default function NewsPage() {
  const news = getAllNews();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-[0.15em] text-blue-600 mb-1">
            NEWS
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
            ファクタリング最新ニュース
          </h1>
          <div className="w-10 h-1 bg-orange-500 rounded-full mt-2" />
          <p className="text-sm text-gray-500 mt-3">
            ファクタリング業界の最新動向・法改正・新サービス情報をまとめてお届けします。
          </p>
        </div>

        {news.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-bold mb-2">ニュースはまだありません</p>
            <p className="text-sm">最新のファクタリング関連ニュースを随時更新予定です。</p>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map((item) => (
              <a
                key={item.slug}
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 p-5 md:p-6"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-400">
                        {item.publishedAt}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.category === "業界動向"
                            ? "bg-blue-50 text-blue-600"
                            : item.category === "法改正"
                            ? "bg-red-50 text-red-600"
                            : item.category === "サービス"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.category}
                      </span>
                      {item.isManual && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          編集部
                        </span>
                      )}
                    </div>
                    <h2 className="font-bold text-base text-gray-900 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.summary}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-2">
                      出典: {item.sourceName}
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-300 shrink-0 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/"
            className="inline-block px-5 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-50 transition-colors"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
