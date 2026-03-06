"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/partner", label: "ダッシュボード", icon: "📊" },
  { href: "/partner/leads", label: "リード一覧", icon: "📋" },
  { href: "/partner/settings", label: "設定", icon: "⚙️" },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 公開ページではサイドバーを表示しない
  const publicPages = ["/partner/login", "/partner/register", "/partner/forgot-password", "/partner/reset-password"];
  if (publicPages.includes(pathname)) return null;

  const handleLogout = async () => {
    await fetch("/api/partner/auth", { method: "DELETE" });
    router.push("/partner/login");
  };

  const isActive = (href: string) => {
    if (href === "/partner") return pathname === "/partner";
    return pathname.startsWith(href);
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">ファクナビ 業者専用</h1>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              isActive(item.href)
                ? "bg-primary text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full transition-colors"
        >
          <span>🚪</span>
          <span>ログアウト</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        aria-label="メニュー"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        {sidebar}
      </div>
    </>
  );
}
