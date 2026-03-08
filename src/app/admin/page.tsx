"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Stats {
  mitsumoriCount: number;
  reviewsPending: number;
  reviewsApproved: number;
  reviewsRejected: number;
  takedownsPending: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [mitsumoriRes, reviewsRes, takedownsRes] = await Promise.all([
          fetch("/api/admin/mitsumori"),
          fetch("/api/admin/reviews"),
          fetch("/api/admin/takedowns"),
        ]);

        const mitsumoriData = await mitsumoriRes.json();
        const reviewsData = await reviewsRes.json();
        const takedownsData = await takedownsRes.json();

        const reviews = reviewsData.data || [];
        const takedowns = takedownsData.data || [];
        setStats({
          mitsumoriCount: mitsumoriData.data?.length || 0,
          reviewsPending: reviews.filter((r: { status: string }) => r.status === "pending").length,
          reviewsApproved: reviews.filter((r: { status: string }) => r.status === "approved").length,
          reviewsRejected: reviews.filter((r: { status: string }) => r.status === "rejected").length,
          takedownsPending: takedowns.filter((t: { status: string }) => t.status === "pending").length,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="見積もり申し込み"
          value={stats?.mitsumoriCount ?? 0}
          color="blue"
          href="/admin/mitsumori"
        />
        <StatCard
          label="口コミ（承認待ち）"
          value={stats?.reviewsPending ?? 0}
          color="amber"
          href="/admin/reviews?status=pending"
        />
        <StatCard
          label="口コミ（承認済み）"
          value={stats?.reviewsApproved ?? 0}
          color="green"
          href="/admin/reviews?status=approved"
        />
        <StatCard
          label="口コミ（不承認）"
          value={stats?.reviewsRejected ?? 0}
          color="red"
          href="/admin/reviews?status=rejected"
        />
        <StatCard
          label="取下依頼（審査中）"
          value={stats?.takedownsPending ?? 0}
          color="amber"
          href="/admin/takedowns"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/mitsumori"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">📋 見積もり管理</h2>
          <p className="text-sm text-gray-600">
            一括見積もりの申し込み一覧の閲覧、書類のダウンロード
          </p>
        </Link>
        <Link
          href="/admin/reviews"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">💬 口コミ管理</h2>
          <p className="text-sm text-gray-600">
            口コミの承認・不承認、ステータスフィルター
          </p>
        </Link>
        <Link
          href="/admin/partners"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">🏢 提携業者管理</h2>
          <p className="text-sm text-gray-600">
            提携ファクタリング業者の登録・管理
          </p>
        </Link>
        <Link
          href="/admin/takedowns"
          className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-2">🚫 取下依頼</h2>
          <p className="text-sm text-gray-600">
            業者からの取下依頼の確認・承認・却下
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
