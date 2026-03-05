import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const companiesDir = path.join(__dirname, "..", "content", "companies");
const reviewsPath = path.join(__dirname, "..", "content", "reviews", "reviews.json");

// Load reviews and calculate averages
const reviews = JSON.parse(fs.readFileSync(reviewsPath, "utf-8"));
const avgMap = {};
const countMap = {};
for (const r of reviews) {
  if (avgMap[r.companySlug] === undefined) {
    avgMap[r.companySlug] = 0;
    countMap[r.companySlug] = 0;
  }
  avgMap[r.companySlug] += r.rating;
  countMap[r.companySlug]++;
}
for (const slug in avgMap) {
  avgMap[slug] = Math.round((avgMap[slug] / countMap[slug]) * 10) / 10;
}

// Bayesian average: weighted score considering review count
// score = (count / (count + m)) * avg + (m / (count + m)) * globalAvg
// m = minimum reviews for full weight (set to 3)
const m = 3;
const allRatings = Object.values(avgMap);
const globalAvg = allRatings.length > 0
  ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
  : 3.5;

const files = fs.readdirSync(companiesDir).filter(f => f.endsWith(".json"));
const companies = files.map(f => {
  const d = JSON.parse(fs.readFileSync(path.join(companiesDir, f), "utf-8"));
  const avg = avgMap[d.slug] !== undefined ? avgMap[d.slug] : (d.overallRating || 3.0);
  const count = countMap[d.slug] || 0;
  // Bayesian weighted score
  d._score = (count / (count + m)) * avg + (m / (count + m)) * globalAvg;
  d._rating = avg;
  d._count = count;
  return d;
});

// Boost certain promoted companies slightly
const BOOST = {
  "betrading": 0.15,
  "labol": 0.25,
  "ququmo": 0.25,
  "paytner": 0.35,
  "accel-factor": 0.30,
};
for (const c of companies) {
  if (BOOST[c.slug]) {
    c._score += BOOST[c.slug];
  }
}

// Sort by Bayesian score (desc)
companies.sort((a, b) => b._score - a._score || a.slug.localeCompare(b.slug));

// Assign new rank positions and update overallRating
companies.forEach((c, i) => {
  c.rankPosition = i + 1;
  c.overallRating = c._rating;
  const score = c._score;
  const rating = c._rating;
  const count = c._count;
  delete c._score;
  delete c._rating;
  delete c._count;
  const fp = path.join(companiesDir, c.slug + ".json");
  fs.writeFileSync(fp, JSON.stringify(c, null, 2) + "\n");
  if (i < 20) {
    console.log(`${c.rankPosition}. ${c.name} (rating: ${rating}, reviews: ${count}, score: ${score.toFixed(2)})`);
  }
});

console.log(`\nRank positions updated for ${companies.length} companies (global avg: ${globalAvg.toFixed(2)})`);
