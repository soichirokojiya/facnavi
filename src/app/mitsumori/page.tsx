import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { MitsumoriLP } from "./MitsumoriLP";

export const metadata: Metadata = {
  title: "ファクタリング一括見積もり - 最適な業者を無料で比較",
  description:
    "たった30秒で複数のファクタリング会社に一括見積もり依頼。厳選された優良業者のみ掲載、完全無料で手数料を最安に抑えられます。",
  alternates: { canonical: `${SITE_URL}/mitsumori` },
  robots: { index: false, follow: false },
};

export default function MitsumoriPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "一括見積もり", url: `${SITE_URL}/mitsumori` },
        ]}
      />
      <Breadcrumb items={[{ label: "一括見積もり" }]} />
      <MitsumoriLP />
    </div>
  );
}
