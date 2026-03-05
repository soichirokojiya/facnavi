import Link from "next/link";
import { ArticleFrontmatter } from "@/types/article";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArticleEyecatch } from "./ArticleEyecatch";

interface ArticleCardProps {
  article: ArticleFrontmatter;
}

const categoryVariant: Record<string, "primary" | "success" | "warning" | "danger"> = {
  基礎知識: "primary",
  選び方: "success",
  業種別: "warning",
  比較: "danger",
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/column/${article.slug}`}>
      <Card hover className="overflow-hidden">
        <ArticleEyecatch category={article.category} title={article.title} size="sm" />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={categoryVariant[article.category] ?? "gray"}>
              {article.category}
            </Badge>
            <span className="text-xs text-gray-500">{article.publishedAt}</span>
          </div>
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm">
            {article.title}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">
            {article.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
