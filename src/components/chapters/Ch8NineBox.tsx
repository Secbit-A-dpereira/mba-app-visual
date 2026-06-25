'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { TeamMember } from '@/types/mba';

const PERFORMANCE_LABELS: Record<number, string> = {
  1: 'Low',
  2: 'Medium',
  3: 'High',
};

const POTENTIAL_LABELS: Record<number, string> = {
  1: 'Limited',
  2: 'Moderate',
  3: 'High',
};

const BOX_STRATEGIES: Record<string, {
  label: string;
  color: string;
  description: string;
  action: string;
}> = {
  '3,3': {
    label: 'Star',
    color: 'from-emerald-500 to-emerald-600',
    description: 'High Performance × High Potential',
    action: 'Accelerate: promote, give stretch assignments, and invest in leadership development.',
  },
  '3,2': {
    label: 'Performer',
    color: 'from-teal-500 to-teal-600',
    description: 'High Performance × Moderate Potential',
    action: 'Reward & challenge: provide new opportunities and lateral moves to sustain growth.',
  },
  '3,1': {
    label: 'Solid Professional',
    color: 'from-blue-500 to-blue-600',
    description: 'High Performance × Limited Potential',
    action: 'Stabilize: leverage expertise, mentor others, and recognize contributions.',
  },
  '2,3': {
    label: 'High Potential',
    color: 'from-cyan-500 to-cyan-600',
    description: 'Medium Performance × High Potential',
    action: 'Develop: provide coaching, training, and challenging projects to unlock potential.',
  },
  '2,2': {
    label: 'Core Contributor',
    color: 'from-indigo-500 to-indigo-600',
    description: 'Medium Performance × Moderate Potential',
    action: 'Engage: set clear goals, provide feedback, and invest in skill-building.',
  },
  '2,1': {
    label: 'Question Mark',
    color: 'from-amber-500 to-amber-600',
    description: 'Medium Performance × Limited Potential',
    action: 'Diagnose: identify barriers to performance — is it role fit, motivation, or resources?',
  },
  '1,3': {
    label: 'Diamond in the Rough',
    color: 'from-violet-500 to-violet-600',
    description: 'Low Performance × High Potential',
    action: 'Coach: invest time in mentoring — this person may be in the wrong role or needs guidance.',
  },
  '1,2': {
    label: 'Inconsistent',
    color: 'from-orange-500 to-orange-600',
    description: 'Low Performance × Moderate Potential',
    action: 'Evaluate: assess fit and provide structured performance improvement plan.',
  },
  '1,1': {
    label: 'Poor Performer',
    color: 'from-red-500 to-red-600',
    description: 'Low Performance × Limited Potential',
    action: 'Act: consider reassignment, PIP (Performance Improvement Plan), or managed exit.',
  },
};

