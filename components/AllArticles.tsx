"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleFrontmatter } from "@/lib/articles";

const categoryColors: Record<string, string> = {
  Transportation: "bg-orange-100 text-orange-700",
  Subscriptions: "bg-violet-100 text-violet-700",
  Lifestyle: "bg-emerald-100 text-emerald-700",
  Housing: "bg-sky-100 text-sky-700",
  Investing: "bg-blue-100 text-blue-700",
  Debt: "bg-red-100 text-red-700",
  Taxes: "bg-gray-100 text-gray-700",
  Retirement: "bg-indigo-100 text-indigo-700",
  Insurance: "bg-cyan-100 text-cyan-700",
  Career: "bg-amber-100 text-amber-700",
  Budgeting: "bg-teal-100 text-teal-700",
  Credit: "bg-purple-100 text-purple-700",
};

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-rose-600",
  "from-amber-500 to-yellow-600",
  "from-fuchsia-500 to-violet-700",
];

const ARTICLES_PER_PAGE = 6;

export default function AllArticles({ articles }: { articles: ArticleFrontmatter[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of articles) {
      counts[a.category] = (counts[a.category] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const filtered = useMemo(
    () => (activeCategory ? articles.filter((a) => a.category === activeCategory) : articles),
    [articles, activeCategory]
  );

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const start = page * ARTICLES_PER_PAGE;
  const pageArticles = filtered.slice(start, start + ARTICLES_PER_PAGE);

  function selectCategory(cat: string | null) {
    setActiveCategory(cat);
    setPage(0);
  }

  return (
    <div>
      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => selectCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
            activeCategory === null
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:bg-secondary"
          }`}
        >
          All
          <span className="ml-1.5 text-xs opacity-70">({articles.length})</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {cat}
            <span className="ml-1.5 text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pageArticles.map((article, i) => (
          <Link
            key={article.slug}
            href={`/${article.slug}`}
            className="group rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col bg-white"
          >
            <div className={`h-40 bg-linear-to-br ${gradients[(start + i) % gradients.length]} flex items-center justify-center text-5xl`}>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="p-2 rounded-xl border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {(() => {
            if (totalPages <= 8) {
              return Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors border ${
                    i === page
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-secondary text-foreground"
                  }`}
                >
                  {i + 1}
                </button>
              ));
            }

            // Build page numbers with ellipsis
            // Always show: first 2, last 2, current ±1, with ... gaps
            const shown = new Set<number>();
            [0, 1].forEach((i) => { if (i < totalPages) shown.add(i); });
            [totalPages - 2, totalPages - 1].forEach((i) => { if (i >= 0) shown.add(i); });
            [page - 1, page, page + 1].forEach((i) => { if (i >= 0 && i < totalPages) shown.add(i); });

            const sorted = Array.from(shown).sort((a, b) => a - b);
            const pages: (number | "...")[] = [];
            for (let idx = 0; idx < sorted.length; idx++) {
              if (idx > 0 && sorted[idx] - sorted[idx - 1] > 1) pages.push("...");
              pages.push(sorted[idx]);
            }

            return pages.map((p, idx) =>
              p === "..." ? (
                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm select-none">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors border ${
                    p === page
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:bg-secondary text-foreground"
                  }`}
                >
                  {p + 1}
                </button>
              )
            );
          })()}

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="p-2 rounded-xl border border-border hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
