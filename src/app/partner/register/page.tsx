"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CompanyOption {
  slug: string;
  name: string;
}

export default function PartnerRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("/api/partner/companies");
        const json = await res.json();
        setCompanyOptions(json.data || []);
      } catch {
        // ignore
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        // 選択されていなければ検索文字をクリア
        if (!companySlug) setCompanySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [companySlug]);

  const selectedCompany = companyOptions.find((c) => c.slug === companySlug);

  const filteredCompanies = companyOptions.filter(
    (c) => c.name.toLowerCase().includes(companySearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companySlug || !email || !password) {
      setError("すべての項目を入力してください。");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          company_slug: companySlug,
          company_name: selectedCompany?.name || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登録に失敗しました。");
        return;
      }

      setSuccess(true);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">確認メールを送信しました</h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              ご登録いただいたメールアドレスに確認メールを送信しました。<br />
              メール内のリンクをクリックして認証を完了してください。
            </p>
            <p className="text-xs text-gray-400">メールが届かない場合は、迷惑メールフォルダをご確認ください。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
            ファクタリング業者様新規登録
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                会社名
              </label>
              {companySlug ? (
                <div className="flex items-center justify-between w-full px-3 py-2 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-700">{selectedCompany?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCompanySlug("");
                      setCompanySearch("");
                    }}
                    className="text-gray-400 hover:text-gray-600 text-sm ml-2"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  placeholder="会社名を入力して検索..."
                  autoComplete="off"
                />
              )}
              {showDropdown && !companySlug && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {(companySearch ? filteredCompanies : companyOptions).length > 0 ? (
                    (companySearch ? filteredCompanies : companyOptions).slice(0, 30).map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => {
                          setCompanySlug(c.slug);
                          setCompanySearch(c.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 text-gray-700"
                      >
                        {c.name}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-400">該当する会社が見つかりません</p>
                  )}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                パスワード（8文字以上）
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                required
                minLength={8}
              />
            </div>
            {error && (
              <p className="text-sm text-danger font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "登録中..." : "登録する"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            既にアカウントをお持ちの方は{" "}
            <Link href="/partner/login" className="text-primary hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
