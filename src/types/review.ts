export interface Review {
  id: string;
  companySlug: string;
  authorName: string;
  industry: string;
  prefecture: string;
  rating: number;
  title: string;
  body: string;
  pros: string;
  cons: string;
  createdAt: string;
}

export interface ReviewSummary {
  companySlug: string;
  companyName: string;
  averageRating: number;
  totalCount: number;
  ratingDistribution: Record<number, number>;
}
