import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllCompanies, displayName } from "@/lib/companies";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { ReviewForm } from "./ReviewForm";

export const metadata: Metadata = {
  title: "口コミを投稿する",
  description:
    "ファクタリング会社の口コミ・評判を投稿できます。あなたの体験が他の利用者の参考になります。",
  alternates: { canonical: `${SITE_URL}/kuchikomi/post` },
};

export default function ReviewPostPage() {
  const companies = getAllCompanies().map((c) => ({
    slug: c.slug,
    name: displayName(c),
  }));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "口コミ", url: `${SITE_URL}/kuchikomi` },
          { name: "口コミを投稿", url: `${SITE_URL}/kuchikomi/post` },
        ]}
      />
      <Breadcrumb
        items={[
          { label: "口コミ", href: "/kuchikomi" },
          { label: "口コミを投稿" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        口コミを投稿する
      </h1>
      <p className="text-gray-600 mb-8">
        ファクタリング会社を利用した感想を教えてください。あなたの口コミが他の利用者の参考になります。
      </p>

      <Suspense fallback={null}>
        <ReviewForm companies={companies} />
      </Suspense>
    </div>
  );
}
