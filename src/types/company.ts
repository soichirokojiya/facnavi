export type FactoringType = "2社間" | "3社間" | "2社間・3社間";

export interface Company {
  slug: string;
  name: string;
  description: string;
  affiliateUrl: string;
  factoringType: FactoringType;
  feeRange: { min: number; max: number };
  minAmount: number;
  maxAmount: number;
  speedDays: number;
  onlineComplete: boolean;
  features: string[];
  pros: string[];
  cons: string[];
  overallRating: number;
  rankPosition: number;
  establishedYear?: number;
  targetIndustries?: string[];
}
