import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "運営会社情報",
  description: `${SITE_NAME}の運営会社情報・サイト概要をご紹介します。`,
  alternates: { canonical: `${SITE_URL}/about` },
};

const companyInfo = [
  ["運営者", "Common Future & Co.株式会社", "https://www.cfac.co.jp/"],
  ["所在地", "神奈川県逗子市小坪6-6-46"],
  ["設立", "2015年"],
  ["事業内容", "ファクタリング関連の情報メディア運営"],
  ["メール", "info@cfac.co.jp"],
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "運営会社情報", url: `${SITE_URL}/about` },
        ]}
      />
      <Breadcrumb items={[{ label: "運営会社情報" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">運営会社情報</h1>

      <Card className="p-6 mb-10">
        <h2 className="text-lg font-bold mb-4">会社概要</h2>
        <dl className="divide-y divide-gray-100">
          {companyInfo.map(([label, value, url]) => (
            <div key={label} className="flex py-3 text-sm">
              <dt className="w-32 flex-shrink-0 font-medium text-gray-500">
                {label}
              </dt>
              <dd className="text-gray-900">
                {url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Card>

      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">
          {SITE_NAME}について
        </h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            {SITE_NAME}は、ファクタリングの利用を検討されている事業者様に向けて、
            業者の比較情報・口コミ・お役立ちコンテンツを提供する情報メディアです。
          </p>
          <p>
            「どのファクタリング会社を選べばいいかわからない」という方が、
            手数料・入金スピード・口コミ評価などを比較し、最適な業者を見つけられることを目指しています。
          </p>
          <p>
            掲載情報は定期的に見直し・更新を行っておりますが、
            最新の情報は各ファクタリング会社の公式サイトにてご確認ください。
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-bold mb-4">広告掲載について</h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            当サイトはアフィリエイトプログラムに参加しており、
            掲載リンクを経由して各サービスへお申し込みいただいた場合、
            当サイトに報酬が支払われることがあります。
          </p>
          <p>
            ただし、ランキングや口コミの評価は広告の有無に関わらず、
            独自の基準に基づいて作成しております。
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">免責事項</h2>
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            当サイトに掲載されている情報は、可能な限り正確な情報を提供するよう努めておりますが、
            その内容の正確性や安全性を保証するものではありません。
          </p>
          <p>
            当サイトの情報を利用したことにより生じたいかなる損害についても、
            当サイト運営者は一切の責任を負いかねます。
            ファクタリングのご利用にあたっては、各社の公式情報をご確認の上、ご自身の判断でお申し込みください。
          </p>
        </div>
      </section>
    </div>
  );
}
