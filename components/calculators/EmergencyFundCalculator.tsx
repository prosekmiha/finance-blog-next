"use client";

import { useState, useMemo } from "react";
import { DollarSign, Shield, TrendingUp } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const SITUATIONS = [
  { label: "Stable W-2, dual income", multiplier: 3, description: "Two incomes, no dependents" },
  { label: "Stable W-2, single income", multiplier: 4, description: "One income or dependents" },
  { label: "W-2, unstable industry", multiplier: 5, description: "Tech, finance, or volatile sector" },
  { label: "Freelance / 1099", multiplier: 7, description: "Variable income, self-employed" },
  { label: "Business owner", multiplier: 9, description: "Highly variable revenue" },
];

const HYSA_RATE = 0.045;

export function EmergencyFundCalculator() {
  const [rent, setRent] = useState(1500);
  const [utilities, setUtilities] = useState(200);
  const [groceries, setGroceries] = useState(400);
  const [transport, setTransport] = useState(400);
  const [insurance, setInsurance] = useState(200);
  const [debtPayments, setDebtPayments] = useState(300);
  const [situation, setSituation] = useState(1);
  const [currentSaved, setCurrentSaved] = useState(2000);
  const [monthlySavings, setMonthlySavings] = useState(300);

  const monthlyEssentials = rent + utilities + groceries + transport + insurance + debtPayments;
  const selectedSituation = SITUATIONS[situation];
  const target = monthlyEssentials * selectedSituation.multiplier;
  const gap = Math.max(0, target - currentSaved);
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(gap / monthlySavings) : null;
  const annualYield = currentSaved * HYSA_RATE;
  const progress = Math.min(100, Math.round((currentSaved / target) * 100));

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-cyan-600 px-6 py-5">
        <h2 className="text-white text-xl font-bold">Emergency Fund Calculator</h2>
        <p className="text-white/80 text-sm mt-1">Calculate your exact target and how long it will take to get there</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Situation selector */}
        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">Your employment situation</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SITUATIONS.map((s, i) => (
              <button key={i} onClick={() => setSituation(i)}
                className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  situation === i
                    ? "bg-cyan-50 border-cyan-400 text-cyan-900"
                    : "border-border hover:bg-secondary text-foreground"
                }`}>
                <span className="font-semibold block">{s.label}</span>
                <span className="text-xs text-muted-foreground">{s.description} — {s.multiplier}× months</span>
              </button>
            ))}
          </div>
        </div>

        {/* Monthly essentials */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">Monthly essential expenses</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Rent / Mortgage", value: rent, set: setRent },
              { label: "Utilities", value: utilities, set: setUtilities },
              { label: "Groceries", value: groceries, set: setGroceries },
              { label: "Transportation", value: transport, set: setTransport },
              { label: "Health Insurance", value: insurance, set: setInsurance },
              { label: "Min. Debt Payments", value: debtPayments, set: setDebtPayments },
            ].map(({ label, value, set }) => (
              <div key={label} className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">{label}</label>
                <div className="relative">
                  <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="number" min="0" value={value}
                    onChange={(e) => set(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-7 pr-2 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-sm font-semibold text-foreground border-t border-border pt-3">
            <span>Monthly essentials total</span>
            <span>{fmt(monthlyEssentials)}</span>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-cyan-50 border border-cyan-200 p-4 text-center">
            <Shield size={18} className="mx-auto mb-1 text-cyan-600" />
            <p className="text-2xl font-bold text-foreground">{fmt(target)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your target ({selectedSituation.multiplier} months)</p>
          </div>
          <div className="rounded-xl bg-secondary border border-border p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Currently saved</label>
            <div className="relative">
              <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" value={currentSaved}
                onChange={(e) => setCurrentSaved(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-2 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 bg-white" />
            </div>
            {annualYield > 0 && (
              <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                <TrendingUp size={12} /> Earning ~{fmt(annualYield)}/yr at 4.5% HYSA
              </p>
            )}
          </div>
          <div className="rounded-xl bg-secondary border border-border p-4">
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Monthly savings toward fund</label>
            <div className="relative">
              <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" value={monthlySavings}
                onChange={(e) => setMonthlySavings(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-2 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/30 bg-white" />
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-foreground">Progress to goal</span>
            <span className="font-bold text-cyan-600">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {gap > 0 && (
          <div className={`rounded-xl p-4 text-sm ${monthsToGoal && monthsToGoal <= 24 ? "bg-green-50 border border-green-200 text-green-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
            {monthsToGoal ? (
              <>You need <strong>{fmt(gap)}</strong> more. At {fmt(monthlySavings)}/month → fully funded in{" "}
                <strong>{monthsToGoal >= 12 ? `${Math.floor(monthsToGoal / 12)}y ${monthsToGoal % 12}m` : `${monthsToGoal} months`}</strong>.</>
            ) : (
              <>Set a monthly savings amount to see your timeline.</>
            )}
          </div>
        )}

        {gap === 0 && (
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800 font-semibold text-center">
            ✅ You're fully funded! Your emergency fund covers {selectedSituation.multiplier} months of essentials.
          </div>
        )}
      </div>
    </div>
  );
}
