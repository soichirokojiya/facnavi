"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Review {
  id: string;
  created_at: string;
  company_slug: string;
  author_name: string;
  rating: number;
  title: string;
  status: string;
}

const STATUS_OPTIONS = [
  { value: "", label: "全件" },
  { value: "pending", label: "承認待ち" },
  { value: "approved", label: "承認済み" },
  { value: "rejected", label: "不承認" },
];

export default function AdminReviewsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      }
    >
      <AdminReviewsContent />
    </Suspense>
  );
}

function AdminReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const statusFilter = searchParams.get("status") || "";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchReviews = () => {
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : "";
    fetch(`/api/admin/reviews${query}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleStatusChange = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error("Failed to update:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleFilterChange = (status: string) => {
    router.push(`/admin/reviews${status ? `?status=${status}` : ""}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">口コミ管理</h1>

      {/* ステータスフィルター */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleFilterChange(opt.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-primary text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">該当する口コミはありません。</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">投稿日</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">会社</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">投稿者</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">評価</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">タイトル</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr
                    key={review.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">{formatDate(review.created_at)}</td>
                    <td className="px-4 py-3 font-medium">{review.company_slug}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{review.author_name}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell max-w-48 truncate">
                      {review.title}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={review.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {review.status !== "approved" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "approved")}
                            disabled={updating === review.id}
                            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
                          >
                            承認
                          </button>
                        )}
                        {review.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusChange(review.id, "rejected")}
                            disabled={updating === review.id}
                            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                          >
                            不承認
                          </button>
                        )}
                      </div>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    pending: "承認待ち",
    approved: "承認済み",
    rejected: "不承認",
  };

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {labels[status] || status}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}
