'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { OperationsMetrics } from '@/types/mba';

const SLIDER_CONFIG: {
  key: keyof OperationsMetrics;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
}[] = [
  {
    key: 'throughput',
    label: 'Throughput',
    unit: 'units/hr',
    min: 0,
    max: 500,
    step: 1,
    description: 'Number of units produced per hour',
  },
  {
    key: 'inventory',
    label: 'Inventory',
    unit: 'units',
    min: 0,
    max: 5000,
    step: 10,
    description: 'Total units in the system (WIP + finished)',
  },
  {
    key: 'flowTime',
    label: 'Flow Time',
    unit: 'days',
    min: 0,
    max: 30,
    step: 0.5,
    description: 'Average time a unit spends in the system',
  },
  {
    key: 'defectRate',
    label: 'Defect Rate',
    unit: '%',
    min: 0,
    max: 100,
    step: 0.5,
    description: 'Percentage of units with defects',
  },
  {
    key: 'oee',
    label: 'Overall Equipment Effectiveness (OEE)',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
    description: 'Overall Equipment Effectiveness — availability × performance × quality',
  },
];

function getOeeColor(value: number): string {
  if (value >= 85) return 'text-emerald-600 dark:text-emerald-400';
  if (value >= 60) return 'text-amber-655 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getDefectColor(value: number): string {
  if (value <= 2) return 'text-emerald-600 dark:text-emerald-400';
  if (value <= 10) return 'text-amber-655 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getFlowColor(value: number): string {
  if (value <= 5) return 'text-emerald-600 dark:text-emerald-400';
  if (value <= 15) return 'text-amber-655 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getThroughputColor(value: number): string {
  if (value >= 200) return 'text-emerald-600 dark:text-emerald-400';
  if (value >= 100) return 'text-amber-655 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getInventoryColor(value: number): string {
  if (value <= 500) return 'text-emerald-600 dark:text-emerald-400';
  if (value <= 2000) return 'text-amber-655 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getSliderColor(key: string, value: number): string {
  switch (key) {
    case 'throughput': return getThroughputColor(value);
    case 'inventory': return getInventoryColor(value);
    case 'flowTime': return getFlowColor(value);
    case 'defectRate': return getDefectColor(value);
    case 'oee': return getOeeColor(value);
    default: return 'text-emerald-600 dark:text-emerald-400';
  }
}

function getTrackColor(key: string, value: number): string {
  switch (key) {
    case 'throughput':
    case 'oee':
      return value >= 60 ? '#10B981' : value >= 30 ? '#F59E0B' : '#EF4444';
    case 'inventory':
    case 'flowTime':
    case 'defectRate':
      return value <= 40 ? '#10B981' : value <= 70 ? '#F59E0B' : '#EF4444';
    default:
      return '#10B981';
  }
}

