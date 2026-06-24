'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';

export default function Ch6Marketing() {
  const { state, updateChapter } = useMBA();
  const { ladder, positioning } = state.chapter6;

  // ─── Brand Ladder ────────────────────────────────────────────

  function handleLadderChange(field: string, value: string) {
    updateChapter('chapter6', {
      ladder: { ...ladder, [field]: value },
    });
  }

  function handlePositioningChange(field: string, value: string) {
    updateChapter('chapter6', {
      positioning: { ...positioning, [field]: value },
    });
  }

  const positioningPhrase =
    positioning.target &&
    positioning.brand &&
    positioning.category &&
    positioning.differentiator
      ? `For ${positioning.target}, ${positioning.brand} is the ${positioning.category} that ${positioning.differentiator}.`
      : null;

  const ladderLevels = [
    { key: 'attributes', label: 'Attributes', desc: 'Product features & characteristics', color: 'border-l-emerald-500' },
    { key: 'functionalBenefit', label: 'Functional Benefit', desc: 'What it does for the customer', color: 'border-l-emerald-600' },
    { key: 'emotionalBenefit', label: 'Emotional Benefit', desc: 'How it makes the customer feel', color: 'border-l-amber-500' },
    { key: 'brandEssence', label: 'Brand Essence', desc: 'The core DNA of the brand', color: 'border-l-amber-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {/* ── Section: Brand Ladder Builder ─────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Brand Ladder Builder</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Build your brand hierarchy from tangible attributes to core essence.
          </p>
        </div>

        <div className="space-y-3">
          {ladderLevels.map((level, idx) => (
            <div
              key={level.key}
              className={`bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 border-l-4 ${level.color} p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-base font-bold text-slate-600 dark:text-slate-400 mr-2">
                    {idx + 1}
                  </span>
                  <span className="text-base font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {level.label}
                  </span>
                </div>
              </div>
              <p className="text-base text-slate-450 dark:text-slate-400 mb-2 ml-7">
                {level.desc}
              </p>
              <div className="ml-7">
                <input
                  type="text"
                  value={(ladder as any)[level.key] || ''}
                  onChange={e => handleLadderChange(level.key, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder={`e.g. ${idx === 0 ? 'Stainless steel, ergonomic grip' : idx === 1 ? 'Easy to clean, durable' : idx === 2 ? 'Confidence, peace of mind' : 'Reliability redefined'}`}
                />
              </div>
              {/* Visual connector arrow between levels */}
              {idx < ladderLevels.length - 1 && (
                <div className="flex justify-center pt-3 text-slate-350 dark:text-slate-700">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <hr className="border-slate-200 dark:border-slate-850" />

      {/* ── Section: Positioning Statement ─────────────────────── */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Positioning Statement</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Define your market position with the classic framework.
          </p>
        </div>

        <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
            <label className="block text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
              Target Audience
            </label>
            <input
              type="text"
              value={positioning.target}
              onChange={e => handlePositioningChange('target', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="health-conscious professionals"
            />
          </div>

          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
            <label className="block text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
              Brand Name
            </label>
            <input
              type="text"
              value={positioning.brand}
              onChange={e => handlePositioningChange('brand', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="VitalEats"
            />
          </div>

          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
            <label className="block text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
              Category
            </label>
            <input
              type="text"
              value={positioning.category}
              onChange={e => handlePositioningChange('category', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="meal delivery service"
            />
          </div>

          <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
            <label className="block text-base font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-2">
              Differentiator
            </label>
            <input
              type="text"
              value={positioning.differentiator}
              onChange={e => handlePositioningChange('differentiator', e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 text-base placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="uses AI to personalize every meal"
            />
          </div>
        </div>

        {/* Generated Positioning Statement */}
        {positioningPhrase && (
          <div className="mt-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-150 dark:border-emerald-900/80 p-5 shadow-sm">
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider mb-2">
              Generated Positioning Statement
            </p>
            <p className="text-base font-semibold text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {positioningPhrase}
            </p>
          </div>
        )}
      </div>

      {/* ── Divider ──────────────────────────────────────────── */}
      <hr className="border-slate-200 dark:border-slate-850" />

      {/* ── Section: Positioning Strategy Check ───────────────── */}
      <PositioningStrategyCheck />
    </div>
  );
}

/* ── Positioning Strategy Check Component ─────────────────── */
const POSITIONING_QUESTIONS = [
  { id: 'first', label: 'Are you first in your category?', options: [
    { value: 'yes', label: 'Yes, we are the pioneer' },
    { value: 'no', label: 'No, we are not first' },
  ]},
  { id: 'word', label: 'Do you own a unique word or attribute?', options: [
    { value: 'yes', label: 'Yes, we own a distinct word' },
    { value: 'no', label: 'No, we don\'t have one' },
  ]},
  { id: 'ladder', label: 'What rung are you on the market ladder?', options: [
    { value: 'leader', label: '#1 Market Leader' },
    { value: 'second', label: '#2 Strong Challenger' },
    { value: 'third', label: '#3 or Lower' },
  ]},
  { id: 'mature', label: 'Is your market mature or growing?', options: [
    { value: 'mature', label: 'Mature & consolidated' },
    { value: 'growing', label: 'Still growing / emerging' },
  ]},
];

function PositioningStrategyCheck() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const result = React.useMemo(() => {
    const { first, word, ladder, mature } = answers;
    if (!first || !word || !ladder || !mature) return null;

    if (first === 'yes') return {
      title: 'Be the Pioneer',
      description: 'You are first in your category. Reinforce your leadership by owning the category word.',
      action: 'Invest in branding to own the category word. Defend your position against imitators.'
    };
    if (first === 'no' && ladder === 'second') return {
      title: 'Find the Opposite',
      description: 'As #2, study the leader\u2019s strength and position yourself as the opposite.',
      action: 'Identify the leader\u2019s weakness (flip side of strength) and claim that attribute.'
    };
    if (first === 'no' && ladder === 'third' && mature === 'growing') return {
      title: 'Niche Down',
      description: 'In a growing market, find a profitable niche where you can dominate.',
      action: 'Sacrifice broad appeal. Focus on a narrow segment with high need.'
    };
    if (first === 'no' && ladder === 'third' && mature === 'mature') return {
      title: 'Consolidate or Exit',
      description: 'In a mature market with two dominant players, being #3 is unsustainable.',
      action: 'Find a small profitable niche or prepare to sell.'
    };
    if (word === 'no') return {
      title: 'Own a Word',
      description: 'You lack a unique attribute. Find an unoccupied word that represents your core benefit.',
      action: 'Select a single, relevant word and dedicate all marketing to owning it.'
    };
    return {
      title: 'General Positioning Strategy',
      description: 'Focus on differentiation and clear messaging.',
      action: 'Align your message with customer perceptions. Be honest about limitations.'
    };
  }, [answers]);

  const allAnswered = POSITIONING_QUESTIONS.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Positioning Strategy Check</h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Answer 4 quick questions to check your positioning strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POSITIONING_QUESTIONS.map(q => (
          <div key={q.id} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-2">{q.label}</p>
            <div className="space-y-1">
              {q.options.map(opt => (
                <label key={opt.value} className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                  answers[q.id] === opt.value
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-400'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border border-transparent'
                }`}>
                  <input type="radio" name={q.id} value={opt.value}
                    checked={answers[q.id] === opt.value}
                    onChange={() => handleAnswer(q.id, opt.value)}
                    className="accent-emerald-500" />
                  <span className="text-base text-slate-600 dark:text-slate-400">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {result && (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recommended Strategy: {result.title}</h3>
          <p className="text-base text-slate-600 dark:text-slate-300">{result.description}</p>
          <div className="text-base text-slate-700 dark:text-slate-300">
            <strong className="text-emerald-600 dark:text-emerald-400 block mb-1">Action:</strong>
            {result.action}
          </div>
        </div>
      )}

      {!allAnswered && (
        <p className="text-base text-slate-400 text-center">Answer all 4 questions to see your strategy recommendation.</p>
      )}
    </div>
  );
}
