"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { INDUSTRIES } from "@/lib/constants";

/* ─── 定数 ─── */

const AMOUNT_OPTIONS = [
  "10万円未満",
  "10〜30万円未満",
  "30〜50万円未満",
  "50〜100万円未満",
  "100〜300万円未満",
  "300〜500万円未満",
  "500〜1,000万円未満",
  "1,000〜3,000万円未満",
  "3,000〜5,000万円未満",
  "5,000万〜1億円未満",
  "1〜3億円未満",
  "3億円以上",
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
  purchase_amount: string;
  deposit_timing: string;
  business_type: string;
  industry: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  message: string;
  agreed: boolean;
}

const initialForm: FormData = {
  purchase_amount: "",
  deposit_timing: "",
  business_type: "",
  industry: "",
  company_name: "",
  contact_name: "",
  phone: "",
  email: "",
  message: "",
  agreed: false,
};

/* ─── 共通UI ─── */

function SectionHeading({ sub, children, size = "default" }: { sub?: string; children: React.ReactNode; size?: "default" | "large" }) {
  return (
    <div className="text-center mb-10">
      {sub && (
        <p className="text-[11px] font-bold tracking-[0.2em] text-blue-500/70 mb-2 uppercase">
          {sub}
        </p>
      )}
      <h2 className={`font-black text-gray-900 tracking-tight ${size === "large" ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"}`}>
        {children}
      </h2>
      <div className="w-12 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
    </div>
  );
}

function CtaButton({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <a
        href="#form"
        className="shimmer inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-base rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
      >
        無料で一括見積もりする →
      </a>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-gray-500 justify-center">
        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>完全無料</span>
        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>最短30秒</span>
        <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>個人事業主OK</span>
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
  icon,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
        {icon && <span className="text-blue-500">{icon}</span>}
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
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900"
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
  icon,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
        {icon && <span className="text-blue-500">{icon}</span>}
        {label}
        {required && (
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        )}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]"
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

/* ─── SVGアイコン ─── */

const icons = {
  building: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
    </svg>
  ),
  yen: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7.5l3 4.5m0 0l3-4.5M12 12v5.25M15 12H9m6 3H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  shield: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  search: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  chart: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
  check: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  edit: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  users: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  globe: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  sparkles: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  document: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  handshake: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3.15M10.05 4.575a1.575 1.575 0 013.15 0v3.15M10.05 4.575v3.15M3.75 7.725h16.5M3.75 7.725V21h4.5V7.725M3.75 7.725L7.5 3.975m12.75 3.75V21h-4.5V7.725m4.5 0L16.5 3.975m-9 13.275h7.5" />
    </svg>
  ),
  star: (cls: string) => (
    <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  quote: (cls: string) => (
    <svg className={cls} fill="currentColor" viewBox="0 0 24 24">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  ),
};

/* ─── LP本体 ─── */

/* ─── おすすめ業者データ（後ほど実データに差し替え） ─── */
const RECOMMENDED_COMPANIES = [
  {
    id: "betrading",
    name: "ビートレーディング",
    rating: 4.8,
    features: ["手数料2%〜", "最短2時間", "オンライン完結"],
    color: "from-blue-500 to-blue-600",
    href: "/go/betrading",
  },
  {
    id: "jsfc",
    name: "日本中小企業金融サポート機構",
    rating: 4.7,
    features: ["手数料1.5%〜", "最短即日", "個人事業主OK"],
    color: "from-emerald-500 to-emerald-600",
    href: "/go/jsfc",
  },
  {
    id: "accelfactor",
    name: "アクセルファクター",
    rating: 4.6,
    features: ["手数料2%〜", "最短即日", "少額対応"],
    color: "from-purple-500 to-purple-600",
    href: "/go/accelfactor",
  },
];

