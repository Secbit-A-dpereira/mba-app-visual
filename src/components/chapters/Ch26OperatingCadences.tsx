// @ts-nocheck
'use client';
import React, { useMemo } from 'react';
import { useMBA } from '@/context/MBAContext';

export default function Ch26OperatingCadences() {
  const { state, updateChapter } = useMBA();
  const { cadences } = state.chapter26 || { cadences: [] };

  const handleFieldChange = (index: number, field: string, value: any) => {
    const updated = [...cadences];
    updated[index] = { ...updated[index], [field]: value };
    updateChapter('chapter26', { cadences: updated });
  };

  // SVG Cadence Timeline computations
  const totalDurationMin = useMemo(() => {
    return cadences.reduce((acc, curr) => acc + curr.duration, 0);
  }, [cadences]);

  const averageEffectiveness = useMemo(() => {
    if (!cadences.length) return "0.0";
    const sum = cadences.reduce((acc, curr) => acc + curr.effectiveness, 0);
    return (sum / cadences.length).toFixed(1);
  }, [cadences]);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Operating Cadences & Routines
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Establish disciplined routines to drive mutual accountability and avoid deal slippage. RevOps stewards operational command by reviewing pipeline generation and forecast accuracy metrics consistently.
        </p>
      </div>

      {/* Cadence Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Routines Active</span>
          <span className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 tabular-nums">
            {cadences.length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Core operating rhythms defined</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Meeting Time Burden</span>
          <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-450 tabular-nums">
            {totalDurationMin} <span className="text-xs font-semibold text-slate-450">min / cycle</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Aggregated meeting minutes</span>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Avg. Rhythm Effectiveness</span>
          <span className={`text-2xl font-extrabold tabular-nums ${parseFloat(averageEffectiveness) >= 4 ? 'text-emerald-500' : parseFloat(averageEffectiveness) >= 2.5 ? 'text-amber-500' : 'text-red-500'}`}>
            {averageEffectiveness} <span className="text-xs font-semibold text-slate-450">/ 5</span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">Target score: &gt;4.0 rating</span>
        </div>
      </div>

      {/* SVG Cadence Timeline Calendar */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Rhythm Rhythm Calendar (Timeline Track)
        </h3>

        <div className="w-full flex items-center justify-center p-2">
          <svg width="100%" height="90" viewBox="0 0 400 90" className="w-full max-w-2xl">
            {/* Base timeline line */}
            <line x1="20" y1="45" x2="380" y2="45" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="3" strokeLinecap="round" />

            {/* Nodes representing cadences */}
            {cadences.map((cad, idx) => {
              const x = 50 + idx * 100;
              const y = 45;
              
              // Scale radius by meeting duration (capped 10 - 24)
              const radius = Math.min(24, Math.max(10, 10 + (cad.duration / 180) * 14));
              
              // Color node based on effectiveness
              let nodeColor = 'fill-slate-400 stroke-slate-500';
              if (cad.effectiveness === 5) nodeColor = 'fill-emerald-500 stroke-emerald-600';
              else if (cad.effectiveness === 4) nodeColor = 'fill-emerald-450 stroke-emerald-500';
              else if (cad.effectiveness === 3) nodeColor = 'fill-amber-500 stroke-amber-600';
              else if (cad.effectiveness === 2) nodeColor = 'fill-orange-400 stroke-orange-500';
              else if (cad.effectiveness === 1) nodeColor = 'fill-rose-500 stroke-rose-600';

              return (
                <g key={cad.name} className="group cursor-pointer">
                  {/* Node Circle */}
                  <circle cx={x} cy={y} r={radius} className={`${nodeColor} stroke-2 transition-all duration-300 group-hover:brightness-110`} />
                  {/* Duration Text */}
                  <text x={x} y={y + 3} textAnchor="middle" className="fill-white text-[8px] font-bold pointer-events-none select-none">
                    {cad.duration}m
                  </text>
                  {/* Frequency top label */}
                  <text x={x} y={y - radius - 6} textAnchor="middle" className="fill-slate-450 dark:fill-slate-500 text-[8px] font-bold uppercase tracking-wider">
                    {cad.frequency}
                  </text>
                  {/* Name bottom label */}
                  <text x={x} y={y + radius + 12} textAnchor="middle" className="fill-slate-800 dark:fill-slate-350 text-[9px] font-bold">
                    {cad.name.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Cadence Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cadences.map((cad, idx) => (
          <div key={cad.name} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">{cad.name}</h4>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {cad.frequency}
              </span>
            </div>

            <div className="space-y-3">
              {/* Duration & Effectiveness */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Duration (Min)</label>
                  <input
                    type="number"
                    value={cad.duration || ''}
                    onChange={(e) => handleFieldChange(idx, 'duration', parseInt(e.target.value))}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Effectiveness (1-5)</label>
                  <div className="flex gap-1 items-center h-7">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => handleFieldChange(idx, 'effectiveness', val)}
                        className={`w-5 h-5 rounded text-[9px] font-bold transition-colors ${
                          cad.effectiveness === val
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attendees */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Attendees</label>
                <input
                  type="text"
                  value={cad.attendees}
                  onChange={(e) => handleFieldChange(idx, 'attendees', e.target.value)}
                  placeholder="Attendees..."
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Agenda */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Agenda Focus</label>
                <input
                  type="text"
                  value={cad.agenda}
                  onChange={(e) => handleFieldChange(idx, 'agenda', e.target.value)}
                  placeholder="Agenda items..."
                  className="w-full px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === NEW INTERACTIVE TOOLS === */}

      {/* Tool 1: Meeting Feedback Collector */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          📝 Meeting Feedback Collector
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Collect real-time feedback on the value of each cadence from attendees. Use this to continuously improve your rhythms.
        </p>
        <div className="space-y-3">
          {cadences.length === 0 && (
            <p className="text-xs text-slate-400 italic">No cadences defined yet. Add cadences above to enable feedback collection.</p>
          )}
          {cadences.map((cad, idx) => (
            <div key={cad.name} className="border border-slate-100 dark:border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{cad.name}</h4>
                <span className="text-[10px] text-slate-400">{cad.frequency}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[11px] text-slate-500">Feedback (1-5):</span>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      onClick={() => {
                        // Update effectiveness directly via existing handler
                        handleFieldChange(idx, 'effectiveness', star);
                      }}
                      className={`w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                        cad.effectiveness >= star
                          ? 'bg-amber-400 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <textarea
                  placeholder="What worked well? What could be improved?"
                  rows={2}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-700 dark:text-slate-300 placeholder-slate-400"
                  defaultValue=""
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tool 2: Cadence Health Score */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          🩺 Cadence Health Score
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Composite health score based on effectiveness, meeting load, and attendee coverage. Scores above 70% indicate a healthy rhythm.
        </p>
        {cadences.length > 0 && (() => {
          const healthScores = cadences.map(cad => {
            const effScore = cad.effectiveness / 5 * 40; // max 40 points
            const durScore = Math.max(0, 1 - (cad.duration / 120)) * 30; // 30 points if short
            const attendeeScore = cad.attendees ? 30 : 0; // 30 points if attendees defined
            return {
              name: cad.name,
              score: Math.min(100, Math.round(effScore + durScore + attendeeScore)),
              effScore,
              durScore,
              attendeeScore
            };
          });
          const avgHealth = Math.round(healthScores.reduce((acc, s) => acc + s.score, 0) / healthScores.length);

          return (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-extrabold tabular-nums" style={{ color: avgHealth >= 70 ? '#10b981' : avgHealth >= 50 ? '#f59e0b' : '#ef4444' }}>
                  {avgHealth}%
                </span>
                <span className="text-xs text-slate-500">Average Health Score</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthScores.map(hs => (
                  <div key={hs.name} className="border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{hs.name}</span>
                      <span className={`font-bold ${hs.score >= 70 ? 'text-emerald-500' : hs.score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {hs.score}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${hs.score}%`,
                          backgroundColor: hs.score >= 70 ? '#10b981' : hs.score >= 50 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>Effectiveness: {Math.round(hs.effScore)}/40</span>
                      <span>Duration: {Math.round(hs.durScore)}/30</span>
                      <span>Attendees: {Math.round(hs.attendeeScore)}/30</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
        {cadences.length === 0 && (
          <p className="text-xs text-slate-400 italic">Add cadences to calculate health scores.</p>
        )}
      </div>
    </div>
  );
}
