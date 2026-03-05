import type { MetadataRoute } from "next";
import { getCompanySlugs } from "@/lib/companies";
import { getArticleSlugs } from "@/lib/articles";
import { getReviewedCompanySlugs } from "@/lib/reviews";
import { CATEGORIES } from "@/lib/categories";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const companySlugs = getCompanySlugs();
  const articleSlugs = getArticleSlugs();
  const reviewCompanySlugs = getReviewedCompanySlugs();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/ranking`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/kuchikomi`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/column`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/shindan`, changeFrequency: "monthly", priority: 0.7 },
  ];

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

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/ranking/category/${cat.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...companyPages, ...articlePages, ...reviewPages];
}
