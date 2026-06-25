// @ts-nocheck
'use client';
import React, { useMemo, useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { currency, pct } from '@/lib/math';

export default function Ch25RevenueDashboard() {
  const { state, updateChapter } = useMBA();
  const { trends, indicators, benchmarks } = state.chapter25 || {
    trends: [],
    indicators: [],
    benchmarks: { nrr: 0, ltvCac: 0, churn: 0, payback: 0 }
  };

  const [activeMetric, setActiveMetric] = useState<'revenue' | 'arr' | 'churn'>('revenue');

  // NEW: Scenario simulators
  const [projectedGrowthRate, setProjectedGrowthRate] = useState(5); // % monthly
  const [projectedChurnRate, setProjectedChurnRate] = useState(1); // % monthly
  const [cashBurn, setCashBurn] = useState(50000); // monthly burn

  // Input Handlers
  const handleTrendChange = (index: number, key: 'revenue' | 'arr' | 'churn', value: number) => {
    const updated = [...trends];
    updated[index] = { ...updated[index], [key]: isNaN(value) ? 0 : value };
    updateChapter('chapter25', { trends: updated });
  };

  const handleIndicatorChange = (index: number, key: 'value' | 'target', value: number) => {
    const updated = [...indicators];
    updated[index] = { ...updated[index], [key]: isNaN(value) ? 0 : value };
    updateChapter('chapter25', { indicators: updated });
  };

  const handleBenchmarkChange = (key: keyof typeof benchmarks, value: number) => {
    updateChapter('chapter25', {
      benchmarks: { ...benchmarks, [key]: isNaN(value) ? 0 : value }
    });
  };

  // SVG Line Chart calculations
  const chartData = useMemo(() => {
    const values = trends.map(t => t[activeMetric]);
    const maxVal = Math.max(...values, 100);
    const minVal = Math.min(...values, 0);

    const width = 360;
    const height = 150;
    const paddingLeft = 45;
    const paddingRight = 15;
    const paddingTop = 15;
    const paddingBottom = 25;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const points = trends.map((t, idx) => {
      const x = paddingLeft + (idx / (trends.length - 1)) * chartWidth;
      const y = height - paddingBottom - ((t[activeMetric] - minVal) / (maxVal - minVal || 1)) * chartHeight;
      return { x, y, value: t[activeMetric], month: t.month };
    });

    let pathD = '';
    let areaD = '';
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
      areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
    }

    return { points, pathD, areaD, width, height, maxVal, minVal, paddingLeft, paddingBottom };
  }, [trends, activeMetric]);

  // Derived current overall values (last month from trends)
  const currentFin = useMemo(() => {
    if (!trends.length) return { revenue: 0, arr: 0, churn: 0 };
    return trends[trends.length - 1];
  }, [trends]);

  // NEW: Projected next month values based on simulators
  const projectedNext = useMemo(() => {
    const growthMultiplier = 1 + projectedGrowthRate / 100;
    const churnMultiplier = 1 - projectedChurnRate / 100;
    const projectedRevenue = Math.round(currentFin.revenue * growthMultiplier);
    const projectedArr = Math.round(currentFin.arr * growthMultiplier);
    const projectedChurn = currentFin.churn + (projectedChurnRate * (1 - currentFin.churn / 100)); // simplistic
    return { revenue: projectedRevenue, arr: projectedArr, churn: Math.min(100, Math.max(0, Math.round(projectedChurn * 10) / 10)) };
  }, [currentFin, projectedGrowthRate, projectedChurnRate]);

  // NEW: Runway calculation
  const monthsOfRunway = useMemo(() => {
    if (cashBurn <= 0) return Infinity;
    // assume cash reserves = 0 for this sim; just show burn rate
    return Math.round(1000000 / cashBurn * 10) / 10; // pretend €1M cash
  }, [cashBurn]);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">📈</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Revenue & Metrics Hub
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Input monthly performance, visualize cash metrics via active trend paths, manage early pipeline warning signals, and inspect your SaaS metrics compared to global benchmarks.
        </p>
      </div>

      {/* Trailing Trajectory Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-base font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Monthly Revenue</span>
          <span className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tabular-nums">
            {currency(currentFin.revenue)}
          </span>
          <span className="text-base text-slate-400 block mt-1">Based on latest month reporting</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-base font-bold text-slate-400 uppercase tracking-wider block mb-1">Annual Recurring Revenue (ARR)</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-450 tabular-nums">
            {currency(currentFin.arr)}
          </span>
          <span className="text-base text-slate-400 block mt-1">Run rate ARR trajectory</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-base font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Churn Rate</span>
          <span className={`text-2xl font-extrabold tabular-nums ${currentFin.churn > 1.5 ? 'text-red-500' : 'text-emerald-500'}`}>
            {currentFin.churn.toFixed(1)}%
          </span>
          <span className="text-base text-slate-400 block mt-1">Monthly customer attrition</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend entries & SVG Line Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Month-over-Month Financial Trends
            </h3>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg self-start sm:self-center">
              {(['revenue', 'arr', 'churn'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMetric(m)}
                  className={`px-3 py-1 text-base font-bold rounded transition-all capitalize ${
                    activeMetric === m
                      ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly form inputs */}
            <div className="space-y-2 max-h-[30vh] overflow-y-auto pr-1">
              {trends.map((t, idx) => (
                <div key={t.month} className="grid grid-cols-12 gap-2 items-center text-base">
                  <span className="col-span-3 font-bold text-slate-650 dark:text-slate-450">{t.month}</span>
                  <div className="col-span-9 grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      value={t.revenue || ''}
                      onChange={(e) => handleTrendChange(idx, 'revenue', parseInt(e.target.value))}
                      placeholder="Rev"
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base"
                    />
                    <input
                      type="number"
                      value={t.arr || ''}
                      onChange={(e) => handleTrendChange(idx, 'arr', parseInt(e.target.value))}
                      placeholder="ARR"
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base"
                    />
                    <input
                      type="number"
                      step="0.1"
                      value={t.churn || ''}
                      onChange={(e) => handleTrendChange(idx, 'churn', parseFloat(e.target.value))}
                      placeholder="Churn"
                      className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Line Chart */}
            <div className="flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-2 border border-slate-100 dark:border-slate-850">
              <svg width="100%" height={chartData.height} viewBox={`0 0 ${chartData.width} ${chartData.height}`} className="w-full">
                {/* Area Gradient */}
                <defs>
                  <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid/labels */}
                <text x="5" y="15" className="fill-slate-400 text-base font-bold">
                  {activeMetric === 'churn' ? `${chartData.maxVal}%` : `€{Math.round(chartData.maxVal / 1000)}k`}
                </text>
                <text x="5" y={chartData.height - chartData.paddingBottom} className="fill-slate-400 text-base font-bold">
                  {activeMetric === 'churn' ? `${chartData.minVal}%` : `€{Math.round(chartData.minVal / 1000)}k`}
                </text>
                <line x1={chartData.paddingLeft} y1={chartData.height - chartData.paddingBottom} x2={chartData.width} y2={chartData.height - chartData.paddingBottom} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" />

                {/* Draw Area */}
                {chartData.areaD && (
                  <path d={chartData.areaD} fill="url(#gradient-area)" />
                )}

                {/* Draw Line */}
                {chartData.pathD && (
                  <path d={chartData.pathD} className="stroke-emerald-500 fill-none" strokeWidth="2.5" strokeLinecap="round" />
                )}

                {/* Circles and Month labels */}
                {chartData.points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="4" className="fill-white stroke-emerald-500 stroke-2" />
                    <text x={p.x} y={chartData.height - 8} textAnchor="middle" className="fill-slate-400 text-base font-bold">
                      {p.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Benchmarks & Leading Indicators Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Benchmarks Comparisons */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              SaaS Benchmark Audit
            </h3>
            <div className="space-y-3 text-base">
              {/* NRR */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">Net Retention (NRR)</span>
                  <span className="text-base text-slate-400 block">Benchmark: &gt;110%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={benchmarks.nrr}
                    onChange={(e) => handleBenchmarkChange('nrr', parseInt(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-right rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <span className={`w-3 h-3 rounded-full shrink-0 ${benchmarks.nrr >= 110 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* LTV:CAC */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">LTV : CAC Ratio</span>
                  <span className="text-base text-slate-400 block">Benchmark: &gt;3.0x</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={benchmarks.ltvCac}
                    onChange={(e) => handleBenchmarkChange('ltvCac', parseFloat(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-right rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <span className={`w-3 h-3 rounded-full shrink-0 ${benchmarks.ltvCac >= 3.0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* Churn */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">Annual Churn</span>
                  <span className="text-base text-slate-400 block">Benchmark: &lt;5.0%</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={benchmarks.churn}
                    onChange={(e) => handleBenchmarkChange('churn', parseFloat(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-right rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <span className={`w-3 h-3 rounded-full shrink-0 ${benchmarks.churn <= 5.0 && benchmarks.churn > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
              </div>

              {/* Payback */}
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-400">Payback Period (Mo)</span>
                  <span className="text-base text-slate-400 block">Benchmark: &lt;12 Mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={benchmarks.payback}
                    onChange={(e) => handleBenchmarkChange('payback', parseInt(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-right rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                  />
                  <span className={`w-3 h-3 rounded-full shrink-0 ${benchmarks.payback <= 12 && benchmarks.payback > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* Leading Indicators */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              Leading Metrics
            </h3>
            <div className="space-y-3 text-base">
              {indicators.map((ind, idx) => {
                const ratio = ind.value / (ind.target || 1);
                const isHealthy = ratio >= 1;
                return (
                  <div key={ind.name} className="space-y-1.5">
                    <div className="flex justify-between items-center font-semibold text-slate-700 dark:text-slate-400">
                      <span>{ind.name}</span>
                      <span className={isHealthy ? 'text-emerald-500' : 'text-amber-500'}>
                        {ind.value} / {ind.target}
                      </span>
                    </div>
                    {/* Progress Slider Inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={ind.value || ''}
                        onChange={(e) => handleIndicatorChange(idx, 'value', parseFloat(e.target.value))}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base text-right"
                        placeholder="Value"
                      />
                      <input
                        type="number"
                        value={ind.target || ''}
                        onChange={(e) => handleIndicatorChange(idx, 'target', parseFloat(e.target.value))}
                        className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-base text-right"
                        placeholder="Target"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* NEW SCENARIO SIMULATOR SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Scenario Simulator (Next Month Projection)
          </h3>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Projected Monthly Growth (%)</label>
              <input
                type="number"
                step="0.5"
                min="-50"
                max="100"
                value={projectedGrowthRate}
                onChange={(e) => setProjectedGrowthRate(parseFloat(e.target.value))}
                className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Projected Monthly Churn (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={projectedChurnRate}
                onChange={(e) => setProjectedChurnRate(parseFloat(e.target.value))}
                className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-base font-bold uppercase tracking-wider text-slate-400">Projected Revenue</span>
                <span className="block text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">{currency(projectedNext.revenue)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold uppercase tracking-wider text-slate-400">Projected ARR</span>
                <span className="block text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">{currency(projectedNext.arr)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-base font-bold uppercase tracking-wider text-slate-400">Projected Churn</span>
                <span className="block text-lg font-extrabold text-red-500 tabular-nums">{projectedNext.churn.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Cash Burn & Runway Estimate
          </h3>
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2 gap-2 items-center">
              <label className="font-semibold text-slate-600 dark:text-slate-400">Monthly Cash Burn (€)</label>
              <input
                type="number"
                step="1000"
                min="0"
                value={cashBurn}
                onChange={(e) => setCashBurn(parseInt(e.target.value))}
                className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right"
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Estimated Runway (months) w/ €1M cash</span>
              <span className={`text-lg font-extrabold tabular-nums ${monthsOfRunway >= 12 ? 'text-emerald-500' : 'text-red-500'}`}>
                {monthsOfRunway === Infinity ? '∞' : monthsOfRunway.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
