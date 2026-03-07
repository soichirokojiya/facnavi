import Link from "next/link";
import { ArticleFrontmatter } from "@/types/article";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArticleEyecatch } from "./ArticleEyecatch";

interface ArticleCardProps {
  article: ArticleFrontmatter;
}

const categoryVariant: Record<string, "primary" | "success" | "warning" | "danger"> = {
  ファクタリング: "primary",
  資金調達: "success",
  "税金・節税": "warning",
  "確定申告・経理": "primary",
  保険: "success",
  クレジットカード: "danger",
  "経営・資金繰り": "warning",
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link href={`/column/${article.slug}`}>
      <Card hover className="overflow-hidden">
        <ArticleEyecatch category={article.category} title={article.title} image={article.image} size="sm" />
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={categoryVariant[article.category] ?? "gray"}>
              {article.category}
            </Badge>
            <span className="text-xs text-gray-500">{article.publishedAt}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-3">
            {article.description}
          </p>
        </div>
      </Card>
    </Link>
  );
}
