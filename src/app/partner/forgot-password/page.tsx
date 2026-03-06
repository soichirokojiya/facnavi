"use client";

import { useState } from "react";
import Link from "next/link";

export default function PartnerForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/partner/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "処理に失敗しました。");
        return;
      }

      setSent(true);
    } catch {
      setError("通信エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="font-medium text-gray-900 mb-2">メールを送信しました</p>
            <p className="text-sm text-gray-600 mb-4">
              ご登録のメールアドレス宛にパスワードリセットリンクを送信しました。メールをご確認ください。
            </p>
            <Link
              href="/partner/login"
              className="text-primary text-sm hover:underline"
            >
              ログインページへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-xl font-bold text-center text-gray-900 mb-2">
            パスワードをお忘れの方
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6">
            ご登録のメールアドレスを入力してください。パスワードリセットリンクをお送りします。
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            {error && (
              <p className="text-sm text-danger font-medium">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? "送信中..." : "リセットリンクを送信"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            <Link href="/partner/login" className="text-primary hover:underline">
              ログインページへ戻る
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
