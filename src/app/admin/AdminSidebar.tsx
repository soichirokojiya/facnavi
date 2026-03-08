"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadInquiries, setUnreadInquiries] = useState(0);

  const isPublic = pathname === "/admin/login";

  useEffect(() => {
    if (isPublic) return;
    async function fetchUnread() {
      try {
        const res = await fetch("/api/admin/inquiries", { cache: "no-store" });
        const json = await res.json();
        const items = json.data || [];
        const count = items.filter((i: { status: string }) => i.status === "unread").length;
        setUnreadInquiries(count);
      } catch {
        // ignore
      }
    }
    fetchUnread();
  }, [pathname, isPublic]);

  if (isPublic) return null;

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: "/admin", label: "ダッシュボード", icon: "📊", badge: 0 },
    { href: "/admin/mitsumori", label: "見積もり管理", icon: "📋", badge: 0 },
    { href: "/admin/reviews", label: "口コミ管理", icon: "💬", badge: 0 },
    { href: "/admin/partners", label: "提携業者管理", icon: "🏢", badge: 0 },
    { href: "/admin/takedowns", label: "取下依頼", icon: "🚫", badge: 0 },
    { href: "/admin/inquiries", label: "問い合わせ管理", icon: "✉️", badge: unreadInquiries },
    { href: "/admin/news", label: "ニュース管理", icon: "📰", badge: 0 },
    { href: "/admin/settings", label: "サイト設定", icon: "⚙️", badge: 0 },
  ];

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">ファクナビ 管理画面</h1>
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
            <span className="flex-1">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                {item.badge}
              </span>
            )}
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
      {/* モバイルハンバーガー */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-lg shadow-lg"
        aria-label="メニュー"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* モバイルオーバーレイ */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* モバイルサイドバー */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </div>

      {/* デスクトップサイドバー */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 z-30">
        {sidebar}
      </div>
    </>
  );
}