export function MitsumoriLP() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showFixedCta, setShowFixedCta] = useState(false);
  const [formStep, _setFormStep] = useState<1 | 2 | 3>(1);
  const setFormStep = (step: 1 | 2 | 3) => {
    _setFormStep(step);
    // フォーム上部にスクロール
    setTimeout(() => {
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    RECOMMENDED_COMPANIES.map((c) => c.id) // デフォルト全選択
  );

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
    form.purchase_amount &&
    form.deposit_timing &&
    form.business_type &&
    form.industry;

  const isFormValid =
    isStep1Valid &&
    form.company_name &&
    form.contact_name &&
    form.phone &&
    form.email &&
    form.agreed;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid || selectedCompanies.length === 0) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mitsumori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchase_amount: form.purchase_amount,
          deposit_timing: form.deposit_timing,
          business_type: form.business_type,
          industry: form.industry,
          company_name: form.company_name,
          contact_name: form.contact_name,
          phone: form.phone,
          email: form.email,
          message: form.message || undefined,
          selected_companies: selectedCompanies,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("Mitsumori API error:", data.error);
      }
      setStatus("success");
    } catch (err) {
      console.warn("Mitsumori submit error:", err);
      setStatus("success");
    }
  };

  /* ━━━ 送信完了（STEP 3表示中のみヒーロー以降を出す） ━━━ */

  return (
    <>
      {/* ━━━ 1. ファーストビュー ━━━ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50/40">
        {/* 装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-50/30 to-emerald-50/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 py-14 md:py-20 text-center">
          <p className="shimmer inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black px-6 py-2.5 rounded-full mb-6 text-base md:text-lg shadow-lg shadow-blue-500/25">
            {icons.sparkles("w-5 h-5 text-yellow-300")}
            完全無料・最短30秒で入力完了
          </p>

          <h1 className="text-3xl md:text-[2.75rem] font-black mb-2 leading-[1.3] text-gray-900 tracking-tight">
            たった30秒で最適な
          </h1>
          <p className="text-3xl md:text-[2.75rem] font-black mb-4 leading-[1.3] tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">ファクタリング会社が見つかる</span>
          </p>

          <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed max-w-lg mx-auto">
            条件を入力するだけで、あなたに合ったおすすめ業者を自動提案。<br className="hidden sm:block" />
            気になる会社を選んでそのまま見積もり依頼できます。
          </p>

          {/* 統計カード */}
          <div className="flex items-stretch gap-4 md:gap-6 mb-8 justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-blue-500/5 border border-white px-5 md:px-8 py-5 text-center group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-blue-500/25 group-hover:scale-110 transition-transform">
                {icons.building("w-5 h-5 text-white")}
              </div>
              <div className="text-4xl md:text-5xl font-black text-blue-600 leading-none tracking-tighter">255<span className="text-lg font-bold">社</span></div>
              <div className="text-[11px] font-bold text-gray-400 mt-1.5 tracking-wide">掲載社数</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-emerald-500/5 border border-white px-5 md:px-8 py-5 text-center group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                {icons.yen("w-5 h-5 text-white")}
              </div>
              <div className="text-4xl md:text-5xl font-black text-emerald-500 leading-none">無料</div>
              <div className="text-[11px] font-bold text-gray-400 mt-1.5 tracking-wide">利用料金</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md shadow-orange-500/5 border border-white px-5 md:px-8 py-5 text-center group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform">
                {icons.clock("w-5 h-5 text-white")}
              </div>
              <div className="text-4xl md:text-5xl font-black text-orange-500 leading-none">即日</div>
              <div className="text-[11px] font-bold text-gray-400 mt-1.5 tracking-wide">最短入金</div>
            </div>
          </div>

          <CtaButton />
        </div>
      </section>

      {/* ━━━ 2. こんなお悩みありませんか？ ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading>こんなお悩みありませんか？</SectionHeading>
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* 左：イラスト */}
            <div className="md:w-2/5 flex justify-center">
              <Image src="/images/column/small-business.svg" width={280} height={280} alt="お悩みイメージ" className="w-48 md:w-64" />
            </div>
            {/* 右：悩みリスト */}
            <div className="md:w-3/5 space-y-3">
              {[
                { text: "どの業者を選べばいいかわからない", icon: icons.search },
                { text: "手数料を比較する時間がない", icon: icons.clock },
                { text: "悪徳業者に騙されないか不安", icon: icons.shield },
                { text: "急いで資金を調達したい", icon: icons.clock },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50/50 border border-red-100 rounded-xl px-4 py-3.5 group">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-red-100">
                    {item.icon("w-4 h-4 text-red-400")}
                  </div>
                  <p className="text-gray-800 font-bold text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex flex-col items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 animate-bounce">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-black text-gray-900 leading-snug">
                そのお悩み、<br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">ファクナビの一括見積もり</span>で<br className="sm:hidden" />解決できます
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 3. 選ばれる5つの理由 ━━━ */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4">
        <SectionHeading sub="WHY FACNAVI?" size="large">ファクナビが選ばれる<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">4つの理由</span></SectionHeading>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: icons.shield, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", accent: "text-blue-600", num: "01", title: "厳選された優良業者のみ掲載", desc: "独自の審査基準をクリアした信頼性の高い業者だけをご紹介。悪徳業者の心配がありません。" },
            { icon: icons.sparkles, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", accent: "text-purple-600", num: "02", title: "おすすめ業者から選んで見積もり", desc: "条件を入力するとおすすめのファクタリング会社が提案され、気になる会社を選んでまとめて見積もり依頼できます。" },
            { icon: icons.yen, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", accent: "text-emerald-600", num: "03", title: "完全無料・手数料なし", desc: "一括見積もりサービスのご利用は完全無料。利用者に手数料が発生することは一切ありません。" },
            { icon: icons.users, color: "from-orange-400 to-orange-500", bg: "bg-orange-50", accent: "text-orange-600", num: "04", title: "個人事業主・フリーランスもOK", desc: "法人だけでなく、個人事業主やフリーランスの方にも対応した業者を多数掲載しています。" },
          ].map((item, i) => (
            <div key={i} className={`relative p-6 ${item.bg} rounded-2xl hover:shadow-md transition-all duration-300 group`}>
              <span className={`absolute top-4 right-4 text-3xl font-black ${item.accent} opacity-15`}>{item.num}</span>
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {item.icon("w-6 h-6 text-white")}
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ━━━ 4. 3つのメリット ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="MERIT">一括見積もりの3つのメリット</SectionHeading>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { img: "/images/column/fees-comparison.svg", title: "手数料を最安に抑えられる", desc: "複数社の見積もりを比較することで、最も有利な条件を見つけることができます。無駄な手数料を払う必要はありません。" },
              { img: "/images/column/comparison-table.svg", title: "手間なく最適な1社が見つかる", desc: "1社ずつ問い合わせる手間を省き、条件に合った業者を効率的に見つけられます。忙しい経営者でも安心。" },
              { img: "/images/column/contract-signing.svg", title: "安心・安全に利用できる", desc: "審査済みの優良業者のみをご紹介。個人情報の取り扱いも万全で、悪徳業者に騙される心配がありません。" },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100`}>
                <div className="md:w-2/5 flex justify-center">
                  <Image src={item.img} width={200} height={200} alt={item.title} className="w-36 md:w-44" />
                </div>
                <div className="md:w-3/5">
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full px-3 py-1 mb-2">
                    MERIT {i + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 中間CTA ━━━ */}
      <section className="py-8 bg-gradient-to-br from-blue-50 via-white to-emerald-50/40">
        <CtaButton />
      </section>

      {/* ━━━ 5. ご利用の流れ ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="FLOW">ご利用の流れ</SectionHeading>
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* 左：イラスト */}
            <div className="hidden md:flex md:w-1/3 justify-center pt-8">
              <Image src="/images/column/factoring-flow.svg" width={240} height={240} alt="ご利用の流れ" className="w-52" />
            </div>
            {/* 右：ステップ */}
            <div className="md:w-2/3 space-y-4">
              {[
                { step: "STEP 1", title: "条件を入力", desc: "希望金額や業種などを入力。最短30秒で完了します。", color: "from-blue-500 to-blue-600" },
                { step: "STEP 2", title: "おすすめを確認", desc: "あなたの条件に合ったおすすめ業者が自動で表示されます。", color: "from-purple-500 to-purple-600" },
                { step: "STEP 3", title: "選んで見積もり依頼", desc: "気になる会社を複数選んで、まとめて見積もり依頼。", color: "from-emerald-500 to-emerald-600" },
                { step: "STEP 4", title: "比較して契約", desc: "届いた見積もりを比較し、最適な1社と契約。", color: "from-orange-400 to-orange-500" },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-4 relative">
                  {/* 縦線 */}
                  {i < 3 && <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-gray-200 -mb-4" style={{ height: "calc(100% + 16px)" }} />}
                  {/* ステップ番号 */}
                  <div className={`relative z-10 w-9 h-9 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shrink-0 shadow-md text-white text-xs font-black`}>
                    {i + 1}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1">
                    <p className="text-[10px] font-bold text-blue-600 mb-0.5">{item.step}</p>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 6. 利用者の声 ━━━ */}
      <section className="py-10 md:py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
        <SectionHeading sub="VOICE">利用者の声</SectionHeading>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              industry: "建設業",
              name: "A社 代表取締役",
              text: "元請けからの入金が遅れて資金繰りに困っていたところ、一括見積もりで3社から連絡をもらい、最も手数料が低い業者を選べました。翌日には入金されて助かりました。",
              result: "手数料5%・翌日入金",
              stars: 5,
            },
            {
              industry: "運送業",
              name: "B社 経理担当",
              text: "燃料費の高騰で急な資金が必要に。1社ずつ問い合わせる時間がなかったので一括見積もりを利用。比較できたおかげで納得のいく条件で契約できました。",
              result: "手数料8%・即日入金",
              stars: 5,
            },
            {
              industry: "IT企業",
              name: "C社 フリーランス",
              text: "個人事業主でも対応してもらえるか不安でしたが、しっかり対応してくれる業者が見つかりました。オンラインで完結できたのも大きなメリットでした。",
              result: "手数料10%・2日で入金",
              stars: 4,
            },
          ].map((voice) => (
            <div key={voice.name} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              {/* 引用マーク */}
              <div className="absolute -top-3 -left-1">
                {icons.quote("w-10 h-10 text-blue-100")}
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full shadow-sm">
                    {icons.building("w-3 h-3 text-blue-200")}
                    {voice.industry}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{voice.name}</span>
                </div>

                {/* 星評価 */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {icons.star(`w-4 h-4 ${i < voice.stars ? "text-amber-400" : "text-gray-200"}`)}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">{voice.text}</p>

                <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl px-4 py-2.5 border border-emerald-100">
                  {icons.check("w-4 h-4 text-emerald-500 shrink-0")}
                  <p className="text-sm font-bold text-emerald-700">{voice.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ━━━ 7. よくある質問 ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <SectionHeading sub="FAQ">よくある質問</SectionHeading>
        <div className="space-y-2 max-w-2xl mx-auto">
          {[
            { q: "一括見積もりに費用はかかりますか？", a: "いいえ、完全無料でご利用いただけます。利用者に手数料やサービス利用料が発生することは一切ありません。" },
            { q: "個人事業主でも申し込めますか？", a: "はい、個人事業主・フリーランスの方でもお申し込みいただけます。対応可能な業者をご紹介します。" },
            { q: "見積もり後、必ず契約しなければなりませんか？", a: "いいえ、見積もりだけの利用でも問題ありません。条件が合わなければお断りいただいて構いません。" },
            { q: "どのくらいで連絡がもらえますか？", a: "通常、お申し込みから1営業日以内に提携業者からご連絡差し上げます。お急ぎの場合は即日対応も可能です。" },
            { q: "個人情報は安全に管理されますか？", a: "はい、お預かりした個人情報は厳重に管理し、見積もり目的以外には使用いたしません。詳しくはプライバシーポリシーをご確認ください。" },
          ].map((item) => (
            <details key={item.q} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <summary className="flex items-center justify-between cursor-pointer p-4 font-bold text-sm text-gray-900 hover:bg-blue-50/50 transition-colors">
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[10px] font-bold rounded-lg shrink-0 shadow-sm">Q</span>
                  <span className="text-left">{item.q}</span>
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180 shrink-0 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 text-white text-[10px] font-bold rounded-lg mr-2 align-middle shadow-sm">A</span>
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ━━━ 8. フォーム ━━━ */}
      <section id="form" className="py-10 md:py-14 bg-white scroll-mt-20">
        <SectionHeading sub="FORM">無料一括見積もりフォーム</SectionHeading>

        {/* ━━━ 2026年4月サービス開始まで準備中表示 ━━━ */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-5 px-4">
              <p className="font-bold text-lg">無料一括見積もりサービス</p>
              <p className="text-blue-200 text-sm mt-0.5">まもなく開始</p>
            </div>
            <div className="p-8 md:p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-5">
                {icons.clock("w-8 h-8 text-blue-600")}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2026年4月 サービス開始予定</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                現在、一括見積もりサービスの準備を進めております。<br />
                サービス開始までもうしばらくお待ちください。
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-full px-5 py-2.5 border border-blue-100">
                {icons.check("w-4 h-4 text-blue-500")}
                完全無料で利用可能
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ フォーム本体（2026年4月に有効化） ━━━ */}
        {false && formStep <= 2 ? (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* フォームヘッダー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-5 px-4">
              <p className="font-bold text-lg">
                {formStep === 1 ? "STEP 1：条件を入力" : "STEP 2：お客様情報を入力"}
              </p>
              <p className="text-blue-200 text-sm mt-0.5">完全無料</p>
              <div className="flex justify-center gap-2 mt-3">
                <div className={`h-1.5 w-16 rounded-full transition-colors ${formStep >= 1 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className={`h-1.5 w-16 rounded-full transition-colors ${formStep >= 2 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className="h-1.5 w-16 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {formStep === 1 ? (
                <>
                  <SelectField
                    label="買取希望金額"
                    options={AMOUNT_OPTIONS}
                    value={form.purchase_amount}
                    onChange={(v) => updateField("purchase_amount", v)}
                    placeholder="金額を選択してください"
                    required
                    icon={icons.yen("w-4 h-4")}
                  />
                  <SelectField
                    label="入金希望時期"
                    options={TIMING_OPTIONS}
                    value={form.deposit_timing}
                    onChange={(v) => updateField("deposit_timing", v)}
                    placeholder="時期を選択してください"
                    required
                    icon={icons.clock("w-4 h-4")}
                  />
                  <SelectField
                    label="事業形態"
                    options={BUSINESS_TYPES}
                    value={form.business_type}
                    onChange={(v) => updateField("business_type", v)}
                    placeholder="事業形態を選択してください"
                    required
                    icon={icons.building("w-4 h-4")}
                  />
                  <SelectField
                    label="業種"
                    options={INDUSTRIES}
                    value={form.industry}
                    onChange={(v) => updateField("industry", v)}
                    placeholder="業種を選択してください"
                    required
                    icon={icons.chart("w-4 h-4")}
                  />

                  <button
                    type="button"
                    disabled={!isStep1Valid}
                    onClick={() => setFormStep(2)}
                    className="w-full py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="bg-white/20 text-sm rounded-full px-2.5 py-0.5 font-bold">1/3</span>
                    次へ進む
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ 入力後、お客様情報の入力へ進みます
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      {icons.check("w-4 h-4 text-blue-500")}
                      <p className="font-bold">入力条件</p>
                    </div>
                    <p className="text-blue-600 text-xs ml-6">買取: {form.purchase_amount} / {form.deposit_timing} / {form.business_type} / {form.industry}</p>
                    <button type="button" onClick={() => setFormStep(1)} className="text-blue-500 hover:text-blue-700 hover:underline font-bold text-xs mt-1.5 ml-6 transition-colors">条件を変更する</button>
                  </div>

                  <InputField
                    label="会社名（屋号）"
                    placeholder="例：株式会社ファクナビ"
                    value={form.company_name}
                    onChange={(v) => updateField("company_name", v)}
                    required
                    icon={icons.building("w-4 h-4")}
                  />
                  <InputField
                    label="お名前"
                    placeholder="例：山田 太郎"
                    value={form.contact_name}
                    onChange={(v) => updateField("contact_name", v)}
                    required
                    icon={icons.users("w-4 h-4")}
                  />
                  <InputField
                    label="電話番号"
                    type="tel"
                    placeholder="例：03-1234-5678"
                    value={form.phone}
                    onChange={(v) => updateField("phone", v)}
                    required
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>}
                  />
                  <InputField
                    label="メールアドレス"
                    type="email"
                    placeholder="例：info@example.com"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    required
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
                  />

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
                      <span className="text-blue-500">
                        {icons.edit("w-4 h-4")}
                      </span>
                      ご相談内容
                      <span className="text-[10px] font-bold text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">任意</span>
                    </label>
                    <textarea
                      placeholder="ご要望やご質問があればご記入ください"
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none bg-white text-gray-900"
                    />
                  </div>

                  <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
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

                  <button
                    type="button"
                    disabled={!isFormValid}
                    onClick={() => setFormStep(3)}
                    className="w-full py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="bg-white/20 text-sm rounded-full px-2.5 py-0.5 font-bold">2/3</span>
                    おすすめ業者を見る
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ 次のステップで見積もり依頼先を選べます
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
        ) : (
        /* ━━━ STEP 3：業者を選んで送信（3/3） ━━━ */
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* フォームヘッダー */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-5 px-4">
              <p className="font-bold text-lg">
                {status === "success" ? "送信完了" : "STEP 3：見積もり依頼先を選択"}
              </p>
              <p className="text-blue-200 text-sm mt-0.5">完全無料</p>
              <div className="flex justify-center gap-2 mt-3">
                <div className="h-1.5 w-16 rounded-full bg-orange-400" />
                <div className="h-1.5 w-16 rounded-full bg-orange-400" />
                <div className="h-1.5 w-16 rounded-full bg-orange-400" />
              </div>
            </div>

            <div className="p-6 md:p-8">
              {status === "success" ? (
                /* ── 送信完了画面 ── */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/20">
                    {icons.check("w-8 h-8 text-emerald-600")}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">お申し込みありがとうございます</h3>
                  <p className="text-sm text-gray-500 mb-2 leading-relaxed">
                    選択された{selectedCompanies.length}社に見積もり依頼を送信しました。<br />
                    各社より順次ご連絡いたします。
                  </p>
                  <p className="text-xs text-gray-400 mb-6">通常1営業日以内にお電話またはメールでご連絡差し上げます。</p>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                    <p className="text-xs font-bold text-gray-500 mb-2">見積もり依頼先：</p>
                    <div className="space-y-1">
                      {RECOMMENDED_COMPANIES.filter((c) => selectedCompanies.includes(c.id)).map((c) => (
                        <div key={c.id} className="flex items-center gap-2 text-sm text-gray-700">
                          {icons.check("w-3.5 h-3.5 text-emerald-500 shrink-0")}
                          <span className="font-bold">{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    トップページに戻る
                  </Link>
                </div>
              ) : (
                /* ── 業者選択画面 ── */
                <>
                  <p className="text-sm font-bold text-gray-800 mb-1">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500 font-black">あなたにおすすめ</span>のファクタリング会社
                  </p>
                  <p className="text-xs text-gray-500 mb-4">見積もりを依頼したい会社を選んでください（複数選択可）</p>

                  <div className="space-y-3">
                    {RECOMMENDED_COMPANIES.map((company, i) => {
                      const isChecked = selectedCompanies.includes(company.id);
                      return (
                        <label
                          key={company.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            isChecked
                              ? "bg-blue-50 border-blue-400 shadow-sm"
                              : "bg-gray-50 border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setSelectedCompanies((prev) =>
                                prev.includes(company.id)
                                  ? prev.filter((id) => id !== company.id)
                                  : [...prev, company.id]
                              );
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600 shrink-0"
                          />
                          <div className={`w-9 h-9 bg-gradient-to-br ${company.color} rounded-lg flex items-center justify-center shrink-0 shadow-md text-white font-black text-xs`}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm">{company.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, si) => (
                                  <span key={si}>
                                    {icons.star(`w-3.5 h-3.5 ${si < Math.round(company.rating) ? "text-amber-400" : "text-gray-200"}`)}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs font-bold text-amber-600">{company.rating}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {company.features.map((f) => (
                                <span key={f} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{f}</span>
                              ))}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <p className="text-xs text-gray-400 mt-3 text-center">※ 上記はおすすめ業者の一部です。PR含む</p>

                  <button
                    type="button"
                    disabled={selectedCompanies.length === 0 || status === "submitting"}
                    onClick={handleSubmit}
                    className="w-full mt-5 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                        送信中...
                      </>
                    ) : (
                      <>
                        <span className="bg-white/20 text-sm rounded-full px-2.5 py-0.5 font-bold">3/3</span>
                        {selectedCompanies.length}社に見積もりを依頼する
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormStep(2)}
                    className="w-full mt-2 text-sm text-gray-500 hover:text-blue-600 font-bold transition-colors text-center py-2"
                  >
                    ← 前のステップに戻る
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        )}
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
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold rounded-full shadow-lg shadow-emerald-500/30 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto text-center"
            >
              無料で一括見積もりする
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
