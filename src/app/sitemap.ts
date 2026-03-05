import type { MetadataRoute } from "next";
import { getAllCompanies, getCompanySlugs } from "@/lib/companies";
import { getArticleSlugs } from "@/lib/articles";
import { getReviewedCompanySlugs } from "@/lib/reviews";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

const PER_PAGE = 10;

export default function sitemap(): MetadataRoute.Sitemap {
  const allCompanies = getAllCompanies();
  const companySlugs = getCompanySlugs();
  const articleSlugs = getArticleSlugs();
  const reviewCompanySlugs = getReviewedCompanySlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/ranking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kuchikomi`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/column`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/shindan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Ranking pagination pages
  const rankingTotalPages = Math.ceil(allCompanies.length / PER_PAGE);
  const rankingPaginationPages: MetadataRoute.Sitemap = Array.from(
    { length: rankingTotalPages - 1 },
    (_, i) => ({
      url: `${SITE_URL}/ranking/page/${i + 2}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })
  );

  const companyPages: MetadataRoute.Sitemap = companySlugs.map((slug) => ({
    url: `${SITE_URL}/ranking/${slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE_URL}/column/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const reviewPages: MetadataRoute.Sitemap = reviewCompanySlugs.map(
    (slug) => ({
      url: `${SITE_URL}/kuchikomi/${slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  // Category pages with pagination
  const categoryPages: MetadataRoute.Sitemap = [];
  for (const cat of CATEGORIES) {
    const filtered = allCompanies.filter(cat.filter);
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    categoryPages.push({
      url: `${SITE_URL}/ranking/category/${cat.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
    for (let p = 2; p <= totalPages; p++) {
      categoryPages.push({
        url: `${SITE_URL}/ranking/category/${cat.slug}/${p}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  return [...staticPages, ...rankingPaginationPages, ...categoryPages, ...companyPages, ...articlePages, ...reviewPages];
}
