"use client";

import { useEffect, useState } from "react";

const DEFAULT_BILLING_SUBJECT =
  "【ファクナビ】{YYYY}年{MM}月分 リード送客フィーのご案内";

const DEFAULT_BILLING_BODY = `{会社名} 御中

いつもファクナビをご利用いただき、誠にありがとうございます。

{MM}月分のリード送客フィーが確定しましたのでご案内いたします。

━━━━━━━━━━━━━━━━━━━━━━━━
■ 請求内容
━━━━━━━━━━━━━━━━━━━━━━━━
対象期間: {YYYY}年{MM}月1日〜{MM}月{lastDay}日
総リード数: {total}件
取り下げ承認: {removed}件
フィー対象リード数: {billable}件
単価: {fee_per_lead}円（税抜）
━━━━━━━━━━━━━━━━━━━━━━━━
小計: {subtotal}円
消費税（{tax_rate}%）: {tax_amount}円
ご請求金額: {amount}円（税込）
━━━━━━━━━━━━━━━━━━━━━━━━

詳細はパートナーダッシュボードよりご確認いただけます。
{siteUrl}/partner

ご不明な点がございましたら、お気軽にお問い合わせください。

──────────────────
ファクナビ運営事務局
{adminEmail}
──────────────────`;

const PLACEHOLDERS = [
  { key: "{YYYY}", desc: "対象年" },
  { key: "{MM}", desc: "対象月（01〜12）" },
  { key: "{lastDay}", desc: "対象月の末日" },
  { key: "{会社名}", desc: "パートナー会社名" },
  { key: "{total}", desc: "総リード数" },
  { key: "{removed}", desc: "取り下げ承認数" },
  { key: "{billable}", desc: "フィー対象リード数" },
  { key: "{fee_per_lead}", desc: "単価（税抜）" },
  { key: "{subtotal}", desc: "小計（税抜）" },
  { key: "{tax_rate}", desc: "消費税率（%）" },
  { key: "{tax_amount}", desc: "消費税額" },
  { key: "{amount}", desc: "請求金額（税込）" },
  { key: "{siteUrl}", desc: "サイトURL" },
  { key: "{adminEmail}", desc: "管理者メール" },
];

export default function AdminSettingsPage() {
  const [taxRate, setTaxRate] = useState("10");
  const [billingSubject, setBillingSubject] = useState(DEFAULT_BILLING_SUBJECT);
  const [billingBody, setBillingBody] = useState(DEFAULT_BILLING_BODY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.data) {
          setTaxRate(json.data.tax_rate || "10");
          if (json.data.billing_email_subject) {
            setBillingSubject(json.data.billing_email_subject);
          }
          if (json.data.billing_email_body) {
            setBillingBody(json.data.billing_email_body);
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tax_rate: taxRate,
          billing_email_subject: billingSubject,
          billing_email_body: billingBody,
        }),
      });

      if (res.ok) {
        setMessage("保存しました。");
      } else {
        setMessage("保存に失敗しました。");
      }
    } catch {
      setMessage("通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setBillingSubject(DEFAULT_BILLING_SUBJECT);
    setBillingBody(DEFAULT_BILLING_BODY);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">サイト設定</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 消費税率 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">請求設定</h2>
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              消費税率（%）
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              min="0"
              max="100"
              step="1"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              請求メールの消費税計算に使用されます。
            </p>
          </div>
        </div>

        {/* 請求メールテンプレート */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">請求メール文面</h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              デフォルトに戻す
            </button>
          </div>

          {/* プレースホルダー一覧 */}
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-600 mb-2">利用可能なプレースホルダー:</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {PLACEHOLDERS.map((p) => (
                <span key={p.key} className="text-xs text-gray-500">
                  <code className="bg-white px-1 py-0.5 rounded border border-gray-200 text-gray-700">{p.key}</code>
                  {" "}{p.desc}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                件名
              </label>
              <input
                type="text"
                value={billingSubject}
                onChange={(e) => setBillingSubject(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                本文
              </label>
              <textarea
                value={billingBody}
                onChange={(e) => setBillingBody(e.target.value)}
                rows={24}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>

        {message && (
          <p className={`text-sm font-medium ${message.includes("失敗") || message.includes("エラー") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存する"}
        </button>
      </form>
    </div>
  );
}
