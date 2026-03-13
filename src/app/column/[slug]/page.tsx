import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticleSlugs, extractHeadings, getAllArticles } from "@/lib/articles";
import { getCompanyBySlug, displayName } from "@/lib/companies";
import { getAuthorById } from "@/lib/authors";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TableOfContents } from "@/components/articles/TableOfContents";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { ArticleEyecatch } from "@/components/articles/ArticleEyecatch";
import { BreadcrumbJsonLd, ArticleJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { formatFeeRange } from "@/lib/format";
import Image from "next/image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `${SITE_URL}/column/${slug}` },
    ...(article.noindex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: article.title,
      description: article.description,
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
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 text-gray-600 italic">$1</blockquote>');

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

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractHeadings(article.content);
  const htmlContent = renderMarkdownToHtml(article.content);

  const relatedCompanies = (article.relatedCompanies ?? [])
    .map((s) => getCompanyBySlug(s))
    .filter(Boolean);

  const authorData = article.author ? getAuthorById(article.author) : undefined;

  const allArticles = getAllArticles();
  const relatedArticles = (article.relatedArticles ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "実践経営ノート", url: `${SITE_URL}/column` },
          { name: article.title, url: `${SITE_URL}/column/${slug}` },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={`${SITE_URL}/column/${slug}`}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        authorName={authorData?.name ?? article.author}
        authorDescription={authorData?.description ?? article.authorBio}
      />
      {article.faq && article.faq.length > 0 && (
        <FAQJsonLd faqs={article.faq} />
      )}

      <Breadcrumb
        items={[
          { label: "実践経営ノート", href: "/column" },
          { label: article.title },
        ]}
      />

      <article>
        <div className="mb-8">
          <ArticleEyecatch category={article.category} title={article.title} image={article.image} size="lg" />
          <div className="flex items-center gap-2 mt-5 mb-3">
            <Badge>{article.category}</Badge>
            <time className="text-sm text-gray-500">{article.publishedAt}</time>
            {article.updatedAt && (
              <time className="text-sm text-gray-500">最終更新: {article.updatedAt}</time>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-600 mt-3">{article.description}</p>

          {/* 著者情報 */}
          <div className="flex items-center gap-3 mt-4 p-3 bg-gray-50 rounded-xl">
            {article.authorIcon ? (
              <Image src={article.authorIcon} width={40} height={40} alt={article.author || "著者"} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
                {(authorData?.name ?? article.author ?? "編")[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-gray-900">{authorData?.name ?? article.author ?? "ファクナビ編集部"}</p>
              {(authorData?.description || article.authorBio) && (
                <p className="text-xs text-gray-500">{article.authorBio ?? authorData?.description}</p>
              )}
              {authorData?.expertise && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {authorData.expertise.map((tag) => (
                    <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <TableOfContents headings={headings} />

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* 執筆者プロフィール */}
      {article.authorIcon ? (
        <section className="mt-10 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 md:p-8 border border-blue-100">
          <p className="text-xs font-bold text-blue-600 mb-4">この記事の執筆者</p>
          <div className="flex items-start gap-4 md:gap-5">
            <Image src={article.authorIcon} width={80} height={80} alt={article.author || "著者"} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shrink-0 shadow-md" />
            <div>
              <p className="text-lg font-bold text-gray-900">{article.author}</p>
              {article.authorBio && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{article.authorBio}</p>}
              {article.author === "ろい" && (
                <>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    「ファクタリング比較ラボ」主宰。自身の経営経験とファクタリング利用経験をもとに、事業者目線でファクタリングの活用法や選び方を発信中。
                  </p>
                  <a
                    href="https://note.com/financing_tokyo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.195 2.641c-.24-.24-.526-.36-.857-.36h-7.08c-.95 0-1.96.395-3.032 1.186l-1.674 1.29-.51.382-.51-.382L6.858 3.467C5.786 2.676 4.776 2.28 3.826 2.28H.741c-.331 0-.617.121-.857.36-.24.241-.36.527-.36.858v14.925c0 .331.12.617.36.857.24.24.526.36.857.36h3.085c.95 0 1.96-.395 3.032-1.186l1.674-1.29.51-.382.51.382 1.674 1.29c1.072.791 2.082 1.186 3.032 1.186h7.08c.331 0 .617-.12.857-.36.24-.24.36-.526.36-.857V3.499c0-.331-.12-.617-.36-.858z" /></svg>
                    ろい氏のnoteを見る
                  </a>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="mt-10 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 md:p-8 border border-gray-100">
          <p className="text-xs font-bold text-blue-600 mb-4">この記事の執筆者</p>
          <div className="flex items-start gap-4 md:gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
              <span className="text-white text-2xl md:text-3xl font-black">F</span>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{authorData?.name ?? "ファクナビ編集部"}</p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {authorData?.description ?? "ファクタリング比較サイト「ファクナビ」の編集部です。FP・税理士監修のもと、ファクタリングや資金調達に関する正確でわかりやすい情報をお届けしています。中小企業・個人事業主の経営者の方が最適な資金調達方法を見つけられるよう、実践的なコンテンツを発信中。"}
              </p>
              {authorData?.expertise && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {authorData.expertise.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href="/column"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                実践経営ノートの記事一覧を見る
              </Link>
            </div>
          </div>
        </section>
      )}

      {relatedCompanies.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold mb-4">関連するファクタリング業者</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCompanies.map((c) =>
              c ? (
                <Card key={c.slug} hover className="p-4">
                  <Link href={`/ranking/${c.slug}`}>
                    <p className="font-bold">{displayName(c)}</p>
                    <StarRating rating={c.overallRating} size="sm" />
                    <p className="text-xs text-gray-500 mt-1">
                      手数料 {formatFeeRange(c.feeRange.min, c.feeRange.max)}
                    </p>
                  </Link>
                </Card>
              ) : null
            )}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-4">関連記事</h2>
          <ul className="space-y-2">
            {relatedArticles.map((a) =>
              a ? (
                <li key={a.slug}>
                  <Link
                    href={`/column/${a.slug}`}
                    className="text-primary hover:underline"
                  >
                    {a.title}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
