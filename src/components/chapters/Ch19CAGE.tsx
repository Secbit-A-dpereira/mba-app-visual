'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcCAGEFriction } from '@/lib/math';
import type { CAGEInput } from '@/types/mba';

const CAGE_DIMENSIONS: {
  key: keyof CAGEInput;
  label: string;
  icon: string;
  color: string;
  facets: string[];
}[] = [
  {
    key: 'cultural',
    label: 'Cultural Distance',
    icon: '🌍',
    color: 'accent-violet-500',
    facets: ['Language differences', 'Trust & social norms', 'Values & beliefs'],
  },
  {
    key: 'administrative',
    label: 'Administrative Distance',
    icon: '🏛️',
    color: 'accent-blue-500',
    facets: ['Trade agreements', 'Political alignment', 'Legal systems'],
  },
  {
    key: 'geographical',
    label: 'Geographical Distance',
    icon: '🗺️',
    color: 'accent-amber-500',
    facets: ['Physical distance', 'Infrastructure quality', 'Time zones'],
  },
  {
    key: 'economic',
    label: 'Economic Distance',
    icon: '💰',
    color: 'accent-emerald-500',
    facets: ['Income levels', 'Labor costs', 'Consumer purchasing power'],
  },
];

function CAGEGauge({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  let color = 'bg-emerald-500';
  let badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50';
  let label = 'Low Friction';
  let desc = 'Favorable conditions for expansion';

  if (value >= 7) {
    color = 'bg-red-500';
    badgeColor = 'bg-red-50 text-red-600 dark:bg-red-955/40 dark:text-red-400 border border-red-100 dark:border-red-900/50';
    label = 'High Friction';
    desc = 'Significant barriers — reconsider entry';
  } else if (value >= 4) {
    color = 'bg-amber-500';
    badgeColor = 'bg-amber-50 text-amber-700 dark:bg-amber-955/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50';
    label = 'Moderate Friction';
    desc = 'Adapt strategy to local conditions';
  }

  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
          Market Friction Index
        </span>
        <span className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
          {value.toFixed(1)}
          <span className="text-base text-slate-400 dark:text-slate-500 font-normal"> / 10</span>
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative w-full h-3 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
        {/* Tick marks */}
        <div className="absolute inset-0 flex items-center justify-between px-1.5">
          {[0, 2.5, 5, 7.5, 10].map((t) => (
            <div
              key={t}
              className="w-[1px] h-2.5 bg-slate-300 dark:bg-slate-700 opacity-50"
            />
          ))}
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mt-1">
        <span>Low Friction</span>
        <span>High Friction</span>
      </div>

      {/* Status badge + recommendation */}
      <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-855">
        <span
          className={`px-2.5 py-0.5 text-base font-bold uppercase tracking-wider rounded-full ${badgeColor}`}
        >
          {label}
        </span>
        <span className="text-base font-semibold text-slate-500 dark:text-slate-405">
          {desc}
        </span>
      </div>
    </div>
  );
}

