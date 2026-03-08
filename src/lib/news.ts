import fs from "fs";
import path from "path";
import { NewsItem } from "@/types/news";

const newsDir = path.join(process.cwd(), "content/news");

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(newsDir)) return [];
  const files = fs.readdirSync(newsDir).filter((f) => f.endsWith(".json"));
  const items = files.map((file) => {
    const raw = fs.readFileSync(path.join(newsDir, file), "utf-8");
    const data = JSON.parse(raw) as Omit<NewsItem, "slug">;
    const slug = file.replace(/\.json$/, "");
    return { ...data, slug };
  });
  return items.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getLatestNews(count: number): NewsItem[] {
  return getAllNews().slice(0, count);
}
