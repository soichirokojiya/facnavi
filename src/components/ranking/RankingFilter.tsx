"use client";

import { Company } from "@/types/company";
import { ComparisonTable } from "./ComparisonTable";
import { CompanyCard } from "./CompanyCard";

interface RankingFilterProps {
  companies: Company[];
}

export function RankingFilter({ companies }: RankingFilterProps) {
  return (
    <>
      <section className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          比較表で一覧チェック
        </h2>
        <ComparisonTable companies={companies.slice(0, 10)} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-6">各社の詳細</h2>
        <div className="space-y-6">
          {companies.slice(0, 10).map((company, index) => (
            <CompanyCard
              key={company.slug}
              company={company}
              rank={index + 1}
            />
          ))}
        </div>
      </section>
    </>
  );
}
