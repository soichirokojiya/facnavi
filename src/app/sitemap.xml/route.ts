import { getAllCompanies, getCompanySlugs } from "@/lib/companies";
import { getArticleSlugs } from "@/lib/articles";
import { getReviewedCompanySlugs } from "@/lib/reviews";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

const PER_PAGE = 10;

interface SitemapEntry {
  url: string;
  changefreq: string;
  priority: number;
}

function buildEntries(): SitemapEntry[] {
  const allCompanies = getAllCompanies();
  const companySlugs = getCompanySlugs();
  const articleSlugs = getArticleSlugs();
  const reviewCompanySlugs = getReviewedCompanySlugs();

  const entries: SitemapEntry[] = [
    { url: SITE_URL, changefreq: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/ranking`, changefreq: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kuchikomi`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/column`, changefreq: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/shindan`, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, changefreq: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/terms`, changefreq: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changefreq: "yearly", priority: 0.3 },
  ];

  // Ranking pagination
  const rankingTotalPages = Math.ceil(allCompanies.length / PER_PAGE);
  for (let i = 2; i <= rankingTotalPages; i++) {
    entries.push({ url: `${SITE_URL}/ranking/page/${i}`, changefreq: "weekly", priority: 0.7 });
  }

  // Category pages with pagination
  for (const cat of CATEGORIES) {
    const filtered = allCompanies.filter(cat.filter);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    entries.push({ url: `${SITE_URL}/ranking/category/${cat.slug}`, changefreq: "weekly", priority: 0.8 });
    for (let p = 2; p <= totalPages; p++) {
      entries.push({ url: `${SITE_URL}/ranking/category/${cat.slug}/${p}`, changefreq: "weekly", priority: 0.7 });
    }
  }

  // Company pages
  for (const slug of companySlugs) {
    entries.push({ url: `${SITE_URL}/ranking/${slug}`, changefreq: "weekly", priority: 0.8 });
  }

  // Article pages
  for (const slug of articleSlugs) {
    entries.push({ url: `${SITE_URL}/column/${slug}`, changefreq: "monthly", priority: 0.7 });
  }

  // Review pages
  for (const slug of reviewCompanySlugs) {
    entries.push({ url: `${SITE_URL}/kuchikomi/${slug}`, changefreq: "weekly", priority: 0.6 });
  }

  return entries;
}

function toXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `<url>
<loc>${e.url}</loc>
<changefreq>${e.changefreq}</changefreq>
<priority>${e.priority}</priority>
</url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function GET() {
  const xml = toXml(buildEntries());
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
