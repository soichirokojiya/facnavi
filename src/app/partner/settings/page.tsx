"use client";

import { useEffect, useState } from "react";
import { INDUSTRIES, PREFECTURES } from "@/lib/constants";

const DEPOSIT_TIMING_OPTIONS = ["即日", "3日以内", "1週間以内", "1ヶ月以内", "急ぎではない"];

interface ProfileData {
  id: string;
  name: string;
  login_id: string;
  email: string | null;
  supported_prefectures: string[];
  min_amount: number;
  max_amount: number;
  supported_industries: string[];
  supported_deposit_timing: string[];
  fee_per_lead: number;
  sole_proprietor_ok: boolean;
  is_active: boolean;
  company_slug: string | null;
}

export default function PartnerSettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [minAmount, setMinAmount] = useState("10000");
  const [maxAmount, setMaxAmount] = useState("999999999");
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [supportedIndustries, setSupportedIndustries] = useState<string[]>([]);
  const [supportedDepositTiming, setSupportedDepositTiming] = useState<string[]>([]);
  const [soleProprietorOk, setSoleProprietorOk] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/partner/profile");
        const json = await res.json();
        if (json.data) {
          const d = json.data as ProfileData;
          setProfile(d);
          setName(d.name);
          setEmail(d.email || "");
          setMinAmount(String(d.min_amount || 10000));
          setMaxAmount(String(d.max_amount || 999999999));
          setSelectedPrefectures(d.supported_prefectures?.length ? d.supported_prefectures : [...PREFECTURES]);
          setSupportedIndustries(d.supported_industries?.length ? d.supported_industries : [...INDUSTRIES] as string[]);
          setSupportedDepositTiming(d.supported_deposit_timing?.length ? d.supported_deposit_timing : [...DEPOSIT_TIMING_OPTIONS]);
          setSoleProprietorOk(d.sole_proprietor_ok ?? true);
          setIsActive(d.is_active ?? true);
        }
      } catch {
        setFormError("プロフィールの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setFormError("");
    setSaving(true);

    try {
      const res = await fetch("/api/partner/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || null,
          min_amount: parseInt(minAmount) || 0,
          max_amount: parseInt(maxAmount) || 999999999,
          supported_prefectures: selectedPrefectures,
          supported_industries: supportedIndustries,
          supported_deposit_timing: supportedDepositTiming,
          sole_proprietor_ok: soleProprietorOk,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "保存に失敗しました。");
        return;
      }
      setMessage("設定を保存しました。");
      setEditing(false);
    } catch {
      setFormError("通信エラーが発生しました。");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwMessage("");
    setPwError("");

    if (newPassword.length < 8) {
      setPwError("新しいパスワードは8文字以上で設定してください。");
      return;
    }

    setPwChanging(true);
    try {
      const res = await fetch("/api/partner/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
  };

  const togglePrefecture = (pref: string) => {
    setSelectedPrefectures((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const toggleIndustry = (ind: string) => {
    setSupportedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">設定</h1>

      {/* プロフィール設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-lg font-bold text-gray-900">基本設定</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors"
            >
              編集する
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                業者名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className={`w-full px-3 py-2 border-2 rounded-lg outline-none ${editing ? "border-gray-200 focus:ring-3 focus:ring-primary/10 focus:border-primary" : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
                className={`w-full px-3 py-2 border-2 rounded-lg outline-none ${editing ? "border-gray-200 focus:ring-3 focus:ring-primary/10 focus:border-primary" : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"}`}
                placeholder="example@company.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ログインID
              </label>
              <input
                type="text"
                value={profile?.login_id || ""}
                className="w-full px-3 py-2 border-2 border-gray-100 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">変更は管理者にお問い合わせください。</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                リード単価（税抜・円/件）
              </label>
              <input
                type="text"
                value={profile?.fee_per_lead != null ? `${profile.fee_per_lead}円` : "-"}
                className="w-full px-3 py-2 border-2 border-gray-100 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">変更は管理者にお問い合わせください。</p>
            </div>
          </div>

          {/* パスワード変更 */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">パスワード変更</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  minLength={8}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={pwChanging || !currentPassword || !newPassword}
                className="text-sm text-primary hover:underline disabled:opacity-40 disabled:no-underline"
              >
                {pwChanging ? "変更中..." : "変更"}
              </button>
              {pwMessage && <span className="text-sm text-green-600">{pwMessage}</span>}
              {pwError && <span className="text-sm text-red-600">{pwError}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応最小金額（円）
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={minAmount ? Number(minAmount).toLocaleString() : ""}
                onChange={(e) => setMinAmount(e.target.value.replace(/[^0-9]/g, ""))}
                disabled={!editing}
                className={`w-full px-3 py-2 border-2 rounded-lg outline-none ${editing ? "border-gray-200 focus:ring-3 focus:ring-primary/10 focus:border-primary" : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応最大金額（円）
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={maxAmount ? Number(maxAmount).toLocaleString() : ""}
                onChange={(e) => setMaxAmount(e.target.value.replace(/[^0-9]/g, ""))}
                disabled={!editing}
                className={`w-full px-3 py-2 border-2 rounded-lg outline-none ${editing ? "border-gray-200 focus:ring-3 focus:ring-primary/10 focus:border-primary" : "border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed"}`}
              />
            </div>
          </div>

          {/* 対応都道府県 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              対応都道府県（全選択＝全国対応）
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {PREFECTURES.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => editing && togglePrefecture(pref)}
                  disabled={!editing}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    selectedPrefectures.includes(pref)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {pref}
                </button>
              ))}
            </div>
            {editing && (
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setSelectedPrefectures([...PREFECTURES])}
                className="text-xs text-primary hover:underline"
              >
                全選択
              </button>
              <button
                type="button"
                onClick={() => setSelectedPrefectures([])}
                className="text-xs text-gray-500 hover:underline"
              >
                クリア
              </button>
              {selectedPrefectures.length > 0 && (
                <span className="text-xs text-gray-500">
                  {selectedPrefectures.length === PREFECTURES.length
                    ? "全国対応"
                    : `${selectedPrefectures.length}件選択中`}
                </span>
              )}
            </div>
            )}
          </div>

          {/* 対応業種 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              対応業種（全選択＝全業種対応）
            </label>
            <div className="flex flex-wrap gap-1.5 border border-gray-200 rounded-lg p-2">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => editing && toggleIndustry(ind)}
                  disabled={!editing}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    supportedIndustries.includes(ind)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {ind}
                </button>
              ))}
            </div>
            {editing && (
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setSupportedIndustries([...INDUSTRIES] as string[])}
                className="text-xs text-primary hover:underline"
              >
                全選択
              </button>
              <button
                type="button"
                onClick={() => setSupportedIndustries([])}
                className="text-xs text-gray-500 hover:underline"
              >
                クリア
              </button>
              {supportedIndustries.length > 0 && (
                <span className="text-xs text-gray-500">
                  {supportedIndustries.length === INDUSTRIES.length
                    ? "全業種対応"
                    : `${supportedIndustries.length}件選択中`}
                </span>
              )}
            </div>
            )}
          </div>

          {/* 対応入金時期 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              対応入金時期（全選択＝全対応）
            </label>
            <div className="flex flex-wrap gap-1.5 border border-gray-200 rounded-lg p-2">
              {DEPOSIT_TIMING_OPTIONS.map((timing) => (
                <button
                  key={timing}
                  type="button"
                  onClick={() =>
                    editing && setSupportedDepositTiming((prev) =>
                      prev.includes(timing)
                        ? prev.filter((t) => t !== timing)
                        : [...prev, timing]
                    )
                  }
                  disabled={!editing}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    supportedDepositTiming.includes(timing)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {timing}
                </button>
              ))}
            </div>
            {editing && (
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setSupportedDepositTiming([...DEPOSIT_TIMING_OPTIONS])}
                className="text-xs text-primary hover:underline"
              >
                全選択
              </button>
              <button
                type="button"
                onClick={() => setSupportedDepositTiming([])}
                className="text-xs text-gray-500 hover:underline"
              >
                クリア
              </button>
              {supportedDepositTiming.length > 0 && (
                <span className="text-xs text-gray-500">
                  {supportedDepositTiming.length === DEPOSIT_TIMING_OPTIONS.length
                    ? "全対応"
                    : `${supportedDepositTiming.length}件選択中`}
                </span>
              )}
            </div>
            )}
          </div>

          {/* 個人事業主対応 */}
          <div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={soleProprietorOk}
                onChange={(e) => editing && setSoleProprietorOk(e.target.checked)}
                disabled={!editing}
                className={`rounded ${!editing ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              個人事業主対応
            </label>
          </div>

          {message && (
            <p className="text-sm text-green-600 font-medium">{message}</p>
          )}
          {formError && (
            <p className="text-sm text-red-600 font-medium">{formError}</p>
          )}

          {editing && (
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {saving ? "保存中..." : "設定を保存"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  // 元の値に戻す
                  if (profile) {
                    setName(profile.name);
                    setEmail(profile.email || "");
                    setMinAmount(String(profile.min_amount || 10000));
                    setMaxAmount(String(profile.max_amount || 999999999));
                    setSelectedPrefectures(profile.supported_prefectures?.length ? profile.supported_prefectures : [...PREFECTURES]);
                    setSupportedIndustries(profile.supported_industries?.length ? profile.supported_industries : [...INDUSTRIES] as string[]);
                    setSupportedDepositTiming(profile.supported_deposit_timing?.length ? profile.supported_deposit_timing : [...DEPOSIT_TIMING_OPTIONS]);
                    setSoleProprietorOk(profile.sole_proprietor_ok ?? true);
                    setIsActive(profile.is_active ?? true);
                  }
                  setMessage("");
                  setFormError("");
                }}
                className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                キャンセル
              </button>
            </div>
          )}
        </form>
      </div>

      {/* 掲載ステータス */}
      <div className={`rounded-xl border p-6 mb-6 ${isActive ? "bg-white border-gray-200" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">掲載ステータス</h2>
            <p className="text-sm text-gray-600">
              {isActive
                ? "現在、一括見積もりの送客対象です。新しいリードが届きます。"
                : "現在、掲載を停止中です。リードは届きません。"}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <span className={`w-2 h-2 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
              {isActive ? "掲載中" : "停止中"}
            </span>
            <button
              type="button"
              disabled={toggling}
              onClick={async () => {
                const next = !isActive;
                const msg = next
                  ? "掲載を再開しますか？リードの受信が開始されます。"
                  : "掲載を停止しますか？リードが届かなくなります。";
                if (!confirm(msg)) return;
                setToggling(true);
                try {
                  const res = await fetch("/api/partner/profile", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ is_active: next }),
                  });
                  if (res.ok) {
                    setIsActive(next);
                    if (profile) {
                      setProfile({ ...profile, is_active: next });
                    }
                  }
                } catch {
                  // ignore
                } finally {
                  setToggling(false);
                }
              }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 ${
                isActive
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {toggling ? "処理中..." : isActive ? "掲載を停止する" : "掲載を再開する"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
