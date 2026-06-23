'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { EthicalDecision } from '@/types/mba';

/* ── Predefined ethical questions ── */
const PREDEFINED_QUESTIONS: Array<{
  id: string;
  question: string;
  critical: boolean;
  warning?: string;
}> = [
  {
    id: 'data_privacy',
    question: 'Does the decision respect user/employee data privacy?',
    critical: true,
    warning: '⚠️ Data privacy violation detected — this could result in legal penalties, reputation damage, and loss of trust.',
  },
  {
    id: 'stakeholder_impact',
    question: 'Have you considered the impact on all key stakeholders (customers, employees, community, environment)?',
    critical: true,
    warning: '⚠️ Failing to consider stakeholder impact can lead to unintended harm, backlash, and long-term value destruction.',
  },
  {
    id: 'legal_compliance',
    question: 'Is the decision fully compliant with applicable laws and regulations?',
    critical: true,
    warning: '⚠️ Legal non-compliance exposes the organization to lawsuits, fines, and regulatory sanctions.',
  },
  {
    id: 'transparency',
    question: 'Is the decision transparent and can it be communicated openly?',
    critical: false,
  },
  {
    id: 'fairness',
    question: 'Does the decision treat all parties fairly and equitably?',
    critical: true,
    warning: '⚠️ Unfair treatment can create discrimination risks, demotivation, and reputational harm.',
  },
  {
    id: 'long_term_sustainability',
    question: 'Does this decision prioritize long-term sustainability over short-term gains?',
    critical: false,
  },
  {
    id: 'conflict_of_interest',
    question: 'Is the decision free from conflicts of interest?',
    critical: true,
    warning: '⚠️ Conflicts of interest undermine trust and objectivity, and may violate fiduciary duties.',
  },
  {
    id: 'social_responsibility',
    question: 'Does the decision align with corporate social responsibility (CSR) commitments?',
    critical: false,
  },
  {
    id: 'honest_representation',
    question: 'Does the decision honestly represent facts without deception or manipulation?',
    critical: true,
    warning: '⚠️ Dishonest representation can lead to fraud accusations, regulatory action, and irreversible brand damage.',
  },
  {
    id: 'whistleblower_protection',
    question: 'Does the organization protect those who raise ethical concerns?',
    critical: true,
    warning: '⚠️ Without whistleblower protection, unethical behavior goes unreported and may escalate into systemic failure.',
  },
];

/* ── Generate initial blank decisions ── */
function initialDecisions(): EthicalDecision[] {
  return PREDEFINED_QUESTIONS.map((q) => ({
    question: q.question,
    answer: null,
    warning: q.warning,
  }));
}

