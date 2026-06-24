'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcBSCStatus } from '@/lib/math';
import type { BSCItem } from '@/types/mba';

type Perspective = 'financial' | 'customer' | 'internal' | 'learning';
type StatusType = 'on_track' | 'at_risk' | 'delayed';

const PERSPECTIVES: { key: Perspective; icon: string; label: string; color: string }[] = [
  { key: 'financial', icon: '💰', label: 'Financial', color: 'from-emerald-500 to-emerald-600' },
  { key: 'customer', icon: '👥', label: 'Customer', color: 'from-blue-500 to-blue-600' },
  { key: 'internal', icon: '⚙️', label: 'Internal Processes', color: 'from-amber-500 to-amber-600' },
  { key: 'learning', icon: '📚', label: 'Learning & Growth', color: 'from-violet-500 to-violet-600' },
];

const PERSPECTIVE_COLORS: Record<Perspective, string> = {
  financial: 'border-emerald-500/30',
  customer: 'border-blue-500/30',
  internal: 'border-amber-500/30',
  learning: 'border-violet-500/30',
};

const STATUS_CONFIG: Record<StatusType, { label: string; color: string; barColor: string }> = {
  on_track: { label: 'On Track', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50', barColor: 'bg-emerald-500' },
  at_risk: { label: 'At Risk', color: 'bg-amber-50 text-amber-700 dark:bg-amber-955/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50', barColor: 'bg-amber-500' },
  delayed: { label: 'Delayed', color: 'bg-red-50 text-red-650 dark:bg-red-955/40 dark:text-red-400 border border-red-100 dark:border-red-900/50', barColor: 'bg-red-500' },
};

function generateId(): string {
  return `bsc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function Ch18BalancedScorecard() {
  const { state, updateChapter } = useMBA();
  const scorecard = state.chapter18.scorecard;
  const statusSummary = calcBSCStatus(scorecard);

  // Form state
  const [activePerspective, setActivePerspective] = useState<Perspective | null>(null);
  const [formData, setFormData] = useState<{
    objective: string;
    kpi: string;
    target: string;
    status: StatusType;
  }>({ objective: '', kpi: '', target: '', status: 'on_track' });

  const getItemsForPerspective = (perspective: Perspective) =>
    scorecard.filter((item) => item.perspective === perspective);

  const handleAdd = () => {
    if (!activePerspective) return;
    const targetVal = parseFloat(formData.target);
    if (!formData.objective.trim() || !formData.kpi.trim() || isNaN(targetVal)) return;

    const newItem: BSCItem = {
      id: generateId(),
      perspective: activePerspective,
      objective: formData.objective.trim(),
      kpi: formData.kpi.trim(),
      target: targetVal,
      status: formData.status,
    };
    updateChapter('chapter18', { scorecard: [...scorecard, newItem] });
    setFormData({ objective: '', kpi: '', target: '', status: 'on_track' });
  };

  const handleRemove = (id: string) => {
    updateChapter('chapter18', {
      scorecard: scorecard.filter((item) => item.id !== id),
    });
  };

  const handleStatusChange = (id: string, status: StatusType) => {
    updateChapter('chapter18', {
      scorecard: scorecard.map((item) =>
        item.id === id ? { ...item, status } : item
      ),
    });
  };

  const allItems = scorecard;

  // --------- New interactive tools ---------

  // Strategy Map Visual – assign weights to perspectives
  const [weights, setWeights] = useState<Record<Perspective, number>>({
    financial: 25,
    customer: 25,
    internal: 25,
    learning: 25,
  });
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const weightedScore = PERSPECTIVES.reduce((acc, p) => {
    const items = getItemsForPerspective(p.key);
    const pctOnTrack = items.length > 0 ? items.filter(i => i.status === 'on_track').length / items.length : 0;
    return acc + pctOnTrack * (weights[p.key] / 100);
  }, 0) * 100;
  const weightedScoreLabel = weightedScore >= 70 ? 'Healthy' : weightedScore >= 40 ? 'Needs Attention' : 'Critical';

  // Goal Timeline – add milestones per objective
  const [milestones, setMilestones] = useState<{ id: string; objective: string; q1: number; q2: number; q3: number; q4: number }[]>([]);
  const [milestoneForm, setMilestoneForm] = useState({ objective: '', q1: 0, q2: 0, q3: 0, q4: 0 });

  const addMilestone = () => {
    if (!milestoneForm.objective.trim()) return;
    setMilestones([...milestones, { id: generateId(), ...milestoneForm }]);
    setMilestoneForm({ objective: '', q1: 0, q2: 0, q3: 0, q4: 0 });
  };
  const removeMilestone = (id: string) => setMilestones(milestones.filter(m => m.id !== id));

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🎯 Balanced Scorecard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Define objectives, KPIs, and targets across 4 strategic perspectives. Track status and monitor overall execution health.
        </p>
      </div>

      {/* 4 Quadrant Summary Bar */}
      {allItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
              Overall Strategic Status
            </h4>
            <span className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505 font-mono">
              {statusSummary.total} item{statusSummary.total !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Stacked bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden flex">
            {statusSummary.onTrack > 0 && (
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${(statusSummary.onTrack / statusSummary.total) * 100}%`,
                }}
                title={`${statusSummary.onTrack} on track`}
              />
            )}
            {statusSummary.atRisk > 0 && (
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{
                  width: `${(statusSummary.atRisk / statusSummary.total) * 100}%`,
                }}
                title={`${statusSummary.atRisk} at risk`}
              />
            )}
            {statusSummary.delayed > 0 && (
              <div
                className="h-full bg-red-500 transition-all duration-300"
                style={{
                  width: `${(statusSummary.delayed / statusSummary.total) * 100}%`,
                }}
                title={`${statusSummary.delayed} delayed`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-base font-semibold text-slate-500 dark:text-slate-450">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>
                On Track: {statusSummary.onTrack}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>
                At Risk: {statusSummary.atRisk}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>
                Delayed: {statusSummary.delayed}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* 4 Quadrants grid */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
        {PERSPECTIVES.map((perspective) => {
          const items = getItemsForPerspective(perspective.key);
          const isActive = activePerspective === perspective.key;

          return (
            <div
              key={perspective.key}
              className={`bg-white dark:bg-slate-900/40 rounded-xl border ${
                isActive ? 'border-emerald-500 shadow-md shadow-emerald-500/5' : 'border-slate-200 dark:border-slate-800/80'
              } overflow-hidden transition-all duration-200 shadow-sm`}
            >
              {/* Card header */}
              <button
                onClick={() =>
                  setActivePerspective(isActive ? null : perspective.key)
                }
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{perspective.icon}</span>
                  <div className="text-left">
                    <h4 className="text-base font-semibold text-slate-850 dark:text-slate-200">
                      {perspective.label}
                    </h4>
                    <p className="text-base text-slate-450 dark:text-slate-500 font-medium">
                      {items.length} objective{items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 dark:text-slate-550 text-base font-bold">
                  {isActive ? '▲' : '▼'}
                </span>
              </button>

              {/* Expanded content */}
              {isActive && (
                <div className="px-5 pb-5 space-y-4 border-t border-slate-100 dark:border-slate-855 pt-4">
                  {/* Form */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-xl border border-slate-150 dark:border-slate-850 p-4 space-y-3">
                    <h5 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Add Objective</h5>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Objective Description</label>
                        <input
                          type="text"
                          placeholder="e.g., Increase repeat customer rate"
                          value={formData.objective}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              objective: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">KPI</label>
                          <input
                            type="text"
                            placeholder="e.g., Retention %"
                            value={formData.kpi}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                kpi: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Value</label>
                          <input
                            type="number"
                            placeholder="e.g., 85"
                            value={formData.target}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                target: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-855 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1.5">
                      {(['on_track', 'at_risk', 'delayed'] as StatusType[]).map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, status: s }))
                            }
                            className={`px-3 py-1 text-base rounded-lg font-bold transition-all border cursor-pointer ${
                              formData.status === s
                                ? STATUS_CONFIG[s].color
                                : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-550 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                          >
                            {STATUS_CONFIG[s].label}
                          </button>
                        )
                      )}
                      <button
                        onClick={handleAdd}
                        disabled={
                          !formData.objective.trim() ||
                          !formData.kpi.trim() ||
                          !formData.target.trim()
                        }
                        className="ml-auto px-4 py-1.5 text-base font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        + Add Objective
                      </button>
                    </div>
                  </div>

                  {/* Existing items */}
                  {items.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-start gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 text-base shadow-sm"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-1.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {item.objective}
                              </span>
                              <span
                                className={`shrink-0 px-2 py-0.5 text-base font-bold rounded-full border uppercase tracking-wider ${
                                  STATUS_CONFIG[item.status].color
                                }`}
                              >
                                {STATUS_CONFIG[item.status].label}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-455 dark:text-slate-450 font-semibold text-base">
                              <span>
                                KPI: <strong className="text-slate-700 dark:text-slate-300 font-bold">{item.kpi}</strong>
                              </span>
                              <span>
                                Target: <strong className="text-slate-700 dark:text-slate-300 font-mono tabular-nums">{item.target}</strong>
                              </span>
                            </div>
                          </div>

                          {/* Status cycling */}
                          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                            {(['on_track', 'at_risk', 'delayed'] as StatusType[]).map(
                              (s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(item.id, s)}
                                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer border ${
                                    item.status === s
                                      ? s === 'on_track'
                                        ? 'bg-emerald-500 border-emerald-400 scale-125 shadow-sm shadow-emerald-500/20'
                                        : s === 'at_risk'
                                          ? 'bg-amber-500 border-amber-400 scale-125 shadow-sm shadow-amber-500/20'
                                          : 'bg-red-500 border-red-450 scale-125 shadow-sm shadow-red-500/20'
                                      : 'bg-slate-300 dark:bg-slate-800 border-transparent hover:bg-slate-400 dark:hover:bg-slate-700'
                                  }`}
                                  title={STATUS_CONFIG[s].label}
                                />
                              )
                            )}
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="ml-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {items.length === 0 && (
                    <p className="text-base text-slate-400 dark:text-slate-550 italic text-center py-4 font-medium">
                      No items yet. Add your first objective above.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary section */}
      {allItems.length > 0 && (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
            📊 Scorecard Summary by Perspective
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-4 gap-3">
            {PERSPECTIVES.map((p) => {
              const items = getItemsForPerspective(p.key);
              if (items.length === 0) return null;
              const onTrack = items.filter((i) => i.status === 'on_track').length;
              const atRisk = items.filter((i) => i.status === 'at_risk').length;
              const delayed = items.filter((i) => i.status === 'delayed').length;
              const pct = items.length > 0 ? (onTrack / items.length) * 100 : 0;

              return (
                <div
                  key={p.key}
                  className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3.5 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.icon}</span>
                    <span className="text-base font-bold text-slate-750 dark:text-slate-300">
                      {p.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 text-base font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-400">
                      {onTrack} on track
                    </span>
                    {atRisk > 0 && (
                      <span className="text-amber-600 dark:text-amber-400">
                        · {atRisk} risk
                      </span>
                    )}
                    {delayed > 0 && (
                      <span className="text-red-655 dark:text-red-400">
                        · {delayed} delay
                      </span>
                    )}
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-505">
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============= NEW TOOL 1: STRATEGY MAP VISUAL ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          🧭 Strategy Map – Weighted Score
        </h4>
        <p className="text-base text-slate-450 dark:text-slate-505 font-medium">
          Adjust weight for each perspective (total must sum to 100%). The weighted score reflects overall execution health based on objectives status.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PERSPECTIVES.map((p) => (
            <div key={p.key} className="space-y-2">
              <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{p.label}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={weights[p.key]}
                onChange={(e) =>
                  setWeights({ ...weights, [p.key]: parseInt(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${p.key === 'financial' ? 'bg-emerald-500' : p.key === 'customer' ? 'bg-blue-500' : p.key === 'internal' ? 'bg-amber-500' : 'bg-violet-500'}`}
                  style={{ width: `${(weights[p.key] / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Total Weight: {totalWeight}%
            {totalWeight !== 100 && (
              <span className="text-red-500 ml-2">(must equal 100%)</span>
            )}
          </span>
          <span className={`text-base font-bold font-mono tabular-nums ${totalWeight === 100 ? 'text-emerald-600' : 'text-slate-400'}`}>
            Score: {totalWeight === 100 ? `${weightedScore.toFixed(1)}%` : '—'}
          </span>
        </div>
        {totalWeight === 100 && (
          <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-3 text-center">
            <span className={`px-2.5 py-0.5 text-base font-bold rounded-full uppercase tracking-wider ${
              weightedScore >= 70 ? 'bg-emerald-50 text-emerald-700' : weightedScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
            }`}>
              {weightedScoreLabel}
            </span>
            <p className="text-base text-slate-500 mt-1">
              Weighted performance based on objectives status per perspective.
            </p>
          </div>
        )}
      </div>

      {/* ============= NEW TOOL 2: GOAL TIMELINE ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          📅 Goal Timeline (Quarterly Progress)
        </h4>
        <p className="text-base text-slate-450 dark:text-slate-505 font-medium">
          Add an objective and set expected completion % for each quarter. Visualise progress throughout the year.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
          <div className="sm:col-span-1 space-y-1">
            <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Objective</label>
            <input
              type="text"
              value={milestoneForm.objective}
              onChange={(e) => setMilestoneForm({ ...milestoneForm, objective: e.target.value })}
              placeholder="e.g., Reduce churn"
              className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          {(['q1', 'q2', 'q3', 'q4'] as const).map((q) => (
            <div key={q} className="space-y-1">
              <label className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{q.toUpperCase()}</label>
              <input
                type="number"
                min={0}
                max={100}
                value={milestoneForm[q]}
                onChange={(e) => setMilestoneForm({ ...milestoneForm, [q]: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 text-base rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
          <button
            onClick={addMilestone}
            disabled={!milestoneForm.objective.trim()}
            className="px-3 py-1.5 text-base font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            + Add
          </button>
        </div>
        {milestones.length > 0 && (
          <div className="space-y-2">
            {milestones.map((m) => (
              <div key={m.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-base">
                <span className="font-semibold text-slate-800 dark:text-slate-200 w-1/3 truncate">{m.objective}</span>
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {(['q1', 'q2', 'q3', 'q4'] as const).map((q) => {
                    const val = m[q];
                    return (
                      <div key={q} className="text-center">
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${val}%` }} />
                        </div>
                        <span className="text-base font-bold text-slate-400 dark:text-slate-500 mt-0.5 block">{q.toUpperCase()} {val}%</span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => removeMilestone(m.id)} className="text-slate-400 hover:text-red-500 cursor-pointer">✕</button>
              </div>
            ))}
          </div>
        )}
        {milestones.length === 0 && (
          <p className="text-base text-slate-400 dark:text-slate-550 italic font-medium text-center py-2">
            No milestones yet. Add one above.
          </p>
        )}
      </div>

      {/* Info footer */}
      {allItems.length === 0 && (
        <div className="text-base text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 font-medium leading-relaxed">
          <p>
            <strong>Getting started:</strong> Click on any of the 4 perspective
            cards above to expand it, then fill in your objective, KPI, target
            value, and status. The summary bar at the top will automatically
            update to show overall execution health.
          </p>
        </div>
      )}
    </div>
  );
}
