import { Company } from "@/types/company";
import { DiagnosisInput, DiagnosisResult } from "@/types/diagnosis";

export function diagnose(
  input: DiagnosisInput,
  companies: Company[]
): DiagnosisResult[] {
  const results = companies.map((company) => {
    let score = 0;
    const reasons: string[] = [];

    // Fee priority
    if (input.priority === "手数料") {
      const avgFee = (company.feeRange.min + company.feeRange.max) / 2;
      if (avgFee <= 5) {
        score += 30;
        reasons.push("手数料が非常に安い");
      } else if (avgFee <= 10) {
        score += 20;
        reasons.push("手数料が比較的安い");
      } else {
        score += 10;
      }
    }

    // Speed priority
    if (input.priority === "スピード" || input.urgency === "即日") {
      if (company.speedDays <= 1) {
        score += 30;
        reasons.push("最短即日で入金可能");
      }
    }

    // Urgency bonus
    if (input.urgency === "即日" && company.speedDays <= 1) {
      score += 15;
    } else if (input.urgency === "3日以内" && company.speedDays <= 3) {
      score += 10;
    }

    // Online preference
    if (input.isOnlinePreferred && company.onlineComplete) {
      score += 15;
      reasons.push("オンライン完結対応");
    }

    // Factoring type match
    if (input.factoringType !== "どちらでも") {
      if (
        company.factoringType.includes(input.factoringType) ||
        company.factoringType === "2社間・3社間"
      ) {
        score += 10;
        reasons.push(`${input.factoringType}ファクタリングに対応`);
      }
    }

    // Amount range
    if (input.amount > 0) {
      if (
        (company.minAmount === 0 || input.amount >= company.minAmount) &&
        (company.maxAmount === 0 || input.amount <= company.maxAmount)
      ) {
        score += 10;
        reasons.push("希望金額に対応");
      }
    }

    // Industry match
    if (
      input.industry &&
      company.targetIndustries?.includes(input.industry)
    ) {
      score += 10;
      reasons.push(`${input.industry}の実績あり`);
    }

    // Review/support priority
    if (input.priority === "審査") {
      if (company.features.some((f) => f.includes("審査"))) {
        score += 15;
        reasons.push("審査通過率が高い");
      }
    }
    if (input.priority === "サポート") {
      if (!company.onlineComplete) {
        score += 10;
        reasons.push("対面での手厚いサポート");
      }
      if (company.features.some((f) => f.includes("出張") || f.includes("サポート"))) {
        score += 10;
        reasons.push("充実したサポート体制");
      }
    }

    // Base rating bonus
    score += company.overallRating * 3;

    return { company, score, reasons };
  });

  return results.sort((a, b) => b.score - a.score);
}
