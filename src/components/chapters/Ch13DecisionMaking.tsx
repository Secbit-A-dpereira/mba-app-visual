'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcBiasRisk } from '@/lib/math';
import type { BiasChecklist } from '@/types/mba';

const BIAS_ITEMS: { key: keyof import('@/types/mba').BiasChecklist; label: string; description: string }[] = [
  { key: 'sunkCost', label: 'Sunk Cost Fallacy', description: 'Continuing a failing endeavor because of past investment' },
  { key: 'confirmationBias', label: 'Confirmation Bias', description: 'Seeking evidence that supports pre-existing beliefs' },
  { key: 'statusQuo', label: 'Status Quo Bias', description: 'Preferring things to stay the same by inertia' },
  { key: 'anchoring', label: 'Anchoring', description: 'Over-relying on the first piece of information received' },
  { key: 'overconfidence', label: 'Overconfidence', description: 'Overestimating your own abilities or predictions' },
  { key: 'framing', label: 'Framing Effect', description: 'Being swayed by how information is presented' },
  { key: 'availability', label: 'Availability Heuristic', description: 'Judging likelihood by how easily examples come to mind' },
  { key: 'hindsight', label: 'Hindsight Bias', description: 'Seeing past events as having been predictable' },
  { key: 'dunningKruger', label: 'Dunning-Kruger Effect', description: 'Low-ability individuals overestimating their competence' },
  { key: 'groupthink', label: 'Groupthink', description: 'Conforming to group consensus to avoid conflict' },
];

