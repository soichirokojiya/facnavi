export interface NavCategory {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavCategory[];
}

export const MEGA_MENU_GROUPS: NavGroup[] = [
  {
    title: "条件別",
    items: [
      { label: "即日入金", href: "/ranking/category/same-day" },
      { label: "オンライン完結", href: "/ranking/category/online-complete" },
      { label: "手数料が安い", href: "/ranking/category/low-fees" },
      { label: "個人事業主OK", href: "/ranking/category/sole-proprietor" },
      { label: "土日対応", href: "/ranking/category/weekend" },
      { label: "少額対応", href: "/ranking/category/small-amount" },
      { label: "大口対応", href: "/ranking/category/large-amount" },
      { label: "審査が通りやすい", href: "/ranking/category/easy-screening" },
      { label: "必要書類が少ない", href: "/ranking/category/few-documents" },
      { label: "債権譲渡登記不要", href: "/ranking/category/no-registration" },
      { label: "決算書不要", href: "/ranking/category/no-financial-statements" },
      { label: "確定申告書不要", href: "/ranking/category/no-tax-return" },
    ],
  },
  {
    title: "取引形態別",
    items: [
      { label: "2社間", href: "/ranking/category/two-party" },
      { label: "3社間", href: "/ranking/category/three-party" },
    ],
  },
  {
    title: "業種別",
    items: [
      { label: "建設業向け", href: "/ranking/category/construction" },
      { label: "医療・介護向け", href: "/ranking/category/medical" },
      { label: "診療報酬", href: "/ranking/category/medical-reward" },
      { label: "介護報酬", href: "/ranking/category/nursing-reward" },
    ],
  },
];