/* ── Main Component ── */
export default function Ch11Ethics() {
  const { state, updateChapter } = useMBA();

  // Initialize decisions from state or from predefined list
  const decisions: EthicalDecision[] =
    state.chapter11.decisions.length > 0
      ? state.chapter11.decisions
      : initialDecisions();

  // If state is empty, populate it once
  const [initialized, setInitialized] = useState(
    state.chapter11.decisions.length > 0
  );

  if (!initialized) {
    updateChapter('chapter11', { decisions: initialDecisions() });
    setInitialized(true);
  }

  const setAnswer = (index: number, answer: boolean) => {
    const updated = decisions.map((d, i) =>
      i === index ? { ...d, answer } : d
    );
    updateChapter('chapter11', { decisions: updated });
  };

  const resetAll = () => {
    updateChapter('chapter11', { decisions: initialDecisions() });
  };

  const activeWarnings = decisions.filter(
    (d) => d.answer === false && d.warning
  );

  // --- NEW: Ethical Score Calculator ---
  const [scoreWeights, setScoreWeights] = useState({
    critical: 3,
    normal: 1,
  });
  const [scoreResult, setScoreResult] = useState<number | null>(null);

  const calcScore = () => {
    let totalMax = 0;
    let totalObtained = 0;
    decisions.forEach((d, i) => {
      const q = PREDEFINED_QUESTIONS[i];
      const weight = q.critical ? scoreWeights.critical : scoreWeights.normal;
      totalMax += weight;
      if (d.answer === true) totalObtained += weight;
    });
    const pct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
    setScoreResult(pct);
  };

  // --- NEW: Scenario Consequence Spinner ---
  const [spinning, setSpinning] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);

  const spinConsequence = () => {
    setSpinning(true);
    const violations = decisions.filter((d) => d.answer === false).length;
    // Simulated outcomes
    const outcomes = [
      { min: 0, max: 0, text: '🌟 Clean slate – minimal ethical risk.' },
      { min: 1, max: 2, text: '⚠️ Low risk – minor adjustments recommended.' },
      { min: 3, max: 4, text: '⚠️ Moderate risk – review key issues soon.' },
      { min: 5, max: 6, text: '🚨 High risk – escalate to senior leadership.' },
      { min: 7, max: 10, text: '🔥 Critical risk – immediate intervention required.' },
    ];
    const match = outcomes.find((o) => violations >= o.min && violations <= o.max);
    const finalText = match ? match.text : 'Unknown scenario.';
    setTimeout(() => {
      setOutcome(finalText);
      setSpinning(false);
    }, 800);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* ── Header ── */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          ⚖️ Ethics Decision Framework
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Evaluate key ethical dimensions of your business decision. Critical items require a &ldquo;Yes&rdquo; to pass.
        </p>
      </div>

      {/* ── Global Warning Banner ── */}
      {activeWarnings.length > 0 && (
        <div className="bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚨</span>
            <h4 className="text-sm font-bold text-red-750 dark:text-red-300">
              {activeWarnings.length} Ethical Risk{activeWarnings.length !== 1 ? 's' : ''} Detected
            </h4>
          </div>
          <ul className="space-y-1.5">
            {activeWarnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400">
                <span className="mt-0.5 flex-shrink-0">•</span>
                <span>{w.warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Progress Bar ── */}
      {decisions.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-emerald-500"
              style={{
                width: `${
                  (decisions.filter((d) => d.answer !== null).length /
                    decisions.length) *
                  100
                }%`,
              }}
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {decisions.filter((d) => d.answer !== null).length} / {decisions.length} answered
          </span>
          <button
            onClick={resetAll}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors underline cursor-pointer"
          >
            Reset all
          </button>
        </div>
      )}

      {/* ── Decision Cards ── */}
      <div className="space-y-3">
        {decisions.map((decision, index) => {
          const qDef = PREDEFINED_QUESTIONS[index] ?? PREDEFINED_QUESTIONS[0];
          const isAnswered = decision.answer !== null;
          const isNo = decision.answer === false;

          return (
            <div
              key={qDef.id}
              className={`
                rounded-xl border p-5 transition-all duration-200 shadow-sm
                ${
                  isNo && qDef.critical
                    ? 'bg-red-50/25 dark:bg-red-955/10 border-red-300 dark:border-red-900/50'
                    : isAnswered
                    ? 'bg-white dark:bg-slate-900/40 border-emerald-350 dark:border-emerald-800/80 shadow-emerald-500/5 dark:shadow-none'
                    : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80'
                }
              `}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Question */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {index + 1}. {decision.question}
                    </span>
                    {qDef.critical && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 text-red-650 dark:bg-red-955/40 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                        Critical
                      </span>
                    )}
                  </div>

                  {/* Inline warning for answered No on critical */}
                  {isNo && qDef.critical && decision.warning && (
                    <p className="text-xs text-red-650 dark:text-red-400 flex items-start gap-1.5 mt-2">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>{decision.warning}</span>
                    </p>
                  )}

                  {/* Checkmark for answered Yes */}
                  {decision.answer === true && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                      <span className="font-bold">✓</span>
                      <span className="ml-1">Ethical check passed</span>
                    </p>
                  )}
                </div>

                {/* Yes / No Buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAnswer(index, true)}
                    className={`
                      px-4 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer
                      ${
                        decision.answer === true
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-355 border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:border-emerald-400'
                      }
                    `}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswer(index, false)}
                    className={`
                      px-4 py-1.5 text-xs font-semibold rounded-lg min-h-[40px] border transition-all cursor-pointer
                      ${
                        decision.answer === false
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-355 border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-955/20 hover:border-red-400'
                      }
                    `}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Summary ── */}
      {decisions.filter((d) => d.answer !== null).length > 0 && (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {decisions.filter((d) => d.answer === true).length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Ethical (Yes)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-655 dark:text-red-400">
                {decisions.filter((d) => d.answer === false).length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Unethical (No)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-500 dark:text-slate-400">
                {decisions.filter((d) => d.answer === null).length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">Pending</div>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW: Ethical Score Calculator ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          📊 Ethical Score Calculator
        </h3>
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500">Weight for critical questions</label>
            <input
              type="number"
              min={1}
              max={10}
              value={scoreWeights.critical}
              onChange={(e) => setScoreWeights({ ...scoreWeights, critical: Math.max(1, Math.min(10, parseInt(e.target.value) || 3)) })}
              className="w-20 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 dark:text-slate-500">Weight for normal questions</label>
            <input
              type="number"
              min={1}
              max={10}
              value={scoreWeights.normal}
              onChange={(e) => setScoreWeights({ ...scoreWeights, normal: Math.max(1, Math.min(10, parseInt(e.target.value) || 1)) })}
              className="w-20 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <button
            onClick={calcScore}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            Calculate Score
          </button>
        </div>
        {scoreResult !== null && (
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <span>Ethical Score: {scoreResult}%</span>
            {scoreResult >= 90 ? '🟢' : scoreResult >= 60 ? '🟡' : '🔴'}
          </div>
        )}
        <p className="text-[10px] text-slate-400 dark:text-slate-500">Higher score means stronger ethical alignment.</p>
      </div>

      {/* ── NEW: Scenario Consequence Spinner ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          🔄 Scenario Consequence Spinner
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Simulate a potential outcome based on your answers.</p>
        <button
          onClick={spinConsequence}
          disabled={spinning}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
        >
          {spinning ? 'Spinning...' : '🎲 Spin the Consequence'}
        </button>
        {outcome && (
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 rounded-lg px-4 py-3">
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">{outcome}</p>
          </div>
        )}
      </div>

      {/* ── Footnote ── */}
      <div className="text-xs text-slate-450 dark:text-slate-500 bg-white dark:bg-slate-900/20 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4">
        <p>
          Based on Chapter 11 ethical decision framework. Critical questions (marked with red badge) require a &ldquo;Yes&rdquo; answer to pass — a &ldquo;No&rdquo; triggers an immediate warning. Use this tool to stress-test business decisions before implementation.
        </p>
      </div>
    </div>
  );
}
