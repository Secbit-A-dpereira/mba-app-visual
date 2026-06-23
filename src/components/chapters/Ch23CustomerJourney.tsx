// @ts-nocheck
'use client';
import React, { useMemo, useState } from 'react';
import { useMBA } from '@/context/MBAContext';

const STAGE_COLORS = [
  'bg-emerald-500',
  'bg-lime-500',
  'bg-amber-500',
  'bg-orange-500',
  'bg-red-500'
];

export default function Ch23CustomerJourney() {
  const { state, updateChapter } = useMBA();
  const { stages } = state.chapter23 || { stages: [] };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], [field]: value };
    updateChapter('chapter23', { stages: updated });
  };

  // Funnel polygon calculations
  const funnelSteps = [
    { top: 120, bottom: 100 }, // Awareness
    { top: 100, bottom: 82 },  // Consideration
    { top: 82, bottom: 66 },   // Purchase
    { top: 66, bottom: 52 },   // Onboarding
    { top: 52, bottom: 40 },   // Retention
    { top: 40, bottom: 30 }    // Advocacy
  ];

  const averageScore = useMemo(() => {
    if (!stages.length) return 0;
    const total = stages.reduce((acc, curr) => acc + curr.score, 0);
    return (total / stages.length).toFixed(1);
  }, [stages]);

  // New weighted score calculation based on importance weights (if any)
  const overallWeightedScore = useMemo(() => {
    if (!stages.length) return 0;
    const sAny = stages as any[];
    const totalWeight = sAny.reduce((acc: number, s: any) => acc + (s.importance || 0), 0);
    if (totalWeight === 0) return 0;
    const weightedSum = sAny.reduce((acc: number, s: any) => acc + (s.score || 0) * (s.importance || 0), 0);
    return (weightedSum / totalWeight).toFixed(1);
  }, [stages]);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🗺️</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Customer Journey Lifecycle Designer
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Design your product launch customer lifecycle from end-to-end. Detail critical transition touchpoints, key performance metrics, and track qualitative health scores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Funnel SVG Visualization Left Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Funnel Health Index
            </h3>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tabular-nums">
              {averageScore}
              <span className="text-xs text-slate-400 dark:text-slate-550 font-normal"> / 5</span>
            </span>
            {/* New: Weighted Score display */}
            <div className="mt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Weighted Score</span>
              <span className="block text-xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {overallWeightedScore}
                <span className="text-xs text-slate-400 font-normal"> / 5</span>
              </span>
            </div>
          </div>

          {/* SVG Funnel */}
          <div className="w-full flex justify-center">
            <svg width="180" height="210" viewBox="0 0 160 190">
              {funnelSteps.map((step, idx) => {
                const stage = stages[idx];
                const score = stage ? stage.score : 0;
                
                // Color mapping based on score 1-5
                let color = 'fill-slate-200 dark:fill-slate-800';
                if (score === 5) color = 'fill-emerald-500 dark:fill-emerald-600';
                else if (score === 4) color = 'fill-emerald-400 dark:fill-emerald-500';
                else if (score === 3) color = 'fill-amber-400 dark:fill-amber-500';
                else if (score === 2) color = 'fill-orange-400 dark:fill-orange-500';
                else if (score === 1) color = 'fill-rose-500 dark:fill-rose-600';

                const y1 = idx * 30 + 5;
                const y2 = y1 + 25;
                const center = 80;
                
                const x1 = center - step.top / 2;
                const x2 = center + step.top / 2;
                const x3 = center + step.bottom / 2;
                const x4 = center - step.bottom / 2;
                
                const points = `${x1},${y1} ${x2},${y1} ${x3},${y2} ${x4},${y2}`;

                return (
                  <g key={stage?.stage || idx} className="group cursor-pointer">
                    <polygon
                      points={points}
                      className={`${color} hover:brightness-105 transition-all duration-300`}
                    />
                    <text
                      x={center}
                      y={y1 + 16}
                      textAnchor="middle"
                      className="fill-white font-extrabold text-[8px] tracking-wider pointer-events-none select-none"
                    >
                      {stage?.stage.toUpperCase()}: {score || '-'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="w-full text-left text-[10px] text-slate-400 dark:text-slate-500 space-y-1">
            <span className="font-bold block uppercase tracking-wider mb-1">Color Key:</span>
            <div className="grid grid-cols-2 gap-1.5 font-semibold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> 5 - Excellent</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> 4 - Strong</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-450" /> 3 - Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> 2 - Weak</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> 1 - Critical</span>
            </div>
          </div>
        </div>

        {/* Journey Stage Form Fields Right Panel */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Touchpoint & Metric Configurations
          </h3>

          <div className="space-y-6 divide-y divide-slate-150 dark:divide-slate-800/60 max-h-[60vh] overflow-y-auto pr-1">
            {stages.map((item, idx) => (
              <div key={item.stage} className={`pt-4 ${idx === 0 ? 'pt-0 border-t-0' : ''} space-y-3`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      Stage {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.stage}</h4>
                  </div>

                  {/* Status Dropdown & Score */}
                  <div className="flex items-center gap-3">
                    <select
                      value={item.status}
                      onChange={(e) => handleFieldChange(idx, 'status', e.target.value)}
                      className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Optimized">Optimized</option>
                    </select>

                    {/* Score selector */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleFieldChange(idx, 'score', s)}
                          className={`w-5 h-5 rounded text-[10px] font-bold transition-colors ${
                            item.score === s
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Touchpoints
                    </label>
                    <input
                      type="text"
                      value={item.touchpoints}
                      onChange={(e) => handleFieldChange(idx, 'touchpoints', e.target.value)}
                      placeholder="e.g. Sales deck, website"
                      className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Tracking Metrics
                    </label>
                    <input
                      type="text"
                      value={item.metrics}
                      onChange={(e) => handleFieldChange(idx, 'metrics', e.target.value)}
                      placeholder="e.g. Lead conversion, NPS"
                      className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Stage Owner
                    </label>
                    <input
                      type="text"
                      value={item.owner}
                      onChange={(e) => handleFieldChange(idx, 'owner', e.target.value)}
                      placeholder="e.g. Marketing, CS"
                      className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* NEW: Duration & Importance Weight */}
                <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={item.duration || ''}
                      onChange={(e) => handleFieldChange(idx, 'duration', parseInt(e.target.value))}
                      placeholder="e.g. 30"
                      className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Importance Weight (0-10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={item.importance || ''}
                      onChange={(e) => handleFieldChange(idx, 'importance', parseFloat(e.target.value))}
                      placeholder="e.g. 8"
                      className="w-full px-2 py-1 text-xs rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
