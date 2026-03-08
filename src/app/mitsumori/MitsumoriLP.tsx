"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { INDUSTRIES, PREFECTURES } from "@/lib/constants";

/* ─── 定数 ─── */

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
  invoice_amount: string;
  purchase_amount: string;
  deposit_timing: string;
  business_type: string;
  industry: string;
  prefecture: string;
  address: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  message: string;
  agreed: boolean;
}

const initialForm: FormData = {
  invoice_amount: "",
  purchase_amount: "",
  deposit_timing: "",
  business_type: "",
  industry: "",
  prefecture: "",
  address: "",
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
        <p className="text-xs font-bold tracking-[0.2em] text-blue-500/70 mb-2 uppercase">
          {sub}
        </p>
      )}
      <h2 className={`font-black text-gray-900 tracking-tight ${size === "large" ? "text-2xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
        {children}
      </h2>
      <div className="w-12 h-1 mx-auto mt-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
    </div>
  );
}

function CtaButton({ className = "", label = "30秒で無料診断する →" }: { className?: string; label?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <a
        href="#form"
        className="shimmer inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold text-base md:text-lg rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 animate-pulse-subtle"
      >
        {label}
      </a>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-500 justify-center">
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>完全無料</span>
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>最短30秒</span>
        <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>しつこい営業なし</span>
      </div>
    </div>
  );
}

function InputField({
  label,
  type = "text",
  inputMode,
  placeholder,
  value,
  onChange,
  required,
  icon,
  suffix,
}: {
  label: string;
  type?: string;
  inputMode?: "numeric" | "tel" | "email" | "text";
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon?: React.ReactNode;
  suffix?: string;
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
      <div className={suffix ? "relative" : ""}>
        <input
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={suffix && value ? Number(value).toLocaleString() : value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900 ${suffix ? "pr-10" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
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
  mapPin: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
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
  trophy: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.023 6.023 0 01-2.77.853m0 0l-.5.5m.5-.5v.143" />
    </svg>
  ),
  lightning: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  arrowDown: (cls: string) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
};

/* ─── LP本体 ─── */

/* ─── おすすめ業者データ（後ほど実データに差し替え） ─── */
const RECOMMENDED_COMPANIES = [
  {
    id: "cashnow",
    name: "CASH NOW",
    rating: 4.5,
    features: ["最短即日", "オンライン完結", "柔軟対応"],
    color: "from-blue-500 to-blue-600",
    href: "/go/cashnow",
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
    setTimeout(() => {
      document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    RECOMMENDED_COMPANIES.map((c) => c.id)
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    form.invoice_amount &&
    form.purchase_amount &&
    form.deposit_timing &&
    form.business_type &&
    form.industry;

  const isFormValid =
    isStep1Valid &&
    form.prefecture &&
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
          invoice_amount: form.invoice_amount,
          purchase_amount: form.purchase_amount,
          deposit_timing: form.deposit_timing,
          business_type: form.business_type,
          industry: form.industry,
          company_name: form.company_name,
          contact_name: form.contact_name,
          prefecture: form.prefecture,
          address: form.address || undefined,
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

  return (
    <>
      {/* ━━━ 1. ファーストビュー ━━━ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
        {/* 装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-sky-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-32 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24">
          {/* 信頼バッジ */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-bold px-5 py-2.5 rounded-full border border-sky-200 shadow-sm">
              {icons.trophy("w-4 h-4 text-amber-500")}
              口コミ掲載数 業界最大級
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-bold px-5 py-2.5 rounded-full border border-sky-200 shadow-sm">
              {icons.shield("w-4 h-4 text-emerald-500")}
              審査済み優良業者のみ
            </span>
          </div>

          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-[1.3] text-gray-900 tracking-tight">
              手数料を<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">最大60%削減</span>
            </h1>
            <p className="text-2xl md:text-4xl font-black mb-3 leading-[1.3] tracking-tight text-gray-800">
              ファクタリング<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">無料一括診断</span>
            </p>
            <p className="text-base md:text-lg text-gray-500 mb-6 max-w-lg mx-auto leading-relaxed">
              30秒の入力で条件に合う業者を自動提案。<br className="hidden sm:block" />
              気になる会社だけ選んで見積もり依頼。
            </p>

            {/* 数字で訴求 */}
            <div className="flex items-stretch gap-3 md:gap-5 mb-8 justify-center">
              {[
                { value: "255", unit: "社+", label: "掲載業者数", color: "text-sky-600", icon: icons.building },
                { value: "98", unit: "%", label: "利用者満足度", color: "text-emerald-600", icon: icons.star },
                { value: "0", unit: "円", label: "利用料金", color: "text-amber-600", icon: icons.yen },
                { value: "30", unit: "秒", label: "カンタン入力", color: "text-orange-600", icon: icons.lightning },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/70 backdrop-blur-sm rounded-2xl border border-sky-100 shadow-sm px-4 md:px-6 py-4 text-center flex-1 max-w-[140px]">
                  <div className={`text-3xl md:text-4xl font-black ${stat.color} leading-none tracking-tighter`}>
                    {stat.value}<span className="text-lg font-bold">{stat.unit}</span>
                  </div>
                  <div className="text-[11px] font-bold text-gray-400 mt-1.5 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* メインCTA */}
            <a
              href="#form"
              className="shimmer inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 text-white font-black text-lg md:text-xl rounded-full shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="bg-white/20 text-sm rounded-full px-3 py-1 font-bold">無料</span>
              30秒でカンタン診断する
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-sm text-gray-400 justify-center font-bold">
              <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}完全無料</span>
              <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}しつこい営業なし</span>
              <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}個人事業主OK</span>
              <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}見積もりだけでもOK</span>
            </div>
          </div>
        </div>

        {/* 波型ボーダー */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" className="w-full h-8 md:h-12">
            <path d="M0 60V20C240 0 480 0 720 20C960 40 1200 40 1440 20V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ━━━ 実績バー ━━━ */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 md:gap-10 text-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                {icons.shield("w-4 h-4 text-blue-600")}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold">業界専門家</p>
                <p className="text-sm font-black text-gray-800">FP・税理士監修</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                {icons.document("w-4 h-4 text-emerald-600")}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold">口コミ掲載</p>
                <p className="text-sm font-black text-gray-800">業界最大級</p>
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                {icons.globe("w-4 h-4 text-orange-600")}
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold">対応エリア</p>
                <p className="text-sm font-black text-gray-800">全国対応</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 2. こんなお悩みありませんか？ ━━━ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading>こんなお悩みありませんか？</SectionHeading>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/5 flex justify-center">
              <Image src="/images/column/small-business.svg" width={280} height={280} alt="お悩みイメージ" className="w-48 md:w-64" />
            </div>
            <div className="md:w-3/5 space-y-3">
              {[
                { text: "どの業者を選べばいいかわからない…", sub: "ネットで調べても情報が多すぎて判断できない", icon: icons.search },
                { text: "1社ずつ問い合わせる時間がない…", sub: "忙しくて何社も電話・メールする余裕がない", icon: icons.clock },
                { text: "手数料を払いすぎていないか不安…", sub: "相場がわからず、提示された条件を鵜呑みにしている", icon: icons.yen },
                { text: "悪徳業者に騙されないか心配…", sub: "初めてのファクタリングで信頼できる業者がわからない", icon: icons.shield },
                { text: "急いで資金が必要なのに間に合うか…", sub: "支払い期日が迫っているのに現金が足りない", icon: icons.lightning },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3 bg-gradient-to-r from-red-50 to-orange-50/50 border border-red-100 rounded-xl px-4 py-3.5">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-red-100 mt-0.5">
                    {item.icon("w-4 h-4 text-red-400")}
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold text-base">{item.text}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex flex-col items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 mb-4 animate-bounce">
                {icons.arrowDown("w-5 h-5 text-white")}
              </div>
              <p className="text-2xl md:text-4xl font-black text-gray-900 leading-snug">
                そのお悩み、<br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">30秒の無料診断</span>で<br className="sm:hidden" />すべて解決
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ 2.5 自力 vs 一括 比較表 ━━━ */}
      <section className="py-10 md:py-14 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading sub="COMPARISON">自力で探す vs 一括診断</SectionHeading>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-bold text-sm w-1/3"></th>
                  <th className="py-3 px-4 text-center w-1/3">
                    <div className="bg-gray-100 rounded-xl py-3 px-2">
                      <p className="font-bold text-gray-500 text-sm">自力で探す</p>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center w-1/3">
                    <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl py-3 px-2 shadow-lg shadow-blue-500/20">
                      <p className="font-bold text-white text-sm">ファクナビ一括診断</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "かかる時間", self: "数時間〜数日", navi: "たった30秒", selfBad: true },
                  { label: "比較社数", self: "1〜2社が限界", navi: "最大5社を同時比較", selfBad: true },
                  { label: "手数料", self: "相場がわからない", navi: "最安値を自動選定", selfBad: true },
                  { label: "業者の信頼性", self: "自分で判断", navi: "審査済み優良業者のみ", selfBad: true },
                  { label: "費用", self: "無料", navi: "完全無料", selfBad: false },
                  { label: "営業電話", self: "多数の電話", navi: "自分で選んだ業者だけ", selfBad: true },
                ].map((row) => (
                  <tr key={row.label}>
                    <td className="py-3 px-4 font-bold text-gray-700 text-sm">{row.label}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-bold ${row.selfBad ? "text-red-400" : "text-gray-600"}`}>
                        {row.selfBad && "△ "}{row.self}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {row.navi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ━━━ 3. 選ばれる5つの理由 ━━━ */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
        <SectionHeading sub="WHY FACNAVI?" size="large">ファクナビが選ばれる<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">5つの理由</span></SectionHeading>
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {[
            { icon: icons.shield, color: "from-blue-500 to-blue-600", bg: "bg-blue-50", accent: "text-blue-600", num: "01", title: "厳選された優良業者のみ掲載", desc: "独自の審査基準をクリアした信頼性の高い業者だけをご紹介。悪徳業者の心配は一切ありません。" },
            { icon: icons.sparkles, color: "from-purple-500 to-purple-600", bg: "bg-purple-50", accent: "text-purple-600", num: "02", title: "提案から自分で選んで依頼", desc: "AIが条件に合う業者を自動提案。その中から気になる会社だけを自分で選んで見積もり依頼できるので、不要な営業連絡は一切ありません。" },
            { icon: icons.yen, color: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", accent: "text-emerald-600", num: "03", title: "手数料を最大60%削減", desc: "複数社の見積もりを比較することで、1社だけに依頼するより平均して手数料を大幅に削減できます。" },
            { icon: icons.lightning, color: "from-orange-400 to-orange-500", bg: "bg-orange-50", accent: "text-orange-600", num: "04", title: "最短即日で資金調達可能", desc: "急ぎの資金需要にも対応。最短即日入金の業者も多数掲載しているので、スピーディーに資金調達できます。" },
            { icon: icons.users, color: "from-teal-500 to-teal-600", bg: "bg-teal-50", accent: "text-teal-600", num: "05", title: "個人事業主・フリーランスもOK", desc: "法人だけでなく、個人事業主やフリーランスの方にも対応した業者を多数掲載。少額からでもOKです。" },
          ].map((item, i) => (
            <div key={i} className={`relative p-6 ${item.bg} rounded-2xl hover:shadow-md transition-all duration-300 group ${i === 4 ? "md:col-span-2 md:max-w-md md:mx-auto" : ""}`}>
              <span className={`absolute top-4 right-4 text-3xl font-black ${item.accent} opacity-15`}>{item.num}</span>
              <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                {item.icon("w-6 h-6 text-white")}
              </div>
              <h3 className="font-black text-gray-900 text-xl mb-2">{item.title}</h3>
              <p className="text-gray-500 text-base leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ━━━ 中間CTA ━━━ */}
      <section className="py-10 bg-gradient-to-r from-blue-600 to-emerald-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-white/80 text-base font-bold mb-2">比較するだけで手数料が下がる</p>
          <p className="text-white text-3xl md:text-4xl font-black mb-6">まずは30秒の無料診断から</p>
          <a
            href="#form"
            className="shimmer inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-blue-600 font-black text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            無料で一括診断する →
          </a>
          <p className="text-white/60 text-xs mt-3 font-bold">※ 利用料・手数料は一切かかりません</p>
        </div>
      </section>

      {/* ━━━ 4. 手数料シミュレーション ━━━ */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeading sub="SIMULATION">一括比較で手数料がこれだけ変わる</SectionHeading>
          <div className="space-y-4">
            {[
              { industry: "建設業 A社", amount: "売掛金 500万円", before: "75万円（15%）", after: "25万円（5%）", saving: "50万円の削減", percent: "66" },
              { industry: "運送業 B社", amount: "売掛金 300万円", before: "36万円（12%）", after: "18万円（6%）", saving: "18万円の削減", percent: "50" },
              { industry: "IT企業 C社", amount: "売掛金 1,000万円", before: "100万円（10%）", after: "30万円（3%）", saving: "70万円の削減", percent: "70" },
            ].map((example) => (
              <div key={example.industry} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-2xl p-5 md:p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">{example.industry}</span>
                  <span className="text-sm text-gray-500 font-bold">{example.amount}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-400 font-bold mb-1">1社のみ</p>
                    <p className="text-xl md:text-2xl font-black text-red-400 line-through decoration-2">{example.before}</p>
                  </div>
                  <div className="shrink-0">
                    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-xs text-gray-400 font-bold mb-1">一括比較後</p>
                    <p className="text-xl md:text-2xl font-black text-blue-600">{example.after}</p>
                  </div>
                  <div className="shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs md:text-sm font-black px-3 py-2 rounded-xl shadow-md">
                    {example.saving}
                    <span className="block text-[10px] font-bold text-emerald-200">({example.percent}%削減)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">※ 実際の手数料は審査内容により異なります。上記は一例です。</p>
        </div>
      </section>

      {/* ━━━ 5. ご利用の流れ ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <SectionHeading sub="FLOW">ご利用の流れ</SectionHeading>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="hidden md:flex md:w-1/3 justify-center pt-8">
              <Image src="/images/column/factoring-flow.svg" width={240} height={240} alt="ご利用の流れ" className="w-52" />
            </div>
            <div className="md:w-2/3 space-y-4">
              {[
                { step: "STEP 1", title: "30秒カンタン入力", desc: "希望金額や業種などを選択するだけ。面倒な入力は不要です。", color: "from-blue-500 to-blue-600" },
                { step: "STEP 2", title: "おすすめ業者が自動で表示", desc: "あなたの条件に合う優良業者がリストで表示されます。各社の特徴や手数料も確認できます。", color: "from-purple-500 to-purple-600" },
                { step: "STEP 3", title: "自分で選んで見積もり依頼", desc: "提案された中から、依頼したい会社だけを自分でチェック。選ばなかった会社から連絡が来ることはありません。", color: "from-emerald-500 to-emerald-600" },
                { step: "STEP 4", title: "比較して最安値で契約", desc: "届いた見積もりを比較し、最も条件の良い1社と契約。これだけで手数料が大幅に下がります。", color: "from-orange-400 to-orange-500" },
              ].map((item, i) => (
                <div key={item.step} className="flex items-start gap-4 relative">
                  {i < 3 && <div className="absolute left-[18px] top-10 bottom-0 w-0.5 bg-gray-200 -mb-4" style={{ height: "calc(100% + 16px)" }} />}
                  <div className={`relative z-10 w-9 h-9 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center shrink-0 shadow-md text-white text-xs font-black`}>
                    {i + 1}
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1">
                    <p className="text-xs font-bold text-blue-600 mb-0.5">{item.step}</p>
                    <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
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
              detail: "年商2億円・従業員15名",
              text: "元請けからの入金が90日後で資金繰りに困っていました。一括見積もりで3社から提案をもらい、最も手数料が低い業者を選べました。1社だけに聞いていたら15%だったところが5%に。",
              result: "手数料5%・翌日入金",
              saving: "年間約120万円の削減",
              stars: 5,
            },
            {
              industry: "運送業",
              name: "B社 経理担当",
              detail: "年商5,000万円・従業員8名",
              text: "燃料費の高騰で急な資金が必要に。1社ずつ問い合わせる時間がなかったので一括見積もりを利用。比較できたおかげで納得のいく条件で即日契約できました。",
              result: "手数料6%・即日入金",
              saving: "1日で300万円を調達",
              stars: 5,
            },
            {
              industry: "IT・Web",
              name: "C社 フリーランス",
              detail: "年商800万円",
              text: "個人事業主でも対応してもらえるか不安でしたが、しっかり対応してくれる業者が3社見つかりました。オンラインで完結できたのも大きなメリットでした。",
              result: "手数料8%・2日で入金",
              saving: "初めてでも安心して利用",
              stars: 5,
            },
          ].map((voice) => (
            <div key={voice.name} className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute -top-3 -left-1">
                {icons.quote("w-10 h-10 text-blue-100")}
              </div>

              <div className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full shadow-sm">
                    {icons.building("w-3 h-3 text-blue-200")}
                    {voice.industry}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-500 font-bold">{voice.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{voice.detail}</span>
                </div>

                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      {icons.star(`w-4 h-4 ${i < voice.stars ? "text-amber-400" : "text-gray-200"}`)}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-base leading-relaxed mb-4">{voice.text}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl px-4 py-2.5 border border-emerald-100">
                    {icons.check("w-4 h-4 text-emerald-500 shrink-0")}
                    <p className="text-sm font-bold text-emerald-700">{voice.result}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl px-4 py-2 border border-blue-100">
                    {icons.sparkles("w-3.5 h-3.5 text-blue-500 shrink-0")}
                    <p className="text-xs font-bold text-blue-700">{voice.saving}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ━━━ 安心保証バー ━━━ */}
      <section className="py-8 bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 border-y border-blue-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {[
              { icon: icons.shield, text: "審査済み優良業者のみ", sub: "悪徳業者は一切掲載しません", color: "text-blue-600", bg: "bg-blue-100" },
              { icon: icons.users, text: "しつこい営業電話なし", sub: "選んだ業者からのみ連絡", color: "text-emerald-600", bg: "bg-emerald-100" },
              { icon: icons.document, text: "個人情報は厳重管理", sub: "SSL暗号化で安全に保護", color: "text-indigo-600", bg: "bg-indigo-100" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  {item.icon(`w-5 h-5 ${item.color}`)}
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-base">{item.text}</p>
                  <p className="text-gray-500 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ 7. よくある質問 ━━━ */}
      <section className="py-10 md:py-14 bg-slate-50">
        <SectionHeading sub="FAQ">よくある質問</SectionHeading>
        <div className="space-y-2 max-w-2xl mx-auto px-4">
          {[
            { q: "一括見積もりに費用はかかりますか？", a: "いいえ、完全無料でご利用いただけます。利用者に手数料やサービス利用料が発生することは一切ありません。ファクタリング会社から紹介料を頂いているため、利用者様は無料でご利用いただけます。" },
            { q: "しつこい営業電話がかかってきませんか？", a: "いいえ、ご安心ください。提案された業者の中から、お客様が自分で選んだ会社からのみ連絡が届きます。選ばなかった業者から連絡が来ることは一切ありません。どの業者に依頼するかは、すべてお客様自身で決められます。" },
            { q: "個人事業主でも申し込めますか？", a: "はい、個人事業主・フリーランスの方でもお申し込みいただけます。少額（10万円〜）から対応可能な業者もご紹介しています。" },
            { q: "見積もり後、必ず契約しなければなりませんか？", a: "いいえ、見積もりだけの利用でも全く問題ありません。条件が合わなければお断りいただいて構いません。比較検討のためだけのご利用も大歓迎です。" },
            { q: "どのくらいで連絡がもらえますか？", a: "通常、お申し込みから1営業日以内に選択された業者からご連絡差し上げます。お急ぎの場合は即日対応も可能です。" },
            { q: "個人情報は安全に管理されますか？", a: "はい、お預かりした個人情報はSSL暗号化通信で保護し、厳重に管理しています。見積もり目的以外には一切使用いたしません。" },
          ].map((item, i) => (
            <div key={item.q} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <button
                className="flex items-center justify-between w-full cursor-pointer p-4 font-bold text-base text-gray-900 hover:bg-blue-50/50 transition-colors text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 text-white text-[10px] font-bold rounded-lg shrink-0 shadow-sm">Q</span>
                  <span>{item.q}</span>
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-3 ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 text-gray-600 text-base leading-relaxed border-t border-gray-100 pt-3">
                  <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-orange-400 to-orange-500 text-white text-[10px] font-bold rounded-lg mr-2 align-middle shadow-sm">A</span>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ━━━ 8. フォーム ━━━ */}
      <section id="form" className="py-10 md:py-14 bg-white scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-2xl px-6 py-10 md:py-12 text-center overflow-hidden border border-sky-100">
            {/* 装飾 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-sky-200/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-200/30 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white text-blue-600 text-sm font-bold px-5 py-2 rounded-full border border-sky-200 shadow-sm mb-5">
                {icons.sparkles("w-4 h-4 text-sky-500")}
                完全無料・最短30秒
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">30秒</span>で無料診断
              </h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-5 text-sm text-gray-500 justify-center font-bold">
                <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}しつこい営業なし</span>
                <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}見積もりだけでもOK</span>
                <span className="inline-flex items-center gap-1">{icons.check("w-4 h-4 text-emerald-500")}個人事業主OK</span>
              </div>
            </div>
          </div>
        </div>

        {process.env.NEXT_PUBLIC_MITSUMORI_ENABLED !== "true" ? (
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-5 px-4">
              <p className="font-bold text-lg">無料一括診断サービス</p>
              <p className="text-blue-200 text-sm mt-0.5">まもなく開始</p>
            </div>
            <div className="p-8 md:p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-5">
                {icons.clock("w-8 h-8 text-blue-600")}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2026年4月 サービス開始予定</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                現在、一括診断サービスの準備を進めております。<br />
                サービス開始までもうしばらくお待ちください。
              </p>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-bold rounded-full px-5 py-2.5 border border-blue-100">
                {icons.check("w-4 h-4 text-blue-500")}
                完全無料で利用可能
              </div>
            </div>
          </div>
        </div>
        ) : formStep <= 2 ? (
        <form onSubmit={(e) => e.preventDefault()} className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-5 px-4">
              <p className="font-bold text-lg">
                {formStep === 1 ? "STEP 1：カンタン条件入力" : "STEP 2：お客様情報を入力"}
              </p>
              <p className="text-blue-200 text-sm mt-0.5">完全無料・しつこい営業なし</p>
              <div className="flex justify-center gap-2 mt-3">
                <div className={`h-1.5 w-16 rounded-full transition-colors ${formStep >= 1 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className={`h-1.5 w-16 rounded-full transition-colors ${formStep >= 2 ? "bg-orange-400" : "bg-white/20"}`} />
                <div className="h-1.5 w-16 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-5">
              {formStep === 1 ? (
                <>
                  {/* 入力人数 */}
                  <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                    <div className="flex -space-x-1.5">
                      {["bg-blue-400", "bg-emerald-400", "bg-orange-400"].map((c, i) => (
                        <div key={i} className={`w-6 h-6 ${c} rounded-full border-2 border-white flex items-center justify-center`}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-orange-700">
                      本日 <span className="text-orange-500 text-sm font-black">12名</span> が診断を利用しました
                    </p>
                  </div>

                  <InputField
                    label="請求書の額面（およそでOK）"
                    type="text"
                    inputMode="numeric"
                    placeholder="例：5,000,000"
                    value={form.invoice_amount}
                    onChange={(v) => updateField("invoice_amount", v.replace(/[^0-9]/g, ""))}
                    required
                    icon={icons.document("w-4 h-4")}
                    suffix="円"
                  />
                  <InputField
                    label="買取希望金額"
                    type="text"
                    inputMode="numeric"
                    placeholder="例：3,000,000"
                    value={form.purchase_amount}
                    onChange={(v) => updateField("purchase_amount", v.replace(/[^0-9]/g, ""))}
                    required
                    icon={icons.yen("w-4 h-4")}
                    suffix="円"
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
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="bg-white/20 text-sm rounded-full px-2.5 py-0.5 font-bold">1/3</span>
                    診断結果を見る
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>
                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ 完全無料・営業電話なし・見積もりだけでもOK
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100/30 rounded-xl p-4 text-sm text-blue-800 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      {icons.check("w-4 h-4 text-blue-500")}
                      <p className="font-bold">入力条件</p>
                    </div>
                    <p className="text-blue-600 text-xs ml-6">買取: {form.purchase_amount ? Number(form.purchase_amount).toLocaleString() + "円" : ""} / {form.deposit_timing} / {form.business_type} / {form.industry}</p>
                    <button type="button" onClick={() => setFormStep(1)} className="text-blue-500 hover:text-blue-700 hover:underline font-bold text-xs mt-1.5 ml-6 transition-colors">条件を変更する</button>
                  </div>

                  <SelectField
                    label="都道府県"
                    options={PREFECTURES}
                    value={form.prefecture}
                    onChange={(v) => updateField("prefecture", v)}
                    placeholder="都道府県を選択"
                    required
                    icon={icons.mapPin("w-4 h-4")}
                  />
                  <InputField
                    label="住所"
                    placeholder="例：渋谷区神宮前1-2-3"
                    value={form.address}
                    onChange={(v) => updateField("address", v)}
                    icon={icons.mapPin("w-4 h-4")}
                  />
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
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="bg-white/20 text-sm rounded-full px-2.5 py-0.5 font-bold">2/3</span>
                    おすすめ業者を見る
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </button>

                  <p className="text-xs text-gray-400 text-center leading-relaxed">
                    ※ 選んだ業者からのみ連絡が届きます
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
        ) : (
        /* ━━━ STEP 3：業者を選んで送信（3/3） ━━━ */
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
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

                  <p className="text-xs text-gray-500 mt-3 text-center">※ 同じ業者への見積もり依頼は6ヶ月以内に1回のみ有効です。別の業者への依頼は何度でも可能です。</p>

                  <button
                    type="button"
                    disabled={selectedCompanies.length === 0 || status === "submitting"}
                    onClick={handleSubmit}
                    className="w-full mt-5 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
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
            <div className="hidden sm:block">
              <p className="text-sm font-black text-gray-800">手数料を最大60%削減</p>
              <p className="text-[10px] text-gray-400 font-bold">完全無料・しつこい営業なし</p>
            </div>
            <a
              href="#form"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all duration-200 text-sm sm:text-base w-full sm:w-auto text-center"
            >
              30秒で無料診断する
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
