import fs from "fs";
import path from "path";
import { Company } from "@/types/company";

const companiesDir = path.join(process.cwd(), "content/companies");

export function getAllCompanies(): Company[] {
  const files = fs.readdirSync(companiesDir).filter((f) => f.endsWith(".json"));
  const companies = files.map((file) => {
    const raw = fs.readFileSync(path.join(companiesDir, file), "utf-8");
    return JSON.parse(raw) as Company;
  });
  return companies.sort((a, b) => a.rankPosition - b.rankPosition);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  const filePath = path.join(companiesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Company;
}

export function getCompanySlugs(): string[] {
  return fs
    .readdirSync(companiesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function formatAmount(amount: number): string {
  if (amount === 0) return "制限なし";
  if (amount >= 100000000) return `${amount / 100000000}億円`;
  if (amount >= 10000) return `${amount / 10000}万円`;
  return `${amount}円`;
}

export function formatFeeRange(min: number, max: number): string {
  return `${min}%〜${max}%`;
}
