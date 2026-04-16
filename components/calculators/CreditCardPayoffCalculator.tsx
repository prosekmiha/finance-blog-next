"use client";

import { useState, useMemo } from "react";
import { DollarSign, TrendingDown, Calendar, AlertTriangle } from "lucide-react";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function calcPayoff(balance: number, apr: number, monthlyPayment: number) {
  if (balance <= 0 || monthlyPayment <= 0) return null;
  const monthlyRate = apr / 100 / 12;
  const minPayment = Math.max(balance * 0.02, 25);
  if (monthlyPayment <= balance * monthlyRate) return null; // payment doesn't cover interest

  let bal = balance;
  let totalInterest = 0;
  let months = 0;

  while (bal > 0.01 && months < 600) {
    const interest = bal * monthlyRate;
    totalInterest += interest;
    bal = bal + interest - monthlyPayment;
    if (bal < 0) bal = 0;
    months++;
  }

  return { months, totalInterest, totalPaid: balance + totalInterest, minPayment };
}

function calcMinPayoff(balance: number, apr: number) {
  const monthlyRate = apr / 100 / 12;
  let bal = balance;
  let totalInterest = 0;
  let months = 0;

  while (bal > 0.01 && months < 600) {
    const interest = bal * monthlyRate;
    totalInterest += interest;
    const payment = Math.max(bal * 0.02, 25);
    bal = bal + interest - payment;
    if (bal < 0) bal = 0;
    months++;
  }

  return { months, totalInterest };
}

export function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState(5000);
  const [apr, setApr] = useState(22);
  const [payment, setPayment] = useState(200);

  const result = useMemo(() => calcPayoff(balance, apr, payment), [balance, apr, payment]);
  const minResult = useMemo(() => calcMinPayoff(balance, apr), [balance, apr]);

  const interestSaved = result ? minResult.totalInterest - result.totalInterest : 0;
  const monthsSaved = result ? minResult.months - result.months : 0;

  const paymentCoversInterest = result !== null;

  return (
    <div className="my-10 rounded-2xl border border-border bg-white shadow-md overflow-hidden">
      <div className="bg-red-600 px-6 py-5">
        <h2 className="text-white text-xl font-bold">Credit Card Payoff Calculator</h2>
        <p className="text-white/80 text-sm mt-1">See exactly when you'll be debt-free — and how much interest you'll pay</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Current Balance</label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" max="100000" value={balance}
                onChange={(e) => setBalance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Interest Rate (APR %)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
              <input type="number" min="1" max="50" step="0.1" value={apr}
                onChange={(e) => setApr(Math.min(50, Math.max(1, Number(e.target.value))))}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Monthly Payment</label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="number" min="0" max="10000" value={payment}
                onChange={(e) => setPayment(Math.max(0, Number(e.target.value)))}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Payment slider */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Monthly payment: <strong className="text-foreground">{fmt(payment)}</strong></span>
            <span>Min payment: ~{fmt(Math.max(balance * 0.02, 25))}</span>
          </div>
          <input type="range" min={Math.max(25, Math.ceil(balance * apr / 100 / 12) + 1)} max={Math.min(balance, 2000)}
            value={payment} onChange={(e) => setPayment(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-red-600" />
        </div>

        {!paymentCoversInterest && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertTriangle size={16} className="shrink-0" />
            Your payment doesn't cover the monthly interest. Increase it to make progress on the balance.
          </div>
        )}

        {result && (
          <>
            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                <Calendar size={18} className="mx-auto mb-1 text-red-600" />
                <p className="text-2xl font-bold text-foreground">
                  {result.months >= 12
                    ? `${Math.floor(result.months / 12)}y ${result.months % 12}m`
                    : `${result.months} months`}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Time to debt-free</p>
              </div>
              <div className="rounded-xl bg-secondary border border-border p-4 text-center">
                <TrendingDown size={18} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{fmt(result.totalInterest)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total interest paid</p>
              </div>
              <div className="rounded-xl bg-secondary border border-border p-4 text-center">
                <DollarSign size={18} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-2xl font-bold text-foreground">{fmt(result.totalPaid)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Total amount paid</p>
              </div>
            </div>

            {/* Comparison vs minimum */}
            {interestSaved > 0 && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">vs. paying only the minimum:</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Interest saved: </span>
                    <strong className="text-green-700">{fmt(interestSaved)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time saved: </span>
                    <strong className="text-green-700">
                      {monthsSaved >= 12
                        ? `${Math.floor(monthsSaved / 12)}y ${monthsSaved % 12}m`
                        : `${monthsSaved} months`}
                    </strong>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Your payment</span>
                    <span>Minimum only</span>
                  </div>
                  <div className="flex gap-1 h-3">
                    <div className="rounded-full bg-green-500 transition-all" style={{ width: `${(result.totalInterest / minResult.totalInterest) * 100}%` }} />
                    <div className="rounded-full bg-red-300 flex-1" />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-700 font-medium">{fmt(result.totalInterest)}</span>
                    <span className="text-red-500 font-medium">{fmt(minResult.totalInterest)}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
