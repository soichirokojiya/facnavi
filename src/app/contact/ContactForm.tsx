"use client";

import { useState } from "react";
import Link from "next/link";

const INQUIRY_TYPES = [
  "サイトに関するご質問",
  "掲載のご依頼・ご相談",
  "口コミに関するお問い合わせ",
  "広告・メディア連携のご相談",
  "不具合・誤りのご報告",
  "その他",
] as const;

interface ContactFormData {
  inquiry_type: string;
  company_name: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  agreed: boolean;
}

const initialForm: ContactFormData = {
  inquiry_type: "",
  company_name: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  agreed: false,
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const isValid = form.inquiry_type && form.name && form.email && form.message && form.agreed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inquiry_type: form.inquiry_type,
          company_name: form.company_name || undefined,
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          message: form.message,
        }),
      });

      if (!res.ok) {
        console.warn("Contact API error:", await res.json());
      }
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn("Contact submit error:", err);
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">送信が完了しました</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          お問い合わせいただきありがとうございます。<br />
          通常2営業日以内にメールにてご返信いたします。
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          トップページに戻る
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-5">
      {/* お問い合わせ種別 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          お問い合わせ種別
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        </label>
        <select
          value={form.inquiry_type}
          onChange={(e) => setForm({ ...form, inquiry_type: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]"
        >
          <option value="">選択してください</option>
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* 会社名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          会社名（屋号）
          <span className="text-[10px] font-bold text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">任意</span>
        </label>
        <input
          type="text"
          placeholder="例：株式会社ファクナビ"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900"
        />
      </div>

      {/* お名前 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          お名前
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        </label>
        <input
          type="text"
          placeholder="例：山田 太郎"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900"
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          メールアドレス
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        </label>
        <input
          type="email"
          placeholder="例：info@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900"
        />
      </div>

      {/* 電話番号 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          電話番号
          <span className="text-[10px] font-bold text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">任意</span>
        </label>
        <input
          type="tel"
          placeholder="例：03-1234-5678"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white text-gray-900"
        />
      </div>

      {/* お問い合わせ内容 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-1.5">
          お問い合わせ内容
          <span className="text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
        </label>
        <textarea
          placeholder="お問い合わせ内容をご記入ください"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none bg-white text-gray-900"
        />
      </div>

      {/* プライバシーポリシー同意 */}
      <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <input
          type="checkbox"
          id="contact-privacy-agree"
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="mt-0.5 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
        />
        <label htmlFor="contact-privacy-agree" className="text-sm text-gray-700">
          <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline font-bold">
            プライバシーポリシー
          </Link>
          に同意する
        </label>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={!isValid || status === "submitting"}
        className="w-full py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-base rounded-full shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
      >
        {status === "submitting" ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            送信中...
          </>
        ) : (
          "お問い合わせを送信する"
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        ※ ファクタリングに関する個別のご相談は、
        <Link href="/mitsumori" className="text-blue-500 hover:underline">一括見積もり</Link>
        をご利用ください。
      </p>
    </form>
  );
}
