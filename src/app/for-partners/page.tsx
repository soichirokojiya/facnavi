import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ファクタリング会社様向け｜一括見積もりサービス掲載のご案内",
  description:
    "ファクナビの一括見積もりサービスに掲載しませんか？質の高いリードを成果報酬型でお届け。初期費用・月額費用0円。先着5社限定で掲載パートナーを募集中。",
  alternates: { canonical: `${SITE_URL}/for-partners` },
  openGraph: {
    title: "ファクタリング会社様向け｜一括見積もりサービス掲載のご案内",
    description:
      "ファクナビの一括見積もりサービスに掲載しませんか？質の高いリードを成果報酬型でお届け。初期費用・月額費用0円。先着5社限定で掲載パートナーを募集中。",
  },
};

function SectionHeading({
  sub,
  title,
}: {
  sub: string;
  title: string;
}) {
  return (
    <div className="text-center mb-10">
      <p className="text-xs font-bold tracking-[0.15em] text-blue-600 uppercase mb-2">
        {sub}
      </p>
      <h2 className="text-2xl md:text-3xl font-black text-gray-900">
        {title}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-3 mx-auto" />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="absolute -top-4 left-6 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <h3 className="text-base font-bold text-gray-900 mt-2 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function ForPartnersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "掲載パートナー募集", url: `${SITE_URL}/for-partners` },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[{ label: "掲載パートナー募集" }]} />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-16 md:py-24">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="inline-flex items-center gap-1.5 bg-orange-50 backdrop-blur border border-orange-200 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full mb-3">
            2026年3月中旬〜4月 サービスローンチ予定
          </p>
          <p className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            先着5社限定
          </p>
          <h1 className="text-[1.6rem] md:text-[2.75rem] font-black leading-[1.25] tracking-tight text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              一括見積もりサービス
            </span>
            に<br className="md:hidden" />
            掲載しませんか？
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            ファクナビは日本最大級のファクタリング比較サイトです。<br className="hidden md:block" />
            初期費用・月額費用0円の完全成果報酬型で、質の高いリードをお届けします。
          </p>
          <Link
            href="/partner/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            無料で掲載を申し込む
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <p className="text-xs text-gray-400 mt-3">
            ※ 登録は3分で完了します
          </p>
        </div>
      </section>

      {/* メリット */}
      <section className="py-14 md:py-20 max-w-4xl mx-auto px-4">
        <SectionHeading sub="BENEFITS" title="ファクナビ掲載のメリット" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard
            icon="💰"
            title="完全成果報酬型"
            description="初期費用・月額費用は一切かかりません。リードが届いた分だけの課金なので、コストリスクゼロで始められます。"
          />
          <FeatureCard
            icon="📋"
            title="質の高いリード"
            description="AIスパム判定・重複チェックを導入済み。いたずらや重複リードは自動で除外し、有効なリードのみをお届けします。"
          />
          <FeatureCard
            icon="🛡️"
            title="取下げ制度あり"
            description="虚偽情報や連絡不通などの場合、5営業日以内に取下げ申請が可能。承認されたリードは課金対象外になります。"
          />
          <FeatureCard
            icon="📊"
            title="専用ダッシュボード"
            description="リード一覧・詳細確認・月別集計・請求確認がすべてオンラインで完結。わかりやすい管理画面を提供します。"
          />
          <FeatureCard
            icon="📧"
            title="リアルタイム通知"
            description="新しいリードが届くと即座にメールで通知。リード情報をすぐに確認し、スピーディーに対応できます。"
          />
          <FeatureCard
            icon="🔒"
            title="少数精鋭の掲載枠"
            description="現在は先着5社限定で募集中。掲載数を厳選しているため、1社あたりのリード配分が多くなります。※募集枠は今後拡大する可能性があります。"
          />
        </div>
      </section>

      {/* 料金体系 */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="PRICING" title="シンプルな料金体系" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-sm text-gray-500 line-through">初期費用</span>
                <span className="text-lg font-bold text-red-500">0円</span>
              </div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-sm text-gray-500 line-through">月額固定費</span>
                <span className="text-lg font-bold text-red-500">0円</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-blue-600 font-bold tracking-wider mb-1">COST PER LEAD</p>
                <p className="text-4xl font-black text-gray-900">
                  16,500<span className="text-lg font-bold text-gray-500">円</span><span className="text-sm font-medium text-gray-400">/件（税込）</span>
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                リード単価は一律16,500円（税込）・追加費用なし
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                有効なリードのみ課金（取下げ承認分は課金対象外）
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                毎月10日締め・請求書はメールで自動送信
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                請求内容はダッシュボードでいつでも確認可能
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* リード配信の仕組み */}
      <section className="py-14 md:py-20 max-w-4xl mx-auto px-4">
        <SectionHeading sub="HOW IT WORKS" title="リード配信の仕組み" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <StepCard
            number={1}
            title="ユーザーが見積もりを申し込む"
            description="ファクナビの一括見積もりフォームから、ユーザーが請求書の額面・希望金額・連絡先などを入力し、相談したい業者を選択して送信します。"
          />
          <StepCard
            number={2}
            title="AIによる自動品質チェック"
            description="送信内容をAIがリアルタイムで判定。スパム・いたずら・テスト送信を自動でブロックし、重複リードも業者ごとにチェックします。"
          />
          <StepCard
            number={3}
            title="リード情報をメールで即時通知"
            description="有効なリードと判定されると、会社名・担当者名・電話番号・メールアドレス・希望条件などの詳細情報がメールで届きます。"
          />
          <StepCard
            number={4}
            title="お電話でユーザーにご連絡"
            description="届いたリード情報をもとに、お電話またはメールでユーザーへご連絡ください。スピーディーな対応が成約率アップのポイントです。"
          />
        </div>
      </section>

      {/* ルール・取下げ制度 */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="RULES" title="リードの取下げ制度" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
            <h3 className="text-base font-bold text-gray-900 mb-3">AIによる自動フィルタリング</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              送信時にAIがリアルタイムでスパム・いたずら・テスト送信を自動判定し、不正なリードをブロックします。
              また、同一ユーザーからの重複リードも自動で除外されるため、質の高いリードのみが届きます。
            </p>

            <h3 className="text-base font-bold text-gray-900 mb-3">手動での取下げ申請</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              AIで防ぎきれないケースについては、正当な理由がある場合に<strong>5営業日以内</strong>に取下げ申請が可能です。
              管理者が審査の上、承認されたリードは課金対象外となります。
            </p>

            <h3 className="text-base font-bold text-gray-900 mb-3">取下げが認められる主な理由</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
              {[
                "虚偽情報（氏名・電話番号・メールアドレス）",
                "連絡不通（番号不存在・別会社・該当社員なし）",
                "メール不達",
                "競合企業からの依頼",
                "重複（ファクナビ内での同一ユーザー）",
                "対象外ユーザー（個人・給与ファクタリング等）",
              ].map((reason) => (
                <div key={reason} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5">●</span>
                  {reason}
                </div>
              ))}
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-3">重複チェックについて</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              同じメールアドレスまたは電話番号で、同じ業者に対して過去6ヶ月以内に送信されたリードは自動で無効化されます。
            </p>
          </div>
        </div>
      </section>

      {/* ご利用の流れ */}
      <section className="py-14 md:py-20 max-w-4xl mx-auto px-4">
        <SectionHeading sub="FLOW" title="掲載開始までの流れ" />
        <div className="max-w-2xl mx-auto space-y-0">
          {[
            {
              step: "1",
              title: "無料登録",
              desc: "会社名・メールアドレス・パスワードを入力するだけ。3分で完了します。",
            },
            {
              step: "2",
              title: "メール認証",
              desc: "登録メールアドレスに届く確認メールのリンクをクリックして認証完了。",
            },
            {
              step: "3",
              title: "掲載審査",
              desc: "管理者が掲載内容を確認後、リード配信を開始します。対応エリア・業種・金額帯などの条件は管理画面からいつでも設定・変更できます。",
            },
            {
              step: "4",
              title: "リード受信開始",
              desc: "審査完了後、ユーザーからの見積もり依頼がメール＆ダッシュボードに届き始めます。",
            },
          ].map((item, i, arr) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {item.step}
                </div>
                {i < arr.length - 1 && (
                  <div className="w-0.5 h-full bg-blue-200 my-1" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="FAQ" title="よくあるご質問" />
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "掲載に費用はかかりますか？",
                a: "初期費用・月額固定費は一切かかりません。リードが届いた分のみ課金される完全成果報酬型です。",
              },
              {
                q: "リードの単価はいくらですか？",
                a: "1件あたり16,500円（税込）です。これ以上の費用は発生しません。",
              },
              {
                q: "取下げ制度とは何ですか？",
                a: "虚偽情報や連絡不通など正当な理由がある場合、リード受信から5営業日以内に取下げ申請ができます。管理者が承認すれば課金対象外になります。",
              },
              {
                q: "リードの重複はどう扱われますか？",
                a: "同じメールアドレスまたは電話番号で、貴社に対して過去6ヶ月以内に配信されたリードがある場合は自動で除外されます。",
              },
              {
                q: "請求の締め日はいつですか？",
                a: "毎月10日締めです。請求書はメールで自動送信されます。詳細はパートナーダッシュボードからいつでもご確認いただけます。",
              },
              {
                q: "掲載を停止したい場合は？",
                a: "管理画面からいつでも掲載の停止・再開ができます。停止中の課金は発生しません。",
              },
              {
                q: "何社まで掲載できますか？",
                a: "現在は先着5社限定で掲載パートナーを募集しています。リードの質を維持するため掲載数を絞っていますが、今後状況に応じて募集枠を拡大する可能性があります。",
              },
            ].map((item) => (
              <div key={item.q} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center text-xs font-bold">
                    Q
                  </span>
                  <p className="text-sm font-bold text-gray-900 pt-0.5">{item.q}</p>
                </div>
                <div className="flex items-start gap-3 mt-3">
                  <span className="shrink-0 w-7 h-7 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                    A
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed pt-0.5">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/25 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
            先着5社限定
          </p>
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            今すぐ無料で掲載を始めましょう
          </h2>
          <p className="text-sm md:text-base text-blue-100 leading-relaxed max-w-xl mx-auto mb-8">
            初期費用・月額費用0円。リスクなしで始められる成果報酬型の集客を、ぜひお試しください。
          </p>
          <Link
            href="/partner/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            無料で掲載を申し込む
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
          <p className="text-xs text-blue-200 mt-3">
            ※ 登録は3分で完了・いつでも掲載停止可能
          </p>
        </div>
      </section>
    </>
  );
}
