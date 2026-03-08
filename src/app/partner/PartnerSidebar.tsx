"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function PartnerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadReplies, setUnreadReplies] = useState(0);

  const publicPages = ["/partner/login", "/partner/register", "/partner/forgot-password", "/partner/reset-password"];
  const isPublic = publicPages.includes(pathname);

  useEffect(() => {
    if (isPublic) return;
    async function fetchUnread() {
      try {
        const [leadsRes, inquiriesRes] = await Promise.all([
          fetch("/api/partner/leads", { cache: "no-store" }),
          fetch("/api/partner/inquiries", { cache: "no-store" }),
        ]);
        const leadsJson = await leadsRes.json();
        const leads = leadsJson.data || [];
        setUnreadCount(leads.filter((l: { viewed_at: string | null; status: string }) => !l.viewed_at && l.status === "active").length);

        const inqJson = await inquiriesRes.json();
        const inquiries = inqJson.data || [];
        setUnreadReplies(inquiries.filter((i: { status: string }) => i.status === "replied").length);
      } catch {
        // ignore
      }
    }
    fetchUnread();
  }, [pathname, isPublic]);

  if (isPublic) return null;

  const handleLogout = async () => {
    await fetch("/api/partner/auth", { method: "DELETE" });
    router.push("/partner/login");
  };

  const isActive = (href: string) => {
    if (href === "/partner") return pathname === "/partner";
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: "/partner", label: "ダッシュボード", icon: "📊", badge: 0 },
    { href: "/partner/leads", label: "リード一覧", icon: "📋", badge: unreadCount },
    { href: "/partner/inquiries", label: "お問い合わせ", icon: "✉️", badge: unreadReplies },
    { href: "/partner/settings", label: "設定", icon: "⚙️", badge: 0 },
  ];

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">ファクタリング業者様専用</h1>
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
