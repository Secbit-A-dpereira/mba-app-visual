// @ts-nocheck
'use client';
import React, { useState } from 'react';
import { currency } from '@/lib/math';

export default function Ch29PricingDecisions() {
  // 1. Cost-Plus Pricing State
  const [cpCost, setCpCost] = useState<number>(120);
  const [cpMarkup, setCpMarkup] = useState<number>(25); // 25%

  // 2. Target Costing State
  const [tcPrice, setTcPrice] = useState<number>(180);
  const [tcProfitMargin, setTcProfitMargin] = useState<number>(20); // 20%

  // 3. Make vs Buy State
  const [mbDM, setMbDM] = useState<number>(15);
  const [mbDL, setMbDL] = useState<number>(10);
  const [mbVarOH, setMbVarOH] = useState<number>(4);
  const [mbAvoidFixed, setMbAvoidFixed] = useState<number>(6); // e.g. production supervisor salary per unit
  const [mbUnavoidFixed, setMbUnavoidFixed] = useState<number>(8); // e.g. factory lease depreciation
  const [mbSupplierPrice, setMbSupplierPrice] = useState<number>(32);

  // 4. Special Order State
  const [soPrice, setSoPrice] = useState<number>(14);
  const [soVolume, setSoVolume] = useState<number>(5000);
  const [soVarCost, setSoVarCost] = useState<number>(11);
  const [soFixedCost, setSoFixedCost] = useState<number>(12000); // e.g. one-time tooling costs

  // 5. Product Mix Capacity State
  const [pmCapacity, setPmCapacity] = useState<number>(3000);
  const [pmA_CM, setPmA_CM] = useState<number>(50);
  const [pmA_Hours, setPmA_Hours] = useState<number>(2.0);
  const [pmA_Demand, setPmA_Demand] = useState<number>(1000);

  const [pmB_CM, setPmB_CM] = useState<number>(90);
  const [pmB_Hours, setPmB_Hours] = useState<number>(4.5);
  const [pmB_Demand, setPmB_Demand] = useState<number>(600);

  // 6. Breakeven Analysis State
  const [bePrice, setBePrice] = useState<number>(25);
  const [beVarCost, setBeVarCost] = useState<number>(15);
  const [beFixedCost, setBeFixedCost] = useState<number>(10000);

  // 7. Contribution Margin Calculator State
  const [cmPrice, setCmPrice] = useState<number>(50);
  const [cmVarCost, setCmVarCost] = useState<number>(30);

  // --- Calculations ---

  // 1. Cost-Plus Pricing
  const cpMarkupAmount = cpCost * (cpMarkup / 100);
  const cpTargetPrice = cpCost + cpMarkupAmount;

  // 2. Target Costing
  const tcProfitAmount = tcPrice * (tcProfitMargin / 100);
  const tcMaxCost = tcPrice - tcProfitAmount;

  // 3. Make vs Buy
  const mbRelevantInHouseCost = mbDM + mbDL + mbVarOH + mbAvoidFixed;
  const mbMakeTotalIncludingUnavoidable = mbRelevantInHouseCost + mbUnavoidFixed;
  const mbBuyTotalIncludingUnavoidable = mbSupplierPrice + mbUnavoidFixed;
  const mbSavings = Math.abs(mbRelevantInHouseCost - mbSupplierPrice);
  const mbDecision = mbRelevantInHouseCost < mbSupplierPrice ? 'MAKE' : 'BUY';

  // 4. Special Order
  const soIncrementalCM = soPrice - soVarCost;
  const soTotalIncrementalCM = soVolume * soIncrementalCM;
  const soNetIncrementalProfit = soTotalIncrementalCM - soFixedCost;
  const soDecision = soNetIncrementalProfit > 0 ? 'ACCEPT' : 'REJECT';

  // 5. Product Mix
  const pmA_CMPerHour = pmA_Hours > 0 ? pmA_CM / pmA_Hours : 0;
  const pmB_CMPerHour = pmB_Hours > 0 ? pmB_CM / pmB_Hours : 0;

  // Mix Allocation
  let pmAllocatedA = 0;
  let pmAllocatedB = 0;
  let pmHoursUsedA = 0;
  let pmHoursUsedB = 0;

  if (pmA_CMPerHour >= pmB_CMPerHour) {
    // Standard Product A has priority
    const hoursNeededA = pmA_Demand * pmA_Hours;
    if (pmCapacity >= hoursNeededA) {
      pmAllocatedA = pmA_Demand;
      pmHoursUsedA = hoursNeededA;
      const remainingHours = pmCapacity - hoursNeededA;
      pmAllocatedB = Math.min(pmB_Demand, Math.floor(remainingHours / (pmB_Hours || 1)));
      pmHoursUsedB = pmAllocatedB * pmB_Hours;
    } else {
      pmAllocatedA = Math.floor(pmCapacity / (pmA_Hours || 1));
      pmHoursUsedA = pmAllocatedA * pmA_Hours;
      pmAllocatedB = 0;
      pmHoursUsedB = 0;
    }
  } else {
    // Premium Product B has priority
    const hoursNeededB = pmB_Demand * pmB_Hours;
    if (pmCapacity >= hoursNeededB) {
      pmAllocatedB = pmB_Demand;
      pmHoursUsedB = hoursNeededB;
      const remainingHours = pmCapacity - hoursNeededB;
      pmAllocatedA = Math.min(pmA_Demand, Math.floor(remainingHours / (pmA_Hours || 1)));
      pmHoursUsedA = pmAllocatedA * pmA_Hours;
    } else {
      pmAllocatedB = Math.floor(pmCapacity / (pmB_Hours || 1));
      pmHoursUsedB = pmAllocatedB * pmB_Hours;
      pmAllocatedA = 0;
      pmHoursUsedA = 0;
    }
  }
  const pmTotalProfit = (pmAllocatedA * pmA_CM) + (pmAllocatedB * pmB_CM);
  const pmTotalHoursUsed = pmHoursUsedA + pmHoursUsedB;

  // 6. Breakeven Analysis
  const beContribution = bePrice - beVarCost;
  const beUnits = beContribution > 0 ? Math.ceil(beFixedCost / beContribution) : 0;
  const beRevenue = beUnits * bePrice;

  // 7. Contribution Margin Calculator
  const cmPerUnit = cmPrice - cmVarCost;
  const cmRatio = cmPrice > 0 ? (cmPerUnit / cmPrice) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 md:p-6 pb-20">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>💲</span> Pricing & Relevant Decisions
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Evaluate short-term tactical decisions: set markups, establish target costs, decide on outsourcing, review special orders, solve bottleneck constraints, compute breakeven, and analyze contribution margins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CARD 1: Cost-Plus Pricing */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
                1. Cost-Plus Pricing
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Standard Markup Model</span>
            </div>
            
            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Full Unit Cost (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    value={cpCost}
                    onChange={e => setCpCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Markup Percentage (%)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <input
                    type="number"
                    value={cpMarkup}
                    onChange={e => setCpMarkup(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-slate-400 text-xs">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Markup Amount ({cpMarkup}%):</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{currency(cpMarkupAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Target Sales Price:</span>
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-450">{currency(cpTargetPrice)}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Target Costing */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-450 uppercase tracking-wider">
                2. Target Costing
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Market Driven Pricing</span>
            </div>
            
            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Target Market Price (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">$</span>
                  <input
                    type="number"
                    value={tcPrice}
                    onChange={e => setTcPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Desired Profit Margin (%)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <input
                    type="number"
                    value={tcProfitMargin}
                    onChange={e => setTcProfitMargin(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                  <span className="text-slate-400 text-xs">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 dark:bg-blue-950/20 border border-blue-500/20 rounded-xl p-4 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Target Profit Margin ({tcProfitMargin}%):</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{currency(tcProfitAmount)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-500/20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Max Allowable Unit Cost:</span>
              <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-450">{currency(tcMaxCost)}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: Make vs Buy (Outsourcing) */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              3. Make vs Buy (Outsourcing)
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Relevant Costs Method</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase">In-house costs per unit</h4>
              <div>
                <label className="text-[9px] text-slate-400 uppercase">Direct Materials</label>
                <input
                  type="number"
                  value={mbDM}
                  onChange={e => setMbDM(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 uppercase">Direct Labor</label>
                <input
                  type="number"
                  value={mbDL}
                  onChange={e => setMbDL(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 uppercase">Var Overhead</label>
                <input
                  type="number"
                  value={mbVarOH}
                  onChange={e => setMbVarOH(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 uppercase">Avoidable Fixed</label>
                <input
                  type="number"
                  value={mbAvoidFixed}
                  onChange={e => setMbAvoidFixed(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-400 uppercase">Unavoidable Fixed</label>
                <input
                  type="number"
                  value={mbUnavoidFixed}
                  onChange={e => setMbUnavoidFixed(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2">Outside Supplier Offer</h4>
                <label className="text-[9px] text-slate-400 uppercase block">Supplier Unit Price</label>
                <input
                  type="number"
                  value={mbSupplierPrice}
                  onChange={e => setMbSupplierPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-850 space-y-1 text-[11px] text-slate-500">
                <div className="flex justify-between">
                  <span>Relevant Make Cost:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currency(mbRelevantInHouseCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Supplier Cost:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{currency(mbSupplierPrice)}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>(Unavoidable Fixed of {currency(mbUnavoidFixed)} omitted)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Make vs Buy Decision Card */}
          <div className={`border rounded-xl p-3 flex items-center justify-between ${
            mbDecision === 'MAKE' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-450' 
              : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-700 dark:text-indigo-400'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80 block">Decision Card</span>
              <span className="text-sm font-bold">RECOMMENDED: {mbDecision} IN-HOUSE</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] uppercase block opacity-85">Net Savings</span>
              <span className="text-base font-mono font-bold">{currency(mbSavings)}/unit</span>
            </div>
          </div>
        </div>

        {/* CARD 4: Special Order Decision */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-450 uppercase tracking-wider">
              4. Special Order Decision
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Excess Capacity Model</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Special Order Price (€)</label>
                <input
                  type="number"
                  value={soPrice}
                  onChange={e => setSoPrice(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Order Volume (Units)</label>
                <input
                  type="number"
                  value={soVolume}
                  onChange={e => setSoVolume(parseInt(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Incremental Var Cost/Unit (€)</label>
                <input
                  type="number"
                  value={soVarCost}
                  onChange={e => setSoVarCost(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">One-time Incremental Fixed Costs (€)</label>
                <input
                  type="number"
                  value={soFixedCost}
                  onChange={e => setSoFixedCost(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-850/50 grid grid-cols-2 text-[11px] text-slate-500 gap-2">
            <div>
              <span>Incremental CM / Unit:</span>
              <span className="font-semibold block text-slate-700 dark:text-slate-350">{currency(soIncrementalCM)}</span>
            </div>
            <div>
              <span>Total Incremental CM:</span>
              <span className="font-semibold block text-slate-700 dark:text-slate-350">{currency(soTotalIncrementalCM)}</span>
            </div>
          </div>

          {/* Special Order Decision Card */}
          <div className={`border rounded-xl p-3 flex items-center justify-between ${
            soDecision === 'ACCEPT' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-450' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-450'
          }`}>
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80 block">Decision Card</span>
              <span className="text-sm font-bold">RECOMMENDED: {soDecision} SPECIAL ORDER</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[9px] uppercase block opacity-85">Net Profit Impact</span>
              <span className={`text-base font-mono font-bold ${soDecision === 'ACCEPT' ? 'text-emerald-600 dark:text-emerald-450' : 'text-rose-500'}`}>
                {currency(soNetIncrementalProfit)}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 5: Product Mix & Capacity Constraint */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡</span> 5. Product Mix & Capacity Constraints
            </h3>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Theory of Constraints Optimization</span>
          </div>

          {/* Global capacity setting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-lg border border-slate-100 dark:border-slate-850">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Available Capacity (e.g. Hours)
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={pmCapacity}
                onChange={e => setPmCapacity(parseInt(e.target.value) || 0)}
                className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                <span>0 hours</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Current: {pmCapacity} hours</span>
                <span>5,000 hours</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Hours Utilized:</span>
                <span className="font-mono font-bold text-slate-700 dark:text-slate-350">{pmTotalHoursUsed} / {pmCapacity} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capacity Slack:</span>
                <span className="font-mono text-slate-500">{pmCapacity - pmTotalHoursUsed} hrs remaining</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Product A Setting */}
            <div className="space-y-3 p-3.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Product A (Standard)</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority: {pmA_CMPerHour >= pmB_CMPerHour ? '1 (High)' : '2'}</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase">Unit CM (€)</label>
                    <input
                      type="number"
                      value={pmA_CM}
                      onChange={e => setPmA_CM(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase">Hours / Unit</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pmA_Hours}
                      onChange={e => setPmA_Hours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 uppercase">Market Demand (Max Units)</label>
                  <input
                    type="number"
                    value={pmA_Demand}
                    onChange={e => setPmA_Demand(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5 font-mono"
                  />
                </div>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850/50 flex justify-between text-[11px] text-slate-500">
                  <span>CM Per Hour:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{currency(pmA_CMPerHour)} / hr</span>
                </div>
              </div>
            </div>

            {/* Product B Setting */}
            <div className="space-y-3 p-3.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-850 pb-1">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Product B (Premium)</h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Priority: {pmB_CMPerHour >= pmA_CMPerHour ? '1 (High)' : '2'}</span>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase">Unit CM (€)</label>
                    <input
                      type="number"
                      value={pmB_CM}
                      onChange={e => setPmB_CM(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 uppercase">Hours / Unit</label>
                    <input
                      type="number"
                      step="0.1"
                      value={pmB_Hours}
                      onChange={e => setPmB_Hours(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 uppercase">Market Demand (Max Units)</label>
                  <input
                    type="number"
                    value={pmB_Demand}
                    onChange={e => setPmB_Demand(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5 font-mono"
                  />
                </div>
                <div className="pt-1.5 border-t border-slate-100 dark:border-slate-850/50 flex justify-between text-[11px] text-slate-500">
                  <span>CM Per Hour:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-350">{currency(pmB_CMPerHour)} / hr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Optimization Output Card */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-450 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-wider opacity-80 block">Optimal Capacity Allocation</span>
              <div className="flex flex-wrap gap-4 text-xs font-semibold">
                <div>
                  <span>Prod A Volume:</span>{' '}
                  <span className="font-mono text-emerald-600 dark:text-emerald-405 font-bold">{pmAllocatedA} units</span>{' '}
                  <span className="text-[10px] text-slate-400 font-normal">({pmHoursUsedA} hrs)</span>
                </div>
                <div>
                  <span>Prod B Volume:</span>{' '}
                  <span className="font-mono text-emerald-600 dark:text-emerald-405 font-bold">{pmAllocatedB} units</span>{' '}
                  <span className="text-[10px] text-slate-400 font-normal">({pmHoursUsedB} hrs)</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-emerald-500/20">
              <span className="text-[9px] uppercase block opacity-85">Total Contribution Margin</span>
              <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-450">{currency(pmTotalProfit)}</span>
            </div>
          </div>
        </div>

        {/* CARD 6: Breakeven Analysis */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                6. Breakeven Analysis
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Find Break-Even Point</span>
            </div>

            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Selling Price per Unit (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">€</span>
                  <input
                    type="number"
                    value={bePrice}
                    onChange={e => setBePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Variable Cost per Unit (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">€</span>
                  <input
                    type="number"
                    value={beVarCost}
                    onChange={e => setBeVarCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Fixed Costs (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">€</span>
                  <input
                    type="number"
                    value={beFixedCost}
                    onChange={e => setBeFixedCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 dark:bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Contribution per Unit:</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">{currency(beContribution)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-cyan-500/20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Breakeven Units:</span>
              <span className="text-lg font-mono font-bold text-cyan-600 dark:text-cyan-450">{beUnits} units</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-slate-500">Breakeven Revenue:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{currency(beRevenue)}</span>
            </div>
          </div>
        </div>

        {/* CARD 7: Contribution Margin Calculator */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                7. Contribution Margin Calculator
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">CM per Unit &amp; Ratio</span>
            </div>

            <div className="space-y-4 mt-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Selling Price per Unit (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">€</span>
                  <input
                    type="number"
                    value={cmPrice}
                    onChange={e => setCmPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Variable Cost per Unit (€)</label>
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5">
                  <span className="text-slate-400 text-xs">€</span>
                  <input
                    type="number"
                    value={cmVarCost}
                    onChange={e => setCmVarCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Contribution Margin per Unit:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{currency(cmPerUnit)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-purple-500/20">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">CM Ratio:</span>
              <span className="text-lg font-mono font-bold text-purple-600 dark:text-purple-450">{cmRatio.toFixed(1)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
