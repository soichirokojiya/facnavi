"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLeadConfirmed } from "@/lib/business-days";

interface LeadItem {
  id: string;
  status: string;
  viewed_at: string | null;
  created_at: string;
  mitsumori_requests: {
    company_name: string;
    contact_name: string;
    invoice_amount: string | null;
    purchase_amount: string;
    industry: string;
    business_type: string;
    created_at: string;
  };
}

const statusLabels: Record<string, string> = {
  active: "確定",
  active_unconfirmed: "未確定",
  takedown_requested: "取下依頼中",
  removed: "取下確定",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  active_unconfirmed: "bg-sky-100 text-sky-800",
  takedown_requested: "bg-amber-100 text-amber-800",
  removed: "bg-red-100 text-red-800",
};

function formatYen(v: string | number | null | undefined): string {
  if (v == null) return "-";
  const n = typeof v === "number" ? v : Number(v);
  return isNaN(n) ? String(v) : `${n.toLocaleString()}円`;
}

function getMonthOptions(): { value: string; label: string }[] {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    options.push({ value, label });
  }
  return options;
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

const ITEMS_PER_PAGE = 20;

export default function PartnerDashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [feePerLead, setFeePerLead] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const res = await fetch(`/api/partner/billing?month=${selectedMonth}`);
        const json = await res.json();
        setLeads(json.data || []);
        setFeePerLead(json.feePerLead || 0);
        setTaxRate(json.taxRate ?? 10);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedMonth]);

  // Reset filter and page when month changes
  useEffect(() => {
    setFilter("all");
    setCurrentPage(1);
  }, [selectedMonth]);

  // Summary counts
  const confirmedCount = leads.filter((l) => l.status === "active" && isLeadConfirmed(l.created_at)).length;
  const unconfirmedCount = leads.filter((l) => l.status === "active" && !isLeadConfirmed(l.created_at)).length;
  const takedownCount = leads.filter((l) => l.status === "takedown_requested").length;
  const removedCount = leads.filter((l) => l.status === "removed").length;
  const subtotal = confirmedCount * feePerLead;
  const taxAmount = Math.floor(subtotal * taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  // Filtered leads
  const filtered =
    filter === "all"
      ? leads
      : filter === "active"
        ? leads.filter((l) => l.status === "active" && isLeadConfirmed(l.created_at))
        : filter === "active_unconfirmed"
          ? leads.filter((l) => l.status === "active" && !isLeadConfirmed(l.created_at))
          : leads.filter((l) => l.status === filter);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLeads = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      {/* Header with month selector */}
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border-2 border-primary/30 bg-primary/5 rounded-lg text-sm font-bold text-primary focus:ring-3 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
        >
          {getMonthOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm text-gray-600 font-medium">総リード数</p>
              <p className="text-2xl font-bold text-gray-700">{leads.length}</p>
            </div>
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <p className="text-sm text-sky-600 font-medium">未確定</p>
              <p className="text-2xl font-bold text-sky-700">{unconfirmedCount}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-600 font-medium">確定</p>
              <p className="text-2xl font-bold text-green-700">{confirmedCount}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-600 font-medium">取下依頼中</p>
              <p className="text-2xl font-bold text-amber-700">{takedownCount}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 font-medium">取下確定</p>
              <p className="text-2xl font-bold text-red-700">{removedCount}</p>
            </div>
          </div>

          {/* Invoice summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">請求概要</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">確定リード数</span>
                <span className="font-medium">{confirmedCount}件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">単価（税抜）</span>
                <span className="font-medium">{formatYen(feePerLead)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-600">小計（税抜）</span>
                <span className="font-medium">{formatYen(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">消費税（{taxRate}%）</span>
                <span className="font-medium">{formatYen(taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-900 font-bold">合計（税込）</span>
                <span className="text-lg font-bold text-primary">{formatYen(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Lead list section */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">リード一覧</h2>
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
              リード送付から5営業日以内に取り下げ依頼がない場合、自動的に承認（課金確定）となります。
            </p>

            {/* Status filter buttons */}
            <div className="flex gap-2 mb-4">
              {[
                { key: "all", label: "すべて" },
                { key: "active_unconfirmed", label: "未確定" },
                { key: "active", label: "確定" },
                { key: "takedown_requested", label: "取下依頼中" },
                { key: "removed", label: "取下確定" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => { setFilter(f.key); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.key
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              リードがありません。
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">申込日</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">会社名</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">担当者</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">請求書額面</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">買取希望金額</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLeads.map((lead) => (
                      <tr key={lead.id} className={`hover:bg-gray-50 ${!lead.viewed_at ? "bg-blue-50/50" : ""}`}>
                        <td className="px-4 py-3 text-gray-600">
                          {new Date(lead.mitsumori_requests.created_at).toLocaleDateString("ja-JP")}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <span className="flex items-center gap-2">
                            {!lead.viewed_at && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                            {lead.mitsumori_requests.company_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {lead.mitsumori_requests.contact_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatYen(lead.mitsumori_requests.invoice_amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {formatYen(lead.mitsumori_requests.purchase_amount)}
                        </td>
                        <td className="px-4 py-3">
                          {(() => {
                            const displayStatus = lead.status === "active"
                              ? (isLeadConfirmed(lead.created_at) ? "active" : "active_unconfirmed")
                              : lead.status;
                            return (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                                  statusColors[displayStatus] || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {statusLabels[displayStatus] || lead.status}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/partner/leads/${lead.id}`}
                            className="text-primary hover:underline text-sm"
                          >
                            詳細
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    全{filtered.length}件中 {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}〜{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)}件
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safeCurrentPage === 1}
                      className="px-3 py-1.5 rounded text-sm border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      前へ
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - safeCurrentPage) <= 2)
                      .reduce<(number | string)[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                        acc.push(p);
                        return acc;
                      }, [])
                      .map((p, idx) =>
                        typeof p === "string" ? (
                          <span key={`dot-${idx}`} className="px-1 text-gray-400">…</span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`px-3 py-1.5 rounded text-sm border ${
                              safeCurrentPage === p
                                ? "bg-primary text-white border-primary"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {p}
                          </button>
                        )
                      )}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage === totalPages}
                      className="px-3 py-1.5 rounded text-sm border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
