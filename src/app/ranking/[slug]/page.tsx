import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getCompanyBySlug,
  getCompanySlugs,
  displayName,
} from "@/lib/companies";
import { formatFeeRange, formatAmount } from "@/lib/format";
import { getReviewsByCompanyAsync, getReviewSummaryAsync } from "@/lib/reviews";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: `${displayName(company)}の口コミ・評判・手数料`,
    description: `${displayName(company)}の手数料${formatFeeRange(company.feeRange.min, company.feeRange.max)}、口コミ評価${company.overallRating}点。${company.description}`,
    alternates: { canonical: `${SITE_URL}/ranking/${slug}` },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const reviews = await getReviewsByCompanyAsync(slug);
  const summary = await getReviewSummaryAsync(slug);
  const allCompanies = getAllCompanies();
  const otherCompanies = allCompanies
    .filter((c) => c.slug !== slug)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
          { name: displayName(company), url: `${SITE_URL}/ranking/${slug}` },
        ]}
      />
      <ProductJsonLd
        name={displayName(company)}
        description={company.description}
        rating={company.overallRating}
        reviewCount={summary?.totalCount ?? 0}
        url={`${SITE_URL}/ranking/${slug}`}
      />

      <Breadcrumb
        items={[
          { label: "ランキング", href: "/ranking" },
          { label: displayName(company) },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            第{company.rankPosition}位
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {displayName(company)}
          </h1>
        </div>
        <StarRating rating={company.overallRating} size="lg" />
        <p className="text-gray-600 mt-3">{company.description}</p>
      </div>

      <div className="text-center mb-8">
        <a
          href={`/go/${company.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link text-lg"
        >
          {displayName(company)}の公式サイトへ →
        </a>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">基本情報</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            ["手数料", formatFeeRange(company.feeRange.min, company.feeRange.max)],
            ["入金スピード", `最短${company.speedDays === 1 ? "即日" : `${company.speedDays}日`}`],
            ["取引形態", company.factoringType],
            ["買取下限", formatAmount(company.minAmount)],
            ["買取上限", formatAmount(company.maxAmount)],
            ["オンライン完結", company.onlineComplete ? "対応" : "非対応"],
            ...(company.establishedYear
              ? [["設立年", `${company.establishedYear}年`]]
              : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">特徴</h2>
        <div className="flex flex-wrap gap-2">
          {company.features.map((f) => (
            <Badge key={f} variant="primary">{f}</Badge>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-success">
          <h3 className="font-bold text-success mb-3">メリット</h3>
          <ul className="space-y-2">
            {company.pros.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <span className="text-success mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 border-l-4 border-l-danger">
          <h3 className="font-bold text-danger mb-3">デメリット</h3>
          <ul className="space-y-2">
            {company.cons.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm">
                <span className="text-danger mt-0.5">△</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mb-8 text-center">
        <Link
          href={`/kuchikomi/post?company=${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {displayName(company)}の口コミを投稿する
        </Link>
      </div>

      {reviews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            口コミ・評判（{reviews.length}件）
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      <div className="text-center mb-12">
        <a
          href={`/go/${company.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link text-lg"
        >
          {displayName(company)}に無料相談する →
        </a>
      </div>

      {otherCompanies.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">他のおすすめ業者</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCompanies.map((c) => (
              <Card key={c.slug} hover className="p-4">
                <a href={`/ranking/${c.slug}`}>
                  <p className="font-bold text-sm">{displayName(c)}</p>
                  <StarRating rating={c.overallRating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">
                    手数料 {formatFeeRange(c.feeRange.min, c.feeRange.max)}
                  </p>
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
