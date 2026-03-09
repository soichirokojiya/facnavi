"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [reviewsPending, setReviewsPending] = useState(0);
  const [takedownsPending, setTakedownsPending] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/reviews").then((r) => r.json()),
      fetch("/api/admin/takedowns").then((r) => r.json()),
    ]).then(([reviewsData, takedownsData]) => {
      setReviewsPending(
        (reviewsData.data || []).filter((r: { status: string }) => r.status === "pending").length
      );
      setTakedownsPending(
        (takedownsData.data || []).filter((t: { status: string }) => t.status === "pending").length
      );
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      {/* 対応が必要な項目 */}
      {!loading && (
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/reviews?status=pending"
              className={`flex items-center justify-between rounded-xl border p-5 hover:shadow-md transition-shadow ${
                reviewsPending > 0
                  ? "bg-amber-50 border-amber-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${reviewsPending > 0 ? "text-amber-800" : "text-gray-700"}`}>口コミ承認待ち</p>
                <p className={`text-xs mt-0.5 ${reviewsPending > 0 ? "text-amber-600" : "text-gray-400"}`}>
                  {reviewsPending > 0 ? "承認・不承認の対応が必要です" : "対応不要"}
                </p>
              </div>
              <span className={`text-3xl font-black ${reviewsPending > 0 ? "text-amber-600" : "text-gray-300"}`}>{reviewsPending}</span>
            </Link>
            <Link
              href="/admin/takedowns"
              className={`flex items-center justify-between rounded-xl border p-5 hover:shadow-md transition-shadow ${
                takedownsPending > 0
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <p className={`text-sm font-bold ${takedownsPending > 0 ? "text-red-800" : "text-gray-700"}`}>取下依頼（審査中）</p>
                <p className={`text-xs mt-0.5 ${takedownsPending > 0 ? "text-red-600" : "text-gray-400"}`}>
                  {takedownsPending > 0 ? "承認・却下の対応が必要です" : "対応不要"}
                </p>
              </div>
              <span className={`text-3xl font-black ${takedownsPending > 0 ? "text-red-600" : "text-gray-300"}`}>{takedownsPending}</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
