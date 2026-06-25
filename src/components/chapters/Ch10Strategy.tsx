'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcVRIOImplication } from '@/lib/math';
import type { PortersFiveForces, VRIOAsset } from '@/types/mba';

const FORCE_LABELS: Record<string, { label: string; description: string }> = {
  rivalry: { label: 'Rivalry', description: 'Intensity of competition among existing firms' },
  threatOfNewEntrants: { label: 'Threat of New Entrants', description: 'How easy it is for new competitors to enter' },
  threatOfSubstitutes: { label: 'Threat of Substitutes', description: 'Availability of alternative products/services' },
  buyerPower: { label: 'Buyer Power', description: 'Bargaining power of customers' },
  supplierPower: { label: 'Supplier Power', description: 'Bargaining power of suppliers' },
};

const FORCE_KEYS = ['rivalry', 'threatOfNewEntrants', 'threatOfSubstitutes', 'buyerPower', 'supplierPower'] as const;

const IMPLICATION_COLORS: Record<string, string> = {
  'Competitive Disadvantage': 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  'Competitive Parity': 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  'Temporary Advantage': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  'Temporary Advantage (unused)': 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  'Sustained Competitive Advantage': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
};

const IMPLICATION_TEXT_COLORS: Record<string, string> = {
  'Competitive Disadvantage': 'text-red-600 dark:text-red-400',
  'Competitive Parity': 'text-yellow-600 dark:text-yellow-400',
  'Temporary Advantage': 'text-blue-600 dark:text-blue-400',
  'Temporary Advantage (unused)': 'text-blue-600 dark:text-blue-400',
  'Sustained Competitive Advantage': 'text-green-600 dark:text-green-400',
};

