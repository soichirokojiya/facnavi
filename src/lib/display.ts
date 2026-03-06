import { Company } from "@/types/company";

/** 表示用の名前（ブランド名優先、なければ法人名） */
export function displayName(company: Company): string {
  return company.brandName || company.name;
}
