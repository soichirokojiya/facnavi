"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CompanyOption {
  slug: string;
  name: string;
}

export default function PartnerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [companyOptions, setCompanyOptions] = useState<CompanyOption[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const companyDropdownRef = useRef<HTMLDivElement>(null);

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
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) {
        setShowCompanyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          login_id: loginId,
          password,
          company_slug: companySlug || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登録に失敗しました。");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/partner/login"), 2000);
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
            <p className="text-green-600 font-medium mb-2">登録が完了しました！</p>
            <p className="text-sm text-gray-600">ログインページへ移動します...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredCompanies = companyOptions.filter(
    (c) =>
      c.name.toLowerCase().includes(companySearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(companySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-xl font-bold text-center text-gray-900 mb-6">
            業者新規登録
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                会社名
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                required
              />
            </div>
            <div className="relative" ref={companyDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                掲載会社と紐付け（任意）
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
                  {filteredCompanies.slice(0, 20).map((c) => (
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
                htmlFor="login_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ログインID
              </label>
              <input
                id="login_id"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
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
