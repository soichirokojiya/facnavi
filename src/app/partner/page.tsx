"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LeadAssignment {
  id: string;
  status: string;
  created_at: string;
  mitsumori_requests: {
    company_name: string;
  };
}

interface MonthlyStats {
  month: string;
  total: number;
  removed: number;
  takedownRequested: number;
  billable: number;
  confirmed: boolean;
}

function formatYen(amount: number): string {
  return amount.toLocaleString() + "円";
}

export default function PartnerDashboardPage() {
  const [leads, setLeads] = useState<LeadAssignment[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [feePerLead, setFeePerLead] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [leadsRes, statsRes] = await Promise.all([
          fetch("/api/partner/leads"),
          fetch("/api/partner/leads/stats"),
        ]);
        const leadsJson = await leadsRes.json();
        const statsJson = await statsRes.json();
        setLeads(leadsJson.data || []);
        setMonthlyStats(statsJson.data || []);
        setFeePerLead(statsJson.feePerLead || 0);
        setTaxRate(statsJson.taxRate ?? 10);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeCount = leads.filter((l) => l.status === "active").length;
  const takedownRequestedCount = leads.filter(
    (l) => l.status === "takedown_requested"
  ).length;
  const removedCount = leads.filter((l) => l.status === "removed").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="全リード数"
          value={leads.length}
          color="blue"
          href="/partner/leads"
        />
        <StatCard
          label="有効リード"
          value={activeCount}
          color="green"
          href="/partner/leads"
        />
        <StatCard
          label="取下依頼中"
          value={takedownRequestedCount}
          color="amber"
          href="/partner/leads"
        />
        <StatCard
          label="取下確定"
          value={removedCount}
          color="red"
          href="/partner/leads"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          月別リード集計
        </h2>
        {monthlyStats.length === 0 ? (
          <p className="text-sm text-gray-500">データがありません</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-2 pr-4 font-semibold text-gray-700">月</th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    総リード数
                  </th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    取下確定
                  </th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    取下依頼中
                  </th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    フィー対象
                  </th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    単価
                  </th>
                  <th className="pb-2 pr-4 font-semibold text-gray-700 text-right">
                    総額（税込）
                  </th>
                  <th className="pb-2 font-semibold text-gray-700 text-center">
                    状態
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyStats.map((row) => (
                  <tr
                    key={row.month}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => window.location.href = `/partner/billing?month=${row.month}`}
                  >
                    <td className="py-2 pr-4 text-primary font-medium underline">
                      {row.month}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-700">
                      {row.total}
                    </td>
                    <td className="py-2 pr-4 text-right text-red-600">
                      {row.removed}
                    </td>
                    <td className="py-2 pr-4 text-right text-amber-600">
                      {row.takedownRequested}
                    </td>
                    <td className="py-2 pr-4 text-right font-bold text-blue-700">
                      {row.billable}
                    </td>
                    <td className="py-2 pr-4 text-right text-gray-700">
                      {formatYen(feePerLead)}
                    </td>
                    <td className="py-2 pr-4 text-right font-bold text-gray-900">
                      {formatYen(Math.floor(row.billable * feePerLead * (100 + taxRate) / 100))}
                    </td>
                    <td className="py-2 text-center">
                      {row.confirmed ? (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          確定
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                          未確定
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/partner/leads"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            📋 リード一覧
          </h2>
          <p className="text-sm text-gray-600">
            割り当てられたリードの閲覧、取下依頼の送信
          </p>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
  href,
}: {
  label: string;
  value: number;
  color: "blue" | "amber" | "green" | "red";
  href: string;
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <Link
      href={href}
      className={`rounded-xl border p-4 hover:shadow-md transition-shadow ${colorMap[color]}`}
    >
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </Link>
  );
}
