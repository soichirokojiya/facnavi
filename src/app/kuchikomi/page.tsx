import type { Metadata } from "next";
import Link from "next/link";
import { getAllReviews, getReviewedCompanySlugs, getReviewSummary } from "@/lib/reviews";
import { getCompanyBySlug } from "@/lib/companies";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ファクタリング口コミ・評判一覧",
  description:
    "実際にファクタリングを利用した方の口コミ・評判を掲載。業者選びの参考にしてください。",
  alternates: { canonical: `${SITE_URL}/kuchikomi` },
};

export default function ReviewsPage() {
  const reviews = getAllReviews();
  const companySlugs = getReviewedCompanySlugs();
  const companyMap = Object.fromEntries(
    companySlugs.map((slug) => [slug, getCompanyBySlug(slug)?.name ?? slug])
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "口コミ", url: `${SITE_URL}/kuchikomi` },
        ]}
      />
      <Breadcrumb items={[{ label: "口コミ" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        口コミ・評判一覧
      </h1>
      <p className="text-gray-600 mb-8">
        実際にファクタリングを利用した方の口コミ・評判をまとめています。
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">業者別の口コミ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {companySlugs.map((slug) => {
            const company = getCompanyBySlug(slug);
            const summary = getReviewSummary(slug);
            if (!company || !summary) return null;
            return (
              <Link key={slug} href={`/kuchikomi/${slug}`}>
                <Card hover className="p-4">
                  <p className="font-bold text-sm">{company.name}</p>
                  <StarRating rating={summary.averageRating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">
                    {summary.totalCount}件の口コミ
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">最新の口コミ</h2>
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} companyName={companyMap[review.companySlug]} />
          ))}
        </div>
      </section>
    </div>
  );
}
