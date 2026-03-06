import type { Metadata } from "next";
import { PartnerLayoutShell } from "./PartnerLayoutShell";

export const metadata: Metadata = {
  title: "業者専用ページ | ファクナビ",
  robots: { index: false, follow: false },
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PartnerLayoutShell>{children}</PartnerLayoutShell>;
}
