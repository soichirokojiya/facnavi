import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug, getArticleSlugs, extractHeadings, getAllArticles } from "@/lib/articles";
import { getCompanyBySlug } from "@/lib/companies";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TableOfContents } from "@/components/articles/TableOfContents";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { formatFeeRange } from "@/lib/companies";

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

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

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
        trimmed.startsWith("<li")
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

  const allArticles = getAllArticles();
  const relatedArticles = (article.relatedArticles ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter(Boolean);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "コラム", url: `${SITE_URL}/column` },
          { name: article.title, url: `${SITE_URL}/column/${slug}` },
        ]}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={`${SITE_URL}/column/${slug}`}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
      />

      <Breadcrumb
        items={[
          { label: "コラム", href: "/column" },
          { label: article.title },
        ]}
      />

      <article>
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge>{article.category}</Badge>
            <time className="text-sm text-gray-500">{article.publishedAt}</time>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
          <p className="text-gray-600 mt-3">{article.description}</p>
        </div>

        <TableOfContents headings={headings} />

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {relatedCompanies.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold mb-4">関連するファクタリング業者</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedCompanies.map((c) =>
              c ? (
                <Card key={c.slug} hover className="p-4">
                  <Link href={`/ranking/${c.slug}`}>
                    <p className="font-bold">{c.name}</p>
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
