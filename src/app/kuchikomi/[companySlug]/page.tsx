import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompanyBySlug } from "@/lib/companies";
import {
  getReviewsByCompany,
  getReviewSummary,
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
    title: `${company.name}の口コミ・評判`,
    description: `${company.name}の口コミ${summary?.totalCount ?? 0}件。平均評価${summary?.averageRating ?? "-"}点。利用者のリアルな声を掲載。`,
    alternates: { canonical: `${SITE_URL}/kuchikomi/${companySlug}` },
  };
}

export default async function CompanyReviewsPage({ params }: Props) {
  const { companySlug } = await params;
  const company = getCompanyBySlug(companySlug);
  if (!company) notFound();

  const reviews = getReviewsByCompany(companySlug);
  const summary = getReviewSummary(companySlug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "口コミ", url: `${SITE_URL}/kuchikomi` },
          {
            name: `${company.name}の口コミ`,
            url: `${SITE_URL}/kuchikomi/${companySlug}`,
          },
        ]}
      />
      {summary && (
        <ProductJsonLd
          name={company.name}
          description={company.description}
          rating={summary.averageRating}
          reviewCount={summary.totalCount}
          url={`${SITE_URL}/kuchikomi/${companySlug}`}
        />
      )}

      <Breadcrumb
        items={[
          { label: "口コミ", href: "/kuchikomi" },
          { label: `${company.name}の口コミ` },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {company.name}の口コミ・評判
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

      <div className="space-y-4 mb-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="text-center">
        <a
          href={company.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link"
        >
          {company.name}の公式サイトへ →
        </a>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={`/ranking/${company.slug}`}
          className="text-primary font-medium hover:underline"
        >
          ← {company.name}の詳細ページに戻る
        </Link>
      </div>
    </div>
  );
}
