import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticle, getArticleSlugs } from "@/lib/articles";
import { CostCalculator } from "@/components/calculators/CostCalculator";
import { ComparisonCalculator } from "@/components/calculators/ComparisonCalculator";
import { CreditCardPayoffCalculator } from "@/components/calculators/CreditCardPayoffCalculator";
import { RetirementCalculator } from "@/components/calculators/RetirementCalculator";
import { EmergencyFundCalculator } from "@/components/calculators/EmergencyFundCalculator";
import { RentVsBuyCalculator } from "@/components/calculators/RentVsBuyCalculator";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

const SITE_URL = "https://whatdoesthisreallycost.com";
const SITE_NAME = "What Does This Really Cost";

const categoryColors: Record<string, string> = {
  Transportation: "text-orange-600 bg-orange-50 border border-orange-200",
  Subscriptions: "text-violet-600 bg-violet-50 border border-violet-200",
  Lifestyle: "text-emerald-600 bg-emerald-50 border border-emerald-200",
  Housing: "text-sky-600 bg-sky-50 border border-sky-200",
  Investing: "text-blue-600 bg-blue-50 border border-blue-200",
  Debt: "text-red-600 bg-red-50 border border-red-200",
  Taxes: "text-gray-600 bg-gray-50 border border-gray-200",
  Retirement: "text-indigo-600 bg-indigo-50 border border-indigo-200",
  Insurance: "text-cyan-600 bg-cyan-50 border border-cyan-200",
  Career: "text-amber-600 bg-amber-50 border border-amber-200",
  Budgeting: "text-teal-600 bg-teal-50 border border-teal-200",
  Credit: "text-purple-600 bg-purple-50 border border-purple-200",
};

const mdxComponents = {
  CostCalculator,
  ComparisonCalculator,
  CreditCardPayoffCalculator,
  RetirementCalculator,
  EmergencyFundCalculator,
  RentVsBuyCalculator,
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

      {/* Breadcrumb bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-10 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#0055a5] transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/#articles`} className="hover:text-[#0055a5] transition-colors">{article.category}</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-xs">{article.title}</span>
        </div>
      </div>

      {/* Article header */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${categoryColors[article.category] ?? "text-blue-600 bg-blue-50 border border-blue-200"}`}>
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock size={11} />
                {article.readTime} min read
              </span>
              <time dateTime={article.publishedAt} className="text-xs text-gray-400">
                {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-4">
              {article.title}
            </h1>
            <p className="text-base text-gray-500 leading-relaxed border-l-4 border-[#0055a5] pl-4">
              {article.description}
            </p>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
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
              className="mt-10 pt-8 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-label="Article navigation"
            >
              {prevArticle ? (
                <Link
                  href={`/${prevArticle.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#0055a5] hover:shadow-sm transition-all"
                >
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <ArrowLeft size={12} /> Previous
                  </span>
                  <span className="text-sm font-bold text-gray-900 leading-snug">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : <div />}
              {nextArticle ? (
                <Link
                  href={`/${nextArticle.slug}`}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-gray-200 bg-white hover:border-[#0055a5] hover:shadow-sm transition-all text-right"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-gray-400">
                    Next <ArrowRight size={12} />
                  </span>
                  <span className="text-sm font-bold text-gray-900 leading-snug">
                    {nextArticle.title}
                  </span>
                </Link>
              ) : <div />}
            </nav>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Related articles */}
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-500">
                  More Articles
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {allArticles
                  .filter((a) => a.slug !== slug)
                  .slice(0, 8)
                  .map((a) => (
                    <Link
                      key={a.slug}
                      href={`/${a.slug}`}
                      className="flex items-start gap-3 px-5 py-3.5 group hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{a.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-[#0055a5] transition-colors line-clamp-2">
                          {a.title}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{a.readTime} min read</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Newsletter sidebar */}
            <div className="rounded-xl border border-[#dde8f5] bg-[#f0f5fb] p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0055a5] mb-1">Newsletter</p>
              <h3 className="text-sm font-black text-gray-900 mb-1.5">The honest money brief</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Real numbers. No fluff. Weekly.</p>
              <NewsletterForm compact />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
