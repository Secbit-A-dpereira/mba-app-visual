'use client';
import { useState, useCallback } from 'react';
import { useMBA } from '@/context/MBAContext';
import type { ERRCItem } from '@/types/mba';

type Quadrant = 'eliminate' | 'reduce' | 'raise' | 'create';

const QUADRANT_CONFIG: Record<Quadrant, { label: string; icon: string; color: string; description: string }> = {
  eliminate: {
    label: 'Eliminate',
    icon: '✂️',
    color: 'border-red-200 dark:border-red-900/40 bg-red-50/10 dark:bg-red-955/5',
    description: 'Which factors that the industry takes for granted should be eliminated?',
  },
  reduce: {
    label: 'Reduce',
    icon: '⬇️',
    color: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/10 dark:bg-amber-955/5',
    description: 'Which factors should be reduced well below industry standard?',
  },
  raise: {
    label: 'Raise',
    icon: '⬆️',
    color: 'border-blue-200 dark:border-blue-900/40 bg-blue-50/10 dark:bg-blue-955/5',
    description: 'Which factors should be raised well above industry standard?',
  },
  create: {
    label: 'Create',
    icon: '✨',
    color: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-955/5',
    description: 'Which new factors should be created that the industry has never offered?',
  },
};

const QUADRANT_ORDER: Quadrant[] = ['eliminate', 'reduce', 'raise', 'create'];

const STRATEGY_CANVAS_DIMS = {
  traditional: ['High price', 'Quality', 'Prestige', 'Marketing', 'Comfort', 'Service'],
  blueOcean: ['Low price', 'Selective quality', 'Boutique feel', 'Word of mouth', 'Minimalist', 'Self-service'],
};

