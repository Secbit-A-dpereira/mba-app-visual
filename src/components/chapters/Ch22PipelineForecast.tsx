'use client';
import React, { useMemo, useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { currency } from '@/lib/math';

export default function Ch22PipelineForecast() {
  const { state, updateChapter } = useMBA();
  const { stages, forecastTarget, actualClosed } = state.chapter22 || {
    stages: [],
    forecastTarget: 0,
    actualClosed: 0
  };

  /* ── Additional interactive tool states ── */
  // Historical Accuracy Tracker (3 months)
  const [history, setHistory] = useState([
    { target: 100000, actual: 95000 },
    { target: 120000, actual: 115000 },
    { target: 110000, actual: 108000 },
  ]);
  // Discount What-If
  const [discountRate, setDiscountRate] = useState(0); // 0-30%

  const handleAmountChange = (index: number, val: number) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], amount: isNaN(val) ? 0 : val };
    updateChapter('chapter22', { stages: updated });
  };

  const handleProbabilityChange = (index: number, val: number) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], probability: Math.max(0, Math.min(100, isNaN(val) ? 0 : val)) };
    updateChapter('chapter22', { stages: updated });
  };

  const handleTargetChange = (val: number) => {
    updateChapter('chapter22', { forecastTarget: isNaN(val) ? 0 : val });
  };

  const handleActualChange = (val: number) => {
    updateChapter('chapter22', { actualClosed: isNaN(val) ? 0 : val });
  };

  // Calculations
  const totalRaw = useMemo(() => {
    return stages.reduce((acc, curr) => acc + curr.amount, 0);
  }, [stages]);

  const totalWeighted = useMemo(() => {
    return stages.reduce((acc, curr) => acc + (curr.amount * curr.probability) / 100, 0);
  }, [stages]);

  const forecastAccuracy = useMemo(() => {
    if (forecastTarget <= 0) return 0;
    const diff = Math.abs(forecastTarget - actualClosed);
    const accuracy = 1 - diff / forecastTarget;
    return Math.max(0, Math.round(accuracy * 100));
  }, [forecastTarget, actualClosed]);

  // SVG Chart variables
  const maxAmount = useMemo(() => {
    const amounts = stages.map(s => s.amount);
    return Math.max(...amounts, 10000);
  }, [stages]);

  /* ── Historical Accuracy ── */
  const avgAccuracy = useMemo(() => {
    const accs = history.map(h => {
      if (h.target <= 0) return 0;
      return 1 - Math.abs(h.target - h.actual) / h.target;
    });
    const total = accs.reduce((a, b) => a + b, 0);
    return Math.round((total / accs.length) * 100);
  }, [history]);

  const handleHistoryChange = (idx: number, field: 'target' | 'actual', val: number) => {
    const newHist = history.map((h, i) => (i === idx ? { ...h, [field]: isNaN(val) ? 0 : val } : h));
    setHistory(newHist);
  };

  /* ── Discount What‑If ── */
  const discountedRevenue = useMemo(() => {
    return totalWeighted * (1 - discountRate / 100);
  }, [totalWeighted, discountRate]);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Pipeline & Forecast Manager
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Input deal pipeline sizes, calculate weighted revenue, and compute forecast accuracy against target commitment. RevOps brings predictability by keeping target vs. actual variance under 5%.
        </p>
      </div>

      {/* Ratios & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Raw Pipeline</span>
          <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
            {currency(totalRaw)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Sum of all active deals</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Weighted Pipeline</span>
          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450 tabular-nums">
            {currency(totalWeighted)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Adjusted for stage probability</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Forecast Variance</span>
          <span className={`text-xl font-extrabold tabular-nums ${actualClosed >= forecastTarget ? 'text-emerald-500' : 'text-rose-500'}`}>
            {currency(actualClosed - forecastTarget)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Actual Closed vs. Target</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Forecast Accuracy</span>
          <span className={`text-xl font-extrabold tabular-nums ${forecastAccuracy >= 90 ? 'text-emerald-500' : forecastAccuracy >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
            {forecastAccuracy}%
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Goal: &gt;90% accuracy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Inputs */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Pipeline Stage Entries
          </h3>

          <div className="space-y-3">
            {stages.map((stage, idx) => (
              <div key={stage.name} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs">
                <div className="sm:col-span-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-850 dark:text-slate-350">{stage.name}</span>
                </div>
                <div className="sm:col-span-4 flex items-center gap-1.5">
                  <span className="text-slate-450">$</span>
                  <input
                    type="number"
                    value={stage.amount || ''}
                    onChange={(e) => handleAmountChange(idx, parseInt(e.target.value))}
                    placeholder="Deal Amount"
                    className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={stage.probability}
                    onChange={(e) => handleProbabilityChange(idx, parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="w-8 text-right font-bold text-slate-650 dark:text-slate-450 tabular-nums">
                    {stage.probability}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast and Chart Right Panel */}
        <div className="space-y-6">
          {/* Targets Configuration */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              Forecast Target Calibration
            </h3>
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Target Forecast Commit ($)
                </label>
                <input
                  type="number"
                  value={forecastTarget || ''}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value))}
                  placeholder="Target Forecast"
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Actual Closed Won ($)
                </label>
                <input
                  type="number"
                  value={actualClosed || ''}
                  onChange={(e) => handleActualChange(parseInt(e.target.value))}
                  placeholder="Actual Closed"
                  className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* SVG Bar Chart Card */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pipeline Funnel Distribution
            </h4>

            {/* Vertical Bar Chart */}
            <div className="w-full h-44 flex items-end justify-between px-2 pt-4">
              {stages.map((stage) => {
                const ratio = stage.amount / maxAmount;
                const barHeight = Math.max(ratio * 120, 4); // Min 4px height for visual feedback
                return (
                  <div key={stage.name} className="flex flex-col items-center group w-7">
                    {/* Tooltip value */}
                    <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(stage.amount / 1000)}k
                    </span>
                    <div
                      className="w-4 bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-500 rounded-t-sm transition-all duration-500 ease-out"
                      style={{ height: `${barHeight}px` }}
                    />
                    <span className="text-[8px] font-semibold text-slate-400 mt-2 truncate w-7 text-center">
                      {stage.name.substring(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── NEW INTERACTIVE TOOL 1: Historical Accuracy Tracker ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
          📈 Historical Forecast Accuracy (Last 3 Months)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Adjust monthly targets and actuals to see trailing accuracy trend.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {history.map((month, idx) => (
            <div key={idx} className="space-y-2 p-3 rounded-md border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Month {idx + 1}</span>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-medium">Target</label>
                <input
                  type="number"
                  value={month.target}
                  onChange={(e) => handleHistoryChange(idx, 'target', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] text-slate-400 uppercase font-medium">Actual</label>
                <input
                  type="number"
                  value={month.actual}
                  onChange={(e) => handleHistoryChange(idx, 'actual', parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">Average Accuracy (trailing 3M)</span>
          <span className={`text-xl font-extrabold tabular-nums ${avgAccuracy >= 90 ? 'text-emerald-500' : avgAccuracy >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
            {avgAccuracy}%
          </span>
        </div>
      </div>

      {/* ── NEW INTERACTIVE TOOL 2: Discount What-If Simulator ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
          💲 Discount Scenario: Impact on Weighted Revenue
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Simulate the effect of average deal discount on your expected weighted pipeline revenue.</p>

        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount Rate</label>
            <input
              type="range"
              min="0"
              max="30"
              step="1"
              value={discountRate}
              onChange={(e) => setDiscountRate(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0%</span>
              <span>30%</span>
            </div>
          </div>
          <div className="text-center">
            <span className="block text-xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">{discountRate}%</span>
            <span className="text-[9px] text-slate-400 uppercase font-bold">Applied</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <span className="text-[10px] text-slate-400 block">Weighted Pipeline (No Discount)</span>
            <span className="text-base font-bold text-slate-800 dark:text-slate-200 tabular-nums">{currency(totalWeighted)}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">After Discount</span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{currency(discountedRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
