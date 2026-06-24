'use client';
import React, { useState } from 'react';
import { useMBA } from '@/context/MBAContext';

export default function Ch9Negotiations() {
  const { state, updateChapter } = useMBA();
  const n = state.chapter9.negotiation;

  const update = (key: string, value: number | boolean) => {
    updateChapter('chapter9', { negotiation: { ...n, [key]: value } });
  };

  const { batna, reservationPrice, aspirationPrice, isBuyer } = n;

  // Determine ZOPA (Zone of Possible Agreement) ranges
  const buyerMin = 0;
  const buyerMax = isBuyer ? reservationPrice : aspirationPrice;
  const sellerMin = isBuyer ? aspirationPrice : reservationPrice;
  const sellerMax = 200; // visual max

  const zopaStart = Math.max(buyerMin, sellerMin);
  const zopaEnd = Math.min(buyerMax, sellerMax);
  const hasZOPA = zopaStart < zopaEnd;

  // Reservation price relative positioning
  const totalRange = 200; // visual scale 0–200
  const batnaPct = (batna / totalRange) * 100;
  const reservationPct = (reservationPrice / totalRange) * 100;
  const aspirationPct = (aspirationPrice / totalRange) * 100;

  // ZOPA visual
  const zopaStartPct = (zopaStart / totalRange) * 100;
  const zopaEndPct = (zopaEnd / totalRange) * 100;
  const zopaWidthPct = zopaEndPct - zopaStartPct;

  // Bargaining ranges
  const buyerRangeStart = Math.min(buyerMin, buyerMax);
  const buyerRangeEnd = Math.max(buyerMin, buyerMax);
  const sellerRangeStart = Math.min(sellerMin, sellerMax);
  const sellerRangeEnd = Math.max(sellerMin, sellerMax);

  // Negotiation batna analysis
  const batnaStrength = isBuyer
    ? (batna >= reservationPrice ? 'Strong' : batna >= reservationPrice * 0.8 ? 'Moderate' : 'Weak')
    : (batna <= reservationPrice ? 'Strong' : batna <= reservationPrice * 1.2 ? 'Moderate' : 'Weak');

  const batnaAdvice = isBuyer
    ? {
        Strong: 'Your BATNA is strong. Walk away confidently if the deal exceeds your reservation price.',
        Moderate: 'Your BATNA is decent but room for improvement. Explore alternatives before negotiating.',
        Weak: 'Your BATNA is weak — strengthening it will give you better leverage at the table.',
      }[batnaStrength]
    : {
        Strong: 'Your BATNA is strong. You can afford to hold firm on your reservation price.',
        Moderate: 'Your BATNA is reasonable. Consider developing additional alternatives.',
        Weak: 'Your BATNA is weak — improve your alternatives to avoid settling for a poor deal.',
      }[batnaStrength];

  const aspirationGap = Math.abs(aspirationPrice - reservationPrice);
  const aspirationAdvice = aspirationGap > 30
    ? 'Large gap between aspiration and reservation — aim high but have realistic expectations.'
    : aspirationGap < 10
    ? 'Tight gap — consider expanding your aspiration to leave room for concessions.'
    : 'Reasonable aspiration gap — good balance between ambition and realism.';

  // --- NEW: Inventory Costing State ---
  const [beginningUnits, setBeginningUnits] = useState(100);
  const [beginningCost, setBeginningCost] = useState(10);
  const [purchase1Units, setPurchase1Units] = useState(150);
  const [purchase1Cost, setPurchase1Cost] = useState(12);
  const [purchase2Units, setPurchase2Units] = useState(100);
  const [purchase2Cost, setPurchase2Cost] = useState(14);
  const [soldUnits, setSoldUnits] = useState(200);

  const totalUnits = beginningUnits + purchase1Units + purchase2Units;
  const endingUnits = totalUnits - soldUnits;

  // FIFO COGS
  let remaining = soldUnits;
  let fifoCogs = 0;
  // from beginning
  const fromBegin = Math.min(remaining, beginningUnits);
  fifoCogs += fromBegin * beginningCost;
  remaining -= fromBegin;
  if (remaining > 0) {
    const fromP1 = Math.min(remaining, purchase1Units);
    fifoCogs += fromP1 * purchase1Cost;
    remaining -= fromP1;
  }
  if (remaining > 0) {
    const fromP2 = Math.min(remaining, purchase2Units);
    fifoCogs += fromP2 * purchase2Cost;
  }

  // LIFO COGS
  remaining = soldUnits;
  let lifoCogs = 0;
  const fromP2 = Math.min(remaining, purchase2Units);
  lifoCogs += fromP2 * purchase2Cost;
  remaining -= fromP2;
  if (remaining > 0) {
    const fromP1 = Math.min(remaining, purchase1Units);
    lifoCogs += fromP1 * purchase1Cost;
    remaining -= fromP1;
  }
  if (remaining > 0) {
    const fromBegin = Math.min(remaining, beginningUnits);
    lifoCogs += fromBegin * beginningCost;
  }

  // Weighted Average COGS
  const totalCost = beginningUnits*beginningCost + purchase1Units*purchase1Cost + purchase2Units*purchase2Cost;
  const avgCost = totalCost / totalUnits;
  const waCogs = avgCost * soldUnits;
  const waEnding = avgCost * endingUnits;

  // --- NEW: EOQ State ---
  const [annualDemand, setAnnualDemand] = useState(5000);
  const [orderCost, setOrderCost] = useState(50);
  const [carryingCostPerUnit, setCarryingCostPerUnit] = useState(2);
  const eoq = Math.sqrt((2 * annualDemand * orderCost) / carryingCostPerUnit);
  const totalAnnualInventoryCost = (annualDemand / eoq) * orderCost + (eoq / 2) * carryingCostPerUnit;
  const annualOrders = annualDemand / eoq;

  // --- NEW: Inventory Carrying Cost State ---
  const [avgInventoryValue, setAvgInventoryValue] = useState(50000);
  const [carryingCostPct, setCarryingCostPct] = useState(15);
  const carryingCost = avgInventoryValue * (carryingCostPct / 100);

  // ── NEW: Break‑Even Analysis ──
  const [bePrice, setBePrice] = useState(50);
  const [beVariableCost, setBeVariableCost] = useState(30);
  const [beFixedCost, setBeFixedCost] = useState(20000);
  const beUnits = bePrice - beVariableCost > 0 ? Math.ceil(beFixedCost / (bePrice - beVariableCost)) : Infinity;
  const beRevenue = beUnits === Infinity ? Infinity : beUnits * bePrice;

  // ── NEW: NPV Calculator ──
  const [initialInvestment, setInitialInvestment] = useState(100000);
  const [discountRate, setDiscountRate] = useState(10);
  const [cashFlows, setCashFlows] = useState([30000, 35000, 40000, 45000, 50000]);
  const npv = cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + discountRate / 100, i + 1), 0) - initialInvestment;

  return (
    <div className="space-y-6 p-6 max-w-full md:max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          🤝 Negotiations Simulator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Define your negotiation parameters and visualize the Zone of Possible Agreement (ZOPA).
        </p>
      </div>

      {/* Buyer/Seller Toggle */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-base font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
            I am negotiating as the...
          </span>
          <div className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5">
            <button
              onClick={() => update('isBuyer', true)}
              className={`px-4 py-1 text-base font-semibold rounded-md transition-colors cursor-pointer ${
                isBuyer
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-650 dark:text-slate-455 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🛒 Buyer
            </button>
            <button
              onClick={() => update('isBuyer', false)}
              className={`px-4 py-1 text-base font-semibold rounded-md transition-colors cursor-pointer ${
                !isBuyer
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-650 dark:text-slate-455 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              🏪 Seller
            </button>
          </div>
        </div>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* BATNA */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold uppercase tracking-wider text-slate-555 dark:text-slate-450">
              BATNA
            </label>
            <span className="text-base font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Best Alternative</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
            <span className="text-slate-455 text-base">$</span>
            <input
              type="number"
              min={0}
              max={200}
              value={batna}
              onChange={(e) => update('batna', parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-none outline-none py-0.5 text-base text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:ring-0 tabular-nums font-semibold"
            />
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={batna}
            onChange={(e) => update('batna', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Reservation Price */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold uppercase tracking-wider text-slate-555 dark:text-slate-455">
              Reservation Price
            </label>
            <span className="text-base font-semibold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Walk-away point</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
            <span className="text-slate-450 text-base">$</span>
            <input
              type="number"
              min={0}
              max={200}
              value={reservationPrice}
              onChange={(e) => update('reservationPrice', parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-none outline-none py-0.5 text-base text-slate-900 dark:text-slate-100 placeholder-slate-450 focus:ring-0 tabular-nums font-semibold"
            />
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={reservationPrice}
            onChange={(e) => update('reservationPrice', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Aspiration Price */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-base font-bold uppercase tracking-wider text-slate-555 dark:text-slate-455">
              Aspiration Price
            </label>
            <span className="text-base font-semibold text-slate-400 dark:text-slate-505 uppercase tracking-wider">Target/goal</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 rounded-lg px-2.5 py-1 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all">
            <span className="text-slate-455 text-base">$</span>
            <input
              type="number"
              min={0}
              max={200}
              value={aspirationPrice}
              onChange={(e) => update('aspirationPrice', parseFloat(e.target.value) || 0)}
              className="w-full bg-transparent border-none outline-none py-0.5 text-base text-slate-900 dark:text-slate-100 placeholder-slate-455 focus:ring-0 tabular-nums font-semibold"
            />
          </div>
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            value={aspirationPrice}
            onChange={(e) => update('aspirationPrice', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* ZOPA Visual Range */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold uppercase tracking-wider text-slate-550 dark:text-slate-405">
            📊 Zone of Possible Agreement (ZOPA)
          </h4>
          <div className={`px-2.5 py-0.5 rounded-full text-base font-bold uppercase tracking-wider ${
            hasZOPA
              ? 'bg-emerald-50 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/80'
              : 'bg-red-50 dark:bg-red-955/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/80'
          }`}>
            {hasZOPA ? '✅ ZOPA Exists' : '❌ No ZOPA'}
          </div>
        </div>

        {/* Visual range bar */}
        <div className="relative h-16 pt-2">
          {/* Background */}
          <div className="absolute inset-x-0 top-2 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-150 dark:border-slate-850" />

          {/* Buyer range bar */}
          <div
            className="absolute top-2 h-7 rounded-l-lg bg-blue-500/20 dark:bg-blue-400/10 border border-blue-500/40 dark:border-blue-400/40"
            style={{
              left: `${(buyerRangeStart / 200) * 100}%`,
              width: `${((buyerRangeEnd - buyerRangeStart) / 200) * 100}%`,
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold uppercase tracking-wider text-blue-700 dark:text-blue-450">
              {isBuyer ? 'Buyer Range' : 'Seller Range'}
            </span>
          </div>

          {/* Seller range bar */}
          <div
            className="absolute top-2 h-7 rounded-r-lg bg-emerald-500/20 dark:bg-emerald-400/10 border border-emerald-500/40 dark:border-emerald-400/40"
            style={{
              left: `${(sellerRangeStart / 200) * 100}%`,
              width: `${((sellerRangeEnd - sellerRangeStart) / 200) * 100}%`,
            }}
          >
            <span className="absolute inset-0 flex items-center justify-center text-base font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-450">
              {isBuyer ? 'Seller Range' : 'Buyer Range'}
            </span>
          </div>

          {/* ZOPA highlight */}
          {hasZOPA && (
            <div
              className="absolute top-2 h-7 z-10 bg-emerald-400/30 dark:bg-emerald-400/20 border border-emerald-500/85 rounded"
              style={{
                left: `${zopaStartPct}%`,
                width: `${Math.max(zopaWidthPct, 2)}%`,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-base font-extrabold text-emerald-800 dark:text-emerald-300 tracking-wider">
                ZOPA
              </span>
            </div>
          )}

          {/* Markers */}
          {/* BATNA marker */}
          <div
            className="absolute -top-1.5 z-20 flex flex-col items-center"
            style={{ left: `calc(${batnaPct}% + 0px)` }}
          >
            <div className="w-0.5 h-10 bg-emerald-555" />
            <div className="absolute -top-4 whitespace-nowrap text-base font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              BATNA ${batna}
            </div>
          </div>

          {/* Reservation marker */}
          <div
            className="absolute top-2 z-20 flex flex-col items-center"
            style={{ left: `${reservationPct}%` }}
          >
            <div className="w-0.5 h-8 bg-amber-500" />
            <div className="absolute -top-4 -translate-x-1/2 whitespace-nowrap text-base font-extrabold text-amber-500 uppercase tracking-wider">
              ▼ ${reservationPrice}
            </div>
          </div>

          {/* Aspiration marker */}
          <div
            className="absolute top-2 z-20 flex flex-col items-center"
            style={{ left: `${aspirationPct}%` }}
          >
            <div className="w-0.5 h-8 bg-emerald-600" />
            <div className="absolute -top-4 -translate-x-1/2 whitespace-nowrap text-base font-extrabold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider">
              ★ ${aspirationPrice}
            </div>
          </div>
        </div>

        {/* Scale */}
        <div className="relative h-4">
          <div className="absolute inset-x-0 flex justify-between text-base font-bold text-slate-400 uppercase tracking-wider">
            <span>$0</span>
            <span>$50</span>
            <span>$100</span>
            <span>$150</span>
            <span>$200</span>
          </div>
        </div>

        {/* ZOPA Summary */}
        <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base text-slate-450 dark:text-slate-500 uppercase tracking-wider font-bold">BATNA</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums">${batna}</p>
            <p className="text-base font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">{batnaStrength}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-955/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base text-slate-450 dark:text-slate-500 uppercase tracking-wider font-bold">Reservation</p>
            <p className="text-lg font-bold text-amber-500 mt-0.5 tabular-nums">${reservationPrice}</p>
            <p className="text-base font-semibold text-slate-405 mt-0.5 uppercase tracking-wide">Walk-away</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-955/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base text-slate-450 dark:text-slate-500 uppercase tracking-wider font-bold">Aspiration</p>
            <p className="text-lg font-bold text-emerald-500 mt-0.5 tabular-nums">${aspirationPrice}</p>
            <p className="text-base font-semibold text-slate-405 mt-0.5 uppercase tracking-wide">Target</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-955/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base text-slate-455 dark:text-slate-500 uppercase tracking-wider font-bold">ZOPA Range</p>
            <p className={`text-lg font-bold mt-0.5 tabular-nums ${hasZOPA ? 'text-emerald-500' : 'text-red-500'}`}>
              {hasZOPA ? `€{zopaStart}–€{zopaEnd}` : '—'}
            </p>
            <p className="text-base font-semibold text-slate-400 mt-0.5 uppercase tracking-wide">
              {hasZOPA ? `Size: €{zopaEnd - zopaStart}` : 'No overlap'}
            </p>
          </div>
        </div>
      </div>

      {/* Negotiation Strategy Advice */}
      <div className="grid grid-cols-1 grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <h4 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              BATNA Analysis
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-base font-bold ${
              batnaStrength === 'Strong' ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/80'
              : batnaStrength === 'Moderate' ? 'bg-amber-50 dark:bg-amber-955/40 text-amber-700 dark:text-amber-405 border border-amber-100 dark:border-amber-900/80'
              : 'bg-red-50 dark:bg-red-955/40 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/80'
            }`}>
              {batnaStrength} BATNA
            </span>
          </div>
          <p className="text-base text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
            {batnaAdvice}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">📐</span>
            <h4 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Aspiration Analysis
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-base font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/80">
              Gap: ${aspirationGap}
            </span>
          </div>
          <p className="text-base text-slate-650 dark:text-slate-355 leading-relaxed font-semibold">
            {aspirationAdvice}
          </p>
        </div>
      </div>

      {/* Role-specific recommendations */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-3">
        <h4 className="text-base font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          {isBuyer ? '🛒' : '🏪'} {isBuyer ? 'Buyer' : 'Seller'} Recommendations
        </h4>
        <ul className="space-y-2 text-base text-slate-600 dark:text-slate-350 font-semibold leading-relaxed">
          {isBuyer ? (
            <>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Your maximum walk-away is <strong className="text-amber-600 dark:text-amber-450">${reservationPrice}</strong>. Do not exceed this.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Aim for <strong className="text-emerald-650 dark:text-emerald-400">${aspirationPrice}</strong> or lower — this is your ideal target.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Your BATNA (<strong className="text-emerald-700 dark:text-emerald-300">${batna}</strong>) is your fallback — the better it is, the more negotiating power you have.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Keep your reservation price hidden — reveal only as a last resort.</span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Your minimum acceptable is <strong className="text-amber-600 dark:text-amber-450">${reservationPrice}</strong>. Never go below this.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Target <strong className="text-emerald-650 dark:text-emerald-400">${aspirationPrice}</strong> or higher as your ideal outcome.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Your BATNA (<strong className="text-emerald-700 dark:text-emerald-300">${batna}</strong>) is your alternative — strengthen it to negotiate from a position of power.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>Anchor high — your first offer sets the tone for the negotiation.</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Info footer */}
      <div className="text-base font-medium text-slate-505 dark:text-slate-400 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-4 shadow-sm">
        <p><strong>ZOPA</strong> (Zone of Possible Agreement) exists when the buyer's maximum and seller's minimum overlap. A wider ZOPA means more room for a mutually acceptable deal. Adjust your parameters above to explore different scenarios.</p>
      </div>

      {/* ── NEW: Break‑Even Analysis ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            📈 Break‑Even Analysis
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Determine the number of units you need to sell to cover all fixed costs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-medium text-slate-700 dark:text-slate-300">Sale Price per Unit (€)</label>
            <input type="number" value={bePrice} onChange={(e) => setBePrice(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 dark:text-slate-300">Variable Cost per Unit (€)</label>
            <input type="number" value={beVariableCost} onChange={(e) => setBeVariableCost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-700 dark:text-slate-300">Total Fixed Costs (€)</label>
            <input type="number" value={beFixedCost} onChange={(e) => setBeFixedCost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base uppercase tracking-wider font-bold text-slate-500">Break‑Even Units</p>
            <p className={`text-lg font-bold mt-0.5 ${isFinite(beUnits) ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {isFinite(beUnits) ? beUnits : '∞'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
            <p className="text-base uppercase tracking-wider font-bold text-slate-500">Break‑Even Revenue</p>
            <p className={`text-lg font-bold mt-0.5 ${isFinite(beRevenue) ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {isFinite(beRevenue) ? `€${beRevenue.toLocaleString()}` : '∞'}
            </p>
          </div>
        </div>
      </div>

      {/* ── NEW: NPV Calculator ── */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 space-y-5 shadow-sm">
        <div>
          <h4 className="text-base font-bold text-slate-400 dark:text-slate-555 uppercase tracking-wider">
            💰 Net Present Value (NPV) Calculator
          </h4>
          <p className="text-base text-slate-400 dark:text-slate-500 font-medium leading-normal mt-1">
            Evaluate an investment by discounting future cash flows at the required rate of return.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-medium">Initial Investment (€)</label>
            <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base font-medium">Discount Rate (%)</label>
            <input type="number" value={discountRate} onChange={(e) => setDiscountRate(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>

        {/* Cash flows (up to 5 years, editable) */}
        <div className="space-y-2">
          {cashFlows.map((cf, i) => (
            <div key={i} className="flex items-center gap-2">
              <label className="text-base w-24">Year {i + 1} cash flow:</label>
              <input
                type="number"
                value={cf}
                onChange={(e) => {
                  const newCFs = [...cashFlows];
                  newCFs[i] = Number(e.target.value);
                  setCashFlows(newCFs);
                }}
                className="flex-1 border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-lg p-3 text-center">
          <p className="text-base uppercase tracking-wider font-bold text-slate-500">NPV</p>
          <p className={`text-lg font-bold mt-0.5 ${npv >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            € {npv.toFixed(2)}
          </p>
          <p className="text-base font-semibold text-slate-400 mt-0.5">
            {npv >= 0 ? '✅ Investment adds value' : '❌ Investment destroys value'}
          </p>
        </div>
      </div>

      {/* --- NEW SECTION: Inventory Costing (FIFO, LIFO, Weighted Average) --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Inventory Costing (FIFO, LIFO, Weighted Average)</h2>
        <p className="mb-2">
          Compute Cost of Goods Sold and Ending Inventory under three common methods.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label className="block text-base">Beginning Units</label>
            <input type="number" value={beginningUnits} onChange={(e) => setBeginningUnits(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Beginning Cost/unit</label>
            <input type="number" value={beginningCost} onChange={(e) => setBeginningCost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div></div>
          <div>
            <label className="block text-base">Purchase 1 Units</label>
            <input type="number" value={purchase1Units} onChange={(e) => setPurchase1Units(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Purchase 1 Cost/unit</label>
            <input type="number" value={purchase1Cost} onChange={(e) => setPurchase1Cost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div></div>
          <div>
            <label className="block text-base">Purchase 2 Units</label>
            <input type="number" value={purchase2Units} onChange={(e) => setPurchase2Units(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Purchase 2 Cost/unit</label>
            <input type="number" value={purchase2Cost} onChange={(e) => setPurchase2Cost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div></div>
          <div>
            <label className="block text-base">Units Sold</label>
            <input type="number" value={soldUnits} onChange={(e) => setSoldUnits(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div></div><div></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-base font-bold">FIFO</p>
            <p>COGS: €{fifoCogs.toFixed(2)}</p>
            <p>Ending Inv: €{(totalCost - fifoCogs).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-base font-bold">LIFO</p>
            <p>COGS: €{lifoCogs.toFixed(2)}</p>
            <p>Ending Inv: €{(totalCost - lifoCogs).toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <p className="text-base font-bold">Weighted Average</p>
            <p>Avg Cost/unit: €{avgCost.toFixed(2)}</p>
            <p>COGS: €{waCogs.toFixed(2)}</p>
            <p>Ending Inv: €{waEnding.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: Economic Order Quantity (EOQ) --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Economic Order Quantity (EOQ)</h2>
        <p className="mb-2">
          Determine the optimal order quantity that minimizes total inventory costs.
        </p>
        <p className="mb-4 font-mono">
          EOQ = √(2 × Annual Demand × Order Cost / Carrying Cost per Unit)
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-base">Annual Demand (units)</label>
            <input type="number" value={annualDemand} onChange={(e) => setAnnualDemand(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Order Cost (€ per order)</label>
            <input type="number" value={orderCost} onChange={(e) => setOrderCost(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Carrying Cost (€/unit/year)</label>
            <input type="number" value={carryingCostPerUnit} onChange={(e) => setCarryingCostPerUnit(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>
        <p className="text-lg font-semibold">EOQ: <span className="text-blue-600">{isFinite(eoq) ? eoq.toFixed(2) : '∞'}</span> units</p>
        <p className="text-lg font-semibold">Orders per year: <span className="text-blue-600">{isFinite(annualOrders) ? annualOrders.toFixed(2) : '∞'}</span></p>
        <p className="text-lg font-semibold">Total Annual Inventory Cost: € <span className="text-blue-600">{isFinite(totalAnnualInventoryCost) ? totalAnnualInventoryCost.toFixed(2) : '∞'}</span></p>
      </div>

      {/* --- NEW SECTION: Inventory Carrying Cost --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Inventory Carrying Cost</h2>
        <p className="mb-2">
          Calculate the annual cost of holding inventory, including storage, insurance, and opportunity cost.
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base">Average Inventory Value (€)</label>
            <input type="number" value={avgInventoryValue} onChange={(e) => setAvgInventoryValue(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-base">Carrying Cost Percentage (%)</label>
            <input type="number" value={carryingCostPct} onChange={(e) => setCarryingCostPct(Number(e.target.value))} className="w-full border rounded px-2 py-1" />
          </div>
        </div>
        <p className="text-lg font-semibold">Annual Carrying Cost: € <span className="text-blue-600">{carryingCost.toFixed(2)}</span></p>
      </div>
    </div>
  );
}
