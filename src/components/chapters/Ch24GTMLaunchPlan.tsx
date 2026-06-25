// @ts-nocheck
'use client';
import React, { useMemo, useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { currency } from '@/lib/math';

export default function Ch24GTMLaunchPlan() {
  const { state, updateChapter } = useMBA();
  const { mode, marketSize, channels, budget, phases } = state.chapter24 || {
    mode: 'top-down',
    marketSize: { tam: 0, sam: 0, som: 0 },
    channels: [],
    budget: { product: 0, marketing: 0, sales: 0, cs: 0 },
    phases: []
  };

  // Capacity planning inputs for bottom-up calculation (local states or calculated)
  const [repCount, setRepCount] = useState(6);
  const [quotaPerRep, setQuotaPerRep] = useState(120000);
  const [rampAttainment, setRampAttainment] = useState(85); // %

  const bottomUpCapacity = useMemo(() => {
    return repCount * quotaPerRep * (rampAttainment / 100);
  }, [repCount, quotaPerRep, rampAttainment]);

  // Handler helpers
  const handleMarketSizeChange = (key: 'tam' | 'sam' | 'som', value: number) => {
    updateChapter('chapter24', {
      marketSize: { ...marketSize, [key]: isNaN(value) ? 0 : value }
    });
  };

  const handleChannelChange = (index: number, field: string, value: number) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? 0 : value };
    updateChapter('chapter24', { channels: updated });
  };

  const handleBudgetChange = (key: keyof typeof budget, value: number) => {
    updateChapter('chapter24', {
      budget: { ...budget, [key]: isNaN(value) ? 0 : value }
    });
  };

  const handlePhaseChange = (index: number, field: string, value: any) => {
    const updated = [...phases];
    updated[index] = { ...updated[index], [field]: value };
    updateChapter('chapter24', { phases: updated });
  };

  const totalChannelPercentage = useMemo(() => {
    return channels.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
  }, [channels]);

  // NEW: Total expected customers derived from channel conversion rates
  const totalExpectedCustomers = useMemo(() => {
    let total = 0;
    channels.forEach((chan) => {
      const conversionRate = (chan.conversion || 0) / 100;
      total += (marketSize.som * (chan.percentage || 0) / 100) * conversionRate;
    });
    return Math.round(total);
  }, [channels, marketSize.som]);

  // NEW: Overall confidence from phases confidence levels
  const overallConfidence = useMemo(() => {
    if (!phases.length) return 0;
    const total = phases.reduce((acc, ph) => acc + (ph.confidence || 0), 0);
    return Math.round(total / phases.length);
  }, [phases]);

  const totalBudget = useMemo(() => {
    return budget.product + budget.marketing + budget.sales + budget.cs;
  }, [budget]);

  // Market Sizing nested circle radius calculations
  const circleRadius = useMemo(() => {
    const tam = marketSize.tam || 1;
    const sam = marketSize.sam || 0;
    const som = marketSize.som || 0;

    const rTAM = 70;
    const rSAM = Math.max(10, rTAM * Math.sqrt(sam / tam));
    const rSOM = Math.max(5, rTAM * Math.sqrt(som / tam));

    return {
      tam: rTAM,
      sam: Math.min(rTAM, rSAM),
      som: Math.min(rSAM, rSOM)
    };
  }, [marketSize]);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Go-To-Market (GTM) Launch Planner
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Triangulate your target goals using Top-Down target modeling or Bottom-Up capacity planning. Allocate marketing and sales budgets, define distribution channels, and track timeline progression.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-3 shadow-sm">
        <span className="text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-2">
          Planning Mode: <span className="text-emerald-500">{mode === 'top-down' ? 'Top-Down Target' : 'Bottom-Up Capacity'}</span>
        </span>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => updateChapter('chapter24', { mode: 'top-down' })}
            className={`px-4 py-1 text-base font-bold rounded-md transition-all ${
              mode === 'top-down'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Top-Down
          </button>
          <button
            onClick={() => updateChapter('chapter24', { mode: 'bottom-up' })}
            className={`px-4 py-1 text-base font-bold rounded-md transition-all ${
              mode === 'bottom-up'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Bottom-Up
          </button>
        </div>
      </div>

      {/* Triangulation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TAM SAM SOM */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Market Sizing (TAM → SAM → SOM)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 text-base">
              <div className="space-y-1">
                <label className="text-base font-bold text-slate-400 uppercase tracking-wider">TAM (Total Addressable Market)</label>
                <input
                  type="number"
                  value={marketSize.tam || ''}
                  onChange={(e) => handleMarketSizeChange('tam', parseInt(e.target.value))}
                  placeholder="TAM Value"
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-base font-bold text-slate-400 uppercase tracking-wider">SAM (Serviceable Addressable)</label>
                <input
                  type="number"
                  value={marketSize.sam || ''}
                  onChange={(e) => handleMarketSizeChange('sam', parseInt(e.target.value))}
                  placeholder="SAM Value"
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-base font-bold text-slate-400 uppercase tracking-wider">SOM (Serviceable Obtainable)</label>
                <input
                  type="number"
                  value={marketSize.som || ''}
                  onChange={(e) => handleMarketSizeChange('som', parseInt(e.target.value))}
                  placeholder="SOM Value"
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Nested Circles SVG */}
            <div className="flex items-center justify-center">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r={circleRadius.tam} className="fill-blue-500/10 stroke-blue-500" strokeWidth="1" />
                <circle cx="75" cy="75" r={circleRadius.sam} className="fill-violet-500/20 stroke-violet-500" strokeWidth="1" />
                <circle cx="75" cy="75" r={circleRadius.som} className="fill-emerald-500/30 stroke-emerald-500" strokeWidth="1.5" />
                <text x="75" y="75" textAnchor="middle" fill="currentColor" className="text-base font-extrabold text-emerald-650 dark:text-emerald-450 pointer-events-none select-none">SOM</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Top-Down Target OR Bottom-Up Capacity Panel */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          {mode === 'top-down' ? (
            <>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                Top-Down Distribution Target
              </h3>
              <p className="text-base text-slate-500">
                Allocate your target launch volume across GTM channels. Total channel alignment must equal exactly 100%.
              </p>
              <div className="space-y-3">
                {channels.map((chan, idx) => (
                  <div key={chan.channelName} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-base">
                    <span className="font-semibold text-slate-700 dark:text-slate-400">{chan.channelName}</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={chan.percentage}
                      onChange={(e) => handleChannelChange(idx, 'percentage', parseInt(e.target.value))}
                      className="h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-right font-bold text-slate-650 tabular-nums">
                      {chan.percentage}% ({currency((marketSize.som * chan.percentage) / 100)})
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Sum Allocation:</span>
                <span className={totalChannelPercentage === 100 ? 'text-emerald-500' : 'text-red-500'}>
                  {totalChannelPercentage}% {totalChannelPercentage !== 100 && '⚠️ Must equal 100%'}
                </span>
              </div>
              {/* NEW: Conversion Rate per channel + expected customers */}
              <div className="pt-2 space-y-2">
                <span className="text-base font-bold uppercase tracking-wider text-slate-400">Conversion Rate per Channel</span>
                {channels.map((chan, idx) => (
                  <div key={chan.channelName} className="grid grid-cols-3 gap-2 items-center text-base">
                    <span className="text-slate-600 dark:text-slate-400">{chan.channelName}</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={chan.conversion || 0}
                      onChange={(e) => handleChannelChange(idx, 'conversion', parseInt(e.target.value))}
                      className="w-full px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-right"
                    />
                    <span className="text-right font-semibold text-slate-650">
                      {Math.round((marketSize.som * (chan.percentage || 0) / 100) * ((chan.conversion || 0) / 100))}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Total Expected Customers</span>
                  <span className="text-emerald-500">{totalExpectedCustomers}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                Bottom-Up Capacity Estimator
              </h3>
              <p className="text-base text-slate-500">
                Calibrate capacity limits based on rep staffing, quota assignments, and ramp-up rate adjustments.
              </p>
              <div className="space-y-3 text-base">
                <div className="grid grid-cols-2 gap-2 items-center">
                  <label className="font-medium text-slate-600 dark:text-slate-400">Reps Count</label>
                  <input
                    type="number"
                    value={repCount}
                    onChange={(e) => setRepCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 items-center">
                  <label className="font-medium text-slate-600 dark:text-slate-400">Quota Per Rep ($)</label>
                  <input
                    type="number"
                    value={quotaPerRep}
                    onChange={(e) => setQuotaPerRep(Math.max(0, parseInt(e.target.value) || 0))}
                    className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-base font-bold text-slate-400 uppercase tracking-wider">
                    <span>Ramp Attainment</span>
                    <span className="tabular-nums">{rampAttainment}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={rampAttainment}
                    onChange={(e) => setRampAttainment(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="flex justify-between items-center text-base font-bold pt-4 border-t border-slate-105 dark:border-slate-800">
                  <span>Bottom-Up Capacity Potential:</span>
                  <span className="text-emerald-500 tabular-nums">{currency(bottomUpCapacity)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Budget Allocation & Project Timeline Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Allocation */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            Budget Allocation ($)
          </h3>
          <div className="space-y-3 text-base">
            {Object.keys(budget).map((key) => {
              const val = budget[key as keyof typeof budget] || 0;
              return (
                <div key={key} className="grid grid-cols-2 gap-4 items-center">
                  <label className="font-semibold text-slate-650 dark:text-slate-400 capitalize">{key} Budget</label>
                  <input
                    type="number"
                    value={val || ''}
                    onChange={(e) => handleBudgetChange(key as keyof typeof budget, parseInt(e.target.value))}
                    className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-right focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              );
            })}
            <div className="flex justify-between items-center text-base font-bold pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Total GTM Budget:</span>
              <span className="text-emerald-555 tabular-nums">{currency(totalBudget)}</span>
            </div>
          </div>
        </div>

        {/* GTM Milestones Timeline */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
            GTM Launch Milestones
          </h3>
          <div className="space-y-4 max-h-[25vh] overflow-y-auto pr-1">
            {phases.map((ph, idx) => (
              <div key={ph.phase} className="flex gap-3 text-base relative">
                {/* Visual node line */}
                {idx < phases.length - 1 && (
                  <div className="absolute top-5 bottom-0 left-2.5 w-[2px] bg-slate-200 dark:bg-slate-800" />
                )}
                {/* Node circle */}
                <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-bold text-base z-10 ${
                  ph.status === 'Completed'
                    ? 'bg-emerald-500 text-white'
                    : ph.status === 'In Progress'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {idx + 1}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-800 dark:text-slate-200">{ph.phase} ({ph.weeks} Weeks)</span>
                    <select
                      value={ph.status}
                      onChange={(e) => handlePhaseChange(idx, 'status', e.target.value)}
                      className="text-base px-1 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-650"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={ph.tasks}
                    onChange={(e) => handlePhaseChange(idx, 'tasks', e.target.value)}
                    placeholder="Milestone tasks..."
                    className="w-full text-base bg-transparent border-b border-slate-150 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-600 dark:text-slate-400 pb-0.5"
                  />
                  {/* NEW: Confidence slider per phase */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base text-slate-500 w-20">Confidence</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={ph.confidence || 50}
                      onChange={(e) => handlePhaseChange(idx, 'confidence', parseInt(e.target.value))}
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <span className="text-base font-bold text-slate-650 w-8 text-right">{ph.confidence || 50}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* NEW: Overall confidence display */}
          <div className="flex justify-between items-center text-base font-bold pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>Overall Confidence</span>
            <span className="text-emerald-500 tabular-nums">{overallConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
