"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isLeadConfirmed } from "@/lib/business-days";

interface LeadItem {
  id: string;
  status: string;
  created_at: string;
  mitsumori_requests: {
    company_name: string;
    contact_name: string;
    invoice_amount: string | null;
    purchase_amount: string;
    industry: string;
    business_type: string;
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

export default function BillingDetailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><p className="text-gray-500">読み込み中...</p></div>}>
      <BillingDetailContent />
    </Suspense>
  );
}

function BillingDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const month = searchParams.get("month");

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [feePerLead, setFeePerLead] = useState(0);
  const [taxRate, setTaxRate] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!month) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/partner/billing?month=${month}`);
        const json = await res.json();
        setLeads(json.data || []);
        setFeePerLead(json.feePerLead || 0);
        setTaxRate(json.taxRate ?? 10);
      } catch (err) {
        console.error("Failed to fetch billing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [month]);

  if (!month) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">月が指定されていません。</p>
        <Link href="/partner" className="text-primary hover:underline">
          ダッシュボードに戻る
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const confirmedCount = leads.filter((l) => l.status === "active" && isLeadConfirmed(l.created_at)).length;
  const unconfirmedCount = leads.filter((l) => l.status === "active" && !isLeadConfirmed(l.created_at)).length;
  const takedownCount = leads.filter((l) => l.status === "takedown_requested").length;
  const removedCount = leads.filter((l) => l.status === "removed").length;
  const subtotal = confirmedCount * feePerLead;
  const taxAmount = Math.floor(subtotal * taxRate / 100);
  const totalAmount = subtotal + taxAmount;

  return (
    <div>
      <div className="mb-4">
        <Link href="/partner" className="text-sm text-primary hover:underline">
          ← ダッシュボードに戻る
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">集計明細</h1>
        <select
          value={month}
          onChange={(e) => router.push(`/partner/billing?month=${e.target.value}`)}
          className="px-4 py-2 border-2 border-primary/30 bg-primary/5 rounded-lg text-sm font-bold text-primary focus:ring-3 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer"
        >
          {getMonthOptions().map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* サマリー */}
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

      {/* 請求サマリー */}
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

      {/* リード明細 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">リード明細</h2>
        </div>
        {leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            この月のリードはありません。
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">No.</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">送付日</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">会社名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">担当者</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">買取希望金額</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">業種</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead, i) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(lead.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.mitsumori_requests.company_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.mitsumori_requests.contact_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatYen(lead.mitsumori_requests.purchase_amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.mitsumori_requests.industry}
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
        )}
      </div>
    </div>
  );
}
