'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcSevenSAlignment } from '@/lib/math';
import type { SevenSAlignment } from '@/types/mba';

const SEVEN_S_LABELS: { key: keyof SevenSAlignment; label: string; description: string }[] = [
  { key: 'strategy', label: 'Strategy', description: 'Plan to build and sustain competitive advantage' },
  { key: 'structure', label: 'Structure', description: 'Organizational hierarchy and reporting lines' },
  { key: 'systems', label: 'Systems', description: 'Processes, workflows, and IT infrastructure' },
  { key: 'sharedValues', label: 'Shared Values', description: 'Core mission, vision, and cultural principles' },
  { key: 'style', label: 'Style', description: 'Leadership approach and management tone' },
  { key: 'staff', label: 'Staff', description: 'Talent pool, headcount, and capabilities' },
  { key: 'skills', label: 'Skills', description: 'Core competencies and expertise within the org' },
];

const HARD_ELEMENTS: (keyof SevenSAlignment)[] = ['strategy', 'structure', 'systems'];
const SOFT_ELEMENTS: (keyof SevenSAlignment)[] = ['sharedValues', 'style', 'staff', 'skills'];

// ─── 7-sided spiderweb SVG ──────────────────────────────────────
function SevenSSpider({ alignment }: { alignment: SevenSAlignment }) {
  const cx = 160;
  const cy = 160;
  const r = 120;
  const n = 7;
  const angleStep = 360 / n;

  function polar(radius: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
  const values = SEVEN_S_LABELS.map((_, i) => alignment[SEVEN_S_LABELS[i].key]);

  const dataPoints = values.map((v, i) => polar(r * (v / 10), i * angleStep));

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-[280px] sm:max-w-[280px] mx-auto">
      {/* Grid rings */}
      {rings.map((rr) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = polar(r * rr, i * angleStep);
          return `${p.x},${p.y}`;
        }).join(' ');
        return (
          <polygon
            key={rr}
            points={pts}
            fill="none"
            stroke="currentColor"
            strokeWidth={rr === 1.0 ? 1.2 : 0.6}
            strokeDasharray={rr === 1.0 ? 'none' : '3,3'}
            className="text-slate-300 dark:text-slate-800 opacity-60"
          />
        );
      })}

      {/* Axis lines */}
      {SEVEN_S_LABELS.map((_, i) => {
        const to = polar(r, i * angleStep);
        return (
          <line key={i} x1={cx} y1={cy} x2={to.x} y2={to.y} stroke="currentColor" strokeWidth={0.6} className="text-slate-300 dark:text-slate-850" />
        );
      })}

      {/* Data polygon — filled */}
      <polygon
        points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')}
        fill="rgba(16, 185, 129, 0.12)"
        stroke="rgb(16, 185, 129)"
        strokeWidth={2}
      />

      {/* Data points + labels */}
      {values.map((v, i) => {
        const pt = dataPoints[i];
        const isWeak = v < 4;
        const labelPt = polar(r + 20, i * angleStep);
        return (
          <React.Fragment key={i}>
            <circle
              cx={pt.x}
              cy={pt.y}
              r={isWeak ? 6 : 4}
              fill={isWeak ? '#EF4444' : '#10B981'}
              stroke="currentColor"
              strokeWidth={1.5}
              className={`text-white dark:text-slate-900 ${isWeak ? 'animate-pulse' : ''}`}
            />
            <text
              x={labelPt.x}
              y={labelPt.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-base font-bold uppercase tracking-wider ${isWeak ? 'fill-red-500' : 'fill-slate-500 dark:fill-slate-400'}`}
            >
              {SEVEN_S_LABELS[i].label}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}

function SevenSSlider({ label, description, value, onChange, isWeak }: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  isWeak: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-200 shadow-sm ${
      isWeak
        ? 'bg-red-50/20 dark:bg-red-955/10 border-red-300 dark:border-red-900/50'
        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`text-base font-semibold ${isWeak ? 'text-red-700 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
            {label}
          </span>
          {isWeak && (
            <span className="text-base font-bold bg-red-50 text-red-600 dark:bg-red-955/40 dark:text-red-450 border border-red-100 dark:border-red-900/50 px-1.5 py-0.5 rounded">
              WEAK
            </span>
          )}
        </div>
        <span className={`text-base font-bold tabular-nums ${isWeak ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {value}
        </span>
      </div>
      <p className="text-base text-slate-400 dark:text-slate-500 leading-normal mb-2">{description}</p>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 dark:bg-slate-750 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <div className="flex justify-between text-base font-bold text-slate-400 dark:text-slate-550 mt-1 uppercase tracking-wider">
        <span>1 Low</span>
        <span>10 High</span>
      </div>
    </div>
  );
}

// ─── NEW: Priority Action Plan tool ─────────────────────────────
function PriorityActionPlan({ alignment, weakNodes }: { alignment: SevenSAlignment; weakNodes: (keyof SevenSAlignment)[] }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  // Generate action steps per weak node
  const actions = weakNodes.map((key) => {
    const label = SEVEN_S_LABELS.find(l => l.key === key)!.label;
    const score = alignment[key];
    const gap = 10 - score;
    return {
      id: key,
      label,
      currentScore: score,
      gap,
      suggestedAction: `Increase ${label} from ${score} to ${Math.min(10, score + 2)} – focus on ${key === 'strategy' ? 'competitive analysis' : key === 'structure' ? 'organizational design' : key === 'systems' ? 'process automation' : 'cultural reinforcement'} projects.`,
    };
  });

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (actions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-3">
      <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
        🎯 Priority Action Plan (Weak Nodes)
      </h3>
      <div className="space-y-2">
        {actions.map((a) => (
          <div
            key={a.id}
            className={`flex items-start gap-3 p-3 rounded-lg border text-base transition-all ${
              checked[a.id]
                ? 'bg-emerald-50/30 dark:bg-emerald-955/10 border-emerald-200 dark:border-emerald-900/40'
                : 'bg-slate-50 dark:bg-slate-950/30 border-slate-150 dark:border-slate-850'
            }`}
          >
            <input
              type="checkbox"
              checked={checked[a.id] || false}
              onChange={() => toggleCheck(a.id)}
              className="mt-0.5 accent-emerald-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{a.label}</span>
              <span className="ml-2 text-slate-450 dark:text-slate-500">(gap: +{a.gap})</span>
              <p className="text-slate-450 dark:text-slate-500 mt-1 leading-relaxed">{a.suggestedAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NEW: Goal Setting tool ─────────────────────────────────────
function GoalSetting({ alignment }: { alignment: SevenSAlignment }) {
  const [goals, setGoals] = useState<Record<string, number>>({});
  const [showGoalInput, setShowGoalInput] = useState<string | null>(null);

  const setGoal = (key: string, value: number) => {
    setGoals(prev => ({ ...prev, [key]: Math.min(10, Math.max(1, value)) }));
  };

  const currentKey = showGoalInput;

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-3">
      <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
        🎯 Set Improvement Goals
      </h3>
      <p className="text-base text-slate-450 dark:text-slate-500 font-medium">
        For any element, define a target score (1–10). Gap is shown.
      </p>
      <div className="space-y-2">
        {SEVEN_S_LABELS.map(({ key, label }) => {
          const currentScore = alignment[key];
          const goal = goals[key];
          const gap = goal !== undefined ? goal - currentScore : null;
          return (
            <div key={key} className="flex items-center gap-3 text-base">
              <span className="w-20 font-semibold text-slate-700 dark:text-slate-300">{label}</span>
              <span className="tabular-nums text-slate-500 dark:text-slate-400">{currentScore} →</span>
              <input
                type="number"
                min={1}
                max={10}
                value={goal ?? ''}
                onChange={(e) => setGoal(key, Number(e.target.value))}
                placeholder="goal"
                className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-center text-base font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {gap !== null && (
                <span className={`tabular-nums font-bold ${gap > 0 ? 'text-emerald-600' : gap < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {gap > 0 ? `+${gap}` : gap}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Ch14SevenS() {
  const { state, updateChapter } = useMBA();
  const alignment = state.chapter14.alignment;

  const handleChange = (key: keyof SevenSAlignment, value: number) => {
    updateChapter('chapter14', { alignment: { ...alignment, [key]: value } });
  };

  const result = calcSevenSAlignment(alignment as unknown as Record<string, number>);
  const weakNodes = result.weakNodes as (keyof SevenSAlignment)[];

  const hardAvg = (
    (alignment.strategy + alignment.structure + alignment.systems) / 3
  ).toFixed(1);

  const softAvg = (
    (alignment.sharedValues + alignment.style + alignment.staff + alignment.skills) / 4
  ).toFixed(1);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🧭 McKinsey 7S Alignment
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Rate each element 1–10. Scores below 4 represent <span className="text-red-500 dark:text-red-400 font-semibold">weak nodes</span>. The spiderweb diagram updates in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Sliders */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hard elements */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
              🔧 Hard Elements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HARD_ELEMENTS.map((key) => (
                <SevenSSlider
                  key={key}
                  label={SEVEN_S_LABELS.find(l => l.key === key)!.label}
                  description={SEVEN_S_LABELS.find(l => l.key === key)!.description}
                  value={alignment[key]}
                  onChange={(v) => handleChange(key, v)}
                  isWeak={weakNodes.includes(key)}
                />
              ))}
            </div>
          </div>

          {/* Soft elements */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
              🌱 Soft Elements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOFT_ELEMENTS.map((key) => (
                <SevenSSlider
                  key={key}
                  label={SEVEN_S_LABELS.find(l => l.key === key)!.label}
                  description={SEVEN_S_LABELS.find(l => l.key === key)!.description}
                  value={alignment[key]}
                  onChange={(v) => handleChange(key, v)}
                  isWeak={weakNodes.includes(key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Spiderweb + metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm flex items-center justify-center">
            <SevenSSpider alignment={alignment} />
          </div>

          {/* Alignment Score */}
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-4">
            <div>
              <div className="flex justify-between text-base font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 mb-1">
                <span>Overall Alignment</span>
                <span className="text-slate-800 dark:text-slate-250 tabular-nums">{result.averageAlignment.toFixed(1)}/10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    result.averageAlignment >= 7 ? 'bg-emerald-500'
                      : result.averageAlignment >= 4 ? 'bg-amber-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${result.averageAlignment * 10}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-450 tabular-nums">{hardAvg}</div>
                <div className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Hard Elements</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-450 tabular-nums">{softAvg}</div>
                <div className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-0.5">Soft Elements</div>
              </div>
            </div>

            {/* Weak Nodes */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-850">
              <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 mb-2.5">
                ⚠️ Weak Nodes Detected
              </h4>
              {weakNodes.length === 0 ? (
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">No weak nodes — all elements are at or above 4.</p>
              ) : (
                <div className="space-y-2">
                  <p className="text-base text-slate-450 dark:text-slate-500 font-medium">
                    {weakNodes.length} element{weakNodes.length !== 1 ? 's' : ''} below threshold:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weakNodes.map((key) => {
                      const label = SEVEN_S_LABELS.find(l => l.key === key)!.label;
                      return (
                        <div key={key} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50/20 dark:bg-red-955/10 border border-red-200 dark:border-red-900/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-base font-semibold text-red-750 dark:text-red-400">{label}</span>
                          <span className="text-base font-bold text-red-550 dark:text-red-400 ml-1">{alignment[key]}/10</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── NEW TOOLS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityActionPlan alignment={alignment} weakNodes={weakNodes} />
        <GoalSetting alignment={alignment} />
      </div>
    </div>
  );
}
