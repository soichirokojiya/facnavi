export type FactoringType = "2社間" | "3社間" | "2社間・3社間";

export interface Company {
  slug: string;
  name: string;
  brandName?: string;
  description: string;
  affiliateUrl: string;
  factoringType: FactoringType;
  feeRange: { min: number; max: number };
  minAmount: number;
  maxAmount: number;
  speedDays: number;
  onlineComplete: boolean;
  soleProprietorOk: boolean;
  weekendPayment: boolean;
  requiredDocuments?: string[];
  address?: string;
  approvalRate?: number;
  features: string[];
  pros: string[];
  cons: string[];
  overallRating: number;
  rankPosition: number;
  establishedYear?: number;
  targetIndustries?: string[];
  detailSections?: {
    merits?: { title: string; body: string }[];
    demerits?: { title: string; body: string }[];
    recommended?: string[];
    flow?: { step: string; detail: string }[];
  };
  faq?: { question: string; answer: string }[];
  feeSimulation?: {
    amount: number;
    feeMin: number;
    feeMax: number;
    handMin: number;
    handMax: number;
  }[];
  comparisons?: {
    competitor: string;
    competitorSlug: string;
    points: string[];
  }[];
}