function generateId(): string {
  return `member_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function Ch8NineBox() {
  const { state, updateChapter } = useMBA();
  const team = state.chapter8.team;

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [hoveredBox, setHoveredBox] = useState<{ p: number; pt: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addMember = () => {
    if (!name.trim() || !role.trim()) return;
    const newMember: TeamMember = {
      id: generateId(),
      name: name.trim(),
      role: role.trim(),
      performance: 2,
      potential: 2,
    };
    updateChapter('chapter8', { team: [...team, newMember] });
    setName('');
    setRole('');
    setShowAddForm(false);
  };

  const removeMember = (id: string) => {
    updateChapter('chapter8', { team: team.filter(m => m.id !== id) });
  };

  const moveMember = (id: string, performance: 1 | 2 | 3, potential: 1 | 2 | 3) => {
    updateChapter('chapter8', {
      team: team.map(m => m.id === id ? { ...m, performance, potential } : m),
    });
  };

  const getMembersInBox = (perf: 1 | 2 | 3, pot: 1 | 2 | 3) => {
    return team.filter(m => m.performance === perf && m.potential === pot);
  };

  const strategy = hoveredBox ? BOX_STRATEGIES[`${hoveredBox.p},${hoveredBox.pt}`] : null;
  const hoveredMembers = hoveredBox ? getMembersInBox(hoveredBox.p as 1|2|3, hoveredBox.pt as 1|2|3) : [];

  // Next position for cycling
  const nextPosition = (current: number): 1 | 2 | 3 => {
    return ((current % 3) + 1) as 1 | 2 | 3;
  };

  // --- NEW: Overhead Variance State ---
  const [budgetedFixedOH, setBudgetedFixedOH] = useState(100000);
  const [actualFixedOH, setActualFixedOH] = useState(95000);
  const [budgetedFOHHours, setBudgetedFOHHours] = useState(20000);
  const [actualMachineHours, setActualMachineHours] = useState(19000);

  const fixedOHRate = budgetedFixedOH / budgetedFOHHours;
  const appliedFixedOH = fixedOHRate * actualMachineHours;
  const fixedSpendingVariance = actualFixedOH - budgetedFixedOH;
  const fixedVolumeVariance = budgetedFixedOH - appliedFixedOH;

  const [budgetedVarRate, setBudgetedVarRate] = useState(5);
  const [actualVarRate, setActualVarRate] = useState(5.5);
  const [actualVarHours, setActualVarHours] = useState(19000);
  const [standardVarHours, setStandardVarHours] = useState(20000);

  const varSpendingVariance = (actualVarRate - budgetedVarRate) * actualVarHours;
  const varEfficiencyVariance = (actualVarHours - standardVarHours) * budgetedVarRate;

  // --- NEW: Overhead Allocation Rate State ---
  const [budgetedTotalOverhead, setBudgetedTotalOverhead] = useState(500000);
  const [budgetedActivity, setBudgetedActivity] = useState(10000);
  const predRate = budgetedTotalOverhead / budgetedActivity;

  // ── NEW: SWOT Analysis ──
  const [swot, setSwot] = useState<{ strengths: string; weaknesses: string; opportunities: string; threats: string }>({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
  });

  // ── NEW: Balanced Scorecard ──
  const [bsc, setBsc] = useState<{ perspective: string; goal: string; performance: number }[]>([]);
  const [bscPerspective, setBscPerspective] = useState('Financial');
  const [bscGoal, setBscGoal] = useState('');
  const [bscPerf, setBscPerf] = useState(5);

  const addBsc = () => {
    if (!bscGoal.trim()) return;
    setBsc([...bsc, { perspective: bscPerspective, goal: bscGoal.trim(), performance: bscPerf }]);
    setBscGoal('');
    setBscPerf(5);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          👥 HR 9-Box Matrix
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Map team members by Performance (rows) vs Potential (columns). Hover a member card to use arrows to cycle their position. Hover any box for strategic guidance.
        </p>
      </div>

      {/* Add member form */}
      {showAddForm ? (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Add Team Member
          </h4>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addMember()}
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addMember()}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addMember}
              disabled={!name.trim() || !role.trim()}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Add Member
            </button>
            <button
              onClick={() => { setShowAddForm(false); setName(''); setRole(''); }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          + Add Team Member
        </button>
      )}

      {/* Team count */}
      {team.length > 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {team.length} team member{team.length !== 1 ? 's' : ''} mapped
        </p>
      )}

      {/* 9-Box Grid */}
      <div className="overflow-x-auto bg-slate-100/50 dark:bg-slate-950/20 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/80">
        <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1.5 min-w-[500px]">
        {/* Empty top-left corner */}
        <div className="flex items-end justify-center pb-2">
          <span className="text-xs text-slate-400 font-medium writing-mode-vertical-lr hidden sm:block">
            Performance →
          </span>
        </div>
        {/* Column headers — Potential */}
        {([3, 2, 1] as const).map((pot) => (
          <div key={`col-${pot}`} className="text-center pb-2">
            <div className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">{POTENTIAL_LABELS[pot]} Potential</div>
            <div className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-0.5">{pot}</div>
          </div>
        ))}

        {/* Rows */}
        {([3, 2, 1] as const).map((perf) => (
          <React.Fragment key={`row-${perf}`}>
            {/* Row header — Performance */}
            <div className="flex items-center pr-3 pl-1">
              <div className="text-right">
                <div className="text-lg font-bold text-slate-700 dark:text-slate-300">{perf}</div>
                <div className="text-[10px] text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">{PERFORMANCE_LABELS[perf]} Perf.</div>
              </div>
            </div>

            {/* Boxes */}
            {([3, 2, 1] as const).map((pot) => {
              const members = getMembersInBox(perf, pot);
              const key = `${perf},${pot}`;
              const boxStrategy = BOX_STRATEGIES[key];
              const isHovered = hoveredBox?.p === perf && hoveredBox?.pt === pot;

              return (
                <div
                  key={key}
                  className={`
                    relative min-h-[120px] rounded-xl border p-2.5 transition-all duration-250 cursor-pointer
                    ${isHovered
                      ? `border-emerald-500 bg-gradient-to-br ${boxStrategy.color} shadow-md scale-[1.01] z-10`
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-750'
                    }
                  `}
                  onMouseEnter={() => setHoveredBox({ p: perf, pt: pot })}
                  onMouseLeave={() => setHoveredBox(null)}
                >
                  {/* Strategy label on hover */}
                  {isHovered && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow uppercase tracking-wider">
                      {boxStrategy.label}
                    </div>
                  )}

                  {/* Member cards */}
                  {members.length === 0 && !isHovered && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {boxStrategy.label}
                      </span>
                    </div>
                  )}

                  <div className="space-y-1.5 overflow-y-auto max-h-[160px]">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className={`
                          group relative px-2.5 py-1.5 rounded-lg text-xs transition-all

                          ${isHovered
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-slate-50 dark:bg-slate-950/60 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/80 shadow-sm'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold truncate">{member.name}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeMember(member.id); }}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ml-1 ${
                              isHovered ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-500'
                            }`}
                            title="Remove member"
                          >
                            ✕
                          </button>
                        </div>
                        <span className={`block truncate mt-0.5 ${
                          isHovered ? 'text-white/70 text-[10px]' : 'text-slate-500 dark:text-slate-500 text-[10px]'
                        }`}>
                          {member.role}
                        </span>
                        {/* Action buttons */}
                        <div className="absolute right-1 bottom-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); moveMember(member.id, perf, nextPosition(pot) as 1|2|3); }}
                            className="bg-slate-200/50 hover:bg-slate-300/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 rounded px-1 text-[10px] cursor-pointer"
                            aria-label="Cycle Potential"
                            title="Cycle Potential"
                          >
                            ↔
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); moveMember(member.id, nextPosition(perf) as 1|2|3, pot); }}
                            className="bg-slate-200/50 hover:bg-slate-300/80 dark:bg-slate-800/50 dark:hover:bg-slate-700/80 rounded px-1 text-[10px] cursor-pointer"
                            aria-label="Cycle Performance"
                            title="Cycle Performance"
                          >
                            ↕
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>

      {/* Strategy details on hover */}
      {strategy && hoveredBox && (
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-emerald-500/30 p-5 space-y-3.5 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${strategy.color} shadow-sm`} />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Box ({hoveredBox.p}, {hoveredBox.pt}) — {strategy.label}
              </h4>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{strategy.description}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3">
            <span className="font-bold text-emerald-600 dark:text-emerald-450">Recommended action: </span>
            {strategy.action}
          </p>
          {hoveredMembers.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Members in this box:</p>
              <div className="flex flex-wrap gap-2">
                {hoveredMembers.map(m => (
                  <span key={m.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350">
                    <span className="font-semibold">{m.name}</span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-slate-500 dark:text-slate-450">{m.role}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
        <p>Click a member card to cycle their Performance level (1→2→3→1). Hover any box to see its talent strategy recommendation.</p>
      </div>

      {/* ── NEW: SWOT Analysis ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            🔍 SWOT Analysis
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Capture your organization&apos;s Strengths, Weaknesses, Opportunities, and Threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['strengths', 'weaknesses', 'opportunities', 'threats'] as const).map((key) => (
            <div key={key}>
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-1">{key}</label>
              <textarea
                value={swot[key]}
                onChange={(e) => setSwot({ ...swot, [key]: e.target.value })}
                rows={3}
                placeholder={`Enter ${key}...`}
                className="w-full px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── NEW: Balanced Scorecard ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            ⚖️ Balanced Scorecard
          </h4>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Define goals and rate current performance (1-10) for each perspective.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <select
            value={bscPerspective}
            onChange={(e) => setBscPerspective(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option>Financial</option>
            <option>Customer</option>
            <option>Internal Process</option>
            <option>Learning & Growth</option>
          </select>
          <input
            type="text"
            placeholder="Goal name"
            value={bscGoal}
            onChange={(e) => setBscGoal(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div>
            <label className="text-[10px] font-medium text-slate-500 block">Performance: {bscPerf}</label>
            <input type="range" min={1} max={10} value={bscPerf} onChange={(e) => setBscPerf(Number(e.target.value))} className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
          </div>
          <button onClick={addBsc} disabled={!bscGoal.trim()} className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
            + Add Goal
          </button>
        </div>

        {bsc.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Perspective</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Goal</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {bsc.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    <td className="py-2 px-3 font-semibold text-slate-700 dark:text-slate-300">{item.perspective}</td>
                    <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{item.goal}</td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full ${
                        item.performance >= 8 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' :
                        item.performance >= 4 ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' :
                        'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                      }`}>{item.performance}/10</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- NEW SECTION: Fixed Overhead Variance --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Fixed Overhead Variance</h2>
        <p className="mb-2">
          Analyze the difference between actual and budgeted fixed overhead, and how efficiently capacity was used.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Budgeted Fixed Overhead (€)</label>
            <input
              type="number"
              value={budgetedFixedOH}
              onChange={(e) => setBudgetedFixedOH(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Fixed Overhead (€)</label>
            <input
              type="number"
              value={actualFixedOH}
              onChange={(e) => setActualFixedOH(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Budgeted Machine Hours</label>
            <input
              type="number"
              value={budgetedFOHHours}
              onChange={(e) => setBudgetedFOHHours(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Machine Hours</label>
            <input
              type="number"
              value={actualMachineHours}
              onChange={(e) => setActualMachineHours(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
        <p className="text-lg font-semibold">Spending Variance: € {fixedSpendingVariance.toFixed(2)}</p>
        <p className="text-lg font-semibold">Volume Variance: € {fixedVolumeVariance.toFixed(2)}</p>
      </div>

      {/* --- NEW SECTION: Variable Overhead Variance --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Variable Overhead Variance</h2>
        <p className="mb-2">
          Evaluate the spending and efficiency components of variable overhead.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Budgeted Variable Rate (€/hour)</label>
            <input
              type="number"
              value={budgetedVarRate}
              onChange={(e) => setBudgetedVarRate(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Variable Rate (€/hour)</label>
            <input
              type="number"
              value={actualVarRate}
              onChange={(e) => setActualVarRate(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Actual Hours Worked</label>
            <input
              type="number"
              value={actualVarHours}
              onChange={(e) => setActualVarHours(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Standard Hours Allowed</label>
            <input
              type="number"
              value={standardVarHours}
              onChange={(e) => setStandardVarHours(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
        <p className="text-lg font-semibold">Spending Variance: € {varSpendingVariance.toFixed(2)}</p>
        <p className="text-lg font-semibold">Efficiency Variance: € {varEfficiencyVariance.toFixed(2)}</p>
      </div>

      {/* --- NEW SECTION: Overhead Allocation Rate --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Overhead Allocation Rate</h2>
        <p className="mb-2">
          Calculate the predetermined overhead rate used to apply overhead to products.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium">Budgeted Total Overhead (€)</label>
            <input
              type="number"
              value={budgetedTotalOverhead}
              onChange={(e) => setBudgetedTotalOverhead(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Budgeted Activity Level (hours)</label>
            <input
              type="number"
              value={budgetedActivity}
              onChange={(e) => setBudgetedActivity(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
        <p className="text-lg font-semibold">Predetermined Overhead Rate: € {predRate.toFixed(2)} / hour</p>
      </div>
    </div>
  );
}
