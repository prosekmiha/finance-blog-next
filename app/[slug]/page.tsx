import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/articles";
import { CostCalculator } from "@/components/calculators/CostCalculator";
import { ComparisonCalculator } from "@/components/calculators/ComparisonCalculator";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";

const SITE_URL = "https://whatdoesthisreallycost.com";
const SITE_NAME = "What Does This Really Cost";

const categoryColors: Record<string, string> = {
  Transportation: "bg-orange-100 text-orange-700",
  Subscriptions: "bg-violet-100 text-violet-700",
  Lifestyle: "bg-emerald-100 text-emerald-700",
  Housing: "bg-sky-100 text-sky-700",
};

const mdxComponents = {
  CostCalculator,
  ComparisonCalculator,
};

export async function generateStaticParams() {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords ?? [
      `true cost of ${article.category.toLowerCase()}`,
      "personal finance",
      "cost breakdown",
      "money calculator",
      article.title,
    ],
    alternates: {
      canonical: `${SITE_URL}/${article.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/${article.slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const wordCount = article.content.split(/\s+/).length;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    wordCount,
    timeRequired: `PT${article.readTime}M`,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${article.slug}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: article.category, item: `${SITE_URL}/?category=${encodeURIComponent(article.category)}` },
        { "@type": "ListItem", position: 3, name: article.title, item: `${SITE_URL}/${article.slug}` },
      ],
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Article header */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} /> All articles
            </Link>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] ?? "bg-blue-100 text-blue-700"}`}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={11} />
                  {article.readTime} min read
                </span>
                <span className="text-xs text-muted-foreground">
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight tracking-tight mb-5">
                {article.title}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
                {article.description}
              </p>
            </div>

            <div className={`lg:col-span-2 h-44 rounded-2xl bg-linear-to-br ${article.gradient} flex items-center justify-center text-7xl shadow-xl`}>
              {article.emoji}
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <article className="prose-article" aria-label={article.title}>
              <MDXRemote source={article.content} components={mdxComponents} />
            </article>

            <CostCalculator
              initialCostDefault={article.initialCost}
              monthlyCostDefault={article.monthlyCost}
              yearsDefault={article.defaultYears}
            />

            {article.comparisonType === "vehicle" && (
              <ComparisonCalculator
                title="Compare Two Options"
                subtitle="How does this compare to your alternative?"
                optionADefault={{
                  label: article.slug.includes("tesla") ? "Tesla Model 3" : "New Car",
                  initialCost: article.initialCost,
                  monthlyCost: article.monthlyCost,
                }}
                optionBDefault={{
                  label: article.slug.includes("tesla") ? "Toyota Camry" : "Used Car",
                  initialCost: Math.round(article.initialCost * 0.6),
                  monthlyCost: Math.round(article.monthlyCost * 0.7),
                }}
                yearsDefault={article.defaultYears}
              />
            )}

            {article.comparisonType === "subscription" && (
              <ComparisonCalculator
                title="Streaming vs. Minimal"
                subtitle="What if you cut back to just one service?"
                optionADefault={{
                  label: "All Streaming Services",
                  initialCost: 0,
                  monthlyCost: article.monthlyCost,
                }}
                optionBDefault={{
                  label: "Minimal Streaming (~1 service)",
                  initialCost: 0,
                  monthlyCost: 15,
                }}
                yearsDefault={article.defaultYears}
              />
            )}

            {/* Article navigation */}
            <nav
              className="mt-8 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-label="Article navigation"
            >
              {prevArticle ? (
                <Link
                  href={`/${prevArticle.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowLeft size={12} /> Previous
                  </span>
                  <span className="text-sm font-bold text-foreground leading-snug">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextArticle ? (
                <Link
                  href={`/${nextArticle.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-2xl border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all text-right"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    Next <ArrowRight size={12} />
                  </span>
                  <span className="text-sm font-bold text-foreground leading-snug">
                    {nextArticle.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="rounded-2xl border border-border bg-white p-5">
              <h2 className="text-sm font-extrabold text-foreground mb-4 uppercase tracking-wide">
                More Articles
              </h2>
              <div className="space-y-4">
                {allArticles
                  .filter((a) => a.slug !== slug)
                  .map((a) => (
                    <Link
                      key={a.slug}
                      href={`/${a.slug}`}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                        {a.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.readTime} min read</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
