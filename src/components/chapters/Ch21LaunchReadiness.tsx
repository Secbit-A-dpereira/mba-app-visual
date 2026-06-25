'use client';
import React, { useMemo, useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { LaunchReadinessItem } from '@/types/mba';

const DEPARTMENTS = ['Product', 'Marketing', 'Sales', 'Customer Success', 'Finance'] as const;

export default function Ch21LaunchReadiness() {
  const { state, updateChapter } = useMBA();
  const { items } = state.chapter21 || { items: [] };

  /* ── Risk heatmap state ── */
  const [riskLevels, setRiskLevels] = useState<Record<string, 'low' | 'medium' | 'high'>>({});

  const handleScoreChange = (id: string, score: number) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, score } : item
    );
    updateChapter('chapter21', { items: updatedItems });
  };

  const handleRiskChange = (id: string, level: 'low' | 'medium' | 'high') => {
    setRiskLevels(prev => ({ ...prev, [id]: level }));
  };

  // Calculations
  const stats = useMemo(() => {
    if (!items.length) return { score: 0, maxScore: 0, percent: 0, risks: 0 };
    const score = items.reduce((acc, curr) => acc + curr.score, 0);
    const maxScore = items.length * 5;
    const percent = Math.round((score / maxScore) * 100);
    const risks = items.filter(i => i.score > 0 && i.score < 3).length;
    return { score, maxScore, percent, risks };
  }, [items]);

  // Risk summary
  const riskSummary = useMemo(() => {
    const low = Object.values(riskLevels).filter(l => l === 'low').length;
    const med = Object.values(riskLevels).filter(l => l === 'medium').length;
    const high = Object.values(riskLevels).filter(l => l === 'high').length;
    return { low, med, high };
  }, [riskLevels]);

  // Donut Gauge SVG calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.percent / 100) * circumference;

  let gaugeColor = 'stroke-emerald-500';
  if (stats.percent < 50) gaugeColor = 'stroke-red-500';
  else if (stats.percent < 80) gaugeColor = 'stroke-amber-500';

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚀</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            RevOps Launch Readiness Index
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Assess GTM launch alignment across departments. Success is built on two-way accountability and removing bottleneck friction points before the "Fiscal Year Flip".
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Index & Gauges */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-6 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Readiness Score
            </h3>

            {/* SVG Donut */}
            <div className="relative w-36 h-36">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                {/* Background circle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                  strokeWidth="12"
                />
                {/* Animated gauge circle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className={`fill-none transition-all duration-500 ease-out ${gaugeColor}`}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Text in the middle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
                  {stats.percent}%
                </span>
                <span className="text-base text-slate-400 font-semibold uppercase tracking-wider">
                  Ready
                </span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                  {stats.score}
                </span>
                <span className="text-base text-slate-400 block">Total Points</span>
              </div>
              <div>
                <span className={`text-2xl font-bold tabular-nums ${stats.risks > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {stats.risks}
                </span>
                <span className="text-base text-slate-400 block">Risk Flags</span>
              </div>
            </div>
          </div>

          {/* Quick Department Legend */}
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
            <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Departmental Health
            </h4>
            <div className="space-y-2">
              {DEPARTMENTS.map(dept => {
                const deptItems = items.filter(i => i.category === dept);
                const score = deptItems.reduce((acc, curr) => acc + curr.score, 0);
                const max = deptItems.length * 5;
                const ratio = max > 0 ? Math.round((score / max) * 100) : 0;
                let colorClass = 'text-emerald-500';
                if (ratio < 50) colorClass = 'text-red-500';
                else if (ratio < 80) colorClass = 'text-amber-500';

                return (
                  <div key={dept} className="flex justify-between items-center text-base">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{dept}</span>
                    <span className={`font-semibold tabular-nums ${colorClass}`}>{ratio}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: List & Scorers */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Launch Readiness Items
            </h3>
            <span className="text-base text-slate-400">Score 1-5 (1 = Not Started, 5 = Launch Ready)</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[60vh] overflow-y-auto pr-1">
            {items.map((item) => {
              const hasRisk = item.score > 0 && item.score < 3;
              return (
                <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-base">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                      {hasRisk && (
                        <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-base font-bold uppercase tracking-wider">
                          ⚠️ Risk Flag
                        </span>
                      )}
                    </div>
                    <span className="text-base text-slate-400 font-medium uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>

                  {/* Scorer Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    {[1, 2, 3, 4, 5].map((scoreValue) => {
                      const isActive = item.score === scoreValue;
                      let activeStyle = 'bg-slate-600 text-white dark:bg-slate-500';
                      if (isActive) {
                        if (scoreValue >= 4) activeStyle = 'bg-emerald-500 text-white';
                        else if (scoreValue === 3) activeStyle = 'bg-amber-500 text-white';
                        else activeStyle = 'bg-red-500 text-white';
                      }
                      return (
                        <button
                          key={scoreValue}
                          onClick={() => handleScoreChange(item.id, scoreValue)}
                          className={`w-7 h-7 rounded-md font-bold transition-all text-base focus:outline-none flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 ${
                            isActive
                              ? activeStyle
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-55'
                          }`}
                        >
                          {scoreValue}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── NEW INTERACTIVE TOOL 1: Risk Heatmap (Dependency-Based) ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
          🔥 Risk Probability Heatmap
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400">Assign a risk level (Low / Medium / High) to each readiness item. The color‑coded matrix helps identify high‑priority friction points before launch.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-base border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-semibold text-slate-500">Item</th>
                <th className="text-center py-2 px-2 font-semibold text-emerald-600">Low</th>
                <th className="text-center py-2 px-2 font-semibold text-amber-600">Medium</th>
                <th className="text-center py-2 px-2 font-semibold text-red-600">High</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const current = riskLevels[item.id] || 'medium';
                return (
                  <tr key={item.id} className="border-b border-slate-50 dark:border-slate-800">
                    <td className="py-2 pr-4 text-slate-700 dark:text-slate-300">{item.name}</td>
                    {(['low', 'medium', 'high'] as const).map(level => {
                      const isSelected = current === level;
                      const colorMap = {
                        low: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
                        medium: 'border-amber-400 bg-amber-50 dark:bg-amber-900/20',
                        high: 'border-red-400 bg-red-50 dark:bg-red-900/20',
                      };
                      const selectedStyle = isSelected
                        ? colorMap[level]
                        : 'border-transparent bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800';
                      return (
                        <td key={level} className="text-center py-2 px-1">
                          <button
                            onClick={() => handleRiskChange(item.id, level)}
                            className={`w-8 h-8 rounded-md border-2 transition-all text-base ${selectedStyle}`}
                          >
                            {level === 'low' ? '🟢' : level === 'medium' ? '🟡' : '🔴'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary legend */}
        <div className="flex gap-4 pt-2 text-base text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span>🟢 Low: {riskSummary.low}</span>
          <span>🟡 Medium: {riskSummary.med}</span>
          <span>🔴 High: {riskSummary.high}</span>
        </div>
      </div>

      {/* ── NEW INTERACTIVE TOOL 2: Launch Timeline Gantt (Simplified) ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
          📅 Launch Timeline – Week‑by‑Week Progress
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400">Each completion milestone maps to a launch week. Hover or click to see the item’s readiness score.</p>

        <div className="space-y-2">
          {items.map((item) => {
            const score = item.score || 1;
            // Map score 1–5 to a week range roughly: 1->week 6, 5->week 1
            const week = Math.max(1, Math.min(6, Math.round(6 - (score * 5) / 5)));
            const barColor =
              score >= 4
                ? 'bg-emerald-500 dark:bg-emerald-600'
                : score >= 3
                  ? 'bg-amber-500 dark:bg-amber-600'
                  : 'bg-red-500 dark:bg-red-600';
            const barWidth = `${(score / 5) * 100}%`;

            return (
              <div key={item.id} className="flex items-center gap-3">
                <span className="w-36 text-base font-medium text-slate-700 dark:text-slate-300 truncate" title={item.name}>
                  {item.name}
                </span>
                {/* Gantt bar */}
                <div className="flex-1 h-4 rounded-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                    style={{ width: barWidth }}
                  />
                </div>
                <span className="w-10 text-base text-slate-400 tabular-nums text-right">
                  W{week}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pt-2 text-base text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Early</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Mid</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Late</span>
          <span className="ml-auto text-base">Lower score = earlier launch week</span>
        </div>
      </div>
    </div>
  );
}
