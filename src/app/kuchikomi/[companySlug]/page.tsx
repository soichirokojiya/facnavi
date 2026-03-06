import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyBySlug, displayName } from "@/lib/companies";
import {
  getReviewsByCompanyAsync,
  getReviewSummary,
  getReviewSummaryAsync,
  getReviewedCompanySlugs,
} from "@/lib/reviews";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { BreadcrumbJsonLd, ProductJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: Promise<{ companySlug: string }>;
}

export async function generateStaticParams() {
  return getReviewedCompanySlugs().map((companySlug) => ({ companySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { companySlug } = await params;
  const company = getCompanyBySlug(companySlug);
  if (!company) return {};
  const summary = getReviewSummary(companySlug);
  return {
    title: `${displayName(company)}の口コミ・評判`,
    description: `${displayName(company)}の口コミ${summary?.totalCount ?? 0}件。平均評価${summary?.averageRating ?? "-"}点。利用者のリアルな声を掲載。`,
    alternates: { canonical: `${SITE_URL}/kuchikomi/${companySlug}` },
  };
}

export default async function CompanyReviewsPage({ params }: Props) {
  const { companySlug } = await params;
  const company = getCompanyBySlug(companySlug);
  if (!company) notFound();

  const reviews = await getReviewsByCompanyAsync(companySlug);
  const summary = await getReviewSummaryAsync(companySlug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "口コミ", url: `${SITE_URL}/kuchikomi` },
          {
            name: `${displayName(company)}の口コミ`,
            url: `${SITE_URL}/kuchikomi/${companySlug}`,
          },
        ]}
      />
      {summary && (
        <ProductJsonLd
          name={displayName(company)}
          description={company.description}
          rating={summary.averageRating}
          reviewCount={summary.totalCount}
          url={`${SITE_URL}/kuchikomi/${companySlug}`}
        />
      )}

      <Breadcrumb
        items={[
          { label: "口コミ", href: "/kuchikomi" },
          { label: `${displayName(company)}の口コミ` },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {displayName(company)}の口コミ・評判
      </h1>

      {summary && (
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {summary.averageRating}
              </div>
              <StarRating rating={summary.averageRating} size="md" showValue={false} />
              <p className="text-sm text-gray-500 mt-1">
                {summary.totalCount}件の口コミ
              </p>
            </div>
            <div className="flex-1 min-w-[200px]">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-4">{star}</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${
                          summary.totalCount > 0
                            ? ((summary.ratingDistribution[star] || 0) /
                                summary.totalCount) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-gray-500">
                    {summary.ratingDistribution[star] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="mb-6 text-center">
        <Link
          href={`/kuchikomi/post?company=${companySlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {displayName(company)}の口コミを投稿する
        </Link>
      </div>

      <div className="space-y-4 mb-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="text-center">
        <a
          href={`/go/${company.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link"
        >
          {displayName(company)}の公式サイトへ →
        </a>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/ranking/${company.slug}`}
          className="text-primary font-medium hover:underline"
        >
          ← {displayName(company)}の詳細ページに戻る
        </Link>
      </div>
    </div>
  );
}
