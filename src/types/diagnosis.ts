export type Priority = "手数料" | "スピード" | "審査" | "サポート";
export type Urgency = "即日" | "3日以内" | "1週間以内" | "急ぎではない";

export interface DiagnosisInput {
  amount: number;
  urgency: Urgency;
  industry: string;
  factoringType: "2社間" | "3社間" | "どちらでも";
  priority: Priority;
  isOnlinePreferred: boolean;
}

export interface DiagnosisResult {
  company: import("./company").Company;
  score: number;
  reasons: string[];
}