function generateId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function QuadrantCard({ quadrant, items, onAdd, onRemove, onEdit }: {
  quadrant: Quadrant;
  items: ERRCItem[];
  onAdd: (text: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) {
  const config = QUADRANT_CONFIG[quadrant];
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  };

  const startEdit = (item: ERRCItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed) onEdit(id, trimmed);
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className={`rounded-xl border ${config.color} p-5 flex flex-col min-h-[260px] shadow-sm`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">{config.icon}</span>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{config.label}</h3>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider ml-auto">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium leading-normal mb-4">{config.description}</p>

      {/* Items list */}
      <div className="flex-1 space-y-2 min-h-[100px] mb-4 overflow-y-auto">
        {items.length === 0 && (
          <p className="text-xs text-slate-400 dark:text-slate-550 italic text-center py-6 font-medium">
            Add items to the {config.label.toLowerCase()} quadrant...
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className="group flex items-start gap-2">
            {editingId === item.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(item.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 px-2.5 py-1 text-xs rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button onClick={() => saveEdit(item.id)} className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:text-emerald-700 cursor-pointer">✓</button>
                <button onClick={() => setEditingId(null)} className="text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer">✕</button>
              </div>
            ) : (
              <>
                <span className="text-xs text-slate-400 select-none font-bold mt-[1px]">•</span>
                <span
                  className="flex-1 text-xs text-slate-700 dark:text-slate-300 font-medium cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors leading-relaxed"
                  onClick={() => startEdit(item)}
                  title="Click to edit"
                >
                  {item.text}
                </span>
                <button
                  onClick={() => onRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-slate-400 hover:text-red-500 transition-all px-1 cursor-pointer"
                  title="Remove"
                >
                  ✕
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add input */}
      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={`Add ${config.label.toLowerCase()} item...`}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ─── NEW: Competitive Factors editor ────────────────────────────
function CompetitiveFactorsEditor() {
  const [factors, setFactors] = useState<{ name: string; currentScore: number; targetScore: number }[]>([
    { name: 'Price', currentScore: 3, targetScore: 8 },
    { name: 'Quality', currentScore: 7, targetScore: 5 },
    { name: 'Service', currentScore: 6, targetScore: 7 },
    { name: 'Innovation', currentScore: 4, targetScore: 9 },
  ]);

  const addFactor = () => {
    setFactors(prev => [...prev, { name: '', currentScore: 5, targetScore: 5 }]);
  };

  const updateFactor = (index: number, field: 'name' | 'currentScore' | 'targetScore', value: string | number) => {
    const updated = [...factors];
    (updated[index] as any)[field] = value;
    setFactors(updated);
  };

  const removeFactor = (index: number) => {
    setFactors(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
        📊 Competitive Factors (Value Curve Editor)
      </h3>
      <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
        Define factors and their current score vs desired (blue ocean) score.
      </p>
      <div className="space-y-2">
        {factors.map((factor, idx) => (
          <div key={idx} className="flex items-center gap-2 text-xs">
            <input
              type="text"
              value={factor.name}
              onChange={(e) => updateFactor(idx, 'name', e.target.value)}
              placeholder="Factor name"
              className="w-28 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-slate-400">Current:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={factor.currentScore}
              onChange={(e) => updateFactor(idx, 'currentScore', Number(e.target.value))}
              className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-center font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-slate-400">→</span>
            <input
              type="number"
              min={1}
              max={10}
              value={factor.targetScore}
              onChange={(e) => updateFactor(idx, 'targetScore', Number(e.target.value))}
              className="w-14 px-2 py-1 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-center font-semibold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => removeFactor(idx)}
              className="text-slate-400 hover:text-red-500 px-1 cursor-pointer"
              title="Remove factor"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={addFactor}
          className="w-full py-1.5 text-xs font-bold rounded-lg border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
        >
          + Add Factor
        </button>
      </div>
    </div>
  );
}

// ─── NEW: Value Innovation Score ─────────────────────────────────
function ValueInnovationScore({ errcItems }: { errcItems: ERRCItem[] }) {
  const countCreate = errcItems.filter(i => i.quadrant === 'create').length;
  const countRaise = errcItems.filter(i => i.quadrant === 'raise').length;
  const countReduce = errcItems.filter(i => i.quadrant === 'reduce').length;
  const countEliminate = errcItems.filter(i => i.quadrant === 'eliminate').length;

  // Simple heuristic: value innovation = (create+raise) - (eliminate+reduce)
  const innovationScore = countCreate + countRaise - countEliminate - countReduce;

  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">
        💡 Value Innovation Score
      </h3>
      <div className="flex flex-wrap gap-4 text-xs font-medium">
        <div className="flex items-center gap-1"><span className="text-blue-500 font-bold">{countRaise}</span> Raise</div>
        <div className="flex items-center gap-1"><span className="text-emerald-500 font-bold">{countCreate}</span> Create</div>
        <div className="flex items-center gap-1"><span className="text-amber-500 font-bold">{countReduce}</span> Reduce</div>
        <div className="flex items-center gap-1"><span className="text-red-500 font-bold">{countEliminate}</span> Eliminate</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Net Innovation:</span>
        <span className={`text-lg font-bold tabular-nums ${innovationScore > 0 ? 'text-emerald-600' : innovationScore < 0 ? 'text-red-500' : 'text-slate-400'}`}>
          {innovationScore > 0 ? '+' : ''}{innovationScore}
        </span>
        <span className="text-[10px] text-slate-450 dark:text-slate-500">(higher = more innovative)</span>
      </div>
    </div>
  );
}

export default function Ch15BlueOcean() {
  const { state, updateChapter } = useMBA();
  const errc = state.chapter15.errc;

  const [strategyCanvas, setStrategyCanvas] = useState<{
    show: boolean;
    profileName: string;
    blueOceanScores: Record<string, number>;
  }>({ show: false, profileName: '', blueOceanScores: {} });

  const getQuadrantItems = useCallback((q: Quadrant) => {
    return errc.filter(item => item.quadrant === q);
  }, [errc]);

  const addItem = (quadrant: Quadrant, text: string) => {
    const newItem: ERRCItem = { id: generateId(), text, quadrant };
    updateChapter('chapter15', { errc: [...errc, newItem] });
  };

  const removeItem = (id: string) => {
    updateChapter('chapter15', { errc: errc.filter(item => item.id !== id) });
  };

  const editItem = (id: string, text: string) => {
    updateChapter('chapter15', { errc: errc.map(item => item.id === id ? { ...item, text } : item) });
  };

  const handleGenerateCanvas = () => {
    // Score each dimension based on quadrant items
    const raiseItems = getQuadrantItems('raise');
    const createItems = getQuadrantItems('create');
    const reduceItems = getQuadrantItems('reduce');
    const eliminateItems = getQuadrantItems('eliminate');

    // Heuristic: raise+create increase scores, reduce+eliminate decrease them
    const scores: Record<string, number> = {
      'Price': Math.max(1, 7 - reduceItems.length * 1.5 - eliminateItems.length * 0.5),
      'Quality': Math.min(10, 5 + raiseItems.length * 0.8 + createItems.length * 0.5),
      'Features': Math.min(10, 5 + createItems.length * 1.2 + raiseItems.length * 0.3),
      'Service': Math.min(10, 5 + raiseItems.length * 0.6 + createItems.length * 0.4),
      'Cost Structure': Math.max(1, 6 - reduceItems.length * 1.2 - eliminateItems.length * 0.3),
      'Innovation': Math.min(10, 4 + createItems.length * 1.5 + raiseItems.length * 0.3),
    };

    const name = `Strategy Canvas — ${new Date().toLocaleDateString()}`;
    setStrategyCanvas({ show: true, profileName: name, blueOceanScores: scores });
  };

  const handleExportMarkdown = () => {
    const lines: string[] = [
      `# Blue Ocean Strategy — ERRC Matrix`,
      `**Generated:** ${new Date().toLocaleString()}`,
      ``,
    ];

    for (const q of QUADRANT_ORDER) {
      const cfg = QUADRANT_CONFIG[q];
      const items = getQuadrantItems(q);
      lines.push(`## ${cfg.icon} ${cfg.label}`);
      if (items.length === 0) {
        lines.push('*No items in this quadrant.*');
      } else {
        items.forEach(item => lines.push(`- ${item.text}`));
      }
      lines.push('');
    }

    if (strategyCanvas.show) {
      lines.push(`## 📈 Strategy Canvas Profile`);
      lines.push(`**${strategyCanvas.profileName}**`);
      lines.push('');
      lines.push('| Dimension | Score |');
      lines.push('|-----------|-------|');
      for (const [dim, score] of Object.entries(strategyCanvas.blueOceanScores)) {
        const bar = '█'.repeat(Math.round(score));
        lines.push(`| ${dim} | ${score.toFixed(1)} ${bar} |`);
      }
      lines.push('');
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blue-ocean-errc-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Canvas profile comparison text
  const canvasProfileText = strategyCanvas.show
    ? Object.entries(strategyCanvas.blueOceanScores)
        .map(([dim, score]) => `${dim}: ${'█'.repeat(Math.round(score))}${'░'.repeat(10 - Math.round(score))} ${score.toFixed(1)}/10`)
        .join('\n')
    : '';

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Blue Ocean Strategy — ERRC Matrix</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Build your Blue Ocean strategy using the Eliminate-Reduce-Raise-Create (ERRC) grid.
          Add bullet points to each quadrant, then generate a Strategy Canvas profile.
        </p>
      </div>

      {/* ERRC Grid — 2×2 */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANT_ORDER.map((q) => (
          <QuadrantCard
            key={q}
            quadrant={q}
            items={getQuadrantItems(q)}
            onAdd={(text) => addItem(q, text)}
            onRemove={removeItem}
            onEdit={editItem}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerateCanvas}
          disabled={errc.length === 0}
          className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          📈 Generate Strategy Canvas
        </button>

        <button
          onClick={handleExportMarkdown}
          disabled={errc.length === 0 && !strategyCanvas.show}
          className="px-5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-350 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          📤 Export Markdown
        </button>
      </div>

      {/* ─── NEW TOOLS ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompetitiveFactorsEditor />
        <ValueInnovationScore errcItems={errc} />
      </div>

      {/* Strategy Canvas Profile */}
      {strategyCanvas.show && (
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-6 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550">📈 Strategy Canvas Profile</h3>
            <span className="text-[10px] font-semibold text-slate-450 dark:text-slate-505 font-mono">{strategyCanvas.profileName}</span>
          </div>

          {/* Visual bar chart */}
          <div className="space-y-4">
            {Object.entries(strategyCanvas.blueOceanScores).map(([dim, score]) => {
              const barColor =
                score >= 7 ? 'bg-emerald-500'
                  : score >= 4 ? 'bg-amber-500'
                  : 'bg-red-500';
              return (
                <div key={dim} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{dim}</span>
                    <span className="text-slate-500 dark:text-slate-400 tabular-nums">{score.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparative profile text */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850/60 p-5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-550 mb-3">Comparative Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 mb-1.5">⬤ Traditional Industry</p>
                <ul className="space-y-1 font-medium text-slate-450 dark:text-slate-500">
                  {STRATEGY_CANVAS_DIMS.traditional.map((d, i) => (
                    <li key={i} className="text-xs">• {d}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1.5">⬤ Blue Ocean Strategy</p>
                <ul className="space-y-1 font-medium text-emerald-600/80 dark:text-emerald-400/80">
                  {STRATEGY_CANVAS_DIMS.blueOcean.map((d, i) => (
                    <li key={i} className="text-xs">• {d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Monospace text profile */}
          <div className="rounded-xl bg-slate-950 border border-slate-850 p-4">
            <pre className="text-[10px] text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
              {canvasProfileText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
