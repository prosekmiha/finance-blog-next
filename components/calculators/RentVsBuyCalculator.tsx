"use client";

import { useState, useMemo } from "react";
import { DollarSign, Home, TrendingUp } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function calcScenarios(
  homePrice: number,
  downPct: number,
  mortgageRate: number,
  propertyTaxRate: number,
  rent: number,
  years: number,
  appreciationRate: number,
  investmentReturn: number
) {
  const downPayment = homePrice * (downPct / 100);
  const loanAmount = homePrice - downPayment;
  const monthlyRate = mortgageRate / 100 / 12;
  const nPayments = 30 * 12;

  // Monthly mortgage payment (P&I)
  const mortgage = loanAmount > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, nPayments)) / (Math.pow(1 + monthlyRate, nPayments) - 1)
    : loanAmount / nPayments;

  const monthlyPropTax = (homePrice * (propertyTaxRate / 100)) / 12;
  const monthlyInsurance = (homePrice * 0.006) / 12;
  const monthlyMaintenance = (homePrice * 0.01) / 12;
  const monthlyPMI = downPct < 20 ? (loanAmount * 0.008) / 12 : 0;

  const totalMonthlyBuy = mortgage + monthlyPropTax + monthlyInsurance + monthlyMaintenance + monthlyPMI;
  const closingCosts = homePrice * 0.03;

  // Buy: calculate equity after N years
  let balance = loanAmount;
  for (let m = 0; m < years * 12; m++) {
    const interest = balance * monthlyRate;
    balance = Math.max(0, balance + interest - mortgage);
  }
  const homeValue = homePrice * Math.pow(1 + appreciationRate / 100, years);
  const equity = homeValue - balance;
  const totalBuyCost = totalMonthlyBuy * years * 12 + closingCosts + downPayment;
  // Net position for buying: equity minus total spent (opportunity cost of down payment included)
  const downPaymentGrown = downPayment * Math.pow(1 + investmentReturn / 100, years);
  const buyNetWealth = equity - closingCosts * 2; // rough selling costs too

  // Rent: invest the difference
  const monthlyDiff = totalMonthlyBuy - rent;
  const rentInvestmentMonthly = Math.max(0, monthlyDiff);
  // Future value of monthly investments
  const monthlyReturnRate = investmentReturn / 100 / 12;
  const investmentGrowth = rentInvestmentMonthly > 0
    ? rentInvestmentMonthly * (Math.pow(1 + monthlyReturnRate, years * 12) - 1) / monthlyReturnRate
    : 0;
  const downPaymentInvested = downPayment * Math.pow(1 + investmentReturn / 100, years);
  const rentNetWealth = investmentGrowth + downPaymentInvested;

  const totalRentCost = rent * years * 12;
  const prRatio = Math.round(homePrice / (rent * 12));

  return {
    buy: { monthlyTotal: totalMonthlyBuy, mortgage, equity, homeValue, netWealth: buyNetWealth, totalCost: totalBuyCost },
    rent: { monthly: rent, netWealth: rentNetWealth, totalCost: totalRentCost, investmentGrowth },
    prRatio,
    buyWins: buyNetWealth > rentNetWealth,
    wealthDiff: Math.abs(buyNetWealth - rentNetWealth),
  };
}

