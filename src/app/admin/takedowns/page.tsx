"use client";

import { useEffect, useState } from "react";

interface TakedownRequest {
  id: string;
  reason: string;
  detail: string | null;
  status: string;
  created_at: string;
  partner_companies: {
    id: string;
    name: string;
  };
  lead_assignments: {
    id: string;
    status: string;
    mitsumori_requests: {
      id: string;
      company_name: string;
      contact_name: string;
      invoice_amount: string | null;
      purchase_amount: string;
      prefecture: string;
    };
  };
}

const statusLabels: Record<string, string> = {
  pending: "審査中",
  approved: "承認済み",
  rejected: "却下",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function AdminTakedownsPage() {
  const [requests, setRequests] = useState<TakedownRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/takedowns");
      const json = await res.json();
      setRequests(json.data || []);
    } catch (err) {
      console.error("Failed to fetch takedowns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessing(id);
    try {
      const res = await fetch("/api/admin/takedowns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchRequests();
      }
    } catch (err) {
      console.error("Failed to update takedown:", err);
    } finally {
      setProcessing(null);
    }
  };

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">取り下げ依頼</h1>

      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "すべて" },
          { key: "pending", label: "審査中" },
          { key: "approved", label: "承認済み" },
          { key: "rejected", label: "却下" },
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
          取り下げ依頼がありません。
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">
                      {req.lead_assignments?.mitsumori_requests?.company_name || "不明"}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        statusColors[req.status] || ""
                      }`}
                    >
                      {statusLabels[req.status] || req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    依頼元: {req.partner_companies?.name || "不明"}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(req.created_at).toLocaleString("ja-JP")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
                <div>
                  <span className="text-gray-500">担当者: </span>
                  {req.lead_assignments?.mitsumori_requests?.contact_name || "-"}
                </div>
                <div>
                  <span className="text-gray-500">買取希望金額: </span>
                  {req.lead_assignments?.mitsumori_requests?.purchase_amount || "-"}
                </div>
                <div>
                  <span className="text-gray-500">都道府県: </span>
                  {req.lead_assignments?.mitsumori_requests?.prefecture || "-"}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm">
                  <span className="font-medium">理由:</span> {req.reason}
                </p>
                {req.detail && (
                  <p className="text-sm text-gray-600 mt-1">{req.detail}</p>
                )}
              </div>

              {req.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(req.id, "approved")}
                    disabled={processing === req.id}
                    className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    承認
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected")}
                    disabled={processing === req.id}
                    className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    却下
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
