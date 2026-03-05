import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { MitsumoriClient } from "./MitsumoriClient";

export const metadata: Metadata = {
  title: "一括見積もり - 複数のファクタリング会社にまとめて問い合わせ",
  description:
    "フォームに情報を入力するだけで、条件に合うファクタリング会社にまとめて見積もり依頼ができます。",
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

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ファクタリング一括見積もり
        </h1>
        <p className="text-gray-600">
          簡単3ステップで複数のファクタリング会社にまとめて問い合わせ
        </p>
      </div>

      <MitsumoriClient />
    </div>
  );
}