function generateId(): string {
  return `vrio_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/* Radar Chart SVG (5-sided polygon) */function FiveForcesRadar({ forces }: { forces: PortersFiveForces }) {
  const f = forces as unknown as Record<string, number>;
  const centerX = 150;
  const centerY = 150;
  const radius = 110;

  const angles = FORCE_KEYS.map((_, i) => {
    const angle = (Math.PI * (90 - i * 72)) / 180; // start at top, clockwise
    return angle;
  });

  /* Grid rings (1–10 scale) */
  const rings = [2, 4, 6, 8, 10];
  const ringPaths = rings.map((level) => {
    const p = level / 10;
    const pts = FORCE_KEYS.map((_, i) => {
      const angle = angles[i];
      const x = centerX + radius * p * Math.cos(angle);
      const y = centerY - radius * p * Math.sin(angle);
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    });
    return `M${centerX},${centerY - radius * p}${pts.join('')}Z`;
  });

  /* Data polygon */
  const dataPoints = FORCE_KEYS.map((key, i) => {
    const val = f[key] ?? 5;
    const p = val / 10;
    const angle = angles[i];
    const x = centerX + radius * p * Math.cos(angle);
    const y = centerY - radius * p * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  });
  const dataPath = `${dataPoints.join('')}Z`;

  /* Axis lines and labels */
  const axes = FORCE_KEYS.map((key, i) => {
    const angle = angles[i];
    const x2 = centerX + radius * Math.cos(angle);
    const y2 = centerY - radius * Math.sin(angle);
    const labelX = centerX + (radius + 24) * Math.cos(angle);
    const labelY = centerY - (radius + 24) * Math.sin(angle);
    const label = FORCE_LABELS[key].label;
    let textAnchor: 'middle' | 'start' | 'end' = 'middle';
    if (Math.abs(angle) < 0.1 || Math.abs(angle - Math.PI) < 0.1) textAnchor = 'middle';
    else if (angle > 0 && angle < Math.PI) textAnchor = 'start';
    else textAnchor = 'end';
    return { x2, y2, labelX, labelY, label, textAnchor };
  });

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[270px] mx-auto">
      {/* Grid rings */}
      {ringPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray={i === 4 ? 'none' : '3,3'} className="text-slate-300 dark:text-slate-700 opacity-60" />
      ))}

      {/* Axis lines */}
      {axes.map((a, i) => (
        <line key={i} x1={centerX} y1={centerY} x2={a.x2} y2={a.y2} stroke="currentColor" strokeWidth="0.6" className="text-slate-300 dark:text-slate-700 opacity-45" />
      ))}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(16, 185, 129, 0.12)" stroke="rgb(16, 185, 129)" strokeWidth="2" />

      {/* Data points */}
      {FORCE_KEYS.map((key, i) => {
        const val = f[key] ?? 5;
        const p = val / 10;
        const angle = angles[i];
        const x = centerX + radius * p * Math.cos(angle);
        const y = centerY - radius * p * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="4.5" fill="rgb(16, 185, 129)" stroke="currentColor" strokeWidth={1.5} className="text-white dark:text-slate-900" />;
      })}

      {/* Labels */}
      {axes.map((a, i) => (
        <text key={i} x={a.labelX} y={a.labelY} textAnchor={a.textAnchor} dominantBaseline="middle" className="fill-slate-500 dark:fill-slate-400 text-base font-bold uppercase tracking-wider">
          {a.label}
        </text>
      ))}
    </svg>
  );
}

/* ── Main Component ── */
export default function Ch10Strategy() {
  const { state, updateChapter } = useMBA();
  const forces = state.chapter10.forces;
  const assets = state.chapter10.assets;

  const [assetName, setAssetName] = useState('');
  const [assetValuable, setAssetValuable] = useState(false);
  const [assetRare, setAssetRare] = useState(false);
  const [assetInimitable, setAssetInimitable] = useState(false);
  const [assetOrganized, setAssetOrganized] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);

  const handleForceChange = (key: string, value: number) => {
    updateChapter('chapter10', { forces: { ...forces, [key]: value } });
  };

  const addAsset = () => {
    if (!assetName.trim()) return;
    const newAsset: VRIOAsset = {
      id: generateId(),
      name: assetName.trim(),
      valuable: assetValuable,
      rare: assetRare,
      inimitable: assetInimitable,
      organized: assetOrganized,
    };
    updateChapter('chapter10', { assets: [...assets, newAsset] });
    setAssetName('');
    setAssetValuable(false);
    setAssetRare(false);
    setAssetInimitable(false);
    setAssetOrganized(false);
    setShowAddAsset(false);
  };

  const removeAsset = (id: string) => {
    updateChapter('chapter10', { assets: assets.filter(a => a.id !== id) });
  };

  // ── NEW: BCG Matrix ──
  const [bcgProducts, setBcgProducts] = useState<{ name: string; marketShare: number; marketGrowth: number }[]>([]);
  const [bcgName, setBcgName] = useState('');
  const [bcgShare, setBcgShare] = useState(5);
  const [bcgGrowth, setBcgGrowth] = useState(5);

  const addBcg = () => {
    if (!bcgName.trim()) return;
    setBcgProducts([...bcgProducts, { name: bcgName.trim(), marketShare: bcgShare, marketGrowth: bcgGrowth }]);
    setBcgName('');
    setBcgShare(5);
    setBcgGrowth(5);
  };

  const getBcgQuadrant = (share: number, growth: number) => {
    if (share >= 5 && growth >= 5) return 'Star';
    if (share >= 5 && growth < 5) return 'Cash Cow';
    if (share < 5 && growth >= 5) return 'Question Mark';
    return 'Dog';
  };

  // ── NEW: Porter's Generic Strategies ──
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const genericStrategies = [
    { id: 'cost', label: 'Cost Leadership', desc: 'Achieve the lowest cost of production and distribution to offer lower prices.' },
    { id: 'differentiation', label: 'Differentiation', desc: 'Offer unique and superior value through product features, quality, or service.' },
    { id: 'focus', label: 'Focus', desc: 'Concentrate on a narrow market segment and tailor the strategy to that segment (cost focus or differentiation focus).' },
  ];

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🏢 Chapter 10: Strategy
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Analyze your competitive environment with Porter&apos;s Five Forces and assess your resources with the VRIO Framework.
        </p>
      </div>

      {/* ── Porter's Five Forces ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            ⚔️ Porter&apos;s Five Forces
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Rate each force from 1 (weak) to 10 (strong). Higher values = stronger force = less attractive industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Sliders */}
          <div className="space-y-5">
            {FORCE_KEYS.map((key) => {
              const val = forces[key];
              const meta = FORCE_LABELS[key];
              return (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                  <div className="w-40 shrink-0">
                    <span className="block text-base font-semibold text-slate-700 dark:text-slate-350 truncate">{meta.label}</span>
                    <span className="block text-base text-slate-400 dark:text-slate-500 truncate">{meta.description}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={val}
                    onChange={(e) => handleForceChange(key, parseInt(e.target.value))}
                    className="flex-grow h-2 md:h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-750 accent-emerald-500"
                  />
                  <span className="w-10 text-right text-base font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {val}/10
                  </span>
                </div>
              );
            })}
          </div>

          {/* Radar Chart */}
          <div className="flex items-center justify-center">
            <FiveForcesRadar forces={forces} />
          </div>
        </div>

        {/* Interpretation */}
        <div className="text-base font-medium text-slate-505 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 space-y-1">
          <p className="font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-base">Interpretation:</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li><strong>1–3 (Low):</strong> Weak force — favorable industry condition</li>
            <li><strong>4–7 (Moderate):</strong> Moderate force — requires attention</li>
            <li><strong>8–10 (High):</strong> Strong force — significant competitive pressure</li>
          </ul>
        </div>
      </div>

      {/* ── VRIO Matrix ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-450 dark:text-slate-555 uppercase tracking-wider">
            💎 VRIO Framework
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Add your strategic assets and check which VRIO criteria they meet. The implication column shows your competitive position.
          </p>
        </div>

        {/* Add Asset */}
        {showAddAsset ? (
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-xl p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
            <h5 className="text-base font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider">Add New Asset</h5>
            <input
              type="text"
              placeholder="Asset name (e.g., Patent, Brand, Team Culture)"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addAsset()}
            />
            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'valuable' as const, label: 'Valuable', desc: 'Exploits opportunities / neutralizes threats' },
                { key: 'rare' as const, label: 'Rare', desc: 'Few competitors possess it' },
                { key: 'inimitable' as const, label: 'Costly to Imitate', desc: 'Difficult or expensive to copy' },
                { key: 'organized' as const, label: 'Organized', desc: 'Firm is organized to capture value' },
              ].map(({ key, label, desc }) => {
                const checked =
                  key === 'valuable' ? assetValuable :
                  key === 'rare' ? assetRare :
                  key === 'inimitable' ? assetInimitable :
                  assetOrganized;
                const setter =
                  key === 'valuable' ? setAssetValuable :
                  key === 'rare' ? setAssetRare :
                  key === 'inimitable' ? setAssetInimitable :
                  setAssetOrganized;
                return (
                  <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setter(e.target.checked)}
                      className="mt-0.5 rounded border-slate-350 dark:border-slate-700 text-emerald-600 focus:ring-emerald-555 w-4 h-4 cursor-pointer accent-emerald-500"
                    />
                    <div>
                      <span className="text-base font-semibold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {label}
                      </span>
                      <p className="text-base text-slate-400 dark:text-slate-500 mt-0.5 leading-normal">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={addAsset}
                disabled={!assetName.trim()}
                className="px-4 py-1.5 text-base font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Add Asset
              </button>
              <button
                onClick={() => { setShowAddAsset(false); setAssetName(''); setAssetValuable(false); setAssetRare(false); setAssetInimitable(false); setAssetOrganized(false); }}
                className="px-4 py-1.5 text-base font-semibold rounded-lg border border-slate-200 dark:border-slate-805 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddAsset(true)}
            className="px-4 py-2 text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer"
          >
            + Add Asset
          </button>
        )}

        {/* VRIO Table */}
        {assets.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-1">
            <table className="w-full text-base">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="text-left py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset</th>
                  <th className="text-center py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">V</th>
                  <th className="text-center py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">R</th>
                  <th className="text-center py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">I</th>
                  <th className="text-center py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-16">O</th>
                  <th className="text-left py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Implication</th>
                  <th className="text-center py-3 px-4 text-base font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {assets.map((asset) => {
                  const implication = calcVRIOImplication(asset);
                  const badgeClass = IMPLICATION_COLORS[implication] ?? 'bg-slate-100 text-slate-700';
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors even:bg-slate-50/20 dark:even:bg-slate-905/10">
                      <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{asset.name}</td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-base font-bold ${asset.valuable ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50'}`}>
                          {asset.valuable ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-base font-bold ${asset.rare ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50'}`}>
                          {asset.rare ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-base font-bold ${asset.inimitable ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50'}`}>
                          {asset.inimitable ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-base font-bold ${asset.organized ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50' : 'bg-red-50 text-red-500 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/50'}`}>
                          {asset.organized ? '✓' : '✗'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 text-base font-semibold rounded-full border ${badgeClass}`}>
                          {implication}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          onClick={() => removeAsset(asset.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Remove asset"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-base font-medium text-slate-400 dark:text-slate-505 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            No assets added yet. Click &ldquo;+ Add Asset&rdquo; to start your VRIO analysis.
          </div>
        )}
      </div>

      {/* ── NEW: BCG Matrix ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            📊 BCG Matrix
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Plot your products by Market Share (x-axis) and Market Growth (y-axis). Drag sliders from 1 (low) to 10 (high).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Product name"
              value={bcgName}
              onChange={(e) => setBcgName(e.target.value)}
              className="w-full px-3 py-1.5 text-base rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <div>
              <label className="text-base font-medium text-slate-600 dark:text-slate-400">Market Share (1-10): {bcgShare}</label>
              <input type="range" min={1} max={10} value={bcgShare} onChange={(e) => setBcgShare(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
            </div>
            <div>
              <label className="text-base font-medium text-slate-600 dark:text-slate-400">Market Growth (1-10): {bcgGrowth}</label>
              <input type="range" min={1} max={10} value={bcgGrowth} onChange={(e) => setBcgGrowth(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            </div>
            <button onClick={addBcg} disabled={!bcgName.trim()} className="px-4 py-1.5 text-base font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
              + Add Product
            </button>
          </div>

          {/* BCG Grid Visualization */}
          <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-r border-b border-slate-300 dark:border-slate-700 p-2">
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">⭐ Star</span>
              </div>
              <div className="border-b border-slate-300 dark:border-slate-700 p-2">
                <span className="text-base font-bold text-amber-600 dark:text-amber-400">❓ Question Mark</span>
              </div>
              <div className="border-r border-slate-300 dark:border-slate-700 p-2">
                <span className="text-base font-bold text-blue-600 dark:text-blue-400">💰 Cash Cow</span>
              </div>
              <div className="p-2">
                <span className="text-base font-bold text-red-600 dark:text-red-400">🐶 Dog</span>
              </div>
            </div>
            {/* Product points */}
            {bcgProducts.map((p, i) => {
              const left = ((p.marketShare - 1) / 9) * 100;
              const top = ((10 - p.marketGrowth) / 9) * 100;
              return (
                <div key={i} className="absolute flex items-center gap-1 transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${left}%`, top: `${top}%` }}>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow" />
                  <span className="text-base font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {bcgProducts.length > 0 && (
          <div className="space-y-2">
            {bcgProducts.map((p, i) => {
              const quadrant = getBcgQuadrant(p.marketShare, p.marketGrowth);
              return (
                <div key={i} className="flex items-center gap-2 text-base font-medium text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                  <span className="text-slate-400">→</span>
                  <span className={`px-2 py-0.5 rounded-full text-base font-bold ${
                    quadrant === 'Star' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300' :
                    quadrant === 'Cash Cow' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300' :
                    quadrant === 'Question Mark' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300' :
                    'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300'
                  }`}>{quadrant}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── NEW: Porter's Generic Strategies ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            ⚡ Porter&apos;s Generic Strategies
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Select a generic strategy to see its definition and typical actions.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {genericStrategies.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStrategy(s.id)}
              className={`px-4 py-1.5 text-base font-semibold rounded-full border transition-colors cursor-pointer ${
                selectedStrategy === s.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {selectedStrategy && (
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-4 space-y-2">
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">
              {genericStrategies.find(s => s.id === selectedStrategy)?.label}
            </p>
            <p className="text-base font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
              {genericStrategies.find(s => s.id === selectedStrategy)?.desc}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
