"use client";

import { usePathname } from "next/navigation";
import { PartnerSidebar } from "./PartnerSidebar";

const AUTH_PATHS = ["/partner/login", "/partner/register", "/partner/forgot-password", "/partner/reset-password", "/partner/verify"];

export function PartnerLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <PartnerSidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
