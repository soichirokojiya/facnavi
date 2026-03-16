import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "プライバシーポリシー - 個人情報保護方針",
  description: `${SITE_NAME}のプライバシーポリシー（個人情報保護方針）です。個人情報の取り扱い・Cookie・アクセス解析について説明しています。`,
  alternates: { canonical: `${SITE_URL}/privacy` },
  openGraph: {
    title: `プライバシーポリシー - 個人情報保護方針 | ${SITE_NAME}`,
    description: `${SITE_NAME}のプライバシーポリシー（個人情報保護方針）です。個人情報の取り扱い・Cookie・アクセス解析について説明しています。`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "プライバシーポリシー", url: `${SITE_URL}/privacy` },
        ]}
      />
      <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. 個人情報の収集について</h2>
          <p>
            {SITE_NAME}（以下「当サイト」）では、お問い合わせフォームや診断ツールの利用時に、
            氏名・メールアドレス等の個人情報を収集する場合があります。
            個人情報の収集は、利用目的を明示した上で、必要最小限の範囲で行います。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. 個人情報の利用目的</h2>
          <p>収集した個人情報は、以下の目的で利用します。</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>お問い合わせへの回答・対応</li>
            <li>サービスの改善・向上</li>
            <li>統計データの作成（個人を特定できない形式）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. 個人情報の第三者提供</h2>
          <p>
            当サイトでは、以下の場合を除き、取得した個人情報を第三者に提供することはありません。
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>ご本人の同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>人の生命・身体・財産の保護に必要な場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Cookie（クッキー）について</h2>
          <p>
            当サイトでは、利便性の向上やアクセス解析のためにCookieを使用しています。
            Cookieにより個人を特定できる情報は収集しておりません。
            ブラウザの設定により、Cookieの受け入れを拒否することも可能ですが、
            一部のサービスが正常に動作しない場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. アクセス解析ツールについて</h2>
          <p>
            当サイトでは、Googleアナリティクスを利用してアクセス情報を収集しています。
            Googleアナリティクスはトラフィックデータの収集のためにCookieを使用していますが、
            このデータは匿名で収集されており、個人を特定するものではありません。
            詳細はGoogleのプライバシーポリシーをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. 広告について</h2>
          <p>
            当サイトは、第三者配信の広告サービスやアフィリエイトプログラムを利用しています。
            これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するために
            Cookieを使用する場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じてプライバシーポリシーを変更することがあります。
            変更後のプライバシーポリシーは、当ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. お問い合わせ</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは、
            <a href="/contact" className="text-primary hover:underline">お問い合わせフォーム</a>
            よりご連絡ください。
          </p>
        </section>

        <p className="text-gray-500 text-xs pt-4">制定日：2025年1月1日</p>
      </div>
    </div>
  );
}
