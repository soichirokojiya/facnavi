import fs from "fs";
import path from "path";
import { Review, ReviewSummary } from "@/types/review";
import { getCompanyBySlug } from "./companies";

const reviewsPath = path.join(process.cwd(), "content/reviews/reviews.json");

/** JSONファイルから静的レビューを取得（同期） */
function getStaticReviews(): Review[] {
  const raw = fs.readFileSync(reviewsPath, "utf-8");
  return JSON.parse(raw) as Review[];
}

/** Supabaseから承認済みレビューを取得 */
async function getSupabaseReviews(): Promise<Review[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes("xxxxx")) return [];

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      companySlug: r.company_slug,
      authorName: r.author_name,
      industry: r.industry,
      prefecture: r.prefecture,
      rating: r.rating,
      title: r.title,
      body: r.body,
      pros: r.pros,
      cons: r.cons,
      createdAt: r.created_at,
    }));
  } catch {
    return [];
  }
}

/** 全レビュー取得（静的JSON + Supabase承認済み） */
export async function getAllReviewsAsync(): Promise<Review[]> {
  const [staticReviews, supabaseReviews] = await Promise.all([
    Promise.resolve(getStaticReviews()),
    getSupabaseReviews(),
  ]);

  // Supabase側のIDで重複排除（JSONとSupabaseに同じものがあればSupabase優先）
  const staticIds = new Set(staticReviews.map((r) => r.id));
  const merged = [
    ...staticReviews,
    ...supabaseReviews.filter((r) => !staticIds.has(r.id)),
  ];

  return merged.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/** 同期版（後方互換） - 静的JSONのみ */
export function getAllReviews(): Review[] {
  const reviews = getStaticReviews();
  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getReviewsByCompany(companySlug: string): Review[] {
  return getAllReviews().filter((r) => r.companySlug === companySlug);
}

export async function getReviewsByCompanyAsync(companySlug: string): Promise<Review[]> {
  const all = await getAllReviewsAsync();
  return all.filter((r) => r.companySlug === companySlug);
}

export function getReviewSummary(companySlug: string): ReviewSummary | null {
  const reviews = getReviewsByCompany(companySlug);
  return buildSummary(companySlug, reviews);
}

export async function getReviewSummaryAsync(companySlug: string): Promise<ReviewSummary | null> {
  const reviews = await getReviewsByCompanyAsync(companySlug);
  return buildSummary(companySlug, reviews);
}

function buildSummary(companySlug: string, reviews: Review[]): ReviewSummary | null {
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

export async function getReviewedCompanySlugsAsync(): Promise<string[]> {
  const reviews = await getAllReviewsAsync();
  return [...new Set(reviews.map((r) => r.companySlug))];
}
