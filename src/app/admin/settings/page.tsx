"use client";

import { useEffect, useState } from "react";

const DEFAULT_BILLING_SUBJECT =
  "【ファクナビ】{YYYY}年{MM}月分 リード送客フィーのご案内";

const DEFAULT_BILLING_BODY = `{会社名} 御中

いつもファクナビをご利用いただき、誠にありがとうございます。

{YYYY}年{MM}月分のリード送客フィーが確定しましたのでご案内いたします。

━━━━━━━━━━━━━━━━━━━━━━━━
■ 請求内容
━━━━━━━━━━━━━━━━━━━━━━━━
対象期間: {YYYY}年{MM}月1日〜{MM}月{lastDay}日
総リード数: {total}件
取下確定: {removed}件
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
  { key: "{removed}", desc: "取下確定数" },
  { key: "{billable}", desc: "フィー対象リード数" },
  { key: "{fee_per_lead}", desc: "単価（税抜）" },
  { key: "{subtotal}", desc: "小計（税抜）" },
  { key: "{tax_rate}", desc: "消費税率（%）" },
  { key: "{tax_amount}", desc: "消費税額" },
  { key: "{amount}", desc: "請求金額（税込）" },
  { key: "{siteUrl}", desc: "サイトURL" },
  { key: "{adminEmail}", desc: "管理者メール" },
];

function getRecentMonths(count: number): { value: string; label: string }[] {
  const months = [];
  const now = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    months.push({ value, label });
  }
  return months;
}

export default function AdminSettingsPage() {
  const [spamCheckEnabled, setSpamCheckEnabled] = useState(true);
  const [duplicateCheckEnabled, setDuplicateCheckEnabled] = useState(true);
  const [duplicateCheckMonths, setDuplicateCheckMonths] = useState("6");
  const [taxRate, setTaxRate] = useState("10");
  const [billingSubject, setBillingSubject] = useState(DEFAULT_BILLING_SUBJECT);
  const [billingBody, setBillingBody] = useState(DEFAULT_BILLING_BODY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  // 請求元情報
  const [billingCompanyName, setBillingCompanyName] = useState("Common Future & Co.株式会社");
  const [billingCompanyAddress, setBillingCompanyAddress] = useState(
    "〒810-0001 福岡県福岡市中央区天神4-6-28 いちご天神ノースビル7階"
  );
  const [billingInvoiceNumber, setBillingInvoiceNumber] = useState("T9011001105902");
  const [billingBankInfo, setBillingBankInfo] = useState(
    "楽天銀行 第二営業支店（252）\n普通 7671151\nCommon Future & Co.株式会社"
  );
  const [billingNotes, setBillingNotes] = useState(
    "振込手数料はお客様ご負担にてお願いいたします"
  );

  // 手動再送
  const [resendMonth, setResendMonth] = useState("");
  const [testEmail, setTestEmail] = useState("admin@facnavi.info");
  const [resending, setResending] = useState(false);
  const [resendResult, setResendResult] = useState("");
  const [resendError, setResendError] = useState("");

  const recentMonths = getRecentMonths(12);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.data) {
          setSpamCheckEnabled(json.data.spam_check_enabled !== "false");
          setDuplicateCheckEnabled(json.data.duplicate_check_enabled !== "false");
          setDuplicateCheckMonths(json.data.duplicate_check_months || "6");
          setTaxRate(json.data.tax_rate || "10");
          if (json.data.billing_email_subject) {
            setBillingSubject(json.data.billing_email_subject);
          }
          if (json.data.billing_email_body) {
            setBillingBody(json.data.billing_email_body);
          }
          if (json.data.billing_company_name) {
            setBillingCompanyName(json.data.billing_company_name);
          }
          if (json.data.billing_company_address) {
            setBillingCompanyAddress(json.data.billing_company_address);
          }
          if (json.data.billing_invoice_number) {
            setBillingInvoiceNumber(json.data.billing_invoice_number);
          }
          if (json.data.billing_bank_info) {
            setBillingBankInfo(json.data.billing_bank_info);
          }
          if (json.data.billing_notes) {
            setBillingNotes(json.data.billing_notes);
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
          spam_check_enabled: String(spamCheckEnabled),
          duplicate_check_enabled: String(duplicateCheckEnabled),
          duplicate_check_months: duplicateCheckMonths,
          tax_rate: taxRate,
          billing_email_subject: billingSubject,
          billing_email_body: billingBody,
          billing_company_name: billingCompanyName,
          billing_company_address: billingCompanyAddress,
          billing_invoice_number: billingInvoiceNumber,
          billing_bank_info: billingBankInfo,
          billing_notes: billingNotes,
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

  const handleResend = async () => {
    if (!resendMonth) return;

    if (!testEmail || !testEmail.trim()) {
      setResendError("送信先メールアドレスを入力してください。");
      return;
    }

    if (!confirm(`${resendMonth} の請求書メールを ${testEmail} にテスト送信しますか？`)) {
      return;
    }

    setResending(true);
    setResendResult("");
    setResendError("");

    try {
      const res = await fetch("/api/cron/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: resendMonth,
          testEmail: testEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setResendError(data.error || "送信に失敗しました。");
        return;
      }

      setResendResult(
        `送信完了: ${data.sent}件成功、${data.failed}件失敗`
      );
    } catch {
      setResendError("通信エラーが発生しました。");
    } finally {
      setResending(false);
    }
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
        {/* 見積もり自動無効化 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">見積もり自動無効化</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={spamCheckEnabled}
                onChange={(e) => setSpamCheckEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">AIスパム判定を有効にする</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={duplicateCheckEnabled}
                onChange={(e) => setDuplicateCheckEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">重複チェックを有効にする</span>
            </label>

            <div className="ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対象期間（月）
              </label>
              <input
                type="number"
                value={duplicateCheckMonths}
                onChange={(e) => setDuplicateCheckMonths(e.target.value)}
                min="1"
                max="120"
                step="1"
                disabled={!duplicateCheckEnabled}
                className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none disabled:opacity-50 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                同じメールアドレスまたは電話番号で、同じ業者に対して指定期間内に送信されたリードを自動で無効にします
              </p>
            </div>
          </div>
        </div>

        {/* 請求設定 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">請求設定</h2>
          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                発行元 商号
              </label>
              <input
                type="text"
                value={billingCompanyName}
                onChange={(e) => setBillingCompanyName(e.target.value)}
                className="w-full max-w-lg px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                発行元 住所
              </label>
              <input
                type="text"
                value={billingCompanyAddress}
                onChange={(e) => setBillingCompanyAddress(e.target.value)}
                className="w-full max-w-lg px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                適格請求書発行事業者登録番号
              </label>
              <input
                type="text"
                value={billingInvoiceNumber}
                onChange={(e) => setBillingInvoiceNumber(e.target.value)}
                className="w-full max-w-sm px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                振込先情報
              </label>
              <textarea
                value={billingBankInfo}
                onChange={(e) => setBillingBankInfo(e.target.value)}
                rows={3}
                className="w-full max-w-lg px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                備考
              </label>
              <input
                type="text"
                value={billingNotes}
                onChange={(e) => setBillingNotes(e.target.value)}
                className="w-full max-w-lg px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
              />
            </div>
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

      {/* 請求書メール送信 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">請求書メール送信</h2>
        <div className="space-y-4">
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              対象月
            </label>
            <select
              value={resendMonth}
              onChange={(e) => setResendMonth(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
            >
              <option value="">選択してください</option>
              {recentMonths.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              送信先メールアドレス
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="admin@facnavi.info"
              required
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              全パートナーの請求書をこのアドレスにテスト送信します（ログは記録されません、件名に【テスト】が付きます）。
            </p>
          </div>

          {resendResult && (
            <p className="text-sm text-green-600 font-medium">{resendResult}</p>
          )}
          {resendError && (
            <p className="text-sm text-red-600 font-medium">{resendError}</p>
          )}

          <button
            type="button"
            disabled={resending || !resendMonth}
            onClick={handleResend}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {resending ? "送信中..." : "テスト送信"}
          </button>
        </div>
      </div>

      {/* パスワード変更 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">パスワード変更</h2>
        <div className="max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在のパスワード
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              新しいパスワード（8文字以上）
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
            />
          </div>
          {pwMessage && <p className="text-sm text-green-600 font-medium">{pwMessage}</p>}
          {pwError && <p className="text-sm text-red-600 font-medium">{pwError}</p>}
          <button
            type="button"
            disabled={pwChanging || !currentPassword || !newPassword}
            onClick={async () => {
              setPwMessage("");
              setPwError("");
              if (newPassword.length < 8) {
                setPwError("新しいパスワードは8文字以上で設定してください。");
                return;
              }
              setPwChanging(true);
              try {
                const res = await fetch("/api/admin/settings", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    _change_password: true,
                    current_password: currentPassword,
                    new_password: newPassword,
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setPwError(data.error || "パスワードの変更に失敗しました。");
                  return;
                }
                setPwMessage("パスワードを変更しました。");
                setCurrentPassword("");
                setNewPassword("");
              } catch {
                setPwError("通信エラーが発生しました。");
              } finally {
                setPwChanging(false);
              }
            }}
            className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {pwChanging ? "変更中..." : "パスワードを変更"}
          </button>
        </div>
      </div>
    </div>
  );
}
