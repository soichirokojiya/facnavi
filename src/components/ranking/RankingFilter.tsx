"use client";

import { useState, useMemo } from "react";
import { Company } from "@/types/company";
import { ComparisonTable } from "./ComparisonTable";
import { CompanyCard } from "./CompanyCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface RankingFilterProps {
  companies: Company[];
}

export function RankingFilter({ companies }: RankingFilterProps) {
  const [feeMin, setFeeMin] = useState<string>("");
  const [feeMax, setFeeMax] = useState<string>("");

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (feeMin && c.feeRange.min < Number(feeMin)) return false;
      if (feeMax && c.feeRange.max > Number(feeMax)) return false;
      return true;
    });
  }, [companies, feeMin, feeMax]);

  const hasFilter = feeMin || feeMax;

  return (
    <>
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div className="text-sm font-bold text-gray-700">手数料で絞り込み</div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">下限</label>
            <select
              value={feeMin}
              onChange={(e) => setFeeMin(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">指定なし</option>
              <option value="1">1%以上</option>
              <option value="2">2%以上</option>
              <option value="3">3%以上</option>
              <option value="5">5%以上</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">上限</label>
            <select
              value={feeMax}
              onChange={(e) => setFeeMax(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            >
              <option value="">指定なし</option>
              <option value="5">5%以下</option>
              <option value="10">10%以下</option>
              <option value="15">15%以下</option>
              <option value="20">20%以下</option>
            </select>
          </div>
          {hasFilter && (
            <Button
              variant="outline"
              onClick={() => {
                setFeeMin("");
                setFeeMax("");
              }}
            >
              リセット
            </Button>
          )}
          {hasFilter && (
            <span className="text-sm text-gray-500">
              {filtered.length}件 / {companies.length}件
            </span>
          )}
        </div>
      </Card>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          比較表で一覧チェック
        </h2>
        <ComparisonTable companies={filtered.slice(0, 10)} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">各社の詳細</h2>
        <div className="space-y-6">
          {filtered.slice(0, 10).map((company) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={company.rankPosition}
            />
          ))}
        </div>
      </section>
    </>
  );
}
