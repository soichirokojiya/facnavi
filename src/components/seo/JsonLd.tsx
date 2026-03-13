interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ファクナビ",
        url: "https://facnavi.info",
        description:
          "ファクタリング業者の比較・口コミ情報サイト",
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  publishedAt,
  updatedAt,
  authorName,
  authorDescription,
}: {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  authorDescription?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        datePublished: publishedAt,
        ...(updatedAt && { dateModified: updatedAt }),
        author: {
          "@type": authorName === "ファクナビ編集部" ? "Organization" : "Person",
          name: authorName ?? "ファクナビ編集部",
          ...(authorDescription && { description: authorDescription }),
        },
        publisher: {
          "@type": "Organization",
          name: "ファクナビ",
        },
      }}
    />
  );
}

export function FAQJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  rating,
  reviewCount,
  url,
}: {
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description,
        url,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.toString(),
          bestRating: "5",
          worstRating: "1",
          ratingCount: reviewCount.toString(),
        },
        category: "ファクタリングサービス",
      }}
    />
  );
}
