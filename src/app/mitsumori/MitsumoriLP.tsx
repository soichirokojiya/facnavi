"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { INDUSTRIES, PREFECTURES } from "@/lib/constants";

/* ─── 定数 ─── */

const AMOUNT_OPTIONS = [
  "100万円以下",
  "100万円〜500万円",
  "500万円〜1,000万円",
  "1,000万円〜3,000万円",
  "3,000万円以上",
] as const;

const TIMING_OPTIONS = [
  "即日",
  "3日以内",
  "1週間以内",
  "1ヶ月以内",
  "急ぎではない",
] as const;

const BUSINESS_TYPES = [
  "法人",
  "個人事業主・フリーランス",
] as const;

/* ─── フォーム型 ─── */

interface FormData {
  amount_range: string;
  deposit_timing: string;
  business_type: string;
  industry: string;
  prefecture: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  message: string;
  agreed: boolean;
}

const initialForm: FormData = {
  amount_range: "",
  deposit_timing: "",
  business_type: "",
  industry: "",
  prefecture: "",
  company_name: "",
  contact_name: "",
  phone: "",
  email: "",
  message: "",
  agreed: false,
};

/* ─── 共通UI ─── */

function SectionHeading({ sub, children, light = false }: { sub?: string; children: React.ReactNode; light?: boolean }) {
  return (
    <div className="text-center mb-12">
      {sub && (
        <p className={`text-xs font-bold tracking-[0.2em] mb-2 ${light ? "text-blue-300" : "text-blue-600"}`}>
          {sub}
        </p>
      )}
      <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${light ? "text-white" : "text-gray-900"}`}>
        {children}
      </h2>
      <div className={`w-12 h-1 mx-auto mt-4 rounded-full ${light ? "bg-orange-400" : "bg-orange-500"}`} />
    </div>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <a
        href="#form"
        className="relative inline-block px-10 py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10">無料で一括見積もりする</span>
      </a>
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><span className="text-green-500">&#10003;</span> 完全無料</span>
        <span className="flex items-center gap-1"><span className="text-green-500">&#10003;</span> 最短30秒</span>
        <span className="flex items-center gap-1"><span className="text-green-500">&#10003;</span> 個人事業主OK</span>
      </div>
    </div>
  );
}

function CtaButtonLight({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <a
        href="#form"
        className="inline-block px-10 py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300"
      >
        無料で一括見積もりする
      </a>
      <div className="flex items-center justify-center gap-4 mt-4 text-sm text-blue-200">
        <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 完全無料</span>
        <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 最短30秒</span>
        <span className="flex items-center gap-1"><span className="text-green-400">&#10003;</span> 個人事業主OK</span>
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
        {label}
        {required && (
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 outline-none transition-colors bg-white text-gray-900"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
        {label}
        {required && (
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        )}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 outline-none transition-colors bg-white text-gray-900"
      >
        <option value="">{placeholder || "選択してください"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── LP本体 ─── */

export function MitsumoriLP() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showFixedCta, setShowFixedCta] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2>(1);

  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  useEffect(() => {
    const onScroll = () => {
      setShowFixedCta(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isStep1Valid =
    form.amount_range &&
    form.deposit_timing &&
    form.business_type &&
    form.industry &&
    form.prefecture;

  const isFormValid =
    isStep1Valid &&
    form.company_name &&
    form.contact_name &&
    form.phone &&
    form.email &&
    form.agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mitsumori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount_range: form.amount_range,
          deposit_timing: form.deposit_timing,
          business_type: form.business_type,
          industry: form.industry,
          prefecture: form.prefecture,
          company_name: form.company_name,
          contact_name: form.contact_name,
          phone: form.phone,
          email: form.email,
          message: form.message || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "送信に失敗しました。");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("通信エラーが発生しました。時間をおいて再度お試しください。");
      setStatus("error");
    }
  };

  /* ━━━ 送信完了 ━━━ */
  if (status === "success") {
    return (
      <div className="py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">お申し込みありがとうございます</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          ご入力いただいた条件に合うファクタリング会社から、順次ご連絡いたします。<br />
          通常1営業日以内にご連絡差し上げます。
        </p>
        <Link href="/" className="text-blue-600 hover:underline font-bold">
          トップページに戻る
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ━━━ 1. ファーストビュー ━━━ */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0b3d91] via-[#1a365d] to-[#0b3d91] -mx-4 px-6 rounded-2xl mb-0">
        <div className="max-w-2xl mx-auto text-center">
          <p className="inline-block text-sm font-bold text-orange-400 border border-orange-400/40 rounded-full px-4 py-1.5 mb-6">
            完全無料・最短30秒で入力完了
          </p>
          <h1 className="text-3xl md:text-[2.75rem] font-extrabold text-white leading-tight tracking-tight mb-5">
            たった30秒で最適な<br />
            ファクタリング会社が見つかる
          </h1>
          <p className="text-blue-200 text-lg mb-12 leading-relaxed">
            条件を入力するだけで、あなたに合ったおすすめ業者を自動提案。<br className="sm:hidden" />
            気になる会社を選んでそのまま見積もり依頼できます。
          </p>

          {/* 数値バー */}
          <div className="grid grid-cols-3 bg-white/10 backdrop-blur rounded-xl border border-white/20 divide-x divide-white/20 mb-12">
            <div className="py-5">
              <p className="text-3xl md:text-4xl font-extrabold text-orange-400">255<span className="text-lg">社</span></p>
              <p className="text-sm text-blue-200 mt-1">掲載社数</p>
            </div>
            <div className="py-5">
              <p className="text-3xl md:text-4xl font-extrabold text-orange-400">95<span className="text-lg">%</span></p>
              <p className="text-sm text-blue-200 mt-1">利用者満足度</p>
            </div>
            <div className="py-5">
              <p className="text-3xl md:text-4xl font-extrabold text-orange-400">最短即日</p>
              <p className="text-sm text-blue-200 mt-1">入金スピード</p>
            </div>
          </div>

          <CtaButtonLight />
        </div>
      </section>

      {/* ━━━ 2. こんなお悩みありませんか？ ━━━ */}
      <section className="py-16 md:py-20">
        <SectionHeading>こんなお悩みありませんか？</SectionHeading>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            "どの業者を選べばいいかわからない",
            "手数料を比較する時間がない",
            "悪徳業者に騙されないか不安",
            "急いで資金を調達したい",
          ].map((text) => (
            <div key={text} className="flex items-start gap-3 bg-red-50 border-l-4 border-red-400 rounded-r-xl p-5">
              <span className="text-red-400 font-bold text-lg shrink-0 mt-0.5">&#x2716;</span>
              <p className="text-gray-800 font-bold">{text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <div className="inline-block">
            <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <p className="text-lg font-bold text-gray-900">
              そのお悩み、<span className="text-orange-500">ファクナビの一括見積もり</span>で解決
            </p>
          </div>
        </div>
      </section>

      {/* ━━━ 3. 選ばれる5つの理由 ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50 -mx-4 px-4 rounded-2xl">
        <SectionHeading sub="WHY FACNAVI?">ファクナビが選ばれる5つの理由</SectionHeading>
        <div className="space-y-4 max-w-2xl mx-auto">
          {[
            { num: "01", title: "厳選された優良業者のみ掲載", desc: "独自の審査基準をクリアした信頼性の高い業者だけをご紹介。悪徳業者の心配がありません。" },
            { num: "02", title: "おすすめ業者から選んで見積もり", desc: "条件を入力するとおすすめのファクタリング会社が提案され、気になる会社を選んでまとめて見積もり依頼できます。" },
            { num: "03", title: "完全無料・手数料なし", desc: "一括見積もりサービスのご利用は完全無料。利用者に手数料が発生することは一切ありません。" },
            { num: "04", title: "個人事業主・フリーランスもOK", desc: "法人だけでなく、個人事業主やフリーランスの方にも対応した業者を多数掲載しています。" },
            { num: "05", title: "全国対応・オンライン完結", desc: "来店不要で全国どこからでもご利用可能。申し込みから契約まですべてオンラインで完結します。" },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 items-start p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <span className="w-11 h-11 flex items-center justify-center bg-[#0b3d91] text-orange-400 text-sm font-extrabold rounded-full shrink-0">
                {item.num}
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 4. 3つのメリット ━━━ */}
      <section className="py-16 md:py-20 bg-[#0b3d91] -mx-4 px-4 rounded-2xl">
        <SectionHeading sub="MERIT" light>一括見積もりの3つのメリット</SectionHeading>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: "💰", title: "手数料を最安に\n抑えられる", desc: "複数社の見積もりを比較することで、最も有利な条件を見つけることができます。" },
            { icon: "🔍", title: "手間なく最適な\n1社が見つかる", desc: "1社ずつ問い合わせる手間を省き、条件に合った業者を効率的に見つけられます。" },
            { icon: "🛡️", title: "安心・安全に\n利用できる", desc: "審査済みの優良業者のみをご紹介。個人情報の取り扱いも万全です。" },
          ].map((item) => (
            <div key={item.title} className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center border border-white/15 hover:bg-white/15 transition-colors">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-white text-lg mb-2 whitespace-pre-line">{item.title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 中間CTA ━━━ */}
      <section className="py-12">
        <CtaButton />
      </section>

      {/* ━━━ 5. ご利用の流れ ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50 -mx-4 px-4 rounded-2xl">
        <SectionHeading sub="FLOW">ご利用の流れ</SectionHeading>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {[
            { step: "STEP 1", title: "条件を入力", desc: "希望金額や業種などを入力。最短30秒で完了。", icon: "📝" },
            { step: "STEP 2", title: "おすすめを確認", desc: "あなたの条件に合ったおすすめ業者が自動で表示されます。", icon: "🔍" },
            { step: "STEP 3", title: "選んで見積もり依頼", desc: "気になる会社を複数選んで、まとめて見積もり依頼。", icon: "📊" },
            { step: "STEP 4", title: "比較して契約", desc: "届いた見積もりを比較し、最適な1社と契約。", icon: "✅" },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">{item.icon}</span>
              </div>
              <p className="text-xs font-bold text-white bg-orange-500 rounded-full px-3 py-1 inline-block mb-2">{item.step}</p>
              <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 6. 利用者の声 ━━━ */}
      <section className="py-16 md:py-20">
        <SectionHeading sub="VOICE">利用者の声</SectionHeading>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              industry: "建設業",
              name: "A社 代表取締役",
              text: "元請けからの入金が遅れて資金繰りに困っていたところ、一括見積もりで3社から連絡をもらい、最も手数料が低い業者を選べました。翌日には入金されて助かりました。",
              result: "手数料5%・翌日入金",
            },
            {
              industry: "運送業",
              name: "B社 経理担当",
              text: "燃料費の高騰で急な資金が必要に。1社ずつ問い合わせる時間がなかったので一括見積もりを利用。比較できたおかげで納得のいく条件で契約できました。",
              result: "手数料8%・即日入金",
            },
            {
              industry: "IT企業",
              name: "C社 フリーランス",
              text: "個人事業主でも対応してもらえるか不安でしたが、しっかり対応してくれる業者が見つかりました。オンラインで完結できたのも大きなメリットでした。",
              result: "手数料10%・2日で入金",
            },
          ].map((voice) => (
            <div key={voice.name} className="bg-white rounded-2xl p-6 border-l-4 border-orange-400 shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-2.5 py-1 bg-[#0b3d91] text-white text-xs font-bold rounded">
                  {voice.industry}
                </span>
                <span className="text-sm text-gray-500 font-medium">{voice.name}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{voice.text}</p>
              <p className="text-sm font-bold text-green-700 bg-green-50 rounded-lg px-3 py-2 inline-block">
                {voice.result}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 7. よくある質問 ━━━ */}
      <section className="py-16 md:py-20 bg-slate-50 -mx-4 px-4 rounded-2xl">
        <SectionHeading sub="FAQ">よくある質問</SectionHeading>
        <div className="space-y-3 max-w-2xl mx-auto">
          {[
            { q: "一括見積もりに費用はかかりますか？", a: "いいえ、完全無料でご利用いただけます。利用者に手数料やサービス利用料が発生することは一切ありません。" },
            { q: "個人事業主でも申し込めますか？", a: "はい、個人事業主・フリーランスの方でもお申し込みいただけます。対応可能な業者をご紹介します。" },
            { q: "見積もり後、必ず契約しなければなりませんか？", a: "いいえ、見積もりだけの利用でも問題ありません。条件が合わなければお断りいただいて構いません。" },
            { q: "どのくらいで連絡がもらえますか？", a: "通常、お申し込みから1営業日以内に提携業者からご連絡差し上げます。お急ぎの場合は即日対応も可能です。" },
            { q: "個人情報は安全に管理されますか？", a: "はい、お預かりした個人情報は厳重に管理し、見積もり目的以外には使用いたしません。詳しくはプライバシーポリシーをご確認ください。" },
          ].map((item) => (
            <details key={item.q} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-gray-900 hover:bg-blue-50/50 transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-[#0b3d91] text-white text-xs font-bold rounded-full shrink-0">Q</span>
                  <span className="text-left">{item.q}</span>
                </span>
                <svg
                  className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180 shrink-0 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-4">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full mr-2 align-middle">A</span>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ━━━ 8. フォーム ━━━ */}
      <section id="form" className="py-16 md:py-20 -mx-4 px-4 scroll-mt-20">
        <SectionHeading sub="FORM">無料一括見積もりフォーム</SectionHeading>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* フォームヘッダー */}
            <div className="bg-gradient-to-r from-[#0b3d91] to-[#1a365d] text-white text-center py-4 px-4">
              <p className="font-bold text-lg">{formStep === 1 ? "STEP 1：条件を入力" : "STEP 2：お客様情報を入力"}</p>
              <p className="text-blue-200 text-sm">完全無料</p>
              <div className="flex justify-center gap-2 mt-3">
                <div className={`h-1 w-16 rounded-full ${formStep >= 1 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className={`h-1 w-16 rounded-full ${formStep >= 2 ? "bg-orange-400" : "bg-white/20"}`} />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {formStep === 1 ? (
                <>
                  <SelectField
                    label="請求書の金額帯"
                    options={AMOUNT_OPTIONS}
                    value={form.amount_range}
                    onChange={(v) => updateField("amount_range", v)}
                    placeholder="金額帯を選択してください"
                    required
                  />
                  <SelectField
                    label="入金希望時期"
                    options={TIMING_OPTIONS}
                    value={form.deposit_timing}
                    onChange={(v) => updateField("deposit_timing", v)}
                    placeholder="時期を選択してください"
                    required
                  />
                  <SelectField
                    label="事業形態"
                    options={BUSINESS_TYPES}
                    value={form.business_type}
                    onChange={(v) => updateField("business_type", v)}
                    placeholder="事業形態を選択してください"
                    required
                  />
                  <SelectField
                    label="業種"
                    options={INDUSTRIES}
                    value={form.industry}
                    onChange={(v) => updateField("industry", v)}
                    placeholder="業種を選択してください"
                    required
                  />
                  <SelectField
                    label="都道府県"
                    options={PREFECTURES}
                    value={form.prefecture}
                    onChange={(v) => updateField("prefecture", v)}
                    placeholder="都道府県を選択してください"
                    required
                  />

                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    onClick={() => setFormStep(2)}
                    className="w-full py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                  >
                    おすすめ業者を見る →
                  </button>
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ 条件に合うおすすめ業者が表示されます
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
                    <p className="font-bold mb-1">入力条件</p>
                    <p>{form.amount_range} / {form.deposit_timing} / {form.business_type} / {form.industry} / {form.prefecture}</p>
                    <button type="button" onClick={() => setFormStep(1)} className="text-blue-600 hover:underline font-bold text-xs mt-1">条件を変更する</button>
                  </div>

                  <InputField
                    label="会社名（屋号）"
                    placeholder="例：株式会社ファクナビ"
                    value={form.company_name}
                    onChange={(v) => updateField("company_name", v)}
                    required
                  />
                  <InputField
                    label="お名前"
                    placeholder="例：山田 太郎"
                    value={form.contact_name}
                    onChange={(v) => updateField("contact_name", v)}
                    required
                  />
                  <InputField
                    label="電話番号"
                    type="tel"
                    placeholder="例：03-1234-5678"
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                    required
                  />
                  <InputField
                    label="メールアドレス"
                    type="email"
                    placeholder="例：info@example.com"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    required
                  />

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
                      ご相談内容
                      <span className="text-[10px] font-bold text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">任意</span>
                    </label>
                    <textarea
                      placeholder="ご要望やご質問があればご記入ください"
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10 outline-none transition-colors resize-none bg-white text-gray-900"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                    <input
                      type="checkbox"
                      id="privacy-agree"
                      checked={form.agreed}
                      onChange={(e) => updateField("agreed", e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                    />
                    <label htmlFor="privacy-agree" className="text-sm text-gray-700">
                      <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-bold">
                        プライバシーポリシー
                      </Link>
                      に同意する
                    </label>
                  </div>

                  {status === "error" && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isFormValid || status === "submitting"}
                    className="w-full py-4 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                  >
                    {status === "submitting" ? "送信中..." : "無料で一括見積もりを依頼する"}
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ ご入力いただいた情報は見積もり目的にのみ使用いたします
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
      </section>

      {/* ━━━ 9. 最終CTA ━━━ */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#0b3d91] to-[#1a365d] -mx-4 px-4 rounded-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
          まずは無料で見積もりを<br className="sm:hidden" />取ってみませんか？
        </h2>
        <p className="text-blue-200 mb-10 leading-relaxed">
          最短30秒で入力完了。複数社を比較して最適な条件を見つけましょう。
        </p>
        <CtaButtonLight />
      </section>

      {/* ━━━ 固定CTAバー ━━━ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
          showFixedCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-gray-800 hidden sm:block">
              完全無料で最適なファクタリング会社が見つかる
            </p>
            <a
              href="#form"
              className="inline-block px-6 py-3 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto text-center"
            >
              無料で一括見積もりする
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
