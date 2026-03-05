import Link from "next/link";
import { Company } from "@/types/company";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { formatFeeRange, formatAmount } from "@/lib/companies";

interface CompanyCardProps {
  company: Company;
  rank: number;
}

export function CompanyCard({ company, rank }: CompanyCardProps) {
  return (
    <Card hover className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href={`/ranking/${company.slug}`}>
              <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
                {company.name}
              </h3>
            </Link>
            <Badge variant={company.onlineComplete ? "success" : "gray"}>
              {company.onlineComplete ? "オンライン完結" : "対面あり"}
            </Badge>
          </div>

          <StarRating rating={company.overallRating} size="sm" />

          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {company.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-sm">
            <div>
              <span className="text-gray-500 block">手数料</span>
              <span className="font-bold text-primary">
                {formatFeeRange(company.feeRange.min, company.feeRange.max)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">入金スピード</span>
              <span className="font-bold">最短{company.speedDays === 1 ? "即日" : `${company.speedDays}日`}</span>
            </div>
            <div>
              <span className="text-gray-500 block">取引形態</span>
              <span className="font-bold">{company.factoringType}</span>
            </div>
            <div>
              <span className="text-gray-500 block">買取上限</span>
              <span className="font-bold">
                {formatAmount(company.maxAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {company.features.slice(0, 3).map((feature) => (
              <Badge key={feature} variant="primary">
                {feature}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <Link
              href={`/ranking/${company.slug}`}
              className="text-sm text-primary font-medium hover:underline"
            >
              詳細を見る →
            </Link>
            <a
              href={company.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="affiliate-link text-sm"
            >
              公式サイトへ
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
