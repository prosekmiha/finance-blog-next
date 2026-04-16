"use client";

import Link from "next/link";
import { useState } from "react";
import { DollarSign, Search, Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  {
    label: "Investing",
    href: "/?category=Investing#articles",
    sub: ["Index Funds", "ETFs", "Dividend Stocks", "Retirement Accounts"],
  },
  {
    label: "Budgeting",
    href: "/?category=Budgeting#articles",
    sub: ["Savings Rate", "Emergency Fund", "Debt Payoff", "Spending"],
  },
  {
    label: "Housing",
    href: "/?category=Housing#articles",
    sub: ["Rent vs Buy", "Mortgages", "Property Costs", "Real Estate"],
  },
  {
    label: "Retirement",
    href: "/?category=Retirement#articles",
    sub: ["401(k)", "Roth IRA", "FIRE", "Social Security"],
  },
  {
    label: "More",
    href: "/#articles",
    sub: ["Taxes", "Insurance", "Career", "Credit"],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#0055a5] flex items-center justify-center">
            <DollarSign size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-black text-[13px] tracking-tight text-gray-900 uppercase hidden sm:block">
            WhatDoesThisReallyCost
          </span>
          <span className="font-black text-[13px] tracking-tight text-gray-900 uppercase sm:hidden">
            WDTRC
          </span>
        </Link>

        {/* Search bar — desktop (scrolls to AllArticles search) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-6">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#0055a5] focus:bg-white transition-colors cursor-pointer"
              readOnly
              onClick={() => {
                document.getElementById("articles-search")?.scrollIntoView({ behavior: "smooth", block: "center" });
                setTimeout(() => document.getElementById("articles-search")?.focus(), 400);
              }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="#articles"
            className="hidden sm:inline-flex items-center px-4 py-1.5 bg-[#0055a5] text-white text-sm font-semibold rounded-full hover:bg-[#004494] transition-colors"
          >
            All Articles
          </Link>
          <button
            className="md:hidden p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Nav bar — desktop */}
      <nav className="hidden md:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-0">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <a
                href={item.href}
                className="flex items-center gap-1 px-4 py-3 text-[13px] font-semibold text-gray-700 hover:text-[#0055a5] transition-colors"
              >
                {item.label}
                <ChevronDown size={12} className="text-gray-400" />
              </a>
              {openDropdown === item.label && (
                <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-40 z-50">
                  {item.sub.map((s) => (
                    <a
                      key={s}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#0055a5] transition-colors"
                    >
                      {s}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          <div className="relative mb-4">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#0055a5] cursor-pointer"
              readOnly
              onClick={() => {
                setMobileOpen(false);
                setTimeout(() => {
                  document.getElementById("articles-search")?.scrollIntoView({ behavior: "smooth", block: "center" });
                  setTimeout(() => document.getElementById("articles-search")?.focus(), 400);
                }, 150);
              }}
            />
          </div>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#0055a5] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
