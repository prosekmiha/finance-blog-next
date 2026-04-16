"use client";

import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const REAL_RETURN = 0.07;
const WITHDRAWAL_RATE = 0.04;

function calcRetirement(currentAge: number, portfolio: number, annualSavings: number, annualSpending: number) {
  const retirementNumber = annualSpending / WITHDRAWAL_RATE;
  if (portfolio >= retirementNumber) return { years: 0, retireAge: currentAge, retirementNumber, finalPortfolio: portfolio };

  let bal = portfolio;
  let years = 0;

  while (bal < retirementNumber && years < 80) {
    bal = bal * (1 + REAL_RETURN) + annualSavings;
    years++;
  }

  return { years, retireAge: currentAge + years, retirementNumber, finalPortfolio: bal };
}

export function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [portfolio, setPortfolio] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [monthlySpending, setMonthlySpending] = useState(4000);

  const annualSavings = monthlyContribution * 12;
  const annualSpending = monthlySpending * 12;
  const savingsRate = annualSpending > 0
    ? Math.round((annualSavings / (annualSavings + annualSpending)) * 100)
    : 0;

  const result = useMemo(
    () => calcRetirement(currentAge, portfolio, annualSavings, annualSpending),
    [currentAge, portfolio, annualSavings, annualSpending]
  );

  const progress = Math.min(100, Math.round((portfolio / result.retirementNumber) * 100));

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-5">
        <h2 className="text-white text-xl font-bold">Retirement Timeline Calculator</h2>
        <p className="text-white/80 text-sm mt-1">Find out exactly when you can retire based on your numbers</p>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Current Age</label>
            <input type="number" min="18" max="70" value={currentAge}
              onChange={(e) => setCurrentAge(Math.min(70, Math.max(18, Number(e.target.value))))}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Current Portfolio</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" max="10000000" value={portfolio}
                onChange={(e) => setPortfolio(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-500" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Monthly Savings</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" max="50000" value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-500" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Monthly Spending</label>
            <div className="relative">
              <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="500" max="50000" value={monthlySpending}
                onChange={(e) => setMonthlySpending(Math.max(500, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4 text-center">
            <Calendar size={18} className="mx-auto mb-1 text-indigo-600" />
            <p className="text-3xl font-bold text-foreground">
              {result.years === 0 ? "Now!" : `${result.years}y`}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {result.years === 0 ? "You can retire today" : `Retire at age ${result.retireAge}`}
            </p>
          </div>
          <div className="rounded-xl bg-secondary border border-border p-4 text-center">
            <TrendingUp size={18} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{fmt(result.retirementNumber)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your retirement number (25× spending)</p>
          </div>
          <div className="rounded-xl bg-secondary border border-border p-4 text-center">
            <DollarSign size={18} className="mx-auto mb-1 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{savingsRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">Your savings rate</p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-foreground">Progress to retirement</span>
            <span className="font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{fmt(portfolio)} saved</span>
            <span>{fmt(result.retirementNumber)} goal</span>
          </div>
        </div>

        {/* What-if: increase savings */}
        {result.years > 5 && (() => {
          const boosted = calcRetirement(currentAge, portfolio, annualSavings * 1.25, annualSpending);
          const yearsSaved = result.years - boosted.years;
          return yearsSaved > 0 ? (
            <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm">
              <span className="font-semibold text-green-800">💡 What if you saved 25% more?</span>
              <span className="text-green-700"> +{fmt(monthlyContribution * 0.25)}/month would shave <strong>{yearsSaved} year{yearsSaved !== 1 ? "s" : ""}</strong> off your timeline.</span>
            </div>
          ) : null;
        })()}

        <p className="text-xs text-muted-foreground">Assumes 7% real (inflation-adjusted) annual return and 4% safe withdrawal rate.</p>
      </div>
    </div>
  );
}
