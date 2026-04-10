import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { ArrowRight, TrendingUp, CreditCard, Wallet, PiggyBank, BarChart2, BookOpen } from "lucide-react";

const categories = [
  { icon: Wallet, label: "Budget Management", color: "bg-blue-50 text-blue-600" },
  { icon: CreditCard, label: "Financial Tools", color: "bg-violet-50 text-violet-600" },
  { icon: PiggyBank, label: "Saving Money", color: "bg-emerald-50 text-emerald-600" },
  { icon: TrendingUp, label: "Passive Income", color: "bg-orange-50 text-orange-600" },
  { icon: BarChart2, label: "Financial Literacy", color: "bg-sky-50 text-sky-600" },
  { icon: BookOpen, label: "Investment Strategy", color: "bg-amber-50 text-amber-600" },
];

const categoryColors: Record<string, string> = {
  Transportation: "bg-orange-100 text-orange-700",
  Subscriptions: "bg-violet-100 text-violet-700",
  Lifestyle: "bg-emerald-100 text-emerald-700",
  Housing: "bg-sky-100 text-sky-700",
};

export default function HomePage() {
  const articles = getAllArticles();
  const [featured, ...sideArticles] = articles;

  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
  ];

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-14 pb-10 md:pt-20 md:pb-14 flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          <div className="flex-1 max-w-xl">
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-4">
              The honest money blog
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.13] tracking-tight mb-5">
              News About Costs and Long-term Spending.
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              Everything you&apos;ve ever wanted to know about what things truly cost — cars,
              subscriptions, and lifestyle choices — brought to you honestly.
            </p>
            {featured && (
              <Link
                href={`/${featured.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Read Latest <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md w-full">
            {categories.map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex flex-col items-start gap-2.5 p-4 rounded-2xl border border-border bg-white hover:shadow-md transition-shadow cursor-default"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-xs font-semibold text-foreground leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Posts (dark section) ── */}
      <section className="bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-white tracking-tight">New Posts</h2>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              See All <ArrowRight size={14} />
            </Link>
          </div>

          {featured && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Link
                href={`/${featured.slug}`}
                className="lg:col-span-3 rounded-2xl overflow-hidden bg-gray-800 hover:bg-gray-750 transition-colors group flex flex-col"
              >
                <div className={`h-52 bg-linear-to-br ${featured.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #fff 0%, transparent 50%)" }} />
                  <span className="text-6xl">{featured.emoji}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-3">
                  <span className={`inline-block self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[featured.category] ?? "bg-blue-100 text-blue-700"}`}>
                    {featured.category}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-300 transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-sm text-white/60 leading-relaxed line-clamp-2 flex-1">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-2 text-white/40 text-xs mt-1">
                    <span>What Does This Really Cost</span>
                    <span>·</span>
                    <span>{featured.readTime} min read</span>
                    <span>·</span>
                    <span>{new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </Link>

              <div className="lg:col-span-2 flex flex-col gap-3">
                {articles.map((article, i) => (
                  <Link
                    key={article.slug}
                    href={`/${article.slug}`}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800 hover:bg-gray-700 transition-colors group"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${gradients[i] ?? gradients[0]} flex items-center justify-center text-2xl shrink-0`}>
                      {article.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-1 ${categoryColors[article.category] ?? "bg-blue-100 text-blue-700"}`}>
                        {article.category}
                      </span>
                      <p className="text-sm font-semibold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                        {article.title}
                      </p>
                      <p className="text-xs text-white/40 mt-1">{article.readTime} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── All Articles grid ── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">All Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col bg-white"
              >
                <div className={`h-40 bg-linear-to-br ${gradients[i] ?? gradients[0]} flex items-center justify-center text-5xl`}>
                  {article.emoji}
                </div>
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <span className={`inline-block self-start px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColors[article.category] ?? "bg-blue-100 text-blue-700"}`}>
                    {article.category}
                  </span>
                  <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                      Read <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="bg-secondary border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Join the thousands already on the list
          </p>
          <h2 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">
            Get notified — last news and articles
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            No spam. Just honest breakdowns of what things really cost.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="#" method="post">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
