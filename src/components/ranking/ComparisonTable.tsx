import Link from "next/link";
import { Company } from "@/types/company";
import { StarRating } from "@/components/ui/StarRating";
import { formatFeeRange } from "@/lib/format";

interface ComparisonTableProps {
  companies: Company[];
}

export function ComparisonTable({ companies }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="px-4 py-3 text-left font-bold">順位</th>
            <th className="px-4 py-3 text-left font-bold">業者名</th>
            <th className="px-4 py-3 text-left font-bold">手数料</th>
            <th className="px-4 py-3 text-left font-bold">評価</th>
            <th className="px-4 py-3 text-center font-bold">オンライン</th>
            <th className="px-4 py-3 text-center font-bold">個人事業主</th>
            <th className="px-4 py-3 text-center font-bold">土日入金</th>
            <th className="px-4 py-3 text-center font-bold">詳細</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, i) => (
            <tr
              key={company.slug}
              className={`border-b border-gray-200 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50 transition-colors`}
            >
              <td className="px-4 py-3 font-bold text-primary text-lg">
                {company.rankPosition}
              </td>
              <td className="px-4 py-3 font-bold">
                <Link
                  href={`/ranking/${company.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {company.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                {formatFeeRange(company.feeRange.min, company.feeRange.max)}
              </td>
              <td className="px-4 py-3">
                <StarRating rating={company.overallRating} size="sm" />
              </td>
              <td className="px-4 py-3 text-center">
                {company.onlineComplete ? (
                  <span className="text-success font-bold">◎</span>
                ) : (
                  <span className="text-gray-400">△</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {company.soleProprietorOk ? (
                  <span className="text-success font-bold">◎</span>
                ) : (
                  <span className="text-gray-400">−</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {company.weekendPayment ? (
                  <span className="text-success font-bold">◎</span>
                ) : (
                  <span className="text-gray-400">−</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={company.affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="inline-block px-3 py-1 bg-accent text-white text-xs font-bold rounded hover:bg-amber-600 transition-colors"
                >
                  公式サイト
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
