import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { ArrowRight, Clock } from "lucide-react";
import AllArticles from "@/components/AllArticles";
import NewsletterForm from "@/components/NewsletterForm";

const categoryColors: Record<string, string> = {
  Transportation: "text-orange-600",
  Subscriptions: "text-violet-600",
  Lifestyle: "text-emerald-600",
  Housing: "text-sky-600",
  Investing: "text-blue-600",
  Debt: "text-red-600",
  Taxes: "text-gray-600",
  Retirement: "text-indigo-600",
  Insurance: "text-cyan-600",
  Career: "text-amber-600",
  Budgeting: "text-teal-600",
  Credit: "text-purple-600",
  Income: "text-green-600",
  "Real Estate": "text-rose-600",
};


function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default function HomePage() {
  const articles = getAllArticles();
  const hero = articles[0];
  const secondary = articles.slice(1, 4);
  const trending = articles.slice(4, 9);
  const rest = articles;

  return (
    <main className="bg-white">


      {/* ── Breaking bar ── */}
      <div className="bg-[#0055a5] text-white text-xs font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center gap-3">
          <span className="bg-white text-[#0055a5] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wide">New</span>
          {hero && (
            <Link href={`/${hero.slug}`} className="hover:underline truncate">
              {hero.title}
            </Link>
          )}
        </div>
      </div>

      {/* ── Hero section ── */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">

          {/* Page title row */}
          <div className="mb-6 pb-4 border-b border-gray-900">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
              Personal Finance &amp; Cost Analysis
            </h1>
          </div>

          {hero && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8">

              {/* Hero article */}
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <Link href={`/${hero.slug}`} className="group block">
                  <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-16/7 flex items-center justify-center">
                    <div className="text-7xl">{hero.emoji}</div>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wide ${categoryColors[hero.category] ?? "text-blue-600"}`}>
                    {hero.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mt-1.5 mb-2.5 group-hover:text-[#0055a5] transition-colors">
                    {hero.title}
                  </h2>
                  <p className="text-base text-gray-600 leading-relaxed mb-3 line-clamp-3">
                    {hero.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{hero.readTime} min read</span>
                    <span>·</span>
                    <span>{formatDate(hero.publishedAt)}</span>
                  </div>
                </Link>
              </div>

              {/* Secondary articles */}
              <div className="mt-6 lg:mt-0 flex flex-col divide-y divide-gray-100">
                {secondary.map((article) => (
                  <Link key={article.slug} href={`/${article.slug}`} className="group py-4 first:pt-0 flex gap-4">
                    <div className="w-20 h-16 bg-gray-100 rounded-md flex items-center justify-center text-3xl shrink-0">
                      {article.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${categoryColors[article.category] ?? "text-blue-600"}`}>
                        {article.category}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug mt-0.5 group-hover:text-[#0055a5] transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-gray-400 mt-1">{article.readTime} min read</p>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          )}
        </div>
      </section>

      {/* ── Main content + sidebar ── */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Left: latest articles list */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 pb-3 border-b-2 border-gray-900 mb-6">
              Latest Articles
            </h2>
            <div className="divide-y divide-gray-100">
              {articles.slice(0, 8).map((article) => (
                <Link key={article.slug} href={`/${article.slug}`} className="group flex gap-5 py-5 first:pt-0">
                  <div className="w-24 h-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center text-4xl shrink-0">
                    {article.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${categoryColors[article.category] ?? "text-blue-600"}`}>
                      {article.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug mt-0.5 mb-1.5 group-hover:text-[#0055a5] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-2">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={11} />
                      <span>{article.readTime} min read</span>
                      <span>·</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="#articles"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:border-[#0055a5] hover:text-[#0055a5] transition-colors"
            >
              View all articles <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: sidebar */}
          <div className="space-y-8">

            {/* Trending */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 pb-3 border-b-2 border-gray-900 mb-4">
                Trending Now
              </h2>
              <ol className="space-y-4">
                {trending.map((article, i) => (
                  <li key={article.slug}>
                    <Link href={`/${article.slug}`} className="group flex gap-3">
                      <span className="text-3xl font-black text-gray-100 leading-none w-8 shrink-0 select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${categoryColors[article.category] ?? "text-blue-600"}`}>
                          {article.category}
                        </span>
                        <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#0055a5] transition-colors mt-0.5">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>

            {/* Newsletter */}
            <div className="bg-[#f0f5fb] rounded-xl p-5 border border-[#dde8f5]">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0055a5] mb-1">Newsletter</p>
              <h3 className="text-base font-black text-gray-900 mb-1.5">The honest money brief</h3>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Real numbers. No fluff. Delivered weekly.
              </p>
              <NewsletterForm compact />
            </div>

            {/* Topics */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 pb-3 border-b-2 border-gray-900 mb-4">
                Browse Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {["Investing", "Retirement", "Budgeting", "Housing", "Debt", "Taxes", "Credit", "Insurance", "Career", "Lifestyle"].map((cat) => (
                  <a
                    key={cat}
                    href="#articles"
                    className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-full text-gray-600 hover:border-[#0055a5] hover:text-[#0055a5] hover:bg-[#f0f5fb] transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── All Articles ── */}
      <section id="articles" className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 pb-3 border-b-2 border-gray-900 mb-8">
            All Articles
          </h2>
          <AllArticles articles={rest} />
        </div>
      </section>

    </main>
  );
}