export function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(400000);
  const [downPct, setDownPct] = useState(10);
  const [mortgageRate, setMortgageRate] = useState(7.0);
  const [propertyTaxRate, setPropertyTaxRate] = useState(1.2);
  const [rent, setRent] = useState(2200);
  const [years, setYears] = useState(7);
  const [appreciation, setAppreciation] = useState(3.0);
  const [investReturn, setInvestReturn] = useState(7.0);

  const r = useMemo(
    () => calcScenarios(homePrice, downPct, mortgageRate, propertyTaxRate, rent, years, appreciation, investReturn),
    [homePrice, downPct, mortgageRate, propertyTaxRate, rent, years, appreciation, investReturn]
  );

  const prLabel = r.prRatio < 15 ? "Buying favored" : r.prRatio < 20 ? "Borderline" : "Renting favored";
  const prColor = r.prRatio < 15 ? "text-green-700 bg-green-50 border-green-200" : r.prRatio < 20 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-sky-600 px-6 py-5">
        <h2 className="text-white text-xl font-bold">Rent vs Buy Calculator</h2>
        <p className="text-white/80 text-sm mt-1">See the true cost of each option — including opportunity cost</p>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Buy inputs */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Home size={15} /> Buying scenario</p>
            {[
              { label: "Home price", value: homePrice, set: setHomePrice, max: 5000000, prefix: "$" },
              { label: "Down payment (%)", value: downPct, set: setDownPct, max: 50, prefix: "%", step: 1 },
              { label: "Mortgage rate (%)", value: mortgageRate, set: setMortgageRate, max: 15, prefix: "%", step: 0.1 },
              { label: "Property tax rate (%)", value: propertyTaxRate, set: setPropertyTaxRate, max: 5, prefix: "%", step: 0.1 },
            ].map(({ label, value, set, max, prefix, step }) => (
              <div key={label} className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground w-36 shrink-0">{label}</label>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{prefix}</span>
                  <input type="number" min="0" max={max} step={step ?? 1000} value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/30" />
                </div>
              </div>
            ))}
          </div>

          {/* Rent + assumptions */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><TrendingUp size={15} /> Renting scenario + assumptions</p>
            {[
              { label: "Monthly rent", value: rent, set: setRent, max: 20000, prefix: "$" },
              { label: "Years to compare", value: years, set: setYears, max: 30, prefix: "yr", step: 1 },
              { label: "Home appreciation (%)", value: appreciation, set: setAppreciation, max: 10, prefix: "%", step: 0.5 },
              { label: "Investment return (%)", value: investReturn, set: setInvestReturn, max: 15, prefix: "%", step: 0.5 },
            ].map(({ label, value, set, max, prefix, step }) => (
              <div key={label} className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground w-36 shrink-0">{label}</label>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{prefix}</span>
                  <input type="number" min="0" max={max} step={step ?? 1000} value={value}
                    onChange={(e) => set(Number(e.target.value))}
                    className="w-full pl-6 pr-2 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly cost comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-sky-50 border border-sky-200 p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Buying — true monthly cost</p>
            <p className="text-2xl font-bold text-foreground">{fmt(r.buy.monthlyTotal)}</p>
            <p className="text-xs text-muted-foreground mt-1">Mortgage {fmt(r.buy.mortgage)} + tax + insurance + maintenance{downPct < 20 ? " + PMI" : ""}</p>
          </div>
          <div className="rounded-xl bg-secondary border border-border p-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">Renting — monthly cost</p>
            <p className="text-2xl font-bold text-foreground">{fmt(r.rent.monthly)}</p>
            <p className="text-xs text-muted-foreground mt-1">Difference invested: {fmt(Math.max(0, r.buy.monthlyTotal - r.rent.monthly))}/mo</p>
          </div>
        </div>

        {/* Net wealth after N years */}
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Net wealth after {years} years</p>
          <div className="space-y-2">
            {[
              { label: "Buy", value: r.buy.netWealth, color: "bg-sky-500" },
              { label: "Rent + invest", value: r.rent.netWealth, color: "bg-emerald-500" },
            ].map(({ label, value, color }) => {
              const maxVal = Math.max(r.buy.netWealth, r.rent.netWealth, 1);
              return (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{label}</span>
                    <span className="font-bold">{fmt(value)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${(value / maxVal) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`mt-4 rounded-lg px-3 py-2 text-sm font-semibold ${r.buyWins ? "bg-sky-50 text-sky-800 border border-sky-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>
            {r.buyWins ? "🏠 Buying" : "🏢 Renting + investing"} comes out ahead by <strong>{fmt(r.wealthDiff)}</strong> after {years} years.
          </div>
        </div>

        {/* P/R ratio */}
        <div className={`rounded-xl border p-3 flex items-center justify-between text-sm ${prColor}`}>
          <span>Price-to-Rent ratio: <strong>{r.prRatio}×</strong></span>
          <span className="font-semibold">{prLabel}</span>
        </div>

        <p className="text-xs text-muted-foreground">Simplified model. Does not include selling costs, rent increases, tax deductions, or life changes. Assumes renter invests the monthly savings difference.</p>
      </div>
    </div>
  );
}
