"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Company } from "@/types/company";
import { CompanyCard } from "./CompanyCard";
import { Badge } from "@/components/ui/Badge";

// フィルター定義（categories.tsのフィルターロジックと同等）
interface FilterDef {
  slug: string;
  label: string;
  group: "condition" | "transaction" | "industry" | "prefecture";
  filter: (c: Company) => boolean;
}

const CONDITION_FILTERS: FilterDef[] = [
  { slug: "low-fees", label: "手数料が安い", group: "condition", filter: (c) => c.feeRange.min <= 3 },
  { slug: "same-day", label: "即日入金", group: "condition", filter: (c) => c.speedDays <= 1 },
  { slug: "sole-proprietor", label: "個人事業主OK", group: "condition", filter: (c) => c.features.some(f => f.includes("個人事業主") || f.includes("フリーランス")) },
  { slug: "online-complete", label: "オンライン完結", group: "condition", filter: (c) => c.onlineComplete },
  { slug: "small-amount", label: "少額OK", group: "condition", filter: (c) => c.minAmount <= 300000 },
  { slug: "large-amount", label: "大口対応", group: "condition", filter: (c) => c.maxAmount >= 100000000 || c.maxAmount === 0 },
  { slug: "weekend", label: "土日対応", group: "condition", filter: (c) => c.weekendPayment || c.features.some(f => f.includes("土日") || f.includes("365日")) },
  { slug: "easy-screening", label: "審査が通りやすい", group: "condition", filter: (c) => c.features.some(f => f.includes("個人事業主") || f.includes("フリーランス") || f.includes("審査")) || c.onlineComplete },
  { slug: "few-documents", label: "書類が少ない", group: "condition", filter: (c) => c.features.some(f => f.includes("書類") && (f.includes("少") || f.includes("簡単") || f.includes("2点") || f.includes("3点"))) },
  { slug: "no-registration", label: "登記不要", group: "condition", filter: (c) => c.features.some(f => f.includes("登記不要") || f.includes("登記なし")) },
  { slug: "no-financial-statements", label: "決算書不要", group: "condition", filter: (c) => c.features.some(f => f.includes("決算書不要") || f.includes("書類") && f.includes("少")) || c.onlineComplete },
  { slug: "no-tax-return", label: "確定申告書不要", group: "condition", filter: (c) => c.features.some(f => f.includes("書類") && (f.includes("少") || f.includes("簡単"))) || c.onlineComplete },
];

const TRANSACTION_FILTERS: FilterDef[] = [
  { slug: "two-party", label: "2社間", group: "transaction", filter: (c) => c.factoringType.includes("2社間") },
  { slug: "three-party", label: "3社間", group: "transaction", filter: (c) => c.factoringType.includes("3社間") },
];

const INDUSTRY_FILTERS: FilterDef[] = [
  { slug: "construction", label: "建設業", group: "industry", filter: (c) => (c.targetIndustries?.includes("建設業") ?? false) || c.features.some(f => f.includes("建設")) },
  { slug: "medical", label: "医療・介護", group: "industry", filter: (c) => (c.targetIndustries?.includes("医療・介護") ?? false) || c.features.some(f => f.includes("医療") || f.includes("介護") || f.includes("診療")) },
  { slug: "transportation", label: "運送業", group: "industry", filter: (c) => (c.targetIndustries?.includes("運送業") ?? false) || c.features.some(f => f.includes("運送") || f.includes("物流")) },
  { slug: "it-web", label: "IT・Web", group: "industry", filter: (c) => (c.targetIndustries?.includes("IT・Web") ?? false) || c.features.some(f => f.includes("IT") || f.includes("Web")) },
  { slug: "manufacturing", label: "製造業", group: "industry", filter: (c) => (c.targetIndustries?.includes("製造業") ?? false) || c.features.some(f => f.includes("製造")) },
  { slug: "food-service", label: "飲食業", group: "industry", filter: (c) => (c.targetIndustries?.includes("飲食業") ?? false) || c.features.some(f => f.includes("飲食")) },
  { slug: "staffing", label: "人材派遣", group: "industry", filter: (c) => (c.targetIndustries?.includes("人材派遣") ?? false) || c.features.some(f => f.includes("人材") || f.includes("派遣")) },
];

const ALL_FILTERS: FilterDef[] = [
  ...CONDITION_FILTERS,
  ...TRANSACTION_FILTERS,
  ...INDUSTRY_FILTERS,
];

const FILTER_GROUPS = [
  { group: "condition" as const, label: "条件別", filters: CONDITION_FILTERS },
  { group: "transaction" as const, label: "取引形態別", filters: TRANSACTION_FILTERS },
  { group: "industry" as const, label: "業種別", filters: INDUSTRY_FILTERS },
];

const PER_PAGE = 20;

interface Props {
  allCompanies: Company[];
  initialCategorySlug: string;
}

export function CategoryFilterClient({ allCompanies, initialCategorySlug }: Props) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // 初期カテゴリがフィルタ定義に存在すればON
    if (ALL_FILTERS.some(f => f.slug === initialCategorySlug)) {
      initial.add(initialCategorySlug);
    }
    return initial;
  });
  const [visibleCount, setVisibleCount] = useState(PER_PAGE);

  const toggleFilter = (slug: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
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
    if (activeFilters.size === 0) return allCompanies;
    return allCompanies.filter((c) =>
      [...activeFilters].every((slug) => {
        const def = ALL_FILTERS.find((f) => f.slug === slug);
        return def ? def.filter(c) : true;
      })
    );
  }, [allCompanies, activeFilters]);

  const visible = filtered.slice(0, visibleCount);

  return (
    <>
      {/* フィルターバッジ */}
      <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">絞り込み（複数選択で AND 検索）</p>
          {activeFilters.size > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              すべて解除
            </button>
          )}
        </div>
        {FILTER_GROUPS.map(({ group, label, filters }) => (
          <div key={group}>
            <p className="text-xs font-bold text-gray-500 mb-1.5">{label}</p>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((f) => {
                const isActive = activeFilters.has(f.slug);
                return (
                  <button
                    key={f.slug}
                    onClick={() => toggleFilter(f.slug)}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-700"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {activeFilters.size > 0 && (
          <p className="text-sm text-gray-500">
            該当: <span className="font-bold text-blue-700">{filtered.length}社</span>
            {activeFilters.size >= 2 && (
              <span className="text-xs text-gray-400 ml-2">
                （{[...activeFilters].map(s => ALL_FILTERS.find(f => f.slug === s)?.label).filter(Boolean).join(" × ")}）
              </span>
            )}
          </p>
        )}
      </div>

      {/* 会社リスト */}
      <div className="space-y-6">
        {visible.map((company, i) => (
          <CompanyCard
            key={company.slug}
            company={company}
            rank={i + 1}
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
    </>
  );
}
