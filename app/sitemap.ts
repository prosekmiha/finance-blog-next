import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const SITE_URL = "https://whatdoesthisreallycost.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `${SITE_URL}/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
