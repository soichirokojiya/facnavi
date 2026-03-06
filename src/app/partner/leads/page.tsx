"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface MitsumoriRequest {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  amount_range: string;
  prefecture: string;
  industry: string;
  business_type: string;
  created_at: string;
}

interface LeadAssignment {
  id: string;
  status: string;
  created_at: string;
  mitsumori_requests: MitsumoriRequest;
}

const statusLabels: Record<string, string> = {
  active: "有効",
  takedown_requested: "取り下げ依頼中",
  removed: "取り下げ済み",
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">リード一覧</h1>

      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "すべて" },
          { key: "active", label: "有効" },
          { key: "takedown_requested", label: "取り下げ依頼中" },
          { key: "removed", label: "取り下げ済み" },
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
                    金額帯
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    都道府県
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
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {lead.mitsumori_requests.company_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.mitsumori_requests.contact_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.mitsumori_requests.amount_range}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.mitsumori_requests.prefecture}
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
