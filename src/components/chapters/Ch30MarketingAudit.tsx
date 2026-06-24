// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';

interface Question {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'first',
    label: 'Are you first in a category?',
    options: [
      { value: 'yes', label: 'Yes, we are the pioneer' },
      { value: 'no', label: 'No, we are not first' },
    ],
  },
  {
    id: 'newCategory',
    label: 'Can you create a new category?',
    options: [
      { value: 'yes', label: 'Yes, we can define a new segment' },
      { value: 'no', label: 'No, we must compete in existing category' },
    ],
  },
  {
    id: 'position',
    label: 'What is your market position?',
    options: [
      { value: 'leader', label: 'Market leader (#1)' },
      { value: 'second', label: 'Strong #2' },
      { value: 'third', label: '#3 or lower' },
    ],
  },
  {
    id: 'uniqueWord',
    label: 'Do you own a unique word/attribute?',
    options: [
      { value: 'yes', label: 'Yes, we own a distinct word' },
      { value: 'no', label: 'No, we don\'t have a unique word' },
    ],
  },
  {
    id: 'mature',
    label: 'Is your market mature?',
    options: [
      { value: 'yes', label: 'Yes, market is mature and consolidated' },
      { value: 'no', label: 'No, market is still growing' },
    ],
  },
  {
    id: 'funding',
    label: 'Do you have adequate funding?',
    options: [
      { value: 'yes', label: 'Yes, we have sufficient capital' },
      { value: 'no', label: 'No, we are underfunded' },
    ],
  },
];

interface StrategyResult {
  title: string;
  description: string;
  laws: number[];
  action: string;
}

const LAW_NAMES: Record<number, string> = {
  1: 'The Law of Leadership',
  2: 'The Law of the Category',
  3: 'The Law of the Mind',
  4: 'The Law of Perception',
  5: 'The Law of Focus',
  6: 'The Law of Exclusivity',
  7: 'The Law of the Ladder',
  8: 'The Law of Duality',
  9: 'The Law of the Opposite',
  10: 'The Law of Division',
  11: 'The Law of Perspective',
  12: 'The Law of Line Extension',
  13: 'The Law of Sacrifice',
  14: 'The Law of Attributes',
  15: 'The Law of Candor',
  16: 'The Law of Singularity',
  17: 'The Law of Unpredictability',
  18: 'The Law of Success',
  19: 'The Law of Failure',
  20: 'The Law of Hype',
  21: 'The Law of Acceleration',
  22: 'The Law of Resources',
};

function computeStrategy(answers: Record<string, string>): StrategyResult {
  const first = answers.first === 'yes';
  const newCat = answers.newCategory === 'yes';
  const pos = answers.position;
  const unique = answers.uniqueWord === 'yes';
  const mature = answers.mature === 'yes';
  const funded = answers.funding === 'yes';

  if (first && newCat) {
    return {
      title: 'Be the Pioneer',
      description: 'You are first in a category you created. Reinforce your leadership by owning the category word.',
      laws: [1, 2, 5],
      action: 'Invest in branding to own the category word. Defend your position against imitators.',
    };
  }
  if (!first && newCat) {
    return {
      title: 'Create a New Category',
      description: 'Since you are not first, define a new sub-category where you can be the pioneer.',
      laws: [2, 3, 10],
      action: 'Identify a narrow segment where you can be first. Launch a dedicated brand name.',
    };
  }
  if (pos === 'leader') {
    return {
      title: 'Defend Your Leadership',
      description: 'As market leader, protect your position by reinforcing your core attribute.',
      laws: [1, 5, 6, 8],
      action: 'Focus on your unique word. Block competitors from owning the same attribute.',
    };
  }
  if (pos === 'second') {
    return {
      title: 'Find the Opposite',
      description: 'As #2, study the leader\'s strength and position yourself as the opposite.',
      laws: [7, 9, 14],
      action: 'Identify the leader\'s weakness (flip side of strength) and claim that attribute.',
    };
  }
  if (pos === 'third' && !mature) {
    return {
      title: 'Niche Down',
      description: 'In a growing market, find a profitable niche where you can dominate.',
      laws: [2, 13, 16],
      action: 'Sacrifice broad appeal. Focus on a narrow segment with high need.',
    };
  }
  if (pos === 'third' && mature) {
    return {
      title: 'Consolidate or Exit',
      description: 'In a mature market with two dominant players, being #3 is unsustainable. Consider a niche or exit.',
      laws: [8, 13, 19],
      action: 'Find a small profitable niche or prepare to sell. Do not fight a losing war.',
    };
  }
  if (!unique) {
    return {
      title: 'Own a Word',
      description: 'You lack a unique attribute. Find an unoccupied word that represents your core benefit.',
      laws: [5, 6, 14],
      action: 'Select a single, relevant word and dedicate all marketing to owning it.',
    };
  }
  if (!funded) {
    return {
      title: 'Secure Resources First',
      description: 'Without adequate funding, even the best idea will fail. Focus on fundraising before launch.',
      laws: [22],
      action: 'Prioritize securing capital to support marketing and capture mindshare.',
    };
  }
  // fallback
  return {
    title: 'General Positioning Strategy',
    description: 'Based on your answers, focus on differentiation and clear messaging.',
    laws: [4, 5, 15],
    action: 'Align your message with customer perceptions. Be honest about limitations.',
  };
}

