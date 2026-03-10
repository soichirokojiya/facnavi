export type FreelanceCategory = "稼ぐ" | "スキルアップ" | "営業・案件獲得" | "お金・税金" | "ツール" | "マインド";

export interface FreelanceArticleFrontmatter {
  title: string;
  slug: string;
  description: string;
  category: FreelanceCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  author?: string;
  authorIcon?: string;
  authorBio?: string;
}

export interface FreelanceArticle extends FreelanceArticleFrontmatter {
  content: string;
}
