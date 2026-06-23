'use client';
import { useState } from 'react';
import { useMBA } from '@/context/MBAContext';
import { calcFinancialRatios, pct, currency } from '@/lib/math';
import type { FinancialStatement, FinancialRatios } from '@/types/mba';

const FIELDS: { key: keyof FinancialStatement; label: string; placeholder: string }[] = [
  { key: 'revenue', label: 'Revenue', placeholder: '1,000,000' },
  { key: 'cogs', label: 'COGS', placeholder: '400,000' },
  { key: 'operatingExpenses', label: 'Operating Expenses', placeholder: '300,000' },
  { key: 'depreciation', label: 'Depreciation', placeholder: '50,000' },
  { key: 'interest', label: 'Interest', placeholder: '20,000' },
  { key: 'taxes', label: 'Taxes', placeholder: '50,000' },
  { key: 'sharesOutstanding', label: 'Shares Outstanding', placeholder: '100,000' },
];

const ROWS: { label: string; key: keyof FinancialRatios; fmt: (v: number) => string }[] = [
  { label: 'Gross Margin', key: 'grossMargin', fmt: pct },
  { label: 'Operating Margin', key: 'operatingMargin', fmt: pct },
  { label: 'Net Margin', key: 'netMargin', fmt: pct },
  { label: 'Current Ratio', key: 'currentRatio', fmt: (v) => v.toFixed(2) },
  { label: 'Debt / Equity', key: 'debtToEquity', fmt: (v) => v.toFixed(2) },
  { label: 'EPS', key: 'eps', fmt: currency },
  { label: 'ROE', key: 'roe', fmt: pct },
];

