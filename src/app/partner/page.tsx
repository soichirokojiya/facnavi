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

export default function PartnerDashboardPage() {
  const [leads, setLeads] = useState<LeadAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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
          label="取り下げ依頼中"
          value={takedownRequestedCount}
          color="amber"
          href="/partner/leads"
        />
        <StatCard
          label="取り下げ済み"
          value={removedCount}
          color="red"
          href="/partner/leads"
        />
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
            割り当てられたリードの閲覧、取り下げ依頼の送信
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
