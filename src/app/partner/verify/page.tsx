"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/partner/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          return;
        }

        setStatus(data.alreadyVerified ? "already" : "success");
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="bg-white rounded-xl shadow-md p-8 text-center">
      {status === "loading" && (
        <>
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">メールアドレスを確認中...</p>
        </>
      )}
      {status === "success" && (
        <>
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">認証完了</h1>
          <p className="text-sm text-gray-600 mb-6">メールアドレスの確認が完了しました。<br />ログインしてご利用ください。</p>
          <Link
            href="/partner/login"
            className="inline-block w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            ログインへ
          </Link>
        </>
      )}
      {status === "already" && (
        <>
          <h1 className="text-xl font-bold text-gray-900 mb-2">認証済みです</h1>
          <p className="text-sm text-gray-600 mb-6">このメールアドレスは既に認証されています。</p>
          <Link
            href="/partner/login"
            className="inline-block w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            ログインへ
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">認証に失敗しました</h1>
          <p className="text-sm text-gray-600 mb-6">リンクが無効または期限切れです。<br />再度新規登録をお試しください。</p>
          <Link
            href="/partner/register"
            className="inline-block w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            新規登録へ
          </Link>
        </>
      )}
    </div>
  );
}

export default function PartnerVerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <Suspense
          fallback={
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">読み込み中...</p>
            </div>
          }
        >
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
