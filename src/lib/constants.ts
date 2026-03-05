export const SITE_NAME = "ファクナビ";
export const SITE_DESCRIPTION =
  "【日本最大級】ファクタリング会社254社の口コミ・評判を徹底比較！手数料・スピード・口コミで選ぶおすすめランキング。あなたに最適な業者が見つかる無料診断ツールも。";
export const SITE_URL = "https://facnavi.info";

export const NAV_ITEMS = [
  { label: "ランキング", href: "/ranking" },
  { label: "口コミ", href: "/kuchikomi" },
  { label: "コラム", href: "/column" },
  { label: "診断ツール", href: "/shindan" },
] as const;

export const INDUSTRIES = [
  "建設業",
  "運送業",
  "製造業",
  "IT・Web",
  "医療・介護",
  "小売業",
  "飲食業",
  "広告・メディア",
  "人材派遣",
  "その他",
] as const;

export const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県",
  "岐阜県", "静岡県", "愛知県", "三重県",
  "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

export const COLORS = {
  primary: "#1e40af",
  primaryLight: "#3b82f6",
  primaryDark: "#1e3a8a",
  accent: "#f59e0b",
  accentLight: "#fbbf24",
  success: "#10b981",
  danger: "#ef4444",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
} as const;
