import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { FAQ_DATA, FAQ_CATEGORIES } from "@/lib/faq";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "よくある質問（FAQ） - ファクタリングの疑問を解決",
  description:
    "ファクタリングに関するよくある質問と回答をまとめました。手数料の相場、審査の流れ、個人事業主の利用可否など、初めての方にもわかりやすく解説します。",
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: "よくある質問（FAQ） - ファクタリングの疑問を解決",
    description:
      "ファクタリングに関するよくある質問と回答をまとめました。手数料の相場、審査の流れ、個人事業主の利用可否など、初めての方にもわかりやすく解説します。",
  },
};

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "よくある質問", url: `${SITE_URL}/faq` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_DATA.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />

      <Breadcrumb items={[{ label: "よくある質問" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        よくある質問（FAQ）
      </h1>
      <p className="text-gray-600 mb-8">
        ファクタリングに関する疑問にお答えします。
      </p>

      {/* Category navigation */}
      <nav className="flex flex-wrap gap-2 mb-10">
        {FAQ_CATEGORIES.map((cat) => (
          <a
            key={cat}
            href={`#${cat}`}
            className="px-4 py-2 text-sm font-medium rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            {cat}
          </a>
        ))}
      </nav>

      {/* FAQ sections */}
      {FAQ_CATEGORIES.map((cat) => {
        const items = FAQ_DATA.filter((item) => item.category === cat);
        return (
          <section key={cat} id={cat} className="mb-12 scroll-mt-20">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#43a047] rounded-full" />
              {cat}
            </h2>
            <div className="space-y-4">
              {items.map((item, i) => (
                <Card key={i} className="p-0 overflow-hidden">
                  <details className="group">
                    <summary className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#43a047] text-white flex items-center justify-center text-sm font-bold mt-0.5">
                        Q
                      </span>
                      <span className="font-bold text-gray-900 flex-1 pt-0.5">
                        {item.question}
                      </span>
                      <span className="flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform mt-1">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-0">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold mt-0.5">
                          A
                        </span>
                        <p className="text-gray-700 leading-relaxed flex-1 pt-0.5">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <Card className="p-8 text-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          まだ疑問が解決しない方へ
        </h2>
        <p className="text-gray-600 mb-6">
          無料診断であなたに最適なファクタリング会社を見つけましょう
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shindan"
            className="inline-block px-8 py-3 bg-[#43a047] text-white font-bold rounded-lg hover:bg-[#2e7d32] transition-colors"
          >
            無料診断スタート
          </Link>
          <Link
            href="/ranking"
            className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            ランキングを見る
          </Link>
        </div>
      </Card>
    </div>
  );
}
