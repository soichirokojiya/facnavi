import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "利用規約 - サイトご利用にあたって",
  description: `${SITE_NAME}の利用規約です。サービス内容・免責事項・広告掲載について定めています。ご利用前に必ずお読みください。`,
  alternates: { canonical: `${SITE_URL}/terms` },
  openGraph: {
    title: `利用規約 - サイトご利用にあたって | ${SITE_NAME}`,
    description: `${SITE_NAME}の利用規約です。サービス内容・免責事項・広告掲載について定めています。ご利用前に必ずお読みください。`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "利用規約", url: `${SITE_URL}/terms` },
        ]}
      />
      <Breadcrumb items={[{ label: "利用規約" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第1条（適用）</h2>
          <p>
            本規約は、{SITE_NAME}（以下「当サイト」）が提供するサービスの利用に関する条件を定めるものです。
            当サイトを利用された時点で、本規約に同意いただいたものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第2条（サービス内容）</h2>
          <p>
            当サイトは、ファクタリング会社の比較情報・口コミ・ランキング・コラム記事等の
            情報提供サービスを運営しています。当サイトはファクタリングサービスそのものを
            提供するものではなく、各ファクタリング会社との契約は利用者と各社との間で行われます。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第3条（掲載情報について）</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              当サイトに掲載されている情報は、可能な限り正確な情報を提供するよう努めておりますが、
              その正確性・完全性・最新性を保証するものではありません。
            </li>
            <li>
              各ファクタリング会社の手数料・サービス内容等は変更される場合があります。
              最新情報は各社の公式サイトでご確認ください。
            </li>
            <li>
              口コミ・評価は利用者個人の感想であり、サービスの効果を保証するものではありません。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第4条（免責事項）</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              当サイトの情報を利用して行った行為により生じたいかなる損害についても、
              当サイト運営者は一切の責任を負いません。
            </li>
            <li>
              当サイトからリンクしている外部サイトの内容については、
              当サイト運営者は責任を負いません。
            </li>
            <li>
              当サイトのサービスの中断・停止・変更等により生じた損害について、
              当サイト運営者は責任を負いません。
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第5条（広告・アフィリエイトについて）</h2>
          <p>
            当サイトはアフィリエイトプログラムに参加しており、
            掲載リンクを経由してサービスにお申し込みいただいた場合、
            当サイトに報酬が支払われることがあります。
            ただし、ランキングや口コミの評価は広告の有無に関わらず、
            独自の基準に基づいて作成しております。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第6条（禁止事項）</h2>
          <p>当サイトの利用にあたり、以下の行為を禁止します。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>当サイトのコンテンツを無断で複製・転載する行為</li>
            <li>当サイトの運営を妨害する行為</li>
            <li>虚偽の口コミ・レビューを投稿する行為</li>
            <li>他の利用者や第三者の権利を侵害する行為</li>
            <li>その他、当サイト運営者が不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第7条（著作権）</h2>
          <p>
            当サイトに掲載されている文章・画像・デザイン等のコンテンツの著作権は、
            当サイト運営者に帰属します。無断での複製・転載・改変は禁止します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第8条（規約の変更）</h2>
          <p>
            当サイト運営者は、必要に応じて本規約を変更することがあります。
            変更後の規約は、当ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <p className="text-gray-500 text-xs pt-4">制定日：2025年1月1日</p>
      </div>
    </div>
  );
}
