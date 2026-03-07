export type ArticleCategory = "ファクタリング" | "資金調達" | "税金・節税" | "確定申告・経理" | "保険" | "クレジットカード" | "経営・資金繰り" | "用語集";

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
