"use client";

import { useEffect, useRef, useState } from "react";

interface Partner {
  id: string;
  company_slug: string | null;
  name: string;
  login_id: string;
  email: string | null;
  supported_prefectures: string[];
  min_amount: number;
  max_amount: number;
  supported_industries: string[];
  sole_proprietor_ok: boolean;
  is_active: boolean;
  created_at: string;
}

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

interface CompanyOption {
  slug: string;
  name: string;
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // フォーム
  const [name, setName] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [minAmount, setMinAmount] = useState("0");
  const [maxAmount, setMaxAmount] = useState("999999999");
  const [selectedPrefectures, setSelectedPrefectures] = useState<string[]>([]);
  const [supportedIndustries, setSupportedIndustries] = useState("");
  const [soleProprietorOk, setSoleProprietorOk] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/admin/partners");
      const json = await res.json();
      setPartners(json.data || []);
    } catch (err) {
      console.error("Failed to fetch partners:", err);
    } finally {
      setLoading(false);
    }
  };

  const companyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCompanyOptions = async () => {
    try {
      const res = await fetch("/api/admin/partners/companies");
      const json = await res.json();
      setCompanyOptions(json.data || []);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchCompanyOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_slug: companySlug || null,
          name,
          login_id: loginId,
          password,
          supported_prefectures: selectedPrefectures,
          min_amount: parseInt(minAmount) || 0,
          max_amount: parseInt(maxAmount) || 999999999,
          supported_industries: supportedIndustries
            ? supportedIndustries.split(",").map((s) => s.trim())
            : [],
          sole_proprietor_ok: soleProprietorOk,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "登録に失敗しました。");
        return;
      }

      // リセット
      setName("");
      setCompanySlug("");
      setCompanySearch("");
      setLoginId("");
      setPassword("");
      setMinAmount("0");
      setMaxAmount("999999999");
      setSelectedPrefectures([]);
      setSupportedIndustries("");
      setSoleProprietorOk(true);
      setIsActive(true);
      setShowForm(false);
      fetchPartners();
    } catch {
      setFormError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const togglePrefecture = (pref: string) => {
    setSelectedPrefectures((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const formatAmount = (amount: number) => {
    if (amount >= 100000000) return "上限なし";
    return `${(amount / 10000).toLocaleString()}万円`;
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">提携業者管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          {showForm ? "閉じる" : "新規登録"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">業者登録</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  required
                />
              </div>
              <div className="relative" ref={companyDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  掲載会社と紐付け
                </label>
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setShowCompanyDropdown(true);
                    if (!e.target.value) {
                      setCompanySlug("");
                    }
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  placeholder="会社名を入力して検索..."
                />
                {!companySlug && !companySearch && (
                  <p className="text-xs text-gray-400 mt-1">
                    該当する会社がない場合は、先に <code className="bg-gray-100 px-1 rounded">content/companies/</code> にJSONを追加してください。
                  </p>
                )}
                {companySlug && (
                  <button
                    type="button"
                    onClick={() => {
                      setCompanySlug("");
                      setCompanySearch("");
                    }}
                    className="absolute right-2 top-[34px] text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
                {showCompanyDropdown && companySearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setCompanySlug("");
                        setCompanySearch("");
                        setShowCompanyDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
                    >
                      紐付けなし
                    </button>
                    {companyOptions
                      .filter((c) =>
                        c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
                        c.slug.toLowerCase().includes(companySearch.toLowerCase())
                      )
                      .slice(0, 20)
                      .map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setCompanySlug(c.slug);
                            setCompanySearch(c.name);
                            setShowCompanyDropdown(false);
                            if (!name) setName(c.name);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                            companySlug === c.slug ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                          }`}
                        >
                          {c.name}
                          <span className="text-gray-400 ml-1 text-xs">({c.slug})</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ログインID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  対応最小金額（円）
                </label>
                <input
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  対応最大金額（円）
                </label>
                <input
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応都道府県（空＝全国対応）
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {PREFECTURES.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePrefecture(pref)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      selectedPrefectures.includes(pref)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              {selectedPrefectures.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  選択中: {selectedPrefectures.join(", ")}
                  <button
                    type="button"
                    onClick={() => setSelectedPrefectures([])}
                    className="ml-2 text-primary hover:underline"
                  >
                    クリア
                  </button>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応業種（カンマ区切り、空＝全業種）
              </label>
              <input
                type="text"
                value={supportedIndustries}
                onChange={(e) => setSupportedIndustries(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                placeholder="例: 建設業, 製造業, IT・通信"
              />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={soleProprietorOk}
                  onChange={(e) => setSoleProprietorOk(e.target.checked)}
                  className="rounded"
                />
                個人事業主対応
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded"
                />
                有効
              </label>
            </div>

            {formError && (
              <p className="text-sm text-danger font-medium">{formError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "登録中..." : "登録する"}
            </button>
          </form>
        </div>
      )}

      {partners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          登録された業者がありません。
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">業者名</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">メール</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ログインID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">対応金額</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">対応地域</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">個人事業主</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.email || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{p.login_id}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatAmount(p.min_amount)} 〜 {formatAmount(p.max_amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.supported_prefectures.length === 0
                        ? "全国"
                        : p.supported_prefectures.length > 3
                        ? `${p.supported_prefectures.slice(0, 3).join(", ")}他`
                        : p.supported_prefectures.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.sole_proprietor_ok ? "○" : "×"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          p.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {p.is_active ? "有効" : "無効"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
