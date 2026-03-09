"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MitsumoriPopup } from "@/components/popups/MitsumoriPopup";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname.startsWith("/admin") || pathname.startsWith("/partner");

  if (hideChrome) {
    return <>{children}</>;
  }

  const hidePopup = pathname === "/mitsumori" || pathname.startsWith("/mitsumori/");

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      {!hidePopup && <MitsumoriPopup />}
    </>
  );
}
