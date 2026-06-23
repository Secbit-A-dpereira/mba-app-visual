'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { LeadershipProfile } from '@/types/mba';

const LABELS: { key: keyof LeadershipProfile; label: string }[] = [
  { key: 'vision', label: 'Vision' },
  { key: 'decision', label: 'Decision Making' },
  { key: 'communication', label: 'Communication' },
  { key: 'empathy', label: 'Empathy' },
  { key: 'adaptability', label: 'Adaptability' },
  { key: 'integrity', label: 'Integrity' },
];

const TRAIT_COLORS = [
  '#10B981', '#059669', '#34D399', '#F59E0B', '#D97706', '#FBBF24',
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function RadarChart({ profile }: { profile: LeadershipProfile }) {
  const values = LABELS.map((l) => profile[l.key]);
  const cx = 120;
  const cy = 120;
  const radius = 95;

  // Grid rings at 20%, 40%, 60%, 80%, 100%
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
  const n = LABELS.length;
  const angleStep = 360 / n;

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[280px] sm:max-w-[280px] mx-auto">
      {/* Grid rings */}
      {rings.map((r) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const { x, y } = polarToCartesian(cx, cy, radius * r, i * angleStep);
          return `${x},${y}`;
        }).join(' ');
        return (
          <polygon
            key={r}
            points={pts}
            fill="none"
            stroke="currentColor"
            strokeWidth={r === 1.0 ? 1.5 : 0.8}
            strokeDasharray={r === 1.0 ? 'none' : '3,3'}
            className="text-slate-300 dark:text-slate-700 opacity-60"
          />
        );
      })}

      {/* Axis lines */}
      {LABELS.map((_, i) => {
        const to = polarToCartesian(cx, cy, radius, i * angleStep);
        return (
          <line
            key={i}
            x1={cx} y1={cy} x2={to.x} y2={to.y}
            stroke="currentColor"
            strokeWidth={0.6}
            className="text-slate-300 dark:text-slate-700 opacity-45"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={values
          .map((v, i) => {
            const { x, y } = polarToCartesian(cx, cy, radius * (v / 10), i * angleStep);
            return `${x},${y}`;
          })
          .join(' ')}
        fill="rgba(16,185,129,0.12)"
        stroke="#10B981"
        strokeWidth={2}
      />

      {/* Data points */}
      {values.map((v, i) => {
        const { x, y } = polarToCartesian(cx, cy, radius * (v / 10), i * angleStep);
        return (
          <circle key={i} cx={x} cy={y} r={4} fill={TRAIT_COLORS[i]} stroke="currentColor" strokeWidth={1.5} className="text-white dark:text-slate-900" />
        );
      })}

      {/* Labels */}
      {LABELS.map((l, i) => {
        const { x, y } = polarToCartesian(cx, cy, radius + 16, i * angleStep);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate-550 dark:fill-slate-400 text-[8px] font-semibold uppercase tracking-wider"
          >
            {l.label}
          </text>
        );
      })}
    </svg>
  );
}

export default function Ch1Leadership() {
  const { state, updateChapter } = useMBA();
  const profile = state.chapter1.profile;

  const handleChange = (key: keyof LeadershipProfile, value: number) => {
    updateChapter('chapter1', { profile: { ...profile, [key]: value } });
  };

  // Local state for new sections
  const [newScores, setNewScores] = useState({
    humanConnection: 5,
    directCommunication: 5,
    curiosityAction: 5,
    visionClarity: 5,
  });

  const [healthChecks, setHealthChecks] = useState({
    safeToDisagree: false,
    mistakesLearning: false,
    directFeedback: false,
    knowsConnection: false,
  });

  const newLabels: { key: keyof typeof newScores; label: string }[] = [
    { key: 'humanConnection', label: 'Human Connection' },
    { key: 'directCommunication', label: 'Direct Communication' },
    { key: 'curiosityAction', label: 'Curiosity & Action' },
    { key: 'visionClarity', label: 'Vision Clarity' },
  ];

  const healthCheckLabels: { key: keyof typeof healthChecks; label: string }[] = [
    { key: 'safeToDisagree', label: 'Team feels safe to disagree' },
    { key: 'mistakesLearning', label: 'Mistakes are treated as learning opportunities' },
    { key: 'directFeedback', label: 'Direct feedback is encouraged' },
    { key: 'knowsConnection', label: 'Each person knows how their work connects to company goals' },
  ];

  // Combine all scores for strengths/growth
  const allScores: { key: string; label: string; score: number }[] = [
    ...LABELS.map((l) => ({ key: l.key, label: l.label, score: profile[l.key] })),
    ...newLabels.map((l) => ({ key: l.key, label: l.label, score: newScores[l.key] })),
  ];

  const sortedDesc = [...allScores].sort((a, b) => b.score - a.score);
  const topStrengths = sortedDesc.slice(0, 3);
  const sortedAsc = [...allScores].sort((a, b) => a.score - b.score);
  const topGrowth = sortedAsc.slice(0, 3);

  const actionSuggestions: Record<string, string> = {
    vision: 'Schedule a 30-minute session to articulate your vision for the next quarter.',
    decision: 'Practice making decisions faster by setting a 24-hour deadline for non-critical choices.',
    communication: 'Send a weekly update to your team highlighting key wins and blockers.',
    empathy: 'Set aside 15 minutes each day for one-on-one check-ins with team members.',
    adaptability: 'Identify one process you can change this week and implement it.',
    integrity: 'Review your recent decisions and ensure they align with your stated values.',
    humanConnection: 'Start each meeting with a personal check-in question.',
    directCommunication: 'Practice giving constructive feedback within 24 hours of observing an issue.',
    curiosityAction: 'Read one article or listen to a podcast about a topic outside your expertise this week.',
    visionClarity: 'Write a one-page document describing your team’s north star and share it with stakeholders.',
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-w-full md:max-w-4xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Leadership Profile</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Adjust each leadership trait to map your profile. The radar chart updates in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Sliders */}
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-5">
          {LABELS.map(({ key, label }, i) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
              <span className="w-28 text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider truncate">{label}</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={profile[key]}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                className="flex-grow h-2 md:h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-emerald-500"
              />
              <span className="w-10 text-right text-xs font-semibold text-slate-700 dark:text-slate-350 tabular-nums">{profile[key]}/10</span>
            </div>
          ))}
        </div>

        {/* Radar */}
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex items-center justify-center h-[340px]">
          <RadarChart profile={profile} />
        </div>
      </div>

      {/* Leadership Style Assessment */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leadership Style Assessment</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Rate yourself on these “Be Human First” dimensions.</p>
        {newLabels.map(({ key, label }) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <span className="w-28 text-xs font-semibold text-slate-550 dark:text-slate-400 uppercase tracking-wider truncate">{label}</span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={newScores[key]}
              onChange={(e) => setNewScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
              className="flex-grow h-2 md:h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-emerald-500"
            />
            <span className="w-10 text-right text-xs font-semibold text-slate-700 dark:text-slate-350 tabular-nums">{newScores[key]}/10</span>
          </div>
        ))}
      </div>

      {/* Team Health Check */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Health Check</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Select the indicators that describe your current team environment.</p>
        {healthCheckLabels.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={healthChecks[key]}
              onChange={(e) => setHealthChecks((prev) => ({ ...prev, [key]: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
          </label>
        ))}
      </div>

      {/* Leadership Action Plan */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leadership Action Plan</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Based on your scores, here are your top strengths and growth areas.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Top Strengths</h4>
            <ul className="space-y-1">
              {topStrengths.map((item) => (
                <li key={item.key} className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{item.label}</span> ({item.score}/10)
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Growth Areas</h4>
            <ul className="space-y-1">
              {topGrowth.map((item) => (
                <li key={item.key} className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{item.label}</span> ({item.score}/10)
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Concrete Actions</h4>
          <ul className="space-y-2">
            {topGrowth.map((item) => (
              <li key={item.key} className="text-sm text-slate-600 dark:text-slate-400">
                <span className="font-medium">{item.label}:</span> {actionSuggestions[item.key] || 'Identify a specific action to improve this area.'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
