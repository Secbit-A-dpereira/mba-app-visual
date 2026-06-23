'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcStartupMetrics, currency } from '@/lib/math';
import type { StartupMetrics } from '@/types/mba';

/* ── Main Component ── */
export default function Ch12EntrepreneurialFinance() {
  const { state, updateChapter } = useMBA();
  const startup = state.chapter12.startup;
  const metrics = state.chapter12.metrics;

  const handleChange = (key: string, value: number) => {
    updateChapter('chapter12', { startup: { ...startup, [key]: value } });
  };

  const handleCalculate = () => {
    const result = calcStartupMetrics(startup);
    updateChapter('chapter12', { metrics: result });
  };

  // ── NEW Tool 1: Runway Simulator ──
  const [simSeed, setSimSeed] = useState(500000);
  const [simBurn, setSimBurn] = useState(40000);
  const [simRevenue, setSimRevenue] = useState(10000);
  const [simMonths, setSimMonths] = useState<number | null>(null);

  const calcSimRunway = () => {
    if (simBurn <= simRevenue) {
      setSimMonths(Infinity);
    } else {
      const months = simSeed / (simBurn - simRevenue);
      setSimMonths(Math.round(months * 10) / 10);
    }
  };

  // ── NEW Tool 2: Quick Valuation Estimator ──
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [growthRate, setGrowthRate] = useState(20);
  const [profitMargin, setProfitMargin] = useState(15);
  const [multiple, setMultiple] = useState(3);
  const [valuation, setValuation] = useState<number | null>(null);

  const calcValuation = () => {
    const netIncome = annualRevenue * (profitMargin / 100);
    const terminalValue = netIncome * multiple;
    setValuation(Math.round(terminalValue));
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          💰 Entrepreneurial Finance
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Calculate your startup&apos;s runway, customer economics, and time to profitability.
        </p>
      </div>

      {/* ════════════════════════════════════════════
          Input Form
          ════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
          📊 Startup Parameters
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Seed Investment */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Seed Investment ($)
            </label>
            <input
              type="number"
              min={0}
              value={startup.seedInvestment}
              onChange={(e) => handleChange('seedInvestment', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Total funding raised</p>
          </div>

          {/* Monthly Burn */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Monthly Burn ($)
            </label>
            <input
              type="number"
              min={0}
              value={startup.monthlyBurn}
              onChange={(e) => handleChange('monthlyBurn', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Monthly operating cost</p>
          </div>

          {/* Monthly Revenue */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Monthly Revenue ($)
            </label>
            <input
              type="number"
              min={0}
              value={startup.monthlyRevenue}
              onChange={(e) => handleChange('monthlyRevenue', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Current MRR</p>
          </div>

          {/* Growth Rate */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Monthly Growth Rate (%)
            </label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={startup.growthRate}
              onChange={(e) => handleChange('growthRate', Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Revenue MoM growth</p>
          </div>

          {/* Churn Rate */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Monthly Churn Rate (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={startup.churnRate}
              onChange={(e) => handleChange('churnRate', Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
              className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-normal font-medium">Monthly customer churn</p>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleCalculate}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            🚀 Calculate Metrics
          </button>
          {metrics && (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Last calculated: now
            </span>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          Results Cards
          ════════════════════════════════════════════ */}
      {metrics ? (
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
            📈 Financial Health Results
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              label="Runway"
              value={metrics.runway}
              unit="months"
              icon="⏳"
              color="emerald"
              tooltip="Months until cash runs out (at current burn & revenue)"
            />
            <MetricCard
              label="LTV"
              value={currency(metrics.ltv)}
              unit="per customer"
              icon="📈"
              color="blue"
              tooltip="Lifetime Value — avg revenue per customer over their lifetime"
            />
            <MetricCard
              label="CAC"
              value={currency(metrics.cac)}
              unit="per customer"
              icon="💵"
              color="amber"
              tooltip="Customer Acquisition Cost (simplified)"
            />
            <MetricCard
              label="LTV:CAC Ratio"
              value={metrics.ltvCacRatio.toFixed(1)}
              unit=""
              icon="⚖️"
              color="purple"
              tooltip="Ratio of LTV to CAC. Target: ≥ 3:1"
            />
            <MetricCard
              label="Break-Even"
              value={metrics.breakEvenMonth}
              unit="months"
              icon="🎯"
              color="rose"
              tooltip="Month when cumulative revenue covers costs"
            />
          </div>

          {/* ── Interpretation ── */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
              📋 Health Assessment
            </h5>
            <div className="space-y-2 text-xs">
              <InterpretationLine
                label="Runway"
                good={metrics.runway >= 12}
                ok={metrics.runway >= 6}
                goodMsg="12+ months — healthy runway"
                okMsg="6–11 months — adequate, but raise funds soon"
                badMsg="Less than 6 months — urgent need for funding or cuts"
              />
              <InterpretationLine
                label="LTV:CAC"
                good={metrics.ltvCacRatio >= 3}
                ok={metrics.ltvCacRatio >= 1.5}
                goodMsg="3:1+ — excellent unit economics"
                okMsg="1.5:1 to 3:1 — acceptable, room for improvement"
                badMsg="Below 1.5:1 — unsustainable unit economics"
              />
              <InterpretationLine
                label="Break-even"
                good={metrics.breakEvenMonth <= 12}
                ok={metrics.breakEvenMonth <= 24}
                goodMsg="≤ 12 months — fast path to profitability"
                okMsg="12–24 months — reasonable timeline"
                badMsg="> 24 months — long road to profit; high risk"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-xs font-medium text-slate-450 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-2xl mb-2">📊</p>
          <p>Fill in the startup parameters above and click</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 my-1">&ldquo;Calculate Metrics&rdquo;</p>
          <p>to see your startup financial health.</p>
        </div>
      )}

      {/* ── NEW: Runway Simulator Tool ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          ⏳ Runway Simulator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Adjust seed investment and monthly burn/revenue to see how long the cash lasts.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Seed ($)</label>
            <input type="number" min={0} value={simSeed} onChange={(e) => setSimSeed(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Monthly Burn ($)</label>
            <input type="number" min={0} value={simBurn} onChange={(e) => setSimBurn(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Monthly Revenue ($)</label>
            <input type="number" min={0} value={simRevenue} onChange={(e) => setSimRevenue(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
        </div>
        <button onClick={calcSimRunway} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-colors cursor-pointer">
          Calculate Runway
        </button>
        {simMonths !== null && (
          <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">
            {simMonths === Infinity ? '♾️ Revenue covers burn — runway is infinite.' : `⏳ Runway: ${simMonths} months`}
          </div>
        )}
      </div>

      {/* ── NEW: Quick Valuation Estimator ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          💵 Quick Valuation Estimator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Estimate your startup's valuation using revenue, margin, and a market multiple.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Annual Revenue ($)</label>
            <input type="number" min={0} value={annualRevenue} onChange={(e) => setAnnualRevenue(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Growth Rate (%)</label>
            <input type="number" min={0} value={growthRate} onChange={(e) => setGrowthRate(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Profit Margin (%)</label>
            <input type="number" min={0} max={100} value={profitMargin} onChange={(e) => setProfitMargin(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Multiple (x)</label>
            <input type="number" min={0} max={50} value={multiple} onChange={(e) => setMultiple(Math.max(0, parseFloat(e.target.value) || 0))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
        </div>
        <button onClick={calcValuation} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer">
          Estimate Valuation
        </button>
        {valuation !== null && (
          <div className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
            💰 Estimated Valuation: ${valuation.toLocaleString()}
          </div>
        )}
      </div>

      {/* ── Footnote ── */}
      <div className="text-xs text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 font-medium leading-relaxed">
        <p>
          Calculations use the startup finance model from Chapter 12. LTV is derived from monthly revenue and churn rate. CAC is simplified for demonstration. Adjust parameters to explore different scenarios.
        </p>
      </div>
    </div>
  );
}

/* ── Metric Card Sub-Component ── */
function MetricCard({
  label,
  value,
  unit,
  icon,
  color,
  tooltip,
}: {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  tooltip: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-500 to-amber-600',
    purple: 'from-purple-500 to-purple-600',
    rose: 'from-rose-500 to-rose-600',
  };

  const borderClasses: Record<string, string> = {
    emerald: 'border-emerald-200 dark:border-emerald-900/50',
    blue: 'border-blue-200 dark:border-blue-900/50',
    amber: 'border-amber-200 dark:border-amber-900/50',
    purple: 'border-purple-200 dark:border-purple-900/50',
    rose: 'border-rose-200 dark:border-rose-900/50',
  };

  return (
    <div
      className={`relative bg-white dark:bg-slate-900/40 rounded-xl border ${borderClasses[color] ?? 'border-slate-200 dark:border-slate-800'} p-4 shadow-sm group transition-all`}
      title={tooltip}
    >
      {/* Icon bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${colorClasses[color] ?? 'from-emerald-500 to-emerald-600'} rounded-full mb-3`} />

      <div className="flex items-center justify-between">
        <span className="text-base">{icon}</span>
        <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-help">ⓘ</span>
      </div>
      <div className="mt-2">
        <div className="text-xl font-bold text-slate-800 dark:text-slate-100 truncate">
          {value}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
          {label}
        </div>
        {unit && (
          <div className="text-[9px] text-slate-450 dark:text-slate-505 font-medium mt-0.5">
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Interpretation Line Sub-Component ── */
function InterpretationLine({
  label,
  good,
  ok,
  goodMsg,
  okMsg,
  badMsg,
}: {
  label: string;
  good: boolean;
  ok: boolean;
  goodMsg: string;
  okMsg: string;
  badMsg: string;
}) {
  let statusLabel: string;
  let colorClass: string;
  let bgClass: string;

  if (good) {
    statusLabel = '✅';
    colorClass = 'text-emerald-600 dark:text-emerald-450';
    bgClass = 'bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/20';
  } else if (ok) {
    statusLabel = '⚠️';
    colorClass = 'text-amber-600 dark:text-amber-450';
    bgClass = 'bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/20';
  } else {
    statusLabel = '❌';
    colorClass = 'text-red-600 dark:text-red-400';
    bgClass = 'bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/20';
  }

  const msg = good ? goodMsg : ok ? okMsg : badMsg;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${bgClass} font-medium`}>
      <span>{statusLabel}</span>
      <span className="text-slate-655 dark:text-slate-400">{label}:</span>
      <span className={colorClass}>{msg}</span>
    </div>
  );
}
