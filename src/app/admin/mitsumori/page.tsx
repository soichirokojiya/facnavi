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
  created_at: string;
  company_name: string;
  contact_name: string;
  invoice_amount: string | null;
  purchase_amount: string;
  deposit_timing: string;
  business_type: string;
  industry: string;
}

export default function AdminMitsumoriPage() {
  const [requests, setRequests] = useState<MitsumoriRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/mitsumori")
      .then((res) => res.json())
      .then((data) => setRequests(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">見積もり管理</h1>

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">申し込みはまだありません。</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">申込日</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">会社名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">担当者</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">請求書額面</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">買取希望</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">入金希望</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">業種</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/mitsumori/${req.id}`}
                        className="text-primary hover:underline"
                      >
                        {formatDate(req.created_at)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <Link
                        href={`/admin/mitsumori/${req.id}`}
                        className="hover:text-primary"
                      >
                        {req.company_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">{req.contact_name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{formatYen(req.invoice_amount)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{formatYen(req.purchase_amount)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">{req.deposit_timing}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{req.industry}</td>
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}
