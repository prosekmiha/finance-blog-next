import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  return [
    {
      url: "https://whatdoesthisreallycost.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...articles.map((article) => ({
      url: `https://whatdoesthisreallycost.com/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
