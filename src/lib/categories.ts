import { Company } from "@/types/company";

export interface Category {
  slug: string;
  title: string;
  h1: string;
  description: string;
  metaDescription: string;
  filter: (company: Company) => boolean;
  sort?: (a: Company, b: Company) => number;
}

export const CATEGORIES: Category[] = [
  {
    slug: "low-fees",
    title: "手数料が安いファクタリング会社",
    h1: "手数料が安いファクタリング会社ランキング",
    description: "手数料の安さで比較したファクタリング会社ランキング。低コストで利用できるおすすめの業者をご紹介します。",
    metaDescription: "手数料が安いファクタリング会社を徹底比較！1%〜の低手数料で利用できるおすすめ業者をランキング形式でご紹介。コストを抑えた資金調達に最適な会社が見つかります。",
    filter: (c) => c.feeRange.min <= 3,
    sort: (a, b) => (a.feeRange.min + a.feeRange.max) / 2 - (b.feeRange.min + b.feeRange.max) / 2,
  },
  {
    slug: "same-day",
    title: "即日入金対応のファクタリング会社",
    h1: "即日入金対応のファクタリング会社ランキング",
    description: "最短即日で入金可能なファクタリング会社をランキング。急な資金需要にも対応できる業者をご紹介します。",
    metaDescription: "即日入金対応のファクタリング会社を比較！最短即日〜翌日入金に対応した業者をランキング形式でご紹介。急ぎの資金調達におすすめの会社が見つかります。",
    filter: (c) => c.speedDays <= 1,
    sort: (a, b) => a.speedDays - b.speedDays || a.rankPosition - b.rankPosition,
  },
  {
    slug: "sole-proprietor",
    title: "個人事業主OKのファクタリング会社",
    h1: "個人事業主が利用できるファクタリング会社ランキング",
    description: "個人事業主・フリーランスでも利用できるファクタリング会社をランキング。少額から対応可能な業者をご紹介します。",
    metaDescription: "個人事業主・フリーランスOKのファクタリング会社を比較！少額から利用できるおすすめ業者をランキング形式でご紹介。審査が柔軟な会社が見つかります。",
    filter: (c) => c.features.some(f => f.includes("個人事業主") || f.includes("フリーランス")),
    sort: (a, b) => a.rankPosition - b.rankPosition,
  },
  {
    slug: "online-complete",
    title: "オンライン完結のファクタリング会社",
    h1: "オンライン完結で利用できるファクタリング会社ランキング",
    description: "来店不要でオンライン完結のファクタリング会社をランキング。非対面で手続きが完了するおすすめ業者をご紹介します。",
    metaDescription: "オンライン完結のファクタリング会社を比較！来店不要・非対面で利用できるおすすめ業者をランキング形式でご紹介。スマホ・PCで手軽に資金調達できます。",
    filter: (c) => c.onlineComplete,
    sort: (a, b) => a.rankPosition - b.rankPosition,
  },
  {
    slug: "two-party",
    title: "2社間ファクタリング会社",
    h1: "2社間ファクタリング対応の会社ランキング",
    description: "取引先に知られずに利用できる2社間ファクタリング対応の会社をランキング。秘密厳守で資金調達できる業者をご紹介します。",
    metaDescription: "2社間ファクタリング対応の会社を比較！取引先に知られずに資金調達できるおすすめ業者をランキング形式でご紹介。秘密厳守の会社が見つかります。",
    filter: (c) => c.factoringType.includes("2社間"),
    sort: (a, b) => a.rankPosition - b.rankPosition,
  },
  {
    slug: "three-party",
    title: "3社間ファクタリング会社",
    h1: "3社間ファクタリング対応の会社ランキング",
    description: "手数料が安い3社間ファクタリング対応の会社をランキング。コストを抑えて利用できる業者をご紹介します。",
    metaDescription: "3社間ファクタリング対応の会社を比較！低手数料で利用できるおすすめ業者をランキング形式でご紹介。銀行系・大手の安心感ある会社が見つかります。",
    filter: (c) => c.factoringType.includes("3社間"),
    sort: (a, b) => (a.feeRange.min + a.feeRange.max) / 2 - (b.feeRange.min + b.feeRange.max) / 2,
  },
  {
    slug: "construction",
    title: "建設業向けファクタリング会社",
    h1: "建設業におすすめのファクタリング会社ランキング",
    description: "建設業界に特化・強いファクタリング会社をランキング。工事代金の早期資金化に対応した業者をご紹介します。",
    metaDescription: "建設業向けファクタリング会社を比較！工事代金の早期資金化に対応したおすすめ業者をランキング形式でご紹介。建設業界に強い会社が見つかります。",
    filter: (c) => c.targetIndustries?.includes("建設業") || c.features.some(f => f.includes("建設")),
    sort: (a, b) => a.rankPosition - b.rankPosition,
  },
  {
    slug: "medical",
    title: "医療・介護向けファクタリング会社",
    h1: "医療・介護業界におすすめのファクタリング会社ランキング",
    description: "医療・介護業界向けのファクタリング会社をランキング。診療報酬・介護報酬の早期資金化に対応した業者をご紹介します。",
    metaDescription: "医療・介護向けファクタリング会社を比較！診療報酬・介護報酬ファクタリングに対応したおすすめ業者をランキング形式でご紹介。",
    filter: (c) => c.targetIndustries?.includes("医療・介護") || c.features.some(f => f.includes("医療") || f.includes("介護") || f.includes("診療")),
    sort: (a, b) => a.rankPosition - b.rankPosition,
  },
  {
    slug: "small-amount",
    title: "少額対応のファクタリング会社",
    h1: "少額から利用できるファクタリング会社ランキング",
    description: "少額（30万円以下〜）から利用できるファクタリング会社をランキング。小口の売掛金でも対応可能な業者をご紹介します。",
    metaDescription: "少額から利用できるファクタリング会社を比較！10万円〜対応のおすすめ業者をランキング形式でご紹介。小口の売掛金でも利用できる会社が見つかります。",
    filter: (c) => c.minAmount <= 300000,
    sort: (a, b) => a.minAmount - b.minAmount || a.rankPosition - b.rankPosition,
  },
  {
    slug: "large-amount",
    title: "大口対応のファクタリング会社",
    h1: "大口・高額対応のファクタリング会社ランキング",
    description: "1億円以上の大口ファクタリングに対応した会社をランキング。大型案件の資金調達に対応できる業者をご紹介します。",
    metaDescription: "大口・高額対応のファクタリング会社を比較！1億円以上の大型案件に対応したおすすめ業者をランキング形式でご紹介。",
    filter: (c) => c.maxAmount >= 100000000 || c.maxAmount === 0,
    sort: (a, b) => (b.maxAmount === 0 ? Infinity : b.maxAmount) - (a.maxAmount === 0 ? Infinity : a.maxAmount),
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}