function BiasToggle({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className={`flex items-start gap-3 py-3.5 px-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 transition-all hover:border-slate-350 dark:hover:border-slate-700/80 shadow-sm`}>
      <button
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 flex-shrink-0 w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
          checked ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-800'
        }`}
      >
        <span
          className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform duration-200 mt-[3px] ml-[3px] ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      <div className="flex-1 min-w-0">
        <label className="text-xs font-semibold text-slate-750 dark:text-slate-300 cursor-pointer select-none">
          {label}
        </label>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {checked && (
        <span className="flex-shrink-0 text-red-500 text-xs font-bold mt-0.5">⚠️</span>
      )}
    </div>
  );
}

export default function Ch13DecisionMaking() {
  const { state, updateChapter } = useMBA();
  const bias = state.chapter13.bias;
  const risk = state.chapter13.risk;
  const activeCount = Object.values(bias).filter(Boolean).length;

  const handleToggle = (key: keyof typeof bias) => {
    const updated = { ...bias, [key]: !bias[key] };
    updateChapter('chapter13', { bias: updated, risk: null });
  };

  const handleCalculate = () => {
    const result = calcBiasRisk(bias as unknown as Record<string, boolean>);
    updateChapter('chapter13', { risk: result.rating, bias: { ...bias } });
  };

  const ratingColor = (() => {
    if (!risk) return null;
    switch (risk) {
      case 'Safe': return {
        bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
        text: 'text-emerald-800 dark:text-emerald-400',
        border: 'border-emerald-150 dark:border-emerald-900/40',
        badge: 'bg-emerald-500',
      };
      case 'Moderate': return {
        bg: 'bg-amber-50/50 dark:bg-amber-950/20',
        text: 'text-amber-800 dark:text-amber-400',
        border: 'border-amber-150 dark:border-amber-900/40',
        badge: 'bg-amber-500',
      };
      case 'Critical': return {
        bg: 'bg-red-50/50 dark:bg-red-955/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-150 dark:border-red-900/40',
        badge: 'bg-red-500',
      };
    }
  })();

  // ── NEW: Group Decision Quality Score ──
  const [teamSize, setTeamSize] = useState(5);
  const [diverse, setDiverse] = useState(true);
  const [psychSafety, setPsychSafety] = useState(50);
  const [groupScore, setGroupScore] = useState<number | null>(null);

  const calcGroupScore = () => {
    const diversityBonus = diverse ? 15 : 0;
    const base = 30;
    const safetyContrib = (psychSafety / 100) * 40;
    const sizePenalty = Math.max(0, (teamSize - 6) * 3);
    const score = Math.min(100, Math.round(base + diversityBonus + safetyContrib - sizePenalty));
    setGroupScore(score);
  };

  // ── NEW: Debiasing Strategies Picker ──
  const strategies = [
    { id: 'premortem', label: 'Pre-mortem', description: 'Imagine the decision has failed — identify potential causes beforehand.' },
    { id: 'redteam', label: 'Red Team', description: 'Assign someone to deliberately challenge the plan.' },
    { id: 'devilsadvocate', label: 'Devil\'s Advocate', description: 'Formally argue against the decision to uncover flaws.' },
    { id: 'blindspots', label: 'Blind Spot Check', description: 'Ask "What would I advise someone else to do?"' },
    { id: 'outsideview', label: 'Outside View', description: 'Look at base rates and similar past situations.' },
  ];
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);

  const toggleStrategy = (id: string) => {
    setSelectedStrategies((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🧠 Bias Mitigation Audit
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Identify and check cognitive biases present in your decision process to mitigate risk.
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
            Cognitive Biases — {activeCount} of {BIAS_ITEMS.length} detected
          </span>
          <button
            onClick={() => {
              const reset = Object.fromEntries(BIAS_ITEMS.map(b => [b.key, false])) as unknown as typeof bias;
              updateChapter('chapter13', { bias: reset, risk: null });
            }}
            className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BIAS_ITEMS.map((item) => (
            <BiasToggle
              key={item.key}
              label={item.label}
              description={item.description}
              checked={bias[item.key]}
              onChange={() => handleToggle(item.key)}
            />
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={activeCount === 0}
        className="w-full py-2.5 px-6 rounded-lg font-bold text-xs uppercase tracking-wider transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {activeCount === 0
          ? 'No biases toggled — all clear'
          : `Calculate Risk (${activeCount} bias${activeCount !== 1 ? 'es' : ''} detected)`
        }
      </button>

      {/* Risk Result */}
      {risk && ratingColor && (
        <div className={`rounded-xl px-5 py-4 ${ratingColor.bg} ${ratingColor.border} border ${ratingColor.text} shadow-sm`}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
            <div className={`w-3 h-3 rounded-full ${ratingColor.badge} flex-shrink-0 animate-pulse`} />
            <div className="flex-1">
              <div className="text-sm font-bold">{risk} — Bias Risk Rating</div>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">
                {risk === 'Safe' && 'No cognitive biases detected. Decision process appears sound.'}
                {risk === 'Moderate' && `${activeCount} bias${activeCount !== 1 ? 'es' : ''} identified. Consider mitigation strategies before finalizing.`}
                {risk === 'Critical' && `${activeCount} bias${activeCount !== 1 ? 'es' : ''} flagged — high risk of flawed decision-making. Run a structured debiasing session.`}
              </p>
            </div>
            <div className="text-2xl font-bold tabular-nums opacity-60">{activeCount}</div>
          </div>

          {/* Active biases summary */}
          {risk !== 'Safe' && (
            <div className="mt-4 pt-4 border-t border-slate-200/20 dark:border-slate-800/40">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-70">Active Biases</p>
              <div className="flex flex-wrap gap-2">
                {BIAS_ITEMS.filter(b => bias[b.key]).map((b) => (
                  <span key={b.key} className="inline-flex items-center px-2 py-0.5 rounded bg-white/10 dark:bg-black/10 text-[10px] font-semibold border border-white/10">
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── NEW: Group Decision Quality Score ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          👥 Group Decision Quality Score
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Assess how likely your group is to make a good decision.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Team Size</label>
            <input type="number" min={1} max={20} value={teamSize} onChange={(e) => setTeamSize(Math.max(1, Math.min(20, parseInt(e.target.value) || 5)))} className="w-full px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" id="diverse" checked={diverse} onChange={() => setDiverse(!diverse)} className="cursor-pointer" />
            <label htmlFor="diverse" className="text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">Diverse Perspectives</label>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Psychological Safety {psychSafety}%</label>
          <input type="range" min={0} max={100} value={psychSafety} onChange={(e) => setPsychSafety(parseInt(e.target.value))} className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 accent-emerald-500 cursor-pointer" />
        </div>
        <button onClick={calcGroupScore} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-colors cursor-pointer">
          Calculate Group Score
        </button>
        {groupScore !== null && (
          <div className={`text-sm font-bold ${groupScore >= 70 ? 'text-emerald-600 dark:text-emerald-400' : groupScore >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
            📊 Group Decision Quality: {groupScore}/100
          </div>
        )}
      </div>

      {/* ── NEW: Debiasing Strategies Picker ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          🛠️ Debiasing Strategies
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Select strategies to counteract the biases you identified.</p>
        <div className="space-y-2">
          {strategies.map((s) => (
            <div key={s.id} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800/50">
              <input type="checkbox" id={s.id} checked={selectedStrategies.includes(s.id)} onChange={() => toggleStrategy(s.id)} className="mt-0.5 cursor-pointer" />
              <div>
                <label htmlFor={s.id} className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">{s.label}</label>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
        {selectedStrategies.length > 0 && (
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ✅ {selectedStrategies.length} debiasing strateg{selectedStrategies.length === 1 ? 'y' : 'ies'} selected.
          </div>
        )}
      </div>
    </div>
  );
}