function DimensionCard({
  dim,
  value,
  onChange,
}: {
  dim: (typeof CAGE_DIMENSIONS)[number];
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base">{dim.icon}</span>
            <h4 className="text-base font-semibold text-slate-850 dark:text-slate-200">
              {dim.label}
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dim.facets.map((f) => (
              <span
                key={f}
                className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 border border-slate-150 dark:border-slate-850 px-2 py-0.5 rounded bg-slate-50/50 dark:bg-slate-950/20"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
        <span className="text-xl font-bold tabular-nums text-slate-800 dark:text-slate-200">
          {value}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 dark:bg-slate-755 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />

      <div className="flex justify-between text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
        <span>Low (1)</span>
        <span>High (10)</span>
      </div>
    </div>
  );
}

export default function Ch19CAGE() {
  const { state, updateChapter } = useMBA();
  const { cage, frictionIndex } = state.chapter19;

  const handleSlider = (key: keyof CAGEInput, value: number) => {
    const updated = { ...cage, [key]: value };
    const index = calcCAGEFriction(updated);
    updateChapter('chapter19', { cage: updated, frictionIndex: index });
  };

  const handleInput = (field: 'homeCountry' | 'targetCountry', value: string) => {
    updateChapter('chapter19', { cage: { ...cage, [field]: value } });
  };

  const currentIndex = frictionIndex ?? calcCAGEFriction(cage);

  // --------- New interactive tools ---------

  // 1) Similarity Radar – a 4‑axis visual using rotated div bars
  // We'll place bars rotated 0°, 45°, 90°, 135° inside a container
  const radarValues = [
    { label: 'Cultural', value: cage.cultural, color: 'bg-violet-500' },
    { label: 'Admin', value: cage.administrative, color: 'bg-blue-500' },
    { label: 'Geographic', value: cage.geographical, color: 'bg-amber-500' },
    { label: 'Economic', value: cage.economic, color: 'bg-emerald-500' },
  ];

  // 2) Country Comparator – two sets of sliders side by side
  const [comparator, setComparator] = useState<{ home: CAGEInput; target: CAGEInput }>({
    home: { homeCountry: '', targetCountry: '', cultural: 5, administrative: 5, geographical: 5, economic: 5 },
    target: { homeCountry: '', targetCountry: '', cultural: 5, administrative: 5, geographical: 5, economic: 5 },
  });
  const homeIndex = calcCAGEFriction(comparator.home);
  const targetIndex = calcCAGEFriction(comparator.target);
  const compareDiff = targetIndex - homeIndex;

  const updateComparator = (side: 'home' | 'target', key: keyof CAGEInput, value: number | string) => {
    setComparator((prev) => ({
      ...prev,
      [side]: { ...prev[side], [key]: value as never },
    }));
  };

  const comparatorDimensions = CAGE_DIMENSIONS.map(d => d.key);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🌐 CAGE Distance Framework
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Assess international market entry barriers across 4 dimensions: Cultural, Administrative, Geographic, and Economic.
        </p>
      </div>

      {/* Country inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Home Country
          </label>
          <input
            type="text"
            placeholder="e.g., United States"
            value={cage.homeCountry}
            onChange={(e) => handleInput('homeCountry', e.target.value)}
            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Target Country
          </label>
          <input
            type="text"
            placeholder="e.g., Brazil"
            value={cage.targetCountry}
            onChange={(e) => handleInput('targetCountry', e.target.value)}
            className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* 4 dimension sliders */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
        {CAGE_DIMENSIONS.map((dim) => (
          <DimensionCard
            key={dim.key}
            dim={dim}
            value={cage[dim.key] as number}
            onChange={(val) => handleSlider(dim.key, val)}
          />
        ))}
      </div>

      {/* Friction gauge */}
      <CAGEGauge value={currentIndex} />

      {/* Interpretation guide */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
          📖 Interpretation Guide
        </h4>
        <ul className="space-y-2 text-base font-medium text-slate-550 dark:text-slate-400">
          <li className="flex items-start gap-1">
            <strong className="text-emerald-600 dark:text-emerald-450 shrink-0">
              Low (1.0–3.9):
            </strong>
            <span>Markets are similar — prioritize expansion with standard strategy.</span>
          </li>
          <li className="flex items-start gap-1">
            <strong className="text-amber-600 dark:text-amber-450 shrink-0">
              Moderate (4.0–6.9):
            </strong>
            <span>Notable differences — adapt your business model and marketing.</span>
          </li>
          <li className="flex items-start gap-1">
            <strong className="text-red-655 dark:text-red-400 shrink-0">
              High (7.0–10.0):
            </strong>
            <span>Significant barriers — reconsider entry or invest heavily in local partnerships.</span>
          </li>
        </ul>
      </div>

      {/* ============= NEW TOOL 1: SIMILARITY RADAR ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          🕸️ Similarity Radar
        </h4>
        <p className="text-base text-slate-450 dark:text-slate-505 font-medium">
          Each axis shows the distance score for that dimension. The closer the bar to the center, the lower the distance (more similar).
        </p>
        <div className="relative w-72 h-72 mx-auto">
          {/* Background cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 absolute top-1/2 left-0 rotate-0" />
            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800 absolute top-1/2 left-0 rotate-45" />
            <div className="w-full h-full border border-slate-200 dark:border-slate-800 rounded-full" />
          </div>
          {/* Bars */}
          {radarValues.map((item, i) => {
            const angle = i * 45; // 0°, 45°, 90°, 135°
            const pct = item.value / 10;
            const length = pct * 50; // 50% of radius max (144px)
            return (
              <div
                key={item.label}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  transform: `rotate(${angle}deg) translateY(-50%)`,
                  width: `${length}%`,
                  left: '50%',
                  top: '50%',
                }}
              >
                <div className={`h-3 rounded-r-full ${item.color}`} style={{ width: '100%' }} />
              </div>
            );
          })}
          {/* Labels around outside */}
          {radarValues.map((item, i) => {
            const angle = i * 45;
            const rad = (angle * Math.PI) / 180;
            const labelRadius = 115; // px from center
            const x = 50 + (labelRadius / 144) * Math.cos(rad) * 50;
            const y = 50 + (labelRadius / 144) * Math.sin(rad) * 50;
            return (
              <span
                key={item.label}
                className="absolute text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap"
                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              >
                {item.label} ({item.value})
              </span>
            );
          })}
        </div>
      </div>

      {/* ============= NEW TOOL 2: COUNTRY COMPARATOR ============= */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h4 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-555">
          ⚖️ Country Comparator
        </h4>
        <p className="text-base text-slate-450 dark:text-slate-505 font-medium">
          Compare two country profiles side by side. The difference in friction index shows how much more (or less) distant the target market is.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home side */}
          <div className="space-y-3">
            <h5 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Profile A (Home)</h5>
            {CAGE_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="space-y-1">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-slate-500">{dim.label}</span>
                  <span className="text-slate-800 dark:text-slate-200">{comparator.home[dim.key]}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={comparator.home[dim.key] as number}
                  onChange={(e) => updateComparator('home', dim.key, Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 text-center">
              <span className="text-base font-bold uppercase tracking-wider text-blue-600">Friction Index</span>
              <p className="text-base font-bold font-mono tabular-nums text-blue-800">{homeIndex.toFixed(1)}</p>
            </div>
          </div>

          {/* Target side */}
          <div className="space-y-3">
            <h5 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Profile B (Target)</h5>
            {CAGE_DIMENSIONS.map((dim) => (
              <div key={dim.key} className="space-y-1">
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-slate-500">{dim.label}</span>
                  <span className="text-slate-800 dark:text-slate-200">{comparator.target[dim.key]}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={comparator.target[dim.key] as number}
                  onChange={(e) => updateComparator('target', dim.key, Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            ))}
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 text-center">
              <span className="text-base font-bold uppercase tracking-wider text-amber-600">Friction Index</span>
              <p className="text-base font-bold font-mono tabular-nums text-amber-800">{targetIndex.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Difference */}
        <div className="bg-slate-50 dark:bg-slate-950/40 rounded-lg p-4 text-center">
          <span className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Distance Difference (B – A)
          </span>
          <p className={`text-2xl font-bold font-mono tabular-nums mt-1 ${
            compareDiff > 0 ? 'text-red-600 dark:text-red-400' : compareDiff < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700'
          }`}>
            {compareDiff > 0 ? '+' : ''}{compareDiff.toFixed(1)}
          </p>
          <p className="text-base text-slate-450 dark:text-slate-505 mt-1">
            {compareDiff > 0 ? 'Target market has higher barriers (more distant)' : compareDiff < 0 ? 'Target market has lower barriers (more similar)' : 'Same friction level'}
          </p>
        </div>
      </div>
    </div>
  );
}
