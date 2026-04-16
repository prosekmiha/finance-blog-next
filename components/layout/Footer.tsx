import Link from "next/link";
import { DollarSign } from "lucide-react";

const footerLinks = {
  Topics: ["Investing", "Retirement", "Budgeting", "Housing", "Debt", "Taxes"],
  Resources: ["All Articles", "Calculators", "Newsletter", "About"],
  Categories: ["Credit", "Insurance", "Career", "Lifestyle", "Transportation", "Subscriptions"],
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-[#0055a5] flex items-center justify-center shrink-0">
                <DollarSign size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="font-black text-[13px] tracking-tight uppercase text-white">
                WhatDoesThisReallyCost
              </span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed">
              Honest, data-driven breakdowns of what things actually cost — so you can make smarter financial decisions.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/#articles"
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} What Does This Really Cost. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            For educational purposes only. Not financial advice.
          </p>
        </div>

      </div>
    </footer>
  );
}
