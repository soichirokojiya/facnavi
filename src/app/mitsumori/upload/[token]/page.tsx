import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { SITE_URL } from "@/lib/constants";
import { UploadForm } from "./UploadForm";

export const metadata: Metadata = {
  title: "書類アップロード｜ファクナビ一括見積もり",
  description: "ファクタリング一括見積もりの審査に必要な書類をアップロードしてください。",
  robots: { index: false },
};

type Props = {
  params: Promise<{ token: string }>;
};

export default async function UploadPage({ params }: Props) {
  const { token } = await params;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "一括見積もり", href: "/mitsumori" },
          { label: "書類アップロード" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-800 mt-6 mb-2">
        審査書類のアップロード
      </h1>
      <p className="text-gray-600 mb-8">
        スムーズな審査のため、以下の書類をアップロードしてください。
        <br />
        対応ファイル形式: JPG / PNG / PDF（各10MBまで）
      </p>

      <UploadForm token={token} />
    </div>
  );
}
