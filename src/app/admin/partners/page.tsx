"use client";

import { useEffect, useRef, useState } from "react";
import { INDUSTRIES } from "@/lib/constants";

const DEPOSIT_TIMING_OPTIONS = ["即日", "3日以内", "1週間以内", "1ヶ月以内", "急ぎではない"];

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
  supported_deposit_timing: string[];
  fee_per_lead: number;
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

interface FormState {
  name: string;
  companySlug: string;
  companySearch: string;
  loginId: string;
  email: string;
  minAmount: string;
  maxAmount: string;
  selectedPrefectures: string[];
  supportedIndustries: string[];
  supportedDepositTiming: string[];
  feePerLead: string;
  soleProprietorOk: boolean;
  isActive: boolean;
}

const emptyForm: FormState = {
  name: "",
  companySlug: "",
  companySearch: "",
  loginId: "",
  email: "",
  minAmount: "10000",
  maxAmount: "999999999",
  selectedPrefectures: [...PREFECTURES],
  supportedIndustries: [...INDUSTRIES] as string[],
  supportedDepositTiming: [...DEPOSIT_TIMING_OPTIONS],
  feePerLead: "15000",
  soleProprietorOk: true,
  isActive: true,
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const companyDropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openEditForm = (p: Partner) => {
    const companyName = companyOptions.find((c) => c.slug === p.company_slug)?.name || "";
    setEditingId(p.id);
    setForm({
      name: p.name,
      companySlug: p.company_slug || "",
      companySearch: companyName || p.company_slug || "",
      loginId: p.login_id,
      email: p.email || "",
      minAmount: String(p.min_amount || 10000),
      maxAmount: String(p.max_amount || 999999999),
      selectedPrefectures: p.supported_prefectures?.length ? p.supported_prefectures : [...PREFECTURES],
      supportedIndustries: p.supported_industries?.length ? p.supported_industries : [...INDUSTRIES] as string[],
      supportedDepositTiming: p.supported_deposit_timing?.length ? p.supported_deposit_timing : [...DEPOSIT_TIMING_OPTIONS],
      feePerLead: String(p.fee_per_lead || 15000),
      soleProprietorOk: p.sole_proprietor_ok ?? true,
      isActive: p.is_active,
    });
    setFormError("");
    setEditingEnabled(false);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const payload = {
        company_slug: form.companySlug || null,
        name: form.name,
        login_id: form.loginId,
        email: form.email || null,
        supported_prefectures: form.selectedPrefectures,
        min_amount: parseInt(form.minAmount) || 0,
        max_amount: parseInt(form.maxAmount) || 999999999,
        supported_industries: form.supportedIndustries,
        supported_deposit_timing: form.supportedDepositTiming,
        fee_per_lead: parseInt(form.feePerLead) || 0,
        sole_proprietor_ok: form.soleProprietorOk,
        is_active: form.isActive,
      };

      if (!editingId) return;
      const res = await fetch("/api/admin/partners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "保存に失敗しました。");
        return;
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchPartners();
    } catch {
      setFormError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: Partner) => {
    if (!confirm(`「${p.name}」を削除しますか？この操作は取り消せません。`)) return;
    setDeleting(p.id);
    try {
      const res = await fetch("/api/admin/partners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id }),
      });
      if (res.ok) {
        fetchPartners();
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました。");
      }
    } catch {
      alert("通信エラーが発生しました。");
    } finally {
      setDeleting(null);
    }
  };

  const togglePrefecture = (pref: string) => {
    setForm((prev) => ({
      ...prev,
      selectedPrefectures: prev.selectedPrefectures.includes(pref)
        ? prev.selectedPrefectures.filter((p) => p !== pref)
        : [...prev.selectedPrefectures, pref],
    }));
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">提携業者管理</h1>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">業者編集</h2>
            {!editingEnabled && (
              <button
                type="button"
                onClick={() => setEditingEnabled(true)}
                className="px-5 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary-dark shadow-sm transition-colors"
              >
                編集する
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset disabled={!editingEnabled} className={`space-y-4 ${!editingEnabled ? "opacity-80" : ""}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業者名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                  value={form.companySearch}
                  onChange={(e) => {
                    setForm({ ...form, companySearch: e.target.value, companySlug: e.target.value ? form.companySlug : "" });
                    setShowCompanyDropdown(true);
                  }}
                  onFocus={() => setShowCompanyDropdown(true)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  placeholder="会社名を入力して検索..."
                />
                {form.companySlug && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, companySlug: "", companySearch: "" })}
                    className="absolute right-2 top-[34px] text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
                {showCompanyDropdown && form.companySearch && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setForm({ ...form, companySlug: "", companySearch: "" });
                        setShowCompanyDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
                    >
                      紐付けなし
                    </button>
                    {companyOptions
                      .filter((c) =>
                        c.name.toLowerCase().includes(form.companySearch.toLowerCase()) ||
                        c.slug.toLowerCase().includes(form.companySearch.toLowerCase())
                      )
                      .slice(0, 20)
                      .map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => {
                            setForm({
                              ...form,
                              companySlug: c.slug,
                              companySearch: c.name,
                              name: form.name || c.name,
                            });
                            setShowCompanyDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                            form.companySlug === c.slug ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
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
                  value={form.loginId}
                  onChange={(e) => setForm({ ...form, loginId: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  placeholder="example@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  リード単価（税抜・円/件）
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.feePerLead ? Number(form.feePerLead).toLocaleString() : ""}
                  onChange={(e) => setForm({ ...form, feePerLead: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  placeholder="例: 15,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  対応最小金額（円）
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.minAmount ? Number(form.minAmount).toLocaleString() : ""}
                  onChange={(e) => setForm({ ...form, minAmount: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  対応最大金額（円）
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.maxAmount ? Number(form.maxAmount).toLocaleString() : ""}
                  onChange={(e) => setForm({ ...form, maxAmount: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応都道府県（全選択＝全国対応）
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {PREFECTURES.map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePrefecture(pref)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      form.selectedPrefectures.includes(pref)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, selectedPrefectures: [...PREFECTURES] })}
                  className="text-xs text-primary hover:underline"
                >
                  全選択
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, selectedPrefectures: [] })}
                  className="text-xs text-gray-500 hover:underline"
                >
                  クリア
                </button>
                {form.selectedPrefectures.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {form.selectedPrefectures.length === PREFECTURES.length
                      ? "全国対応"
                      : `${form.selectedPrefectures.length}件選択中`}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対応業種（全選択＝全業種対応）
              </label>
              <div className="flex flex-wrap gap-1.5 border border-gray-200 rounded-lg p-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        supportedIndustries: prev.supportedIndustries.includes(ind)
                          ? prev.supportedIndustries.filter((i) => i !== ind)
                          : [...prev.supportedIndustries, ind],
                      }))
                    }
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      form.supportedIndustries.includes(ind)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, supportedIndustries: [...INDUSTRIES] as string[] })}
                  className="text-xs text-primary hover:underline"
                >
                  全選択
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, supportedIndustries: [] })}
                  className="text-xs text-gray-500 hover:underline"
                >
                  クリア
                </button>
                {form.supportedIndustries.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {form.supportedIndustries.length === INDUSTRIES.length
                      ? "全業種対応"
                      : `${form.supportedIndustries.length}件選択中`}
                  </span>
                )}
              </div>
            </div>

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
                      setForm((prev) => ({
                        ...prev,
                        supportedDepositTiming: prev.supportedDepositTiming.includes(timing)
                          ? prev.supportedDepositTiming.filter((t) => t !== timing)
                          : [...prev.supportedDepositTiming, timing],
                      }))
                    }
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      form.supportedDepositTiming.includes(timing)
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {timing}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, supportedDepositTiming: [...DEPOSIT_TIMING_OPTIONS] })}
                  className="text-xs text-primary hover:underline"
                >
                  全選択
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, supportedDepositTiming: [] })}
                  className="text-xs text-gray-500 hover:underline"
                >
                  クリア
                </button>
                {form.supportedDepositTiming.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {form.supportedDepositTiming.length === DEPOSIT_TIMING_OPTIONS.length
                      ? "全対応"
                      : `${form.supportedDepositTiming.length}件選択中`}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.soleProprietorOk}
                  onChange={(e) => setForm({ ...form, soleProprietorOk: e.target.checked })}
                  className="rounded"
                />
                個人事業主対応
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">一括見積もり対象</h3>
              <p className="text-xs text-gray-500 mb-2">有効にすると、一括見積もりの送客対象業者になります。</p>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded"
                />
                見積もり送客対象にする
              </label>
            </div>

            </fieldset>

            {formError && (
              <p className="text-sm text-danger font-medium mt-4">{formError}</p>
            )}
            {editingEnabled && (
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? "保存中..." : "更新する"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setEditingEnabled(false);
                    setForm(emptyForm);
                  }}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            )}
            {!editingEnabled && (
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  閉じる
                </button>
              </div>
            )}
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
                  <th className="text-left px-4 py-3 font-medium text-gray-600">リード単価</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">対応地域</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">個人事業主</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">見積もり対象</th>
                  <th className="px-4 py-3"></th>
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
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      {p.fee_per_lead ? `${p.fee_per_lead.toLocaleString()}円` : "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.supported_prefectures.length === 0 || p.supported_prefectures.length === PREFECTURES.length
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
                        {p.is_active ? "送客対象" : "停止中"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(p)}
                          className="text-primary hover:underline text-sm"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={deleting === p.id}
                          className="text-red-600 hover:underline text-sm disabled:opacity-50"
                        >
                          削除
                        </button>
                      </div>
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
