import Link from "next/link";
import { DollarSign } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <DollarSign size={15} className="text-white" />
          </div>
          <span className="font-extrabold text-foreground text-sm tracking-tight uppercase">
            WhatDoesThisReallyCost
          </span>
        </Link>
      </div>
    </header>
  );
}
