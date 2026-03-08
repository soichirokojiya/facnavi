"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function formatYen(v: string | null | undefined): string {
  if (!v) return "-";
  const n = Number(v);
  return isNaN(n) ? v : `${n.toLocaleString()}円`;
}

interface MitsumoriRequest {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  invoice_amount: string | null;
  purchase_amount: string;
  deposit_timing: string;
  industry: string;
  business_type: string;
  created_at: string;
}

interface LeadAssignment {
  id: string;
  status: string;
  viewed_at: string | null;
  created_at: string;
  mitsumori_requests: MitsumoriRequest;
}

const statusLabels: Record<string, string> = {
  active: "有効",
  takedown_requested: "取下依頼中",
  removed: "取下確定",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  takedown_requested: "bg-amber-100 text-amber-800",
  removed: "bg-red-100 text-red-800",
};

export default function PartnerLeadsPage() {
  const [leads, setLeads] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchLeads() {
      try {
        const res = await fetch("/api/partner/leads");
        const json = await res.json();
        setLeads(json.data || []);
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const filtered =
    filter === "all" ? leads : leads.filter((l) => l.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">リード一覧</h1>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-6">
        リード送付から5営業日以内に取り下げ依頼がない場合、自動的に承認（課金確定）となります。
      </p>

      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "すべて" },
          { key: "active", label: "有効" },
          { key: "takedown_requested", label: "取下依頼中" },
          { key: "removed", label: "取下確定" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    会社名
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    担当者
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    請求書額面
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    買取希望金額
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    ステータス
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    申込日
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-gray-50 ${!lead.viewed_at ? "bg-blue-50/50" : ""}`}>
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
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          statusColors[lead.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(
                        lead.mitsumori_requests.created_at
                      ).toLocaleDateString("ja-JP")}
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
        </div>
      )}
    </div>
  );
}
