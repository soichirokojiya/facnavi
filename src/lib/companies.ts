import fs from "fs";
import path from "path";
import { Company } from "@/types/company";
import { Review } from "@/types/review";

const companiesDir = path.join(process.cwd(), "content/companies");
const reviewsPath = path.join(process.cwd(), "content/reviews/reviews.json");

function loadReviewAverages(): Record<string, number> {
  const raw = fs.readFileSync(reviewsPath, "utf-8");
  const reviews = JSON.parse(raw) as Review[];
  const map: Record<string, { sum: number; count: number }> = {};
  for (const r of reviews) {
    if (!map[r.companySlug]) map[r.companySlug] = { sum: 0, count: 0 };
    map[r.companySlug].sum += r.rating;
    map[r.companySlug].count++;
  }
  const result: Record<string, number> = {};
  for (const [slug, { sum, count }] of Object.entries(map)) {
    result[slug] = Math.round((sum / count) * 10) / 10;
  }
  return result;
}

export function getAllCompanies(): Company[] {
  const files = fs.readdirSync(companiesDir).filter((f) => f.endsWith(".json"));
  const averages = loadReviewAverages();
  const companies = files.map((file) => {
    const raw = fs.readFileSync(path.join(companiesDir, file), "utf-8");
    const company = JSON.parse(raw) as Company;
    if (averages[company.slug] !== undefined) {
      company.overallRating = averages[company.slug];
    }
    return company;
  });
  return companies.sort((a, b) => a.rankPosition - b.rankPosition);
}

export function getCompanyBySlug(slug: string): Company | undefined {
  const filePath = path.join(companiesDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  const raw = fs.readFileSync(filePath, "utf-8");
  const company = JSON.parse(raw) as Company;
  const averages = loadReviewAverages();
  if (averages[slug] !== undefined) {
    company.overallRating = averages[slug];
  }
  return company;
}

export function getCompanySlugs(): string[] {
  return fs
    .readdirSync(companiesDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

export function getCompanyCount(): number {
  return fs.readdirSync(companiesDir).filter((f) => f.endsWith(".json")).length;
}
