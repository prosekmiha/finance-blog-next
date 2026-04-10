"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

interface Option {
  label: string;
  initialCost: number;
  monthlyCost: number;
}

interface ComparisonCalculatorProps {
  title?: string;
  subtitle?: string;
  optionADefault: Option;
  optionBDefault: Option;
  yearsDefault?: number;
}

export function ComparisonCalculator({
  title = "Compare Two Options",
  subtitle = "See how the costs stack up over time",
  optionADefault,
  optionBDefault,
  yearsDefault = 5,
}: ComparisonCalculatorProps) {
  const [years, setYears] = useState(yearsDefault);
  const [optionA, setOptionA] = useState(optionADefault);
  const [optionB, setOptionB] = useState(optionBDefault);

  const totalA = optionA.initialCost + optionA.monthlyCost * 12 * years;
  const totalB = optionB.initialCost + optionB.monthlyCost * 12 * years;
  const savings = Math.abs(totalA - totalB);
  const winner = totalA < totalB ? "A" : "B";

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  const maxTotal = Math.max(totalA, totalB, 1);

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-foreground px-6 py-5">
        <h2 className="text-white text-xl font-bold">{title}</h2>
        <p className="text-white/70 text-sm mt-1">{subtitle}</p>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-foreground">
              Time period: {years} {years === 1 ? "year" : "years"}
            </label>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={years}
            onChange={(e) => setYears(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1 year</span>
            <span>10 years</span>
            <span>20 years</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { option: optionA, setOption: setOptionA, label: "Option A", color: "primary", total: totalA },
            { option: optionB, setOption: setOptionB, label: "Option B", color: "chart-2", total: totalB },
          ].map(({ option, setOption, label, color, total }) => (
            <div key={label} className="rounded-xl border border-border p-4 space-y-3">
              <input
                type="text"
                value={option.label}
                onChange={(e) => setOption((prev) => ({ ...prev, label: e.target.value }))}
                className="w-full text-base font-bold bg-transparent border-0 border-b border-dashed border-border pb-1 focus:outline-none focus:border-primary text-foreground"
              />
              <div className="space-y-2">
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="number"
                    min="0"
                    value={option.initialCost || ""}
                    onChange={(e) =>
                      setOption((prev) => ({ ...prev, initialCost: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="Upfront cost"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  />
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="number"
                    min="0"
                    value={option.monthlyCost || ""}
                    onChange={(e) =>
                      setOption((prev) => ({ ...prev, monthlyCost: parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="Monthly cost"
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
                  />
                </div>
              </div>
              <div className={`rounded-lg p-3 ${color === "primary" ? "bg-primary/8 border border-primary/20" : "bg-blue-50 border border-blue-100"}`}>
                <p className="text-xs text-muted-foreground mb-0.5">Total over {years} years</p>
                <p className="text-xl font-bold text-foreground">{fmt(total)}</p>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color === "primary" ? "bg-primary" : "bg-blue-400"}`}
                  style={{ width: `${(total / maxTotal) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-xl bg-secondary border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Over {years} {years === 1 ? "year" : "years"},{" "}
            <strong className="text-foreground">
              {winner === "A" ? optionA.label : optionB.label}
            </strong>{" "}
            saves you{" "}
            <strong className="text-primary">{fmt(savings)}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
