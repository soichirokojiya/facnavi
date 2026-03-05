import fs from "fs";
import path from "path";
import { Review, ReviewSummary } from "@/types/review";
import { getCompanyBySlug } from "./companies";

const reviewsPath = path.join(process.cwd(), "content/reviews/reviews.json");

export function getAllReviews(): Review[] {
  const raw = fs.readFileSync(reviewsPath, "utf-8");
  const reviews = JSON.parse(raw) as Review[];
  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReviewsByCompany(companySlug: string): Review[] {
  return getAllReviews().filter((r) => r.companySlug === companySlug);
}

export function getReviewSummary(companySlug: string): ReviewSummary | null {
  const reviews = getReviewsByCompany(companySlug);
  if (reviews.length === 0) return null;

  const company = getCompanyBySlug(companySlug);
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  return {
    companySlug,
    companyName: company?.name ?? companySlug,
    averageRating: Math.round((total / reviews.length) * 10) / 10,
    totalCount: reviews.length,
    ratingDistribution: distribution,
  };
}

export function getReviewedCompanySlugs(): string[] {
  const reviews = getAllReviews();
  return [...new Set(reviews.map((r) => r.companySlug))];
}
