import Link from "next/link";
import { Review } from "@/types/review";
import { Card } from "@/components/ui/Card";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";

interface ReviewCardProps {
  review: Review;
  companyName?: string;
}

export function ReviewCard({ review, companyName }: ReviewCardProps) {
  return (
    <Card className="p-5">
      {companyName && (
        <div className="mb-2">
          <Link
            href={`/ranking/${review.companySlug}`}
            className="text-xs font-bold text-primary bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
          >
            {companyName}
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} size="sm" showValue={false} />
          <span className="text-sm font-bold">{review.title}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Badge variant="gray">{review.industry}</Badge>
          <span>{review.prefecture}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-3">{review.body}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="bg-green-50 rounded p-2">
          <span className="text-success font-bold">良い点：</span>
          {review.pros}
        </div>
        <div className="bg-red-50 rounded p-2">
          <span className="text-danger font-bold">気になる点：</span>
          {review.cons}
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
        <span>{review.authorName}</span>
        <span>{review.createdAt}</span>
      </div>
    </Card>
  );
}
