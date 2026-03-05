import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { Logo } from "./Logo";

const POPULAR_COMPANIES = [
  { slug: "best-factor", name: "ベストファクター" },
  { slug: "olta", name: "OLTA" },
  { slug: "pay-today", name: "PayToday" },
  { slug: "betrading", name: "ビートレーディング" },
  { slug: "ququmo", name: "QuQuMo" },
  { slug: "accel-factor", name: "アクセルファクター" },
  { slug: "no1", name: "No.1" },
  { slug: "freenance", name: "フリーナンス" },
  { slug: "labol", name: "ラボル" },
  { slug: "msfj", name: "MSFJ" },
  { slug: "mf-early-payment", name: "マネーフォワード" },
  { slug: "gmo-btob", name: "GMO BtoB早払い" },
];

const COLUMN_LINKS = [
  { href: "/column/what-is-factoring", label: "ファクタリングとは？仕組みを解説" },
  { href: "/column/how-to-choose", label: "ファクタリング会社の選び方" },
  { href: "/column/construction-factoring", label: "建設業向けファクタリング" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo size="sm" white />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              ファクタリング会社の口コミ・評判を比較できる情報サイト。
              手数料・入金スピード・審査の通りやすさなど、あなたに最適なファクタリング会社が見つかります。
            </p>
          </div>

          {/* Popular companies */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">人気のファクタリング会社</h3>
            <ul className="space-y-1.5">
              {POPULAR_COMPANIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/ranking/${c.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/ranking" className="text-sm text-primary-light hover:text-white transition-colors font-medium">
                  すべての会社を見る →
                </Link>
              </li>
            </ul>
          </div>

          {/* Content links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">コンテンツ</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/ranking" className="text-sm hover:text-white transition-colors">
                  ファクタリング会社ランキング
                </Link>
              </li>
              <li>
                <Link href="/kuchikomi" className="text-sm hover:text-white transition-colors">
                  口コミ・評判一覧
                </Link>
              </li>
              <li>
                <Link href="/shindan" className="text-sm hover:text-white transition-colors">
                  無料診断ツール
                </Link>
              </li>
              <li>
                <Link href="/column" className="text-sm hover:text-white transition-colors">
                  コラム・お役立ち記事
                </Link>
              </li>
            </ul>

            <h3 className="text-white font-bold text-sm mt-6 mb-4">人気の記事</h3>
            <ul className="space-y-1.5">
              {COLUMN_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">ご案内</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  運営会社情報
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  お問い合わせ
                </Link>
              </li>
              <li>
                <a
                  href="https://note.com/financing_tokyo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  ファクタリング比較ラボ
                </a>
              </li>
            </ul>

            <h3 className="text-white font-bold text-sm mt-6 mb-4">カテゴリで探す</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/ranking/category/low-fees" className="hover:text-white transition-colors">
                  手数料が安い会社
                </Link>
              </li>
              <li>
                <Link href="/ranking/category/same-day" className="hover:text-white transition-colors">
                  即日入金対応の会社
                </Link>
              </li>
              <li>
                <Link href="/ranking/category/sole-proprietor" className="hover:text-white transition-colors">
                  個人事業主OKの会社
                </Link>
              </li>
              <li>
                <Link href="/ranking/category/online-complete" className="hover:text-white transition-colors">
                  オンライン完結の会社
                </Link>
              </li>
              <li>
                <Link href="/ranking/category/construction" className="hover:text-white transition-colors">
                  建設業向けの会社
                </Link>
              </li>
              <li>
                <Link href="/ranking/category/medical" className="hover:text-white transition-colors">
                  医療・介護向けの会社
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} {SITE_NAME} All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              ※当サイトはアフィリエイトプログラムに参加しています。掲載情報は各社公式サイトの内容に基づいていますが、最新情報は各社にお問い合わせください。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
