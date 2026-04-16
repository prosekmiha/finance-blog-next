"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Search, X, Clock } from "lucide-react";
import { ArticleFrontmatter } from "@/lib/articles";

const categoryColors: Record<string, string> = {
  Transportation: "text-orange-600 bg-orange-50 border-orange-200",
  Subscriptions: "text-violet-600 bg-violet-50 border-violet-200",
  Lifestyle: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Housing: "text-sky-600 bg-sky-50 border-sky-200",
  Investing: "text-blue-600 bg-blue-50 border-blue-200",
  Debt: "text-red-600 bg-red-50 border-red-200",
  Taxes: "text-gray-600 bg-gray-50 border-gray-200",
  Retirement: "text-indigo-600 bg-indigo-50 border-indigo-200",
  Insurance: "text-cyan-600 bg-cyan-50 border-cyan-200",
  Career: "text-amber-600 bg-amber-50 border-amber-200",
  Budgeting: "text-teal-600 bg-teal-50 border-teal-200",
  Credit: "text-purple-600 bg-purple-50 border-purple-200",
};

const ARTICLES_PER_PAGE = 12;

function highlight(text: string, query: string) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-900 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getUrlCategory(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("category");
}

export default function AllArticles({ articles }: { articles: ArticleFrontmatter[] }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Read ?category= from URL on mount and on popstate (browser back/forward)
  useEffect(() => {
    function sync() {
      const cat = getUrlCategory();
      setActiveCategory(cat);
      setPage(0);
    }
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(t);
  }, [query]);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of articles) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [articles]);

  const filtered = useMemo(() => {
    let list = activeCategory ? articles.filter((a) => a.category === activeCategory) : articles;
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, activeCategory, debouncedQuery]);

  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const start = page * ARTICLES_PER_PAGE;
  const pageArticles = filtered.slice(start, start + ARTICLES_PER_PAGE);

  function selectCategory(cat: string | null) {
    setActiveCategory(cat);
    setPage(0);
  }

  function clearSearch() {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }

  return (
    <div>
      {/* Search + filters row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative sm:w-64">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            id="articles-search"
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search articles…"
            className="w-full pl-8 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#0055a5] transition-colors"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => selectCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeCategory === null
                ? "bg-[#0055a5] text-white border-[#0055a5]"
                : "border-gray-200 text-gray-600 hover:border-[#0055a5] hover:text-[#0055a5]"
            }`}
          >
            All <span className="opacity-60">({articles.length})</span>
          </button>
          {categories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                activeCategory === cat
                  ? "bg-[#0055a5] text-white border-[#0055a5]"
                  : "border-gray-200 text-gray-600 hover:border-[#0055a5] hover:text-[#0055a5]"
              }`}
            >
              {cat} <span className="opacity-60">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          <Search size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-semibold">No articles found for &ldquo;{debouncedQuery}&rdquo;</p>
          <button onClick={clearSearch} className="mt-2 text-xs text-[#0055a5] hover:underline">Clear search</button>
        </div>
      )}

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {pageArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/${article.slug}`}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200 flex flex-col"
          >
            {/* Thin category color bar */}
            <div className={`h-1 w-full ${
              article.category === "Investing" ? "bg-blue-500" :
              article.category === "Retirement" ? "bg-indigo-500" :
              article.category === "Budgeting" ? "bg-teal-500" :
              article.category === "Housing" ? "bg-sky-500" :
              article.category === "Debt" ? "bg-red-500" :
              article.category === "Taxes" ? "bg-gray-500" :
              article.category === "Credit" ? "bg-purple-500" :
              article.category === "Transportation" ? "bg-orange-500" :
              article.category === "Lifestyle" ? "bg-emerald-500" :
              article.category === "Insurance" ? "bg-cyan-500" :
              article.category === "Career" ? "bg-amber-500" :
              "bg-violet-500"
            }`} />

            <div className="p-5 flex flex-col gap-2 flex-1">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${categoryColors[article.category] ?? "text-blue-600 bg-blue-50 border-blue-200"}`}>
                  {article.category}
                </span>
                <span className="text-2xl">{article.emoji}</span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#0055a5] transition-colors flex-1">
                {highlight(article.title, debouncedQuery)}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                {highlight(article.description, debouncedQuery)}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1 pt-3 border-t border-gray-100">
                <Clock size={11} />
                <span>{article.readTime} min read</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-10">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>

          {(() => {
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
                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold border transition-colors ${
                    p === page
                      ? "bg-[#0055a5] text-white border-[#0055a5]"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
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
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
