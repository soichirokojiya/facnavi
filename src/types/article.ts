export type ArticleCategory = "基礎知識" | "選び方" | "業種別" | "比較";

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  relatedCompanies?: string[];
  relatedArticles?: string[];
}

export interface Article extends ArticleFrontmatter {
  content: string;
}
