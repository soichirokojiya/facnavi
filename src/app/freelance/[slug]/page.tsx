import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getFreelanceArticleBySlug,
  getFreelanceArticleSlugs,
  getAllFreelanceArticles,
  extractHeadings,
} from "@/lib/freelance";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getFreelanceArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getFreelanceArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title}｜THE FREELANCE`,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/freelance/${slug}` },
    openGraph: {
      title: `${article.title}｜THE FREELANCE`,
      description: article.description,
      url: `${SITE_URL}/freelance/${slug}`,
    },
  };
}

function renderMarkdownToHtml(content: string): string {
  let html = content;

  // Headings with IDs
  html = html.replace(/^### (.+)$/gm, (_match, text) => {
    const id = text.toLowerCase().replace(/[^\w\u3000-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h3 id="${id}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_match, text) => {
    const id = text.toLowerCase().replace(/[^\w\u3000-\u9fff]+/g, "-").replace(/^-|-$/g, "");
    return `<h2 id="${id}">${text}</h2>`;
  });

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure class="my-8"><img src="$2" alt="$1" class="w-full rounded-lg shadow-sm" loading="lazy" /><figcaption class="text-sm text-gray-500 text-center mt-2">$1</figcaption></figure>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline">$1</a>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-slate-300 pl-4 text-gray-600 italic">$1</blockquote>');

  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Tables
  html = html.replace(
    /\|(.+)\|\n\|[-|: ]+\|\n((?:\|.+\|\n?)*)/g,
    (_match, header, body) => {
      const headers = header.split("|").map((h: string) => h.trim()).filter(Boolean);
      const rows = body.trim().split("\n").map((row: string) =>
        row.split("|").map((c: string) => c.trim()).filter(Boolean)
      );
      return `<table><thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row: string[]) => `<tr>${row.map((c: string) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
  );

  // Paragraphs
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<li") ||
        trimmed.startsWith("<figure") ||
        trimmed.startsWith("<blockquote")
      )
        return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join("\n");

  return html;
}

export default async function FreelanceArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getFreelanceArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const htmlContent = renderMarkdownToHtml(article.content);

  const allArticles = getAllFreelanceArticles();
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 4);

  return (
    <>
      {/* Dark Navy Top Bar */}
      <div className="bg-[#0f172a]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/freelance"
            className="text-lg md:text-xl font-black text-white tracking-tight hover:opacity-80 transition-opacity"
          >
            THE FREELANCE
          </Link>
          <Link
            href="/freelance"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            記事一覧へ
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <BreadcrumbJsonLd
          items={[
            { name: "ホーム", url: SITE_URL },
            { name: "THE FREELANCE", url: `${SITE_URL}/freelance` },
            { name: article.title, url: `${SITE_URL}/freelance/${slug}` },
          ]}
        />
        <ArticleJsonLd
          title={article.title}
          description={article.description}
          url={`${SITE_URL}/freelance/${slug}`}
          publishedAt={article.publishedAt}
          updatedAt={article.updatedAt}
        />

        <Breadcrumb
          items={[
            { label: "THE FREELANCE", href: "/freelance" },
            { label: article.title },
          ]}
        />

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10 mt-6">
          {/* Main Content */}
          <article>
            {/* Article Header */}
            <div className="mb-8">
              {article.image && (
                <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-6">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-[#0f172a] text-white">
                  {article.category}
                </span>
                <time className="text-sm text-gray-500">{article.publishedAt}</time>
                {article.updatedAt && (
                  <time className="text-sm text-gray-500">
                    最終更新: {article.updatedAt}
                  </time>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {article.title}
              </h1>
              <p className="text-gray-600 mt-3">{article.description}</p>

              {/* Author */}
              <div className="flex items-center gap-3 mt-4 p-3 bg-slate-50 rounded-xl">
                {article.authorIcon ? (
                  <Image
                    src={article.authorIcon}
                    width={40}
                    height={40}
                    alt={article.author || "著者"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {(article.author || "TF")[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {article.author || "THE FREELANCE 編集部"}
                  </p>
                  {article.authorBio && (
                    <p className="text-xs text-gray-500">{article.authorBio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile TOC */}
            {headings.length > 0 && (
              <nav className="lg:hidden bg-white rounded-xl p-6 mb-10 border-2 border-slate-200 shadow-sm">
                <h2 className="font-bold text-base text-gray-800 mb-4 flex items-center gap-2">
                  <span className="inline-block w-6 h-6 bg-[#0f172a] text-white text-xs font-bold rounded flex items-center justify-center">
                    目
                  </span>
                  この記事の目次
                </h2>
                <TOCList headings={headings} />
              </nav>
            )}

            {/* Article Body */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </article>

          {/* Desktop Sidebar TOC */}
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <nav className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h2 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                    <span className="inline-block w-5 h-5 bg-[#0f172a] text-white text-[10px] font-bold rounded flex items-center justify-center">
                      目
                    </span>
                    目次
                  </h2>
                  <TOCList headings={headings} />
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* Author Profile */}
        <section className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 md:p-8 border border-slate-200">
          <p className="text-xs font-bold text-[#0f172a] mb-4 tracking-widest uppercase">
            Author
          </p>
          <div className="flex items-start gap-4 md:gap-5">
            {article.authorIcon ? (
              <Image
                src={article.authorIcon}
                width={80}
                height={80}
                alt={article.author || "著者"}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shrink-0 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0f172a] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white text-2xl md:text-3xl font-black">
                  {(article.author || "TF")[0]}
                </span>
              </div>
            )}
            <div>
              <p className="text-lg font-bold text-gray-900">
                {article.author || "THE FREELANCE 編集部"}
              </p>
              {article.authorBio ? (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {article.authorBio}
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  フリーランスの「稼ぐ力」を最大化するためのノウハウを発信中。収入アップ・スキルアップ・案件獲得・税金対策まで、実践的な情報をお届けしています。
                </p>
              )}
              <Link
                href="/freelance"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-[#0f172a] hover:text-blue-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                THE FREELANCEの記事一覧を見る
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              関連記事
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/freelance/${a.slug}`}
                  className="block p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f172a] text-white mb-2">
                    {a.category}
                  </span>
                  <p className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {a.title}
                  </p>
                  <time className="block text-xs text-gray-400 mt-2">
                    {a.publishedAt}
                  </time>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/* ── Table of Contents List ── */
function TOCList({ headings }: { headings: { id: string; text: string; level: number }[] }) {
  let h2Index = 0;
  return (
    <ol className="space-y-2 text-[15px]">
      {headings.map((h) => {
        if (h.level === 2) h2Index++;
        return (
          <li key={h.id} className={h.level === 3 ? "ml-6 text-sm" : ""}>
            <a
              href={`#${h.id}`}
              className="text-gray-700 hover:text-[#0f172a] hover:underline transition-colors flex items-start gap-2"
            >
              {h.level === 2 && (
                <span className="text-[#0f172a] font-bold shrink-0">
                  {h2Index}.
                </span>
              )}
              {h.level === 3 && (
                <span className="text-gray-400 shrink-0">─</span>
              )}
              <span>{h.text}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
