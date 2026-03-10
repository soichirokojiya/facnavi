import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { FreelanceArticle, FreelanceArticleFrontmatter } from "@/types/freelance";

const freelanceDir = path.join(process.cwd(), "content/freelance");

export const FREELANCE_CATEGORIES = [
  { slug: "earn", label: "稼ぐ", emoji: "💰", description: "収入アップ・高単価案件の獲得術" },
  { slug: "skill-up", label: "スキルアップ", emoji: "📈", description: "スキルを磨いて市場価値を高める" },
  { slug: "sales", label: "営業・案件獲得", emoji: "🤝", description: "営業戦略・案件獲得のノウハウ" },
  { slug: "money-tax", label: "お金・税金", emoji: "🧾", description: "確定申告・節税・お金の管理術" },
  { slug: "tools", label: "ツール", emoji: "🛠️", description: "フリーランスに役立つツール紹介" },
  { slug: "mindset", label: "マインド", emoji: "🧠", description: "フリーランスとしてのマインドセット" },
] as const;

export function getAllFreelanceArticles(): FreelanceArticle[] {
  if (!fs.existsSync(freelanceDir)) return [];
  const files = fs.readdirSync(freelanceDir).filter((f) => f.endsWith(".mdx"));
  const articles = files.map((file) => {
    const raw = fs.readFileSync(path.join(freelanceDir, file), "utf-8");
    const { data, content } = matter(raw);
    return { ...(data as FreelanceArticleFrontmatter), content };
  });
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFreelanceArticleBySlug(slug: string): FreelanceArticle | undefined {
  const articles = getAllFreelanceArticles();
  return articles.find((a) => a.slug === slug);
}

export function getFreelanceArticleSlugs(): string[] {
  if (!fs.existsSync(freelanceDir)) return [];
  return fs
    .readdirSync(freelanceDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(freelanceDir, f), "utf-8");
      const { data } = matter(raw);
      return (data as FreelanceArticleFrontmatter).slug;
    });
}

export function extractHeadings(content: string): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; text: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\u3000-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    headings.push({ id, text, level: match[1].length });
  }
  return headings;
}
