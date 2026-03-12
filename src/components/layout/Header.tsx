"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { NAV_ITEMS } from "@/lib/constants";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenuCategories } from "./MobileMenuCategories";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openMegaMenu = useCallback(() => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsMegaMenuOpen(true);
  }, []);

  const closeMegaMenu = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 150);
  }, []);

  // メニューオープン時にbodyスクロールを無効化
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" aria-label="ファクナビ トップページ">
            <Logo size="md" />
          </Link>

          {/* デスクトップナビゲーション */}
          <div className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={openMegaMenu}
              onMouseLeave={closeMegaMenu}
            >
              <Link
                href="/ranking"
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 rounded-md transition-colors"
              >
                ランキング
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </Link>
            </div>
            <Link
              href="/kuchikomi"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 rounded-md transition-colors"
            >
              口コミ
            </Link>
            <Link
              href="/column"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 rounded-md transition-colors"
            >
              実践経営ノート
            </Link>
            <Link
              href="/shindan"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 rounded-md transition-colors"
            >
              診断ツール
            </Link>
            <Link
              href="/mitsumori"
              className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-lg transition-colors"
            >
              一括見積もり
            </Link>
          </div>

          {/* ハンバーガーボタン（モバイルのみ） */}
          <button
            className="relative w-10 h-10 flex items-center justify-center z-[60] lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <div className="w-7 flex flex-col gap-[7px]">
              <span
                className={`block h-[3px] bg-gray-800 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-[10px]" : ""
                }`}
              />
              <span
                className={`block h-[3px] bg-gray-800 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[3px] bg-gray-800 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-[10px]" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* デスクトップ メガメニュー */}
        <div
          className="hidden lg:block"
          onMouseEnter={openMegaMenu}
          onMouseLeave={closeMegaMenu}
        >
          <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
        </div>
      </header>

      {/* フルスクリーンメニュー（モバイル） */}
      <div
        className={`fixed inset-0 z-[55] bg-white transition-opacity duration-300 lg:hidden ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* 右上バツボタン */}
        <div className="absolute top-0 left-0 right-0 h-16 max-w-6xl mx-auto px-4 flex items-center justify-end">
        <button
          className="w-10 h-10 flex items-center justify-center z-[65]"
          onClick={() => setIsMenuOpen(false)}
          aria-label="メニューを閉じる"
        >
          <svg
            className={`w-8 h-8 text-gray-800 transition-transform duration-500 ease-out ${
              isMenuOpen ? "rotate-0 scale-100" : "rotate-90 scale-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        </div>

        <div
          className={`flex flex-col items-center min-h-screen px-6 py-16 overflow-y-auto transition-all duration-500 ease-out ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          {/* ロゴ（トップへ戻る） */}
          <Link
            href="/"
            className="mb-6 mt-4 hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            <Logo size="lg" />
          </Link>

          {/* 実績数字 */}
          <div className="flex items-center gap-6 mb-8 text-center">
            <p className="text-gray-800 font-bold text-sm">
              掲載社数<span className="text-2xl font-extrabold text-red-600 mx-1">254</span>社
            </p>
            <p className="text-gray-800 font-bold text-sm">
              口コミ数<span className="text-2xl font-extrabold text-red-600 mx-1">106</span>件
            </p>
          </div>

          {/* ナビゲーションリンク */}
          <nav className="flex flex-col items-center gap-5 mb-8">
            <Link
              href="/"
              className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              トップページ
            </Link>
            {NAV_ITEMS.filter((item) => item.href !== "/mitsumori").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-bold text-gray-800 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* カテゴリナビゲーション */}
          <MobileMenuCategories onLinkClick={() => setIsMenuOpen(false)} />

          {/* 一括見積もりCTA */}
          <Link
            href="/mitsumori"
            className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-base rounded-xl px-7 py-3.5 shadow-lg transition-all duration-200 w-full max-w-xs justify-center mt-8"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              最短即日入金<br />
              <span className="text-sm">一括見積もり</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