export default function Ch2FinancialReporting() {
  const { state, updateChapter } = useMBA();
  const [local, setLocal] = useState<FinancialStatement>(() => ({ ...state.chapter2.statement }));
  const [showResult, setShowResult] = useState(false);
  const [invInputs, setInvInputs] = useState({ beginningUnits:0, beginningCostPerUnit:0, purchasesUnits:0, purchasesCostPerUnit:0, unitsSold:0 });
  const [invResult, setInvResult] = useState<{fifoCOGS:number; lifoCOGS:number; waCOGS:number; fifoEnding:number; lifoEnding:number; waEnding:number} | null>(null);
  const [absInputs, setAbsInputs] = useState({ unitsProduced:0, unitsSold:0, fixedMOH:0, variableCostPerUnit:0, pricePerUnit:0 });
  const [absResult, setAbsResult] = useState<{sales:number; absorptionCOGS:number; variableCOGS:number; grossProfitAbs:number; contributionMarginVar:number; netIncomeAbs:number; netIncomeVar:number; diff:number} | null>(null);

  const handleChange = (key: keyof FinancialStatement, raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, '');
    const val = cleaned === '' ? 0 : parseFloat(cleaned);
    setLocal((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
    setShowResult(false);
  };

  const handleCalculate = () => {
    const ratios = calcFinancialRatios(local);
    updateChapter('chapter2', { statement: local, ratios });
    setShowResult(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Reporting</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Enter the income statement figures and click <strong>Calculate</strong> to derive key financial ratios.
        </p>
      </div>

      {/* Input grid within a Card */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 sm:grid-cols-4 gap-4">
          {FIELDS.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={local[key] === 0 ? '' : local[key].toLocaleString('en-US')}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Calculate button */}
      <div className="flex justify-center">
        <button
          onClick={handleCalculate}
          className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          Calculate Ratios
        </button>
      </div>

      {/* Results table */}
      {showResult && state.chapter2.ratios && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 p-1">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
              <tr>
                <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Metric</th>
                <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {ROWS.map(({ label, key, fmt }) => (
                <tr key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors even:bg-slate-50/20 dark:even:bg-slate-900/10">
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-350">{label}</td>
                  <td className="px-4 py-2.5 text-right text-slate-900 dark:text-slate-100 font-mono tabular-nums font-medium">
                    {fmt(state.chapter2.ratios![key])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inventory Costing Comparison */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Inventory Costing Comparison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'beginningUnits', label: 'Beginning Inventory (units)', placeholder: '100' },
            { key: 'beginningCostPerUnit', label: 'Beginning Cost/Unit ($)', placeholder: '10' },
            { key: 'purchasesUnits', label: 'Purchases (units)', placeholder: '200' },
            { key: 'purchasesCostPerUnit', label: 'Purchase Cost/Unit ($)', placeholder: '12' },
            { key: 'unitsSold', label: 'Units Sold', placeholder: '150' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={invInputs[key as keyof typeof invInputs] === 0 ? '' : invInputs[key as keyof typeof invInputs].toLocaleString('en-US')}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                  const val = cleaned === '' ? 0 : parseFloat(cleaned);
                  setInvInputs((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
                  setInvResult(null);
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              const { beginningUnits, beginningCostPerUnit, purchasesUnits, purchasesCostPerUnit, unitsSold } = invInputs;
              const totalUnits = beginningUnits + purchasesUnits;
              const totalCost = beginningUnits * beginningCostPerUnit + purchasesUnits * purchasesCostPerUnit;
              const waCostPerUnit = totalUnits > 0 ? totalCost / totalUnits : 0;
              const fifoCOGS = Math.min(unitsSold, beginningUnits) * beginningCostPerUnit + Math.max(0, unitsSold - beginningUnits) * purchasesCostPerUnit;
              const lifoCOGS = Math.min(unitsSold, purchasesUnits) * purchasesCostPerUnit + Math.max(0, unitsSold - purchasesUnits) * beginningCostPerUnit;
              const waCOGS = unitsSold * waCostPerUnit;
              setInvResult({
                fifoCOGS,
                lifoCOGS,
                waCOGS,
                fifoEnding: totalCost - fifoCOGS,
                lifoEnding: totalCost - lifoCOGS,
                waEnding: totalCost - waCOGS,
              });
            }}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Calculate Inventory COGS
          </button>
        </div>
        {invResult && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 p-1 mt-4">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Method</th>
                  <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">COGS</th>
                  <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Ending Inventory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {[
                  { label: 'FIFO', cogs: invResult.fifoCOGS, ending: invResult.fifoEnding },
                  { label: 'LIFO', cogs: invResult.lifoCOGS, ending: invResult.lifoEnding },
                  { label: 'Weighted Avg', cogs: invResult.waCOGS, ending: invResult.waEnding },
                ].map(({ label, cogs, ending }) => (
                  <tr key={label} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors even:bg-slate-50/20 dark:even:bg-slate-900/10">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-350">{label}</td>
                    <td className="px-4 py-2.5 text-right text-slate-900 dark:text-slate-100 font-mono tabular-nums font-medium">{currency(cogs)}</td>
                    <td className="px-4 py-2.5 text-right text-slate-900 dark:text-slate-100 font-mono tabular-nums font-medium">{currency(ending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Absorption vs Variable Costing */}
      <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Absorption vs Variable Costing</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'unitsProduced', label: 'Units Produced', placeholder: '1000' },
            { key: 'unitsSold', label: 'Units Sold', placeholder: '800' },
            { key: 'fixedMOH', label: 'Fixed MOH ($)', placeholder: '50,000' },
            { key: 'variableCostPerUnit', label: 'Variable Cost/Unit ($)', placeholder: '30' },
            { key: 'pricePerUnit', label: 'Price/Unit ($)', placeholder: '100' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</label>
              <input
                type="text"
                inputMode="decimal"
                placeholder={placeholder}
                value={absInputs[key as keyof typeof absInputs] === 0 ? '' : absInputs[key as keyof typeof absInputs].toLocaleString('en-US')}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                  const val = cleaned === '' ? 0 : parseFloat(cleaned);
                  setAbsInputs((prev) => ({ ...prev, [key]: isNaN(val) ? 0 : val }));
                  setAbsResult(null);
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              const { unitsProduced, unitsSold, fixedMOH, variableCostPerUnit, pricePerUnit } = absInputs;
              const sales = pricePerUnit * unitsSold;
              const fixedMOHPerUnit = unitsProduced > 0 ? fixedMOH / unitsProduced : 0;
              const absorptionCostPerUnit = variableCostPerUnit + fixedMOHPerUnit;
              const absorptionCOGS = absorptionCostPerUnit * unitsSold;
              const variableCOGS = variableCostPerUnit * unitsSold;
              const grossProfitAbs = sales - absorptionCOGS;
              const contributionMarginVar = sales - variableCOGS;
              const netIncomeAbs = grossProfitAbs; // no other period costs
              const netIncomeVar = contributionMarginVar - fixedMOH;
              const diff = netIncomeAbs - netIncomeVar;
              setAbsResult({ sales, absorptionCOGS, variableCOGS, grossProfitAbs, contributionMarginVar, netIncomeAbs, netIncomeVar, diff });
            }}
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Calculate Costing
          </button>
        </div>
        {absResult && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/40 p-1 mt-4">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-850">
                <tr>
                  <th className="text-left px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Metric</th>
                  <th className="text-right px-4 py-3 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {[
                  { label: 'Sales', value: absResult.sales },
                  { label: 'COGS (Absorption)', value: absResult.absorptionCOGS },
                  { label: 'COGS (Variable)', value: absResult.variableCOGS },
                  { label: 'Gross Profit (Absorption)', value: absResult.grossProfitAbs },
                  { label: 'Contribution Margin (Variable)', value: absResult.contributionMarginVar },
                  { label: 'Net Income (Absorption)', value: absResult.netIncomeAbs },
                  { label: 'Net Income (Variable)', value: absResult.netIncomeVar },
                  { label: 'Difference (Abs - Var)', value: absResult.diff },
                ].map(({ label, value }) => (
                  <tr key={label} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors even:bg-slate-50/20 dark:even:bg-slate-900/10">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-350">{label}</td>
                    <td className="px-4 py-2.5 text-right text-slate-900 dark:text-slate-100 font-mono tabular-nums font-medium">{currency(value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
