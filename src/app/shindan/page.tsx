import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { DiagnosisClient } from "./DiagnosisClient";

export const metadata: Metadata = {
  title: "ファクタリング診断ツール - あなたに最適な業者を見つけよう",
  description:
    "簡単な質問に答えるだけで、あなたに最適なファクタリング業者が見つかる無料診断ツール。",
  alternates: { canonical: `${SITE_URL}/shindan` },
  openGraph: {
    title: "ファクタリング診断ツール - あなたに最適な業者を見つけよう",
    description:
      "簡単な質問に答えるだけで、あなたに最適なファクタリング業者が見つかる無料診断ツール。",
  },
};

export default function ShindanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "診断ツール", url: `${SITE_URL}/shindan` },
        ]}
      />
      <Breadcrumb items={[{ label: "診断ツール" }]} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ファクタリング診断ツール
        </h1>
        <p className="text-gray-600">
          5つの質問に答えるだけで、あなたに最適な業者が見つかります
        </p>
      </div>

      <DiagnosisClient />
    </div>
  );
}
