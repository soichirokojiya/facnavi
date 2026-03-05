#!/usr/bin/env node
/**
 * companiesData.ts を content/companies/*.json から再生成する
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "content/companies");
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
const companies = files.map(f => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")));
companies.sort((a, b) => a.rankPosition - b.rankPosition);

const out = 'import { Company } from "@/types/company";\n\n// Auto-generated from content/companies/*.json\nconst companiesData: Company[] = ' + JSON.stringify(companies, null, 2) + ';\n\nexport default companiesData;\n';
fs.writeFileSync(path.join(root, "src/app/shindan/companiesData.ts"), out);
console.log(`companiesData.ts regenerated with ${companies.length} companies`);
