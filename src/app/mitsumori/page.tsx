import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { MitsumoriLP } from "./MitsumoriLP";

export const metadata: Metadata = {
  title: "ファクタリング一括見積もり｜最短30秒で複数社を無料比較",
  description:
    "厳選されたファクタリング会社に一括で見積もり依頼。手数料・スピードを簡単比較して最適な1社が見つかる。完全無料・個人事業主OK・全国対応。",
  alternates: { canonical: `${SITE_URL}/mitsumori` },
};

export default function MitsumoriPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "一括見積もり", url: `${SITE_URL}/mitsumori` },
        ]}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "ファクタリング一括見積もり",
          description:
            "厳選されたファクタリング会社に一括で見積もり依頼。手数料・スピードを簡単比較して最適な1社が見つかる。",
          url: `${SITE_URL}/mitsumori`,
          publisher: {
            "@type": "Organization",
            name: "ファクナビ",
            url: SITE_URL,
          },
        }}
      />
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[{ label: "一括見積もり" }]} />
      </div>
      <MitsumoriLP />
    </>
  );
}