// ----- New Interactive Tools -----

interface StrengthScore {
  name: string;
  score: number; // 1-5
}

const defaultScores: StrengthScore[] = [
  { name: 'Brand Awareness', score: 3 },
  { name: 'Product Quality', score: 4 },
  { name: 'Customer Loyalty', score: 3 },
  { name: 'Marketing Reach', score: 2 },
  { name: 'Innovation', score: 4 },
];

interface CompetitorEntry {
  attribute: string;
  ourScore: number; // 1-10
  competitorScore: number; // 1-10
}

export default function Ch30MarketingAudit() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Brand Strength Scorecard state
  const [scores, setScores] = useState<StrengthScore[]>([...defaultScores]);

  // Competitive Position Matrix state
  const [matrix, setMatrix] = useState<CompetitorEntry[]>([
    { attribute: 'Price', ourScore: 6, competitorScore: 7 },
    { attribute: 'Feature Set', ourScore: 8, competitorScore: 5 },
    { attribute: 'Service', ourScore: 5, competitorScore: 6 },
    { attribute: 'Brand Image', ourScore: 7, competitorScore: 8 },
  ]);

  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const result = useMemo(() => computeStrategy(answers), [answers]);

  // Determine dot position for positioning map
  const mapX = useMemo(() => {
    const mature = answers.mature;
    if (mature === 'yes') return 80;
    if (mature === 'no') return 20;
    return 50; // default center
  }, [answers.mature]);

  const mapY = useMemo(() => {
    const unique = answers.uniqueWord;
    if (unique === 'yes') return 20;
    if (unique === 'no') return 80;
    return 50;
  }, [answers.uniqueWord]);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  // Brand Strength computation
  const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  const brandStrengthLabel =
    averageScore >= 4.5 ? 'Excellent' :
    averageScore >= 3.5 ? 'Good' :
    averageScore >= 2.5 ? 'Average' :
    averageScore >= 1.5 ? 'Weak' : 'Very Weak';

  // Competitive Position Matrix computation
  const ourTotal = matrix.reduce((sum, e) => sum + e.ourScore, 0);
  const competitorTotal = matrix.reduce((sum, e) => sum + e.competitorScore, 0);
  const advantage = ourTotal - competitorTotal;
  const advantageLabel = advantage > 0 ? 'We Lead' : advantage < 0 ? 'They Lead' : 'Neck and Neck';

  const addMatrixRow = () => {
    setMatrix([...matrix, { attribute: '', ourScore: 5, competitorScore: 5 }]);
  };

  const updateMatrixRow = (index: number, field: keyof CompetitorEntry, value: string | number) => {
    const newMatrix = [...matrix];
    if (field === 'attribute') {
      newMatrix[index].attribute = value as string;
    } else if (field === 'ourScore') {
      newMatrix[index].ourScore = value as number;
    } else if (field === 'competitorScore') {
      newMatrix[index].competitorScore = value as number;
    }
    setMatrix(newMatrix);
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎯</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Positioning Strategy Wizard
        </h2>
      </div>
      <p className="text-base text-slate-500 dark:text-slate-400 mb-6">
        Answer 6 questions to get a personalized positioning strategy recommendation.
      </p>

      {/* Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTIONS.map((q) => (
          <div
            key={q.id}
            className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm"
          >
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {q.label}
            </p>
            <div className="space-y-1">
              {q.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    answers[q.id] === opt.value
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => handleAnswer(q.id, opt.value)}
                    className="accent-emerald-500"
                  />
                  <span className="text-base text-slate-600 dark:text-slate-400">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      {allAnswered && (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recommended Strategy: {result.title}
          </h3>
          <p className="text-base text-slate-600 dark:text-slate-300">
            {result.description}
          </p>
          <div className="text-base text-slate-700 dark:text-slate-300">
            <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">
              Action:
            </strong>
            {result.action}
          </div>
          <div className="text-base text-slate-500 dark:text-slate-400">
            <strong className="block mb-1">Relevant Laws:</strong>
            <div className="flex flex-wrap gap-2">
              {result.laws.map((lawId) => (
                <span
                  key={lawId}
                  className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-base font-medium"
                >
                  {LAW_NAMES[lawId] || `Law ${lawId}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Positioning Map */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm">
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
          Positioning Map
        </h3>
        <div className="relative w-full max-w-xs mx-auto aspect-square">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Axes */}
            <line x1="10" y1="90" x2="90" y2="90" stroke="#94a3b8" strokeWidth="0.5" />
            <line x1="10" y1="10" x2="10" y2="90" stroke="#94a3b8" strokeWidth="0.5" />
            {/* Labels */}
            <text x="50" y="98" textAnchor="middle" fontSize="3" fill="#94a3b8">
              Market Maturity →
            </text>
            <text x="2" y="50" textAnchor="middle" fontSize="3" fill="#94a3b8" transform="rotate(-90,2,50)">
              Product Uniqueness →
            </text>
            {/* Dot */}
            <circle cx={mapX} cy={mapY} r="4" fill="#10b981" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>
        <p className="text-base text-slate-400 dark:text-slate-500 text-center mt-2">
          Your position based on market maturity and product uniqueness.
        </p>
      </div>

      {/* --- New Interactive Tool 1: Brand Strength Scorecard --- */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Brand Strength Scorecard
          </h3>
          <span className="text-base text-slate-400 font-mono">Rate each dimension 1-5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {scores.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <label className="text-base font-medium text-slate-600 dark:text-slate-300 capitalize">
                {item.name}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={item.score}
                  onChange={(e) => {
                    const newScores = [...scores];
                    newScores[idx].score = parseInt(e.target.value);
                    setScores(newScores);
                  }}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-base font-mono w-4 text-right text-slate-500">{item.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">Average Score:</span>
            <span className="text-base font-mono font-bold text-purple-600 dark:text-purple-400">{averageScore.toFixed(1)} / 5</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-base font-semibold text-slate-600 dark:text-slate-300">Brand Strength:</span>
            <span className="text-base font-bold text-purple-600 dark:text-purple-400">{brandStrengthLabel}</span>
          </div>
        </div>
      </div>

      {/* --- New Interactive Tool 2: Competitive Position Matrix --- */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-base font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Competitive Position Matrix
          </h3>
          <span className="text-base text-slate-400 font-mono">Compare yourself vs. a key competitor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 pr-4 font-semibold text-slate-500">Attribute</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-500">Your Score (1-10)</th>
                <th className="text-center py-2 px-2 font-semibold text-slate-500">Competitor Score (1-10)</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-1.5 pr-4">
                    <input
                      type="text"
                      value={row.attribute}
                      onChange={(e) => updateMatrixRow(idx, 'attribute', e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-slate-700 dark:text-slate-300"
                      placeholder="e.g. Price"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={row.ourScore}
                      onChange={(e) => updateMatrixRow(idx, 'ourScore', parseInt(e.target.value) || 5)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </td>
                  <td className="py-1.5 px-2">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={row.competitorScore}
                      onChange={(e) => updateMatrixRow(idx, 'competitorScore', parseInt(e.target.value) || 5)}
                      className="w-full text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={addMatrixRow}
          className="text-base text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          + Add Attribute
        </button>

        <div className={`border rounded-xl p-4 mt-2 flex items-center justify-between ${
          advantage > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-450' :
          advantage < 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-450' :
          'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
        }`}>
          <span className="text-base font-bold uppercase tracking-wider">{advantageLabel}</span>
          <span className="text-base font-mono font-bold">
            {advantage > 0 ? '+' : ''}{advantage} pts
          </span>
        </div>
      </div>
    </div>
  );
}
