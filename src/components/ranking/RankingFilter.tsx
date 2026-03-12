"use client";

import { useState, useMemo } from "react";
import { Company } from "@/types/company";
import { ComparisonTable } from "./ComparisonTable";
import { CompanyCard } from "./CompanyCard";

interface FilterOption {
  key: string;
  label: string;
  filter: (c: Company) => boolean;
}

const FILTER_OPTIONS: FilterOption[] = [
  { key: "same-day", label: "即日入金", filter: (c) => c.speedDays <= 1 },
  { key: "online", label: "オンライン完結", filter: (c) => c.onlineComplete },
  { key: "low-fees", label: "手数料が安い", filter: (c) => c.feeRange.min <= 3 },
  { key: "sole-prop", label: "個人事業主OK", filter: (c) => c.features.some(f => f.includes("個人事業主") || f.includes("フリーランス")) },
  { key: "small", label: "少額OK", filter: (c) => c.minAmount <= 300000 },
  { key: "large", label: "大口対応", filter: (c) => c.maxAmount >= 100000000 || c.maxAmount === 0 },
  { key: "weekend", label: "土日対応", filter: (c) => c.weekendPayment || c.features.some(f => f.includes("土日") || f.includes("365日")) },
  { key: "two-party", label: "2社間", filter: (c) => c.factoringType.includes("2社間") },
  { key: "three-party", label: "3社間", filter: (c) => c.factoringType.includes("3社間") },
];

const PER_PAGE = 20;

interface RankingFilterProps {
  companies: Company[];
}

export function RankingFilter({ companies }: RankingFilterProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const toggleFilter = (key: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
    setVisibleCount(PER_PAGE);
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setVisibleCount(PER_PAGE);
  };

  const filtered = useMemo(() => {
    if (activeFilters.size === 0) return companies;
    return companies.filter((c) =>
      [...activeFilters].every((key) => {
        const opt = FILTER_OPTIONS.find((o) => o.key === key);
        return opt ? opt.filter(c) : true;
      })
    );
  }, [companies, activeFilters]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      {/* フィルター */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-gray-700">条件で絞り込み（複数選択OK）</p>
          {activeFilters.size > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              クリア
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const isActive = activeFilters.has(opt.key);
            return (
              <button
                key={opt.key}
                onClick={() => toggleFilter(opt.key)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {activeFilters.size > 0 && (
          <p className="mt-3 text-sm text-gray-500">
            該当: <span className="font-bold text-blue-700">{filtered.length}社</span>
          </p>
        )}
      </div>

      {/* 比較表 */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          比較表で一覧チェック
        </h2>
        <ComparisonTable companies={visible.slice(0, 10)} />
      </section>

      {/* 各社詳細 */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">各社の詳細</h2>
        <div className="space-y-6">
          {visible.map((company, index) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={index + 1}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>該当する会社が見つかりませんでした。</p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:underline mt-2"
            >
              フィルターをクリア
            </button>
          </div>
        )}

        {/* もっと見る */}
        {visibleCount < filtered.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + PER_PAGE)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
            >
              もっと見る（残り{filtered.length - visibleCount}社）
            </button>
          </div>
        )}
      </section>
    </>
  );
}
