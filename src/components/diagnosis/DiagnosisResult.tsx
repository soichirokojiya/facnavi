import Link from "next/link";
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

      <div className="text-center mt-8 space-y-4">
        <Button variant="outline" onClick={onReset}>
          もう一度診断する
        </Button>

        <div className="mt-6 p-6 bg-gradient-to-br from-[#0b3d91] to-[#1a365d] rounded-2xl text-center">
          <p className="text-xs font-bold text-orange-400 mb-2">2026年4月サービス開始予定</p>
          <p className="text-white font-bold text-lg mb-2">もっと比較したい方へ</p>
          <p className="text-blue-200 text-sm mb-4">複数社にまとめて見積もり依頼できる一括見積もりサービス</p>
          <Link
            href="/mitsumori"
            className="inline-block px-6 py-3 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm"
          >
            一括見積もりの詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );
}
