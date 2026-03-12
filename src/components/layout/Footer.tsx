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
  { href: "/column/two-vs-three-party", label: "2社間・3社間の違い" },
  { href: "/column/factoring-fees", label: "手数料の相場と安くするコツ" },
  { href: "/column/sole-proprietor-factoring", label: "個人事業主のファクタリング" },
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
                  実践経営ノート
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-white transition-colors">
                  よくある質問（FAQ）
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
              <li>
                <Link href="/column" className="text-sm text-primary-light hover:text-white transition-colors font-medium">
                  すべての記事を見る →
                </Link>
              </li>
            </ul>
          </div>

          {/* Site info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4">ご案内</h3>
            <ul className="space-y-1.5">
              <li>
                <a href="https://www.cfac.co.jp/" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  運営会社情報
                </a>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-white transition-colors">
                  利用規約
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
                <Link href="/for-partners" className="text-sm hover:text-white transition-colors">
                  一括見積もり業者登録
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

          </div>
        </div>

        {/* カテゴリリンク */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 条件から探す */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">条件から探す</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link href="/ranking/category/same-day" className="hover:text-white transition-colors">即日・当日入金</Link></li>
                <li><Link href="/ranking/category/online-complete" className="hover:text-white transition-colors">オンライン完結</Link></li>
                <li><Link href="/ranking/category/low-fees" className="hover:text-white transition-colors">手数料が安い</Link></li>
                <li><Link href="/ranking/category/sole-proprietor" className="hover:text-white transition-colors">個人事業主・フリーランス</Link></li>
                <li><Link href="/ranking/category/easy-screening" className="hover:text-white transition-colors">審査が通りやすい</Link></li>
                <li><Link href="/ranking/category/small-amount" className="hover:text-white transition-colors">少額ファクタリング</Link></li>
                <li><Link href="/ranking/category/large-amount" className="hover:text-white transition-colors">高額ファクタリング</Link></li>
                <li><Link href="/ranking/category/weekend" className="hover:text-white transition-colors">土日対応</Link></li>
                <li><Link href="/ranking/category/few-documents" className="hover:text-white transition-colors">必要書類が少ない</Link></li>
                <li><Link href="/ranking/category/no-registration" className="hover:text-white transition-colors">債権譲渡登記不要</Link></li>
                <li><Link href="/ranking/category/no-financial-statements" className="hover:text-white transition-colors">決算書不要</Link></li>
                <li><Link href="/ranking/category/no-tax-return" className="hover:text-white transition-colors">確定申告書不要</Link></li>
                <li><Link href="/ranking/category/two-party" className="hover:text-white transition-colors">2社間ファクタリング</Link></li>
                <li><Link href="/ranking/category/three-party" className="hover:text-white transition-colors">3社間ファクタリング</Link></li>
                <li><Link href="/ranking/category/all-companies" className="hover:text-white transition-colors">ファクタリング会社一覧</Link></li>
              </ul>
            </div>

            {/* 業種別 */}
            <div>
              <h3 className="text-white font-bold text-sm mb-4">業種別</h3>
              <ul className="space-y-1.5 text-sm">
                <li><Link href="/ranking/category/construction" className="hover:text-white transition-colors">建設業向け</Link></li>
                <li><Link href="/ranking/category/medical" className="hover:text-white transition-colors">医療・介護向け</Link></li>
                <li><Link href="/ranking/category/medical-reward" className="hover:text-white transition-colors">診療報酬ファクタリング</Link></li>
                <li><Link href="/ranking/category/nursing-reward" className="hover:text-white transition-colors">介護報酬ファクタリング</Link></li>
                <li><Link href="/ranking/category/transportation" className="hover:text-white transition-colors">運送業向け</Link></li>
                <li><Link href="/ranking/category/it-web" className="hover:text-white transition-colors">IT・Web向け</Link></li>
                <li><Link href="/ranking/category/manufacturing" className="hover:text-white transition-colors">製造業向け</Link></li>
                <li><Link href="/ranking/category/food-service" className="hover:text-white transition-colors">飲食業向け</Link></li>
                <li><Link href="/ranking/category/staffing" className="hover:text-white transition-colors">人材派遣向け</Link></li>
                <li><Link href="/ranking/category/advertising" className="hover:text-white transition-colors">広告・メディア向け</Link></li>
                <li><Link href="/ranking/category/retail" className="hover:text-white transition-colors">小売業向け</Link></li>
              </ul>
            </div>

            {/* エリア別（47都道府県） */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-bold text-sm mb-4">エリア別</h3>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
                <Link href="/ranking/category/hokkaido" className="hover:text-white transition-colors">北海道</Link>
                <Link href="/ranking/category/aomori" className="hover:text-white transition-colors">青森</Link>
                <Link href="/ranking/category/iwate" className="hover:text-white transition-colors">岩手</Link>
                <Link href="/ranking/category/miyagi" className="hover:text-white transition-colors">宮城</Link>
                <Link href="/ranking/category/akita" className="hover:text-white transition-colors">秋田</Link>
                <Link href="/ranking/category/yamagata" className="hover:text-white transition-colors">山形</Link>
                <Link href="/ranking/category/fukushima" className="hover:text-white transition-colors">福島</Link>
                <Link href="/ranking/category/ibaraki" className="hover:text-white transition-colors">茨城</Link>
                <Link href="/ranking/category/tochigi" className="hover:text-white transition-colors">栃木</Link>
                <Link href="/ranking/category/gunma" className="hover:text-white transition-colors">群馬</Link>
                <Link href="/ranking/category/saitama" className="hover:text-white transition-colors">埼玉</Link>
                <Link href="/ranking/category/chiba" className="hover:text-white transition-colors">千葉</Link>
                <Link href="/ranking/category/tokyo" className="hover:text-white transition-colors">東京</Link>
                <Link href="/ranking/category/kanagawa" className="hover:text-white transition-colors">神奈川</Link>
                <Link href="/ranking/category/niigata" className="hover:text-white transition-colors">新潟</Link>
                <Link href="/ranking/category/toyama" className="hover:text-white transition-colors">富山</Link>
                <Link href="/ranking/category/ishikawa" className="hover:text-white transition-colors">石川</Link>
                <Link href="/ranking/category/fukui" className="hover:text-white transition-colors">福井</Link>
                <Link href="/ranking/category/yamanashi" className="hover:text-white transition-colors">山梨</Link>
                <Link href="/ranking/category/nagano" className="hover:text-white transition-colors">長野</Link>
                <Link href="/ranking/category/gifu" className="hover:text-white transition-colors">岐阜</Link>
                <Link href="/ranking/category/shizuoka" className="hover:text-white transition-colors">静岡</Link>
                <Link href="/ranking/category/aichi" className="hover:text-white transition-colors">愛知</Link>
                <Link href="/ranking/category/mie" className="hover:text-white transition-colors">三重</Link>
                <Link href="/ranking/category/shiga" className="hover:text-white transition-colors">滋賀</Link>
                <Link href="/ranking/category/kyoto" className="hover:text-white transition-colors">京都</Link>
                <Link href="/ranking/category/osaka" className="hover:text-white transition-colors">大阪</Link>
                <Link href="/ranking/category/hyogo" className="hover:text-white transition-colors">兵庫</Link>
                <Link href="/ranking/category/nara" className="hover:text-white transition-colors">奈良</Link>
                <Link href="/ranking/category/wakayama" className="hover:text-white transition-colors">和歌山</Link>
                <Link href="/ranking/category/tottori" className="hover:text-white transition-colors">鳥取</Link>
                <Link href="/ranking/category/shimane" className="hover:text-white transition-colors">島根</Link>
                <Link href="/ranking/category/okayama" className="hover:text-white transition-colors">岡山</Link>
                <Link href="/ranking/category/hiroshima" className="hover:text-white transition-colors">広島</Link>
                <Link href="/ranking/category/yamaguchi" className="hover:text-white transition-colors">山口</Link>
                <Link href="/ranking/category/tokushima" className="hover:text-white transition-colors">徳島</Link>
                <Link href="/ranking/category/kagawa" className="hover:text-white transition-colors">香川</Link>
                <Link href="/ranking/category/ehime" className="hover:text-white transition-colors">愛媛</Link>
                <Link href="/ranking/category/kochi" className="hover:text-white transition-colors">高知</Link>
                <Link href="/ranking/category/fukuoka" className="hover:text-white transition-colors">福岡</Link>
                <Link href="/ranking/category/saga" className="hover:text-white transition-colors">佐賀</Link>
                <Link href="/ranking/category/nagasaki" className="hover:text-white transition-colors">長崎</Link>
                <Link href="/ranking/category/kumamoto" className="hover:text-white transition-colors">熊本</Link>
                <Link href="/ranking/category/oita" className="hover:text-white transition-colors">大分</Link>
                <Link href="/ranking/category/miyazaki" className="hover:text-white transition-colors">宮崎</Link>
                <Link href="/ranking/category/kagoshima" className="hover:text-white transition-colors">鹿児島</Link>
                <Link href="/ranking/category/okinawa" className="hover:text-white transition-colors">沖縄</Link>
              </div>
            </div>
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
