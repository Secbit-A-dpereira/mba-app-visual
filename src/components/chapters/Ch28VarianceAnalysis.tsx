// @ts-nocheck
'use client';
import React, { useState } from 'react';
import { currency, pct } from '@/lib/math';

export default function Ch28VarianceAnalysis() {
  // Budgeted & Standard inputs
  const [budgetedUnits, setBudgetedUnits] = useState<number>(1000);
  const [standardPrice, setStandardPrice] = useState<number>(200);

  const [stdMatQtyPerUnit, setStdMatQtyPerUnit] = useState<number>(3.0); // e.g. 3 lbs
  const [stdMatPrice, setStdMatPrice] = useState<number>(10.0); // e.g. €10 per lb

  const [stdLaborHrsPerUnit, setStdLaborHrsPerUnit] = useState<number>(1.5); // e.g. 1.5 hrs
  const [stdLaborRate, setStdLaborRate] = useState<number>(30.0); // e.g. €30 per hr

  const [stdOHRatePerUnit, setStdOHRatePerUnit] = useState<number>(25.0); // e.g. €25 per unit

  // Actual outcomes inputs
  const [actualUnits, setActualUnits] = useState<number>(800);
  const [actualRevenue, setActualRevenue] = useState<number>(150000);

  const [actualMatQty, setActualMatQty] = useState<number>(2800); // e.g. 2800 lbs used
  const [actualMatCost, setActualMatCost] = useState<number>(32200); // total materials cost

  const [actualLaborHrs, setActualLaborHrs] = useState<number>(1400); // e.g. 1400 hrs worked
  const [actualLaborCost, setActualLaborCost] = useState<number>(39200); // total labor cost

  const [actualOHCost, setActualOHCost] = useState<number>(23000); // total overhead cost

  // Derived Standard Costs
  const stdMatCostPerUnit = stdMatQtyPerUnit * stdMatPrice;
  const stdLaborCostPerUnit = stdLaborHrsPerUnit * stdLaborRate;
  const totalStdCostPerUnit = stdMatCostPerUnit + stdLaborCostPerUnit + stdOHRatePerUnit;

  // Flexible Budget Calculations
  const flexRevenue = actualUnits * standardPrice;
  const SQ = actualUnits * stdMatQtyPerUnit;
  const flexMaterials = SQ * stdMatPrice;

  const SH = actualUnits * stdLaborHrsPerUnit;
  const flexLabor = SH * stdLaborRate;

  const flexOverhead = actualUnits * stdOHRatePerUnit;

  // Actual rates
  const actualPricePerUnit = actualUnits > 0 ? actualRevenue / actualUnits : 0;
  const actualMatPricePerUnit = actualMatQty > 0 ? actualMatCost / actualMatQty : 0;
  const actualLaborRatePerUnit = actualLaborHrs > 0 ? actualLaborCost / actualLaborHrs : 0;

  // Variance Calculations
  // 1. Revenue Variance (based on sales price variance for actual volume)
  const revenueVariance = actualRevenue - flexRevenue; // Positive is Favorable for revenue
  const revenuePct = flexRevenue > 0 ? revenueVariance / flexRevenue : 0;

  // 2. Materials Price Variance: AQ * (AP - SP) => Actual Cost - (AQ * SP)
  const materialsPriceVariance = actualMatCost - (actualMatQty * stdMatPrice); // Positive is Unfavorable for cost
  const matPricePct = flexMaterials > 0 ? materialsPriceVariance / flexMaterials : 0;

  // 3. Materials Efficiency Variance: SP * (AQ - SQ)
  const materialsEffVariance = stdMatPrice * (actualMatQty - SQ); // Positive is Unfavorable
  const matEffPct = flexMaterials > 0 ? materialsEffVariance / flexMaterials : 0;

  // 4. Labor Rate Variance: AH * (AR - SR) => Actual Cost - (AH * SR)
  const laborRateVariance = actualLaborCost - (actualLaborHrs * stdLaborRate); // Positive is Unfavorable
  const laborRatePct = flexLabor > 0 ? laborRateVariance / flexLabor : 0;

  // 5. Labor Efficiency Variance: SR * (AH - SH)
  const laborEffVariance = stdLaborRate * (actualLaborHrs - SH); // Positive is Unfavorable
  const laborEffPct = flexLabor > 0 ? laborEffVariance / flexLabor : 0;

  // 6. Overhead Variance
  const overheadVariance = actualOHCost - flexOverhead; // Positive is Unfavorable
  const overheadPct = flexOverhead > 0 ? overheadVariance / flexOverhead : 0;

  // Summary helper
  const getVarianceStatus = (val: number, isRevenue = false) => {
    if (Math.abs(val) < 0.01) return { text: 'None', isFavorable: true, color: 'text-slate-400' };
    const isFav = isRevenue ? val > 0 : val < 0;
    return {
      text: isFav ? 'Favorable' : 'Unfavorable',
      isFavorable: isFav,
      color: isFav ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold',
    };
  };

  const getExceptionFlag = (pctVal: number) => {
    const absPct = Math.abs(pctVal);
    if (absPct >= 0.10) {
      return (
        <span className="px-2 py-0.5 text-base font-bold rounded bg-rose-500/20 border border-rose-500/30 text-rose-400 animate-pulse uppercase">
          ⚠️ Exception
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-base font-bold rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 uppercase">
        OK
      </span>
    );
  };

  // Compile variances for chart
  const chartData = [
    { name: 'Revenue', value: revenueVariance, isFav: revenueVariance > 0, display: Math.abs(revenueVariance) },
    { name: 'Mat Price', value: materialsPriceVariance, isFav: materialsPriceVariance < 0, display: Math.abs(materialsPriceVariance) },
    { name: 'Mat Usage', value: materialsEffVariance, isFav: materialsEffVariance < 0, display: Math.abs(materialsEffVariance) },
    { name: 'Labor Rate', value: laborRateVariance, isFav: laborRateVariance < 0, display: Math.abs(laborRateVariance) },
    { name: 'Labor Eff', value: laborEffVariance, isFav: laborEffVariance < 0, display: Math.abs(laborEffVariance) },
    { name: 'Overhead', value: overheadVariance, isFav: overheadVariance < 0, display: Math.abs(overheadVariance) },
  ];

  const maxChartVal = Math.max(...chartData.map(d => d.display)) * 1.15 || 1000;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📉</span> Variance & Budget Analysis (Management by Exception)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Perform flexible budgeting adjustments to isolate price, rate, and efficiency deviations. Highlight variances exceeding the 10% exception threshold.
        </p>
      </div>

      {/* Grid: Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Standards Card */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Standards & Static Budget Parameters
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Budgeted Vol (Units)</label>
              <input
                type="number"
                value={budgetedUnits}
                onChange={e => setBudgetedUnits(parseInt(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Standard Price / Unit (€)</label>
              <input
                type="number"
                value={standardPrice}
                onChange={e => setStandardPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Std Materials (Qty/Unit)</label>
              <input
                type="number"
                step="0.1"
                value={stdMatQtyPerUnit}
                onChange={e => setStdMatQtyPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Std Materials Price ($/unit of qty)</label>
              <input
                type="number"
                step="0.1"
                value={stdMatPrice}
                onChange={e => setStdMatPrice(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Std Labor (Hrs/Unit)</label>
              <input
                type="number"
                step="0.1"
                value={stdLaborHrsPerUnit}
                onChange={e => setStdLaborHrsPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Std Labor Rate ($/hr)</label>
              <input
                type="number"
                value={stdLaborRate}
                onChange={e => setStdLaborRate(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Std Overhead Rate ($/unit)</label>
              <input
                type="number"
                value={stdOHRatePerUnit}
                onChange={e => setStdOHRatePerUnit(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Actual Outcome Inputs Card */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Actual Results (Launch Outcome)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Vol Sold (Units)</label>
              <input
                type="number"
                value={actualUnits}
                onChange={e => setActualUnits(parseInt(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Revenue (€)</label>
              <input
                type="number"
                value={actualRevenue}
                onChange={e => setActualRevenue(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Materials (Qty Used)</label>
              <input
                type="number"
                value={actualMatQty}
                onChange={e => setActualMatQty(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Materials Total Cost (€)</label>
              <input
                type="number"
                value={actualMatCost}
                onChange={e => setActualMatCost(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Labor (Hours Worked)</label>
              <input
                type="number"
                value={actualLaborHrs}
                onChange={e => setActualLaborHrs(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Labor Total Cost (€)</label>
              <input
                type="number"
                value={actualLaborCost}
                onChange={e => setActualLaborCost(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-base font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Overhead Cost (€)</label>
              <input
                type="number"
                value={actualOHCost}
                onChange={e => setActualOHCost(parseFloat(e.target.value) || 0)}
                className="w-full text-base bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Variance Dashboard Table */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          3. Detailed Flexible Budget Variance Breakdown
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-2 pr-2">Metric Type</th>
                <th className="py-2 px-2">Actual Cost/Rev</th>
                <th className="py-2 px-2">Flexible Budget</th>
                <th className="py-2 px-2">Variance (€)</th>
                <th className="py-2 px-2">Variance (%)</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2 text-center">Management Flag</th>
              </tr>
            </thead>
            <tbody>
              {/* Revenue */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Revenue (Sales Price)</td>
                <td className="py-3 px-2 font-mono">{currency(actualRevenue)}</td>
                <td className="py-3 px-2 font-mono">{currency(flexRevenue)}</td>
                <td className="py-3 px-2 font-mono">{currency(revenueVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(revenuePct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(revenueVariance, true).color}`}>
                  {getVarianceStatus(revenueVariance, true).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(revenuePct)}</td>
              </tr>
              {/* Materials Price */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Materials Price Variance</td>
                <td className="py-3 px-2 font-mono">{currency(actualMatCost)}</td>
                <td className="py-3 px-2 font-mono">{currency(actualMatQty * stdMatPrice)}</td>
                <td className="py-3 px-2 font-mono">{currency(materialsPriceVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(matPricePct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(materialsPriceVariance).color}`}>
                  {getVarianceStatus(materialsPriceVariance).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(matPricePct)}</td>
              </tr>
              {/* Materials Efficiency */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Materials Efficiency (Usage)</td>
                <td className="py-3 px-2 font-mono">{currency(actualMatQty * stdMatPrice)}</td>
                <td className="py-3 px-2 font-mono">{currency(flexMaterials)}</td>
                <td className="py-3 px-2 font-mono">{currency(materialsEffVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(matEffPct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(materialsEffVariance).color}`}>
                  {getVarianceStatus(materialsEffVariance).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(matEffPct)}</td>
              </tr>
              {/* Labor Rate */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Labor Rate (Price)</td>
                <td className="py-3 px-2 font-mono">{currency(actualLaborCost)}</td>
                <td className="py-3 px-2 font-mono">{currency(actualLaborHrs * stdLaborRate)}</td>
                <td className="py-3 px-2 font-mono">{currency(laborRateVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(laborRatePct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(laborRateVariance).color}`}>
                  {getVarianceStatus(laborRateVariance).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(laborRatePct)}</td>
              </tr>
              {/* Labor Efficiency */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Labor Efficiency (Hours)</td>
                <td className="py-3 px-2 font-mono">{currency(actualLaborHrs * stdLaborRate)}</td>
                <td className="py-3 px-2 font-mono">{currency(flexLabor)}</td>
                <td className="py-3 px-2 font-mono">{currency(laborEffVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(laborEffPct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(laborEffVariance).color}`}>
                  {getVarianceStatus(laborEffVariance).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(laborEffPct)}</td>
              </tr>
              {/* Overhead */}
              <tr className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                <td className="py-3 pr-2 font-semibold">Overhead Spending Variance</td>
                <td className="py-3 px-2 font-mono">{currency(actualOHCost)}</td>
                <td className="py-3 px-2 font-mono">{currency(flexOverhead)}</td>
                <td className="py-3 px-2 font-mono">{currency(overheadVariance)}</td>
                <td className="py-3 px-2 font-mono">{pct(overheadPct)}</td>
                <td className={`py-3 px-2 ${getVarianceStatus(overheadVariance).color}`}>
                  {getVarianceStatus(overheadVariance).text}
                </td>
                <td className="py-3 px-2 text-center">{getExceptionFlag(overheadPct)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SVG Horizontal Bar Chart representing variances */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          4. Variance Magnitude Chart
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-1 space-y-2">
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualizes the magnitude and direction of variances. Bars to the left indicate favorable cost outcomes or higher revenue. Bars to the right represent unfavorable spend overruns or revenue shortfalls.
            </p>
            <div className="flex gap-3 text-base">
              <span className="flex items-center gap-1 font-semibold text-emerald-500">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Favorable
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-500">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Unfavorable
              </span>
            </div>
          </div>

          <div className="md:col-span-3 h-64 bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-4">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              {/* Central Axis (0 value at x=250) */}
              <line x1="250" y1="10" x2="250" y2="180" stroke="#64748b" strokeWidth="1.5" />
              <text x="250" y="8" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">0 (Budget Target)</text>
              <line x1="120" y1="10" x2="120" y2="180" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="380" y1="10" x2="380" y2="180" stroke="#334155" strokeWidth="0.5" strokeDasharray="3,3" />

              {chartData.map((d, i) => {
                const yOffset = 20 + i * 26;
                const barWidth = (d.display / maxChartVal) * 120;
                const barX = d.isFav ? 250 - barWidth : 250;
                const barColor = d.isFav ? '#10b981' : '#f43f5e';

                return (
                  <g key={d.name}>
                    {/* Label */}
                    <text x="15" y={yOffset + 14} fill="#94a3b8" fontSize="9" fontWeight="semibold">{d.name}</text>

                    {/* Bar */}
                    <rect
                      x={barX}
                      y={yOffset + 4}
                      width={Math.max(1.5, barWidth)}
                      height="12"
                      fill={barColor}
                      rx="2"
                    />

                    {/* Value Badge */}
                    <text
                      x={d.isFav ? barX - 6 : barX + barWidth + 6}
                      y={yOffset + 13}
                      fill={barColor}
                      fontSize="8.5"
                      fontWeight="bold"
                      textAnchor={d.isFav ? 'end' : 'start'}
                    >
                      {d.isFav ? '-' : '+'}{currency(d.display)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* ===== NEW INTERACTIVE TOOLS ===== */}

      {/* Tool 1: Break-Even Sensitivity Analysis */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          📈 Break-Even Sensitivity Analysis
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400">
          See how changes in price, cost, or volume affect the break-even point. Adjust sliders to simulate varying market conditions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div>
              <label className="text-base font-bold text-slate-400 uppercase block mb-1">Selling Price (€)</label>
              <input
                type="range"
                min="150"
                max="300"
                step="5"
                value={standardPrice}
                onChange={e => setStandardPrice(parseFloat(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <span className="text-base font-mono text-slate-600">${standardPrice}</span>
            </div>
            <div>
              <label className="text-base font-bold text-slate-400 uppercase block mb-1">Variable Cost ($/unit)</label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={totalStdCostPerUnit}
                onChange={e => {
                  // Adjust standard price? We'll just show variable cost as a derived value; we instead change standard materials price proportionally
                  const newVar = parseFloat(e.target.value);
                  const ratio = newVar / totalStdCostPerUnit;
                  // Scale all standard costs proportionally (simplified)
                  setStdMatPrice(prev => Math.round(prev * ratio * 10) / 10);
                  setStdLaborRate(prev => Math.round(prev * ratio));
                  setStdOHRatePerUnit(prev => Math.round(prev * ratio));
                }}
                className="w-full accent-amber-500"
              />
              <span className="text-base font-mono text-slate-600">${Math.round(totalStdCostPerUnit)}</span>
            </div>
            <div>
              <label className="text-base font-bold text-slate-400 uppercase block mb-1">Fixed Costs (€)</label>
              <input
                type="range"
                min="50000"
                max="200000"
                step="5000"
                defaultValue={100000}
                className="w-full accent-blue-500"
                onChange={e => {
                  // Disabled - for display only, we don't use fixed costs in variance framework
                }}
              />
              <span className="text-base font-mono text-slate-600">$100,000 (static)</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-3 text-base">
              <span className="text-slate-400 block">Contribution Margin / Unit</span>
              <span className="text-lg font-bold text-emerald-500">
                €{(standardPrice - totalStdCostPerUnit).toFixed(2)}
              </span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-3 text-base">
              <span className="text-slate-400 block">Break-Even Volume (units)</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {Math.ceil(100000 / (standardPrice - totalStdCostPerUnit)) || '∞'}
              </span>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-3 text-base">
              <span className="text-slate-400 block">Break-Even Revenue (€)</span>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
                €{(Math.ceil(100000 / (standardPrice - totalStdCostPerUnit)) * standardPrice).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tool 2: Rolling Budget Comparison */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          📊 Rolling Budget Comparison
        </h3>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Compare your static budget and flexible budget against a rolling average of the last 3 periods (simulated). Identifies trend-based variances.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-base">
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 block mb-1">Static Budget Revenue (Budgeted Units × Standard Price)</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
              €{(budgetedUnits * standardPrice).toLocaleString()}
            </span>
          </div>
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 block mb-1">Flexible Budget Revenue (Actual Units × Standard Price)</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">
              €{flexRevenue.toLocaleString()}
            </span>
          </div>
          <div className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
            <span className="text-slate-400 block mb-1">Rolling Average Budget (Simulated 3‑period)</span>
            <span className="text-lg font-bold text-emerald-500">
              €{Math.round((budgetedUnits * standardPrice * 0.9 + flexRevenue * 1.1 + actualRevenue * 0.95) / 3).toLocaleString()}
            </span>
            <p className="text-base text-slate-400 mt-1">Weighted blend of static, flexible, and prior actuals.</p>
          </div>
        </div>
        <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-3 mt-2">
          <h4 className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-1">Insights</h4>
          <ul className="text-base text-slate-500 space-y-0.5 list-disc list-inside">
            <li>The rolling budget smooths seasonality and external shocks.</li>
            <li>Compare your current flexible budget variance against the rolling baseline to distinguish trend from noise.</li>
            <li>If variances persist beyond the rolling average, investigate systemic issues.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