export default function Ch7Operations() {
  const { state, updateChapter } = useMBA();
  const metrics = state.chapter7.metrics;

  // Cost of Quality & Waste state
  const [totalUnitsProduced, setTotalUnitsProduced] = useState(1000);
  const [defectiveUnits, setDefectiveUnits] = useState(50);
  const [costPerUnit, setCostPerUnit] = useState(10);
  const [scrapCostPerUnit, setScrapCostPerUnit] = useState(5);
  const [reworkCostPerUnit, setReworkCostPerUnit] = useState(3);

  // EOQ state
  const [annualDemand, setAnnualDemand] = useState(10000);
  const [orderingCost, setOrderingCost] = useState(50);
  const [holdingCost, setHoldingCost] = useState(2);

  const handleChange = (key: keyof OperationsMetrics, value: number) => {
    updateChapter('chapter7', { metrics: { ...metrics, [key]: value } });
  };

  // Calculate operational metrics insights
  const throughputRate = metrics.throughput;
  const wip = metrics.inventory;
  const cycleTime = wip > 0 && throughputRate > 0 ? (wip / throughputRate).toFixed(1) : '—';
  const qualityRate = (100 - metrics.defectRate).toFixed(1);
  const firstPassYield = metrics.defectRate > 0
    ? Math.pow((100 - metrics.defectRate) / 100, 3) * 100
    : 100;
  const effectiveOee = metrics.oee * ((100 - metrics.defectRate) / 100);
  const littleSLaw = wip / (throughputRate || 1);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          ⚙️ Operations Metrics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Adjust key operational parameters to monitor system performance and identify bottlenecks.
        </p>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-5">
        {SLIDER_CONFIG.map((cfg) => {
          const value = metrics[cfg.key];
          const colorClass = getSliderColor(cfg.key, value);
          const pct = Math.min(100, Math.max(0, (value / cfg.max) * 100));

          return (
            <div
              key={cfg.key}
              className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {cfg.label}
                  </label>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium leading-normal">
                    {cfg.description}
                  </p>
                </div>
                <span className={`text-2xl font-bold tabular-nums ${colorClass}`}>
                  {value}
                  <span className="text-xs font-semibold text-slate-400 ml-1 uppercase">{cfg.unit}</span>
                </span>
              </div>

              {/* Custom slider */}
              <div className="relative pt-2">
                <input
                  type="range"
                  min={cfg.min}
                  max={cfg.max}
                  step={cfg.step}
                  value={value}
                  onChange={(e) => handleChange(cfg.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-550 mt-1 uppercase tracking-wider">
                  <span>{cfg.min}</span>
                  <span>{cfg.max}</span>
                </div>
              </div>

              {/* Mini progress indicator */}
              <div className="flex gap-1 mt-1">
                {[0, 1, 2, 3].map((segment) => {
                  const segStart = segment * 25;
                  return (
                    <div
                      key={segment}
                      className="h-1 flex-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
                    >
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${Math.min(100, Math.max(0, (pct - segStart) * 4))}%`,
                          backgroundColor: getTrackColor(cfg.key, pct),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Little's Law & Insights */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-4">
          📐 Operational Insights
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Throughput</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{throughputRate} <span className="text-xs font-normal text-slate-450 dark:text-slate-505">u/hr</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">WIP (Inventory)</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{wip} <span className="text-xs font-normal text-slate-455 dark:text-slate-505">units</span></p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cycle Time</p>
            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-350">
              {isFinite(littleSLaw) ? littleSLaw.toFixed(1) : '—'} <span className="text-xs font-normal text-slate-455 dark:text-slate-505">hrs</span>
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Quality Rate</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{qualityRate}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">First Pass Yield</p>
            <p className="text-lg font-bold text-amber-550 dark:text-amber-400">{firstPassYield.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Effective OEE</p>
            <p className="text-lg font-bold text-emerald-800 dark:text-emerald-300">{effectiveOee.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Defect Rate</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{metrics.defectRate}%</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">Flow Time</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-350">{metrics.flowTime} <span className="text-xs font-normal text-slate-455 dark:text-slate-505">days</span></p>
          </div>
        </div>
      </div>

      {/* OEE Gauge */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-4">
          🎯 OEE Performance Gauge
        </h4>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background track */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                className="text-slate-100 dark:text-slate-800" />
              {/* Colored arc */}
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${(metrics.oee / 100) * 264} 264`}
                strokeLinecap="round"
                className={
                  metrics.oee >= 85 ? 'text-emerald-500' :
                  metrics.oee >= 60 ? 'text-amber-500' :
                  'text-red-500'
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl font-bold tabular-nums ${
                metrics.oee >= 85 ? 'text-emerald-650 dark:text-emerald-400' :
                metrics.oee >= 60 ? 'text-amber-650 dark:text-amber-400' :
                'text-red-650 dark:text-red-400'
              }`}>
                {metrics.oee}%
              </span>
            </div>
          </div>
          <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-450 font-medium">
            <p className="flex items-center"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />85–100%: World Class</p>
            <p className="flex items-center"><span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2" />60–84%: Typical</p>
            <p className="flex items-center"><span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-2" />{'<'}60%: Needs Improvement</p>
          </div>
        </div>
      </div>

      {/* Cost of Quality & Waste */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-4">
          💰 Cost of Quality &amp; Waste
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Units Produced</label>
              <input type="number" min={0} value={totalUnitsProduced} onChange={e => setTotalUnitsProduced(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Defective / Rework Units</label>
              <input type="number" min={0} value={defectiveUnits} onChange={e => setDefectiveUnits(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost per Unit (€)</label>
              <input type="number" min={0} step={0.01} value={costPerUnit} onChange={e => setCostPerUnit(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Scrap / Defective Cost per Unit (€)</label>
              <input type="number" min={0} step={0.01} value={scrapCostPerUnit} onChange={e => setScrapCostPerUnit(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rework Cost per Unit (€)</label>
              <input type="number" min={0} step={0.01} value={reworkCostPerUnit} onChange={e => setReworkCostPerUnit(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
          {/* Results */}
          <div className="space-y-2">
            {(() => {
              const goodUnits = totalUnitsProduced - defectiveUnits;
              const costGood = goodUnits * costPerUnit;
              const costDefective = defectiveUnits * scrapCostPerUnit;
              const costRework = defectiveUnits * reworkCostPerUnit;
              const totalPoorQuality = costDefective + costRework;
              const qualityYield = totalUnitsProduced > 0 ? (goodUnits / totalUnitsProduced) * 100 : 0;
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cost of Good Units</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${costGood.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cost of Defective Units</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">${costDefective.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cost of Rework</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">${costRework.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Cost of Poor Quality</p>
                    <p className="text-lg font-bold text-red-700 dark:text-red-300">${totalPoorQuality.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quality Yield %</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{qualityYield.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* EOQ Calculator */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-4">
          📦 EOQ Calculator
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Annual Demand (units)</label>
              <input type="number" min={0} value={annualDemand} onChange={e => setAnnualDemand(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ordering Cost per Order (€)</label>
              <input type="number" min={0} step={0.01} value={orderingCost} onChange={e => setOrderingCost(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Holding Cost per Unit per Year (€)</label>
              <input type="number" min={0} step={0.01} value={holdingCost} onChange={e => setHoldingCost(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="space-y-2">
            {(() => {
              const eoq = holdingCost > 0 ? Math.sqrt((2 * annualDemand * orderingCost) / holdingCost) : 0;
              const ordersPerYear = eoq > 0 ? annualDemand / eoq : 0;
              const totalInvCost = eoq > 0 ? (annualDemand / eoq) * orderingCost + (eoq / 2) * holdingCost : 0;
              return (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">EOQ</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{eoq.toFixed(1)} units</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Orders per Year</p>
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{ordersPerYear.toFixed(1)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Inventory Cost</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${totalInvCost.toFixed(2)}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
