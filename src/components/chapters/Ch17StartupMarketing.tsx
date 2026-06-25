'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(0);
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Ch17StartupMarketing() {
  const { state, updateChapter } = useMBA();
  const mkt = state.chapter17.marketing;

  const update = (key: string, value: number) => {
    updateChapter('chapter17', {
      marketing: { ...mkt, [key]: value },
    });
  };

  const { targetAudienceReach, conversionRate, cac, viralCoefficient } = mkt;

  // --- Calculations ---
  const conversionDecimal = conversionRate / 100;
  const initialCustomers = Math.round(targetAudienceReach * conversionDecimal);

  // With viral coefficient (k-factor): each customer brings k new customers
  // Total = initial / (1 - k)  when k < 1 (geometric series)
  const hasViralGrowth = viralCoefficient > 0 && viralCoefficient < 1;
  const totalCustomers = hasViralGrowth
    ? Math.round(initialCustomers / (1 - viralCoefficient))
    : initialCustomers;

  // Assume average revenue per customer = 3x CAC (simplified LTV assumption)
  const avgRevenuePerCustomer = cac * 3;
  const revenueProjection = totalCustomers * avgRevenuePerCustomer;

  // Total marketing spend
  const totalMarketingCost = initialCustomers * cac;

  // Cost efficiency (ratio of revenue to marketing cost)
  const costEfficiencyRatio =
    totalMarketingCost > 0
      ? Math.round((revenueProjection / totalMarketingCost) * 10) / 10
      : 0;

  // ROI
  const roi =
    totalMarketingCost > 0
      ? (((revenueProjection - totalMarketingCost) / totalMarketingCost) * 100)
      : 0;

  // Viral growth indication
  const viralLabel =
    viralCoefficient <= 0
      ? 'No viral effect'
      : viralCoefficient < 0.5
        ? 'Low viral'
        : viralCoefficient < 0.8
          ? 'Moderate viral'
          : viralCoefficient < 1
            ? 'High viral'
            : 'Explosive (≥1.0)';

  // --------------------- New interactive tools ---------------------

  // Tool 1: Lifetime Value (LTV) Simulator
  const [ltvInputs, setLtvInputs] = useState({
    monthlyRevenuePerCustomer: 50,
    monthlyChurnRate: 5,  // %
    directCostPerCustomer: 10,
    discountRate: 10,      // % annual
  });
  const ltvMonthlyChurnDecimal = ltvInputs.monthlyChurnRate / 100;
  const ltvMonths = ltvMonthlyChurnDecimal > 0 ? Math.round(1 / ltvMonthlyChurnDecimal) : 120; // cap at 10 years
  const ltvMonthlyNet = ltvInputs.monthlyRevenuePerCustomer - ltvInputs.directCostPerCustomer;
  // Simple LTV = monthlyNet * months, ignoring discount for simplicity but we show discounted version
  const ltvSimple = ltvMonthlyNet * ltvMonths;
  const discountMonthly = Math.pow(1 + ltvInputs.discountRate / 100, 1 / 12) - 1;
  let ltvDiscounted = 0;
  if (discountMonthly > 0) {
    // sum_{t=1}^{months} monthlyNet / (1+discountMonthly)^t
    for (let t = 1; t <= ltvMonths; t++) {
      ltvDiscounted += ltvMonthlyNet / Math.pow(1 + discountMonthly, t);
    }
  } else {
    ltvDiscounted = ltvSimple;
  }
  ltvDiscounted = Math.round(ltvDiscounted);
  const ltvSimpleRounded = Math.round(ltvSimple);

  // Tool 2: Break-Even Customer Count
  const [beInputs, setBeInputs] = useState({
    fixedCosts: 50000,
    avgRevenuePerSale: 100,
    avgCogsPerSale: 40,
  });
  const beContributionPerCustomer = beInputs.avgRevenuePerSale - beInputs.avgCogsPerSale;
  const beCustomers = beContributionPerCustomer > 0
    ? Math.ceil(beInputs.fixedCosts / beContributionPerCustomer)
    : Infinity;

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          📈 Startup Marketing Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Estimate your customer acquisition, revenue potential, and cost efficiency based on key marketing inputs.
        </p>
      </div>

      {/* Input grid */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
        {/* Target Audience Reach */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              👥 Target Audience Reach
            </label>
            <span className="text-base font-bold text-slate-400 dark:text-slate-650 uppercase tracking-wider">Addressable</span>
          </div>
          <input
            type="number"
            min={0}
            value={targetAudienceReach}
            onChange={(e) =>
              update('targetAudienceReach', parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
          <input
            type="range"
            min={0}
            max={10000000}
            step={1000}
            value={targetAudienceReach}
            onChange={(e) =>
              update('targetAudienceReach', parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Conversion Rate */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
              📊 Conversion Rate (%)
            </label>
            <span className="text-base font-bold text-slate-400 dark:text-slate-655 uppercase tracking-wider">% of Reach</span>
          </div>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={conversionRate}
            onChange={(e) =>
              update('conversionRate', parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={conversionRate}
            onChange={(e) =>
              update('conversionRate', parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* CAC */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
              💰 Cost per Acquisition (CAC)
            </label>
            <span className="text-base font-bold text-slate-400 dark:text-slate-655 uppercase tracking-wider">USD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 dark:text-slate-600 font-bold text-base select-none">$</span>
            <input
              type="number"
              min={0}
              value={cac}
              onChange={(e) =>
                update('cac', parseFloat(e.target.value) || 0)
              }
              className="flex-1 px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>
          <input
            type="range"
            min={0}
            max={500}
            step={1}
            value={cac}
            onChange={(e) => update('cac', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Viral Coefficient */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">
              🔄 Viral Coefficient (k)
            </label>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">{viralLabel}</span>
          </div>
          <input
            type="number"
            min={0}
            max={2}
            step={0.01}
            value={viralCoefficient}
            onChange={(e) =>
              update('viralCoefficient', parseFloat(e.target.value) || 0)
            }
            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
          />
          <input
            type="range"
            min={0}
            max={2}
            step={0.01}
            value={viralCoefficient}
            onChange={(e) =>
              update('viralCoefficient', parseFloat(e.target.value))
            }
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
            <span>0 (none)</span>
            <span>1 (exponential)</span>
            <span>2 (hyper)</span>
          </div>
        </div>
      </div>

      {/* Results grid */}
      <div className="space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
          📊 Calculated Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Initial Customers */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 text-center shadow-sm">
            <p className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Initial Customers
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
              {formatNum(initialCustomers)}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-505 font-medium mt-1">
              Reach × {conversionRate}%
            </p>
          </div>

          {/* Total Customers (with viral) */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 text-center shadow-sm relative">
            {hasViralGrowth && (
              <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-base font-bold bg-amber-50 text-amber-700 dark:bg-amber-955/40 dark:text-amber-450 border border-amber-100 dark:border-amber-900/50">
                viral
              </span>
            )}
            <p className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Customers
            </p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2 font-mono tabular-nums">
              {formatNum(totalCustomers)}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-505 font-medium mt-1">
              {hasViralGrowth
                ? `k=${viralCoefficient.toFixed(2)}`
                : viralCoefficient >= 1
                  ? '∞ (viral ≥ 1.0)'
                  : 'No viral growth'}
            </p>
          </div>

          {/* Revenue Projection */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 text-center shadow-sm">
            <p className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Revenue Projection
            </p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 font-mono tabular-nums">
              {formatCurrency(revenueProjection)}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-505 font-medium mt-1">
              ~{formatCurrency(avgRevenuePerCustomer)} / cust
            </p>
          </div>

          {/* Cost Efficiency */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 text-center shadow-sm">
            <p className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Cost Efficiency
            </p>
            <p className="text-2xl font-bold mt-2 font-mono tabular-nums">
              <span
                className={
                  costEfficiencyRatio >= 3
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : costEfficiencyRatio >= 1.5
                      ? 'text-amber-655 dark:text-amber-400'
                      : 'text-red-655 dark:text-red-400'
                }
              >
                {costEfficiencyRatio}x
              </span>
            </p>
            <p className="text-base text-slate-450 dark:text-slate-550 font-medium mt-1">
              {roi >= 0 ? '+' : ''}{roi.toFixed(0)}% ROI
            </p>
          </div>
        </div>
      </div>

      {/* Detailed breakdown */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          📋 Detailed Breakdown
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Marketing Spend
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono tabular-nums">
              {formatCurrency(totalMarketingCost)}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-505 font-medium mt-0.5">
              {formatNum(initialCustomers)} customers × {formatCurrency(cac)} CAC
            </p>
          </div>
          <div>
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Avg. Revenue / Customer
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1 font-mono tabular-nums">
              {formatCurrency(avgRevenuePerCustomer)}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-505 font-medium mt-0.5">
              Assumed 3× CAC ({formatCurrency(cac)})
            </p>
          </div>
          <div>
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Viral Amplification
            </p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
              {hasViralGrowth
                ? `${(1 / (1 - viralCoefficient)).toFixed(1)}× multiplier`
                : viralCoefficient >= 1
                  ? 'Unbounded growth'
                  : 'None'}
            </p>
            <p className="text-base text-slate-450 dark:text-slate-550 font-medium mt-0.5">
              1/(1−k) formula (k={viralCoefficient.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          💡 Key Insights
        </h4>
        <ul className="space-y-3 font-medium text-slate-655 dark:text-slate-400">
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold shrink-0 mt-[2px]">•</span>
            <span className="text-base leading-relaxed">
              <strong>Conversion impact:</strong>{' '}
              {conversionRate >= 5
                ? 'Strong conversion — your funnel is efficient.'
                : 'Improving conversion by 1% adds ~' +
                  formatNum(Math.round(targetAudienceReach * 0.01) - initialCustomers) +
                  ' customers.'}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold shrink-0 mt-[2px]">•</span>
            <span className="text-base leading-relaxed">
              <strong>Viral leverage:</strong>{' '}
              {viralCoefficient >= 0.5
                ? 'Strong viral loop — focus on referral mechanics.'
                : viralCoefficient > 0
                  ? 'Early viral signal — optimize sharing triggers.'
                  : 'No viral effect — invest in referral programs.'}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="text-emerald-500 font-bold shrink-0 mt-[2px]">•</span>
            <span className="text-base leading-relaxed">
              <strong>Cost efficiency:</strong>{' '}
              {costEfficiencyRatio >= 3
                ? 'Healthy — each dollar spent generates ' +
                  costEfficiencyRatio.toFixed(1) +
                  '× in revenue.'
                : costEfficiencyRatio >= 1
                  ? 'Break-even zone — reduce CAC or increase LTV.'
                  : 'Unsustainable — CAC exceeds revenue per customer.'}
            </span>
          </li>
        </ul>
      </div>

      {/* ============= NEW TOOL 1: LTV SIMULATOR ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          💵 Lifetime Value (LTV) Simulator
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Monthly Revenue / Customer
            </label>
            <input
              type="number"
              value={ltvInputs.monthlyRevenuePerCustomer}
              onChange={(e) =>
                setLtvInputs({ ...ltvInputs, monthlyRevenuePerCustomer: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Monthly Churn Rate (%)
            </label>
            <input
              type="number"
              step={0.1}
              value={ltvInputs.monthlyChurnRate}
              onChange={(e) =>
                setLtvInputs({ ...ltvInputs, monthlyChurnRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Direct Cost / Customer / Month
            </label>
            <input
              type="number"
              value={ltvInputs.directCostPerCustomer}
              onChange={(e) =>
                setLtvInputs({ ...ltvInputs, directCostPerCustomer: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Discount Rate (% annual)
            </label>
            <input
              type="number"
              value={ltvInputs.discountRate}
              onChange={(e) =>
                setLtvInputs({ ...ltvInputs, discountRate: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 text-center">
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Avg. Lifetime (months)</p>
            <p className="text-lg font-bold font-mono tabular-nums text-slate-800 dark:text-slate-200">{ltvMonths}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 text-center">
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Simple LTV</p>
            <p className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(ltvSimpleRounded)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 text-center">
            <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Discounted LTV</p>
            <p className="text-lg font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(ltvDiscounted)}</p>
          </div>
        </div>
        <p className="text-base text-slate-400 dark:text-slate-505 font-medium">
          Discounted LTV uses monthly discount factor from annual rate. Useful to compare customer value with CAC.
        </p>
      </div>

      {/* ============= NEW TOOL 2: BREAK-EVEN CUSTOMER COUNT ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          💲 Break-Even Customer Count
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Fixed Costs ($)
            </label>
            <input
              type="number"
              value={beInputs.fixedCosts}
              onChange={(e) =>
                setBeInputs({ ...beInputs, fixedCosts: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Avg Revenue / Sale ($)
            </label>
            <input
              type="number"
              value={beInputs.avgRevenuePerSale}
              onChange={(e) =>
                setBeInputs({ ...beInputs, avgRevenuePerSale: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Avg COGS / Sale ($)
            </label>
            <input
              type="number"
              value={beInputs.avgCogsPerSale}
              onChange={(e) =>
                setBeInputs({ ...beInputs, avgCogsPerSale: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-4 text-center">
          <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Customers Needed to Break Even
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums mt-1 text-slate-800 dark:text-slate-200">
            {beCustomers === Infinity ? '∞' : formatNum(beCustomers)}
          </p>
          <p className="text-base text-slate-450 dark:text-slate-505 mt-1">
            Contribution margin per customer: {formatCurrency(beContributionPerCustomer)}
          </p>
        </div>
      </div>

      <div className="text-base text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 font-medium leading-relaxed">
        <p>
          <strong>Note:</strong> Revenue projection assumes an average LTV of 3×
          CAC (rule of thumb). Adjust your CAC and conversion rate to match
          real-world benchmarks. A viral coefficient (k) above 1.0 indicates
          exponential (viral) growth.
        </p>
      </div>
    </div>
  );
}
