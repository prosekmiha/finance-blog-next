"use client";

import { useState, useCallback } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface CostCalculatorProps {
  initialCostDefault?: number;
  monthlyCostDefault?: number;
  yearsDefault?: number;
}

export function CostCalculator({
  initialCostDefault = 0,
  monthlyCostDefault = 0,
  yearsDefault = 5,
}: CostCalculatorProps) {
  const [initialCost, setInitialCost] = useState(initialCostDefault);
  const [monthlyCost, setMonthlyCost] = useState(monthlyCostDefault);
  const [years, setYears] = useState(yearsDefault);

  const totalCost = initialCost + monthlyCost * 12 * years;
  const totalMonthly = totalCost / (years * 12);

  const formatCurrency = useCallback((value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  const handleInput = (
    setter: (v: number) => void,
    value: string,
    max: number
  ) => {
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed >= 0 && parsed <= max) {
      setter(parsed);
    } else if (value === "" || value === "0") {
      setter(0);
    }
  };

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-primary px-6 py-5">
        <h2 className="text-white text-xl font-bold font-sans">
          True Cost Calculator
        </h2>
        <p className="text-white/80 text-sm mt-1">
          See the real long-term cost — not just the sticker price
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="initial-cost">
              Upfront / One-Time Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                id="initial-cost"
                type="number"
                min="0"
                max="10000000"
                value={initialCost || ""}
                onChange={(e) => handleInput(setInitialCost, e.target.value, 10000000)}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="monthly-cost">
              Monthly Ongoing Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                id="monthly-cost"
                type="number"
                min="0"
                max="100000"
                value={monthlyCost || ""}
                onChange={(e) => handleInput(setMonthlyCost, e.target.value, 100000)}
                placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground" htmlFor="num-years">
              Number of Years
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                id="num-years"
                type="number"
                min="1"
                max="50"
                value={years}
                onChange={(e) => handleInput(setYears, e.target.value, 50)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="range"
            min="1"
            max="30"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 year</span>
            <span>15 years</span>
            <span>30 years</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-primary/8 border border-primary/20 p-4">
            <div className="flex items-center gap-2 text-primary mb-1">
              <DollarSign size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Total Cost</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalCost)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              over {years} {years === 1 ? "year" : "years"}
            </p>
          </div>

          <div className="rounded-xl bg-secondary border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Avg. Monthly Cost</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(totalMonthly)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">all costs included</p>
          </div>

          <div className="rounded-xl bg-secondary border border-border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar size={16} />
              <span className="text-xs font-semibold uppercase tracking-wide">Monthly Ongoing</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(monthlyCost)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{formatCurrency(monthlyCost * 12)} per year</p>
          </div>
        </div>

        {totalCost > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Cost breakdown
            </p>
            <div className="flex h-3 rounded-full overflow-hidden">
              {initialCost > 0 && (
                <div
                  className="bg-primary transition-all duration-500"
                  style={{ width: `${(initialCost / totalCost) * 100}%` }}
                  title={`Upfront: ${formatCurrency(initialCost)}`}
                />
              )}
              {monthlyCost * 12 * years > 0 && (
                <div
                  className="bg-chart-2 transition-all duration-500"
                  style={{ width: `${((monthlyCost * 12 * years) / totalCost) * 100}%` }}
                  title={`Ongoing: ${formatCurrency(monthlyCost * 12 * years)}`}
                />
              )}
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                <span className="text-xs text-muted-foreground">Upfront ({formatCurrency(initialCost)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-chart-2" />
                <span className="text-xs text-muted-foreground">
                  Ongoing ({formatCurrency(monthlyCost * 12 * years)})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
