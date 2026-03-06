import { DiagnosisResult as Result } from "@/types/diagnosis";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
function formatFeeRange(min: number, max: number): string {
  return `${min}%〜${max}%`;
}

interface DiagnosisResultProps {
  results: Result[];
  onReset: () => void;
}

export function DiagnosisResultView({ results, onReset }: DiagnosisResultProps) {
  const top3 = results.slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">診断結果</h2>
      <p className="text-center text-gray-600 mb-8">
        あなたにおすすめのファクタリング業者はこちらです
      </p>

      <div className="space-y-6">
        {top3.map((result, i) => (
          <Card
            key={result.company.slug}
            className={`p-6 ${i === 0 ? "border-2 border-accent" : ""}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  i === 0
                    ? "bg-accent text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{result.company.name}</h3>
                <StarRating rating={result.company.overallRating} size="sm" />

                <div className="flex flex-wrap gap-2 mt-2">
                  {result.reasons.map((r) => (
                    <Badge key={r} variant="success">
                      {r}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-sm">
                  <div>
                    <span className="text-gray-500 block">手数料</span>
                    <span className="font-bold">
                      {formatFeeRange(
                        result.company.feeRange.min,
                        result.company.feeRange.max
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">入金</span>
                    <span className="font-bold">
                      最短
                      {result.company.speedDays === 1
                        ? "即日"
                        : `${result.company.speedDays}日`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">形態</span>
                    <span className="font-bold">
                      {result.company.factoringType}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <a
                    href={`/go/${result.company.slug}`}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="affiliate-link text-sm"
                  >
                    公式サイトで詳しく見る →
                  </a>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <Button variant="outline" onClick={onReset}>
          もう一度診断する
        </Button>
      </div>
    </div>
  );
}
