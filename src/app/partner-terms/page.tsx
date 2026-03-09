import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "掲載パートナー利用規約",
  description: `${SITE_NAME}の掲載パートナー向け利用規約です。パートナー登録前に必ずお読みください。`,
  alternates: { canonical: `${SITE_URL}/partner-terms` },
  robots: { index: false, follow: false },
};

export default function PartnerTermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "掲載パートナー利用規約", url: `${SITE_URL}/partner-terms` },
        ]}
      />
      <Breadcrumb items={[{ label: "掲載パートナー利用規約" }]} />

      <h1 className="text-3xl font-bold text-gray-900 mb-8">掲載パートナー利用規約</h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第1条（適用）</h2>
          <p>
            本規約は、{SITE_NAME}（以下「当サービス」）が提供する一括見積もりサービスにおける
            掲載パートナー（以下「パートナー」）の利用条件を定めるものです。
            パートナー登録を行った時点で、本規約に同意いただいたものとみなします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第2条（サービス内容）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>当サービスは、ファクタリングの利用を検討するユーザー（以下「ユーザー」）から送信された見積もり依頼情報（以下「リード」）をパートナーに配信するサービスです。</li>
            <li>パートナーは、配信されたリード情報をもとに、ユーザーへ電話またはメールにて直接ご対応いただきます。</li>
            <li>当サービスは、リードの品質を保つため、AIによるスパム判定および重複チェックを実施します。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第3条（登録・審査）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>パートナー登録の申請は、当サービスの登録フォームより行うものとします。</li>
            <li>当サービスは、申請内容を審査のうえ、掲載の可否を判断します。審査基準は非公開とし、理由の開示義務を負いません。</li>
            <li>掲載パートナーの募集枠には上限があります。上限数は当サービスの判断により変更される場合があります。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第4条（料金）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>初期費用および月額固定費は発生しません。</li>
            <li>リード1件あたり16,500円（税込）の成果報酬が発生します。</li>
            <li>取下げ申請が承認されたリードについては、課金対象外となります。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第5条（請求・支払い）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>請求は毎月10日締めとし、請求書はメールにて自動送信されます。</li>
            <li>請求内容の詳細は、パートナー管理画面からいつでもご確認いただけます。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第6条（リードの取下げ）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>パートナーは、リード受信から5営業日以内に、正当な理由がある場合に限り取下げ申請を行うことができます。</li>
            <li>取下げが認められる理由は以下のとおりです。
              <ul className="list-disc pl-5 mt-1 space-y-0.5">
                <li>虚偽情報（氏名・電話番号・メールアドレス）</li>
                <li>連絡不通（番号不存在・別会社・該当社員なし）</li>
                <li>メール不達</li>
                <li>競合企業からの依頼</li>
                <li>重複（当サービス内での同一ユーザー）</li>
                <li>対象外ユーザー（個人・給与ファクタリング等）</li>
              </ul>
            </li>
            <li>取下げの承認・非承認は、当サービスの管理者が審査のうえ判断します。</li>
            <li>5営業日を過ぎたリードは確定扱いとなり、取下げ申請はできません。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第7条（重複チェック）</h2>
          <p>
            同じメールアドレスまたは電話番号で、同じパートナーに対して過去6ヶ月以内に配信されたリードがある場合、
            そのリードは自動で無効化され、課金対象外となります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第8条（掲載の停止・再開）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>パートナーは、管理画面からいつでも掲載の停止・再開を行うことができます。</li>
            <li>掲載停止中はリードの配信が停止され、新たな課金は発生しません。</li>
            <li>掲載停止中でも、管理画面へのアクセスおよび過去のリード・請求情報の確認は引き続き可能です。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第9条（禁止事項）</h2>
          <p>パートナーは、以下の行為を行ってはなりません。</p>
          <ul className="list-disc pl-5 mt-1 space-y-0.5">
            <li>リード情報を第三者に提供・転売する行為</li>
            <li>当サービスの運営を妨害する行為</li>
            <li>虚偽の情報で登録を行う行為</li>
            <li>不正な取下げ申請を繰り返す行為</li>
            <li>その他、当サービスが不適切と判断する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第10条（契約の解除）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>当サービスは、パートナーが本規約に違反した場合、事前の通知なく掲載を停止または登録を取り消すことができます。</li>
            <li>契約解除時点で未払いの料金がある場合、パートナーは速やかに支払いを行うものとします。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第11条（免責事項）</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>当サービスは、リードの正確性・成約を保証するものではありません。</li>
            <li>ユーザーとパートナー間の取引に関して、当サービスは一切の責任を負いません。</li>
            <li>システムの障害・メンテナンス等によるサービスの一時停止について、当サービスは責任を負いません。</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">第12条（規約の変更）</h2>
          <p>
            当サービスは、必要に応じて本規約を変更することができます。
            変更後の規約は、当ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <div className="pt-4 border-t border-gray-200 space-y-1 text-gray-500">
          <p>制定日: 2026年3月8日</p>
          <div className="mt-4">
            <p className="font-medium text-gray-700">運営者</p>
            <p>Common Future & Co.株式会社</p>
            <p>所在地: 神奈川県逗子市小坪6-6-46</p>
            <p>メール: info@cfac.co.jp</p>
            <p>URL: https://www.cfac.co.jp/</p>
          </div>
        </div>
      </div>
    </div>
  );
}
