import Link from "next/link";
import { DollarSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <DollarSign size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight uppercase text-white">
              WhatDoesThisReallyCost
            </span>
          </div>
          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Home</Link>
            <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Blog</Link>
            <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">About us</Link>
            <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">Contact us</Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} What Does This Really Cost. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            All cost estimates are approximations based on industry averages.
          </p>
        </div>
      </div>
    </footer>
  );
}
