export type NewsCategory = "業界動向" | "法改正" | "サービス" | "調査";

export interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  category: NewsCategory;
  isManual: boolean;
}
