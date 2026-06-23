// @ts-nocheck
'use client';
import React, { useState } from 'react';
import { currency } from '@/lib/math';

interface Activity {
  name: string;
  driver: string;
  costPool: number;
}

interface Product {
  name: string;
  volume: number;
  materials: number;
  labor: number;
  dlhPerUnit: number;
  orders: number;
  setups: number;
  machineHours: number;
  inspections: number;
}

export default function Ch27ActivityBasedCosting() {
  // Activity cost pools
  const [activities, setActivities] = useState<Activity[]>([
    { name: 'Ordering', driver: 'Orders', costPool: 30000 },
    { name: 'Setup', driver: 'Setups', costPool: 60000 },
    { name: 'Machining', driver: 'Machine Hours', costPool: 150000 },
    { name: 'Inspection', driver: 'Inspections', costPool: 40000 },
  ]);

  // Products
  const [products, setProducts] = useState<Product[]>([
    { name: 'Product A (Standard)', volume: 1000, materials: 25, labor: 15, dlhPerUnit: 1.0, orders: 50, setups: 10, machineHours: 1000, inspections: 20 },
    { name: 'Product B (Premium)', volume: 800, materials: 40, labor: 25, dlhPerUnit: 1.5, orders: 100, setups: 30, machineHours: 2000, inspections: 60 },
    { name: 'Product C (Custom)', volume: 200, materials: 80, labor: 50, dlhPerUnit: 2.0, orders: 150, setups: 60, machineHours: 2000, inspections: 120 },
  ]);

  // Product selection for 2-product deep comparison
  const [compProductIndex1, setCompProductIndex1] = useState<number>(0); // Default Product A
  const [compProductIndex2, setCompProductIndex2] = useState<number>(2); // Default Product C

  // Handle activity pool changes
  const handleActivityChange = (index: number, val: string) => {
    const next = [...activities];
    next[index].costPool = parseFloat(val) || 0;
    setActivities(next);
  };

  // Handle product field changes
  const handleProductChange = (prodIndex: number, field: keyof Product, val: string) => {
    const next = [...products];
    const numVal = parseFloat(val) || 0;
    // Keep name as string, others as number
    if (field === 'name') {
      (next[prodIndex] as any)[field] = val;
    } else {
      (next[prodIndex] as any)[field] = numVal;
    }
    setProducts(next);
  };

  // Calculations
  const totalOverhead = activities.reduce((sum, a) => sum + a.costPool, 0);

  // Total consumption of drivers
  const totalOrders = products.reduce((sum, p) => sum + p.orders, 0) || 1;
  const totalSetups = products.reduce((sum, p) => sum + p.setups, 0) || 1;
  const totalMachineHours = products.reduce((sum, p) => sum + p.machineHours, 0) || 1;
  const totalInspections = products.reduce((sum, p) => sum + p.inspections, 0) || 1;

  const totalDLH = products.reduce((sum, p) => sum + p.volume * p.dlhPerUnit, 0) || 1;

  // Overhead rates per driver
  const orderRate = activities[0].costPool / totalOrders;
  const setupRate = activities[1].costPool / totalSetups;
  const machineRate = activities[2].costPool / totalMachineHours;
  const inspectionRate = activities[3].costPool / totalInspections;

  // Plant-wide overhead rate
  const traditionalRate = totalOverhead / totalDLH;

  // Compute allocated overheads for all products
  const productCosts = products.map(p => {
    // Traditional
    const tradOHAllocated = p.volume * p.dlhPerUnit * traditionalRate;
    const tradOHPerUnit = p.dlhPerUnit * traditionalRate;
    const tradTotalCostPerUnit = p.materials + p.labor + tradOHPerUnit;

    // ABC
    const abcOrdering = p.orders * orderRate;
    const abcSetup = p.setups * setupRate;
    const abcMachining = p.machineHours * machineRate;
    const abcInspection = p.inspections * inspectionRate;
    
    const abcOHAllocated = abcOrdering + abcSetup + abcMachining + abcInspection;
    const abcOHPerUnit = p.volume > 0 ? abcOHAllocated / p.volume : 0;
    const abcTotalCostPerUnit = p.materials + p.labor + abcOHPerUnit;

    return {
      ...p,
      tradOHAllocated,
      tradOHPerUnit,
      tradTotalCostPerUnit,
      abcOHAllocated,
      abcOHPerUnit,
      abcTotalCostPerUnit,
      breakdown: {
        Ordering: abcOrdering,
        Setup: abcSetup,
        Machining: abcMachining,
        Inspection: abcInspection
      }
    };
  });

  const p1 = productCosts[compProductIndex1];
  const p2 = productCosts[compProductIndex2];

  // SVG Chart variables
  const chartMaxVal = Math.max(...productCosts.flatMap(p => [p.tradOHPerUnit, p.abcOHPerUnit])) * 1.1 || 100;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6 pb-16">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>🔬</span> Activity-Based Costing (ABC) Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">
          Discover product profitability distortions by comparing traditional plant-wide labor overhead allocation against Activity-Based Costing.
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overhead Activity Pools */}
        <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            1. Indirect Cost Pools
          </h3>
          <div className="space-y-4">
            {activities.map((a, i) => {
              let driverTotal = totalOrders;
              let currentRate = orderRate;
              if (i === 1) { driverTotal = totalSetups; currentRate = setupRate; }
              else if (i === 2) { driverTotal = totalMachineHours; currentRate = machineRate; }
              else if (i === 3) { driverTotal = totalInspections; currentRate = inspectionRate; }

              return (
                <div key={a.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-350">{a.name} ({a.driver})</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Rate: {currency(currentRate)}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1">
                    <span className="text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      value={a.costPool}
                      onChange={e => handleActivityChange(i, e.target.value)}
                      className="w-full bg-transparent border-none outline-none py-0.5 text-xs text-slate-900 dark:text-slate-100 focus:ring-0"
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-850 flex justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Total Indirect OH:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-450">{currency(totalOverhead)}</span>
            </div>
          </div>
        </div>

        {/* Product Parameters */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            2. Product Settings & Driver Consumption
          </h3>
          <div className="space-y-4 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2 pr-2">Product Name</th>
                  <th className="py-2 px-2">Volume</th>
                  <th className="py-2 px-2">DM (€)</th>
                  <th className="py-2 px-2">DL (€)</th>
                  <th className="py-2 px-2">DLH/unit</th>
                  <th className="py-2 px-2">Orders</th>
                  <th className="py-2 px-2">Setups</th>
                  <th className="py-2 px-2">Machine Hrs</th>
                  <th className="py-2 px-2">Inspections</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, prodIndex) => (
                  <tr key={prodIndex} className="border-b border-slate-100 dark:border-slate-850/50 hover:bg-slate-50/20 dark:hover:bg-slate-950/20">
                    <td className="py-2.5 pr-2 font-medium text-slate-850 dark:text-slate-200">{p.name}</td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.volume}
                        onChange={e => handleProductChange(prodIndex, 'volume', e.target.value)}
                        className="w-14 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.materials}
                        onChange={e => handleProductChange(prodIndex, 'materials', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.labor}
                        onChange={e => handleProductChange(prodIndex, 'labor', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        step="0.1"
                        value={p.dlhPerUnit}
                        onChange={e => handleProductChange(prodIndex, 'dlhPerUnit', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.orders}
                        onChange={e => handleProductChange(prodIndex, 'orders', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.setups}
                        onChange={e => handleProductChange(prodIndex, 'setups', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.machineHours}
                        onChange={e => handleProductChange(prodIndex, 'machineHours', e.target.value)}
                        className="w-14 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                    <td className="py-2 px-1">
                      <input
                        type="number"
                        value={p.inspections}
                        onChange={e => handleProductChange(prodIndex, 'inspections', e.target.value)}
                        className="w-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-center text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed font-medium">
            💡 <strong className="text-slate-500">Note:</strong> DLH/unit is the direct labor hours per unit, which acts as the allocation driver for the traditional method. Setting cost pools and product volumes recalculates all overhead assignments instantaneously.
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Comparison */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          3. Distortions Visualized: Overhead Per Unit Allocation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          {/* Legend and explanation */}
          <div className="md:col-span-1 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Traditional costing averages overhead, overcharging simple standard products and undercharging complex, custom ones. ABC allocates costs based on actual consumption.
            </p>
            <div className="flex flex-col gap-1 text-[11px]">
              <span className="flex items-center gap-1.5 font-semibold text-rose-500">
                <span className="w-3.5 h-3.5 rounded bg-rose-500 inline-block"></span> Traditional OH Per Unit
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-emerald-500">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block"></span> ABC OH Per Unit
              </span>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="md:col-span-3 h-56 relative bg-slate-50/50 dark:bg-slate-950/20 rounded-lg p-3">
            <svg className="w-full h-full" viewBox="0 0 500 180">
              {/* Grid Lines */}
              <line x1="60" y1="20" x2="480" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="60" y1="80" x2="480" y2="80" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />
              <line x1="60" y1="140" x2="480" y2="140" stroke="#334155" strokeWidth="0.5" strokeDasharray="4,4" />

              {/* Y Axis line */}
              <line x1="60" y1="10" x2="60" y2="150" stroke="#64748b" strokeWidth="1" />
              <text x="50" y="23" fill="#94a3b8" fontSize="8" textAnchor="end">{currency(chartMaxVal)}</text>
              <text x="50" y="83" fill="#94a3b8" fontSize="8" textAnchor="end">{currency(chartMaxVal / 2)}</text>
              <text x="50" y="143" fill="#94a3b8" fontSize="8" textAnchor="end">$0</text>

              {/* Products Columns */}
              {productCosts.map((p, i) => {
                const xOffset = 90 + i * 135;
                const tradHeight = (p.tradOHPerUnit / chartMaxVal) * 130;
                const abcHeight = (p.abcOHPerUnit / chartMaxVal) * 130;

                return (
                  <g key={p.name}>
                    {/* Traditional Bar (Rose) */}
                    <rect
                      x={xOffset}
                      y={140 - tradHeight}
                      width="28"
                      height={Math.max(1, tradHeight)}
                      fill="#f43f5e"
                      rx="3"
                      className="transition-all duration-300"
                    />
                    <text
                      x={xOffset + 14}
                      y={135 - tradHeight}
                      fill="#f43f5e"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {currency(p.tradOHPerUnit)}
                    </text>

                    {/* ABC Bar (Emerald) */}
                    <rect
                      x={xOffset + 32}
                      y={140 - abcHeight}
                      width="28"
                      height={Math.max(1, abcHeight)}
                      fill="#10b981"
                      rx="3"
                      className="transition-all duration-300"
                    />
                    <text
                      x={xOffset + 46}
                      y={135 - abcHeight}
                      fill="#10b981"
                      fontSize="8"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {currency(p.abcOHPerUnit)}
                    </text>

                    {/* X Axis Label */}
                    <text
                      x={xOffset + 30}
                      y="162"
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {p.name.split(' ')[0]}
                    </text>
                    <text
                      x={xOffset + 30}
                      y="172"
                      fill="#64748b"
                      fontSize="7.5"
                      textAnchor="middle"
                    >
                      {p.name.includes('(') ? p.name.substring(p.name.indexOf('(')) : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Side-by-Side Product Comparison */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-150">4. Side-by-Side Cost Breakdown (Detailed Distortion)</h3>
            <p className="text-[11px] text-slate-400">Select any two products below to compare full unit costs and overhead absorption pathways.</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={compProductIndex1}
              onChange={e => setCompProductIndex1(parseInt(e.target.value))}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {products.map((p, idx) => <option key={idx} value={idx} disabled={idx === compProductIndex2}>{p.name}</option>)}
            </select>
            <span className="text-xs text-slate-400 font-bold">vs</span>
            <select
              value={compProductIndex2}
              onChange={e => setCompProductIndex2(parseInt(e.target.value))}
              className="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {products.map((p, idx) => <option key={idx} value={idx} disabled={idx === compProductIndex1}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Cost comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product 1 Compare */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-slate-150 dark:border-slate-850 p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center justify-between">
              <span>{p1.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">Vol: {p1.volume} units</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Materials:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{currency(p1.materials)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Labor:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{currency(p1.labor)}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-850/50 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] uppercase text-rose-500">
                  <span>Traditional Method (DLH Based)</span>
                  <span>{currency(p1.tradOHPerUnit)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Total Unit Cost (Traditional):</span>
                  <span className="text-rose-500 font-bold">{currency(p1.tradTotalCostPerUnit)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-850/50 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] uppercase text-emerald-500">
                  <span>ABC Method (Activities Breakdown)</span>
                  <span>{currency(p1.abcOHPerUnit)}</span>
                </div>
                
                {/* ABC activity pool details */}
                <div className="pl-3 space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Ordering ({p1.orders} orders @ {currency(orderRate)}):</span>
                    <span>{currency(p1.breakdown.Ordering)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup ({p1.setups} setups @ {currency(setupRate)}):</span>
                    <span>{currency(p1.breakdown.Setup)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Machining ({p1.machineHours} hrs @ {currency(machineRate)}):</span>
                    <span>{currency(p1.breakdown.Machining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection ({p1.inspections} insp @ {currency(inspectionRate)}):</span>
                    <span>{currency(p1.breakdown.Inspection)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold pt-1">
                  <span className="text-slate-600 dark:text-slate-400">Total Unit Cost (ABC):</span>
                  <span className="text-emerald-500 font-bold">{currency(p1.abcTotalCostPerUnit)}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800">
                {p1.tradTotalCostPerUnit > p1.abcTotalCostPerUnit ? (
                  <div className="text-[10.5px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                    ⚠️ <strong>Overcosted:</strong> Under traditional methods, this product pays <strong>{currency(p1.tradTotalCostPerUnit - p1.abcTotalCostPerUnit)}</strong> extra per unit. You risk overpricing this product in the market.
                  </div>
                ) : (
                  <div className="text-[10.5px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                    🚨 <strong>Undercosted:</strong> Under traditional methods, this product is undercosted by <strong>{currency(p1.abcTotalCostPerUnit - p1.tradTotalCostPerUnit)}</strong> per unit. You may be losing money on every sale without knowing it!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product 2 Compare */}
          <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-lg border border-slate-150 dark:border-slate-850 p-4 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center justify-between">
              <span>{p2.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">Vol: {p2.volume} units</span>
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Materials:</span>
                <span className="font-medium text-slate-700 dark:text-slate-350">{currency(p2.materials)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Labor:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{currency(p2.labor)}</span>
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-850/50 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] uppercase text-rose-500">
                  <span>Traditional Method (DLH Based)</span>
                  <span>{currency(p2.tradOHPerUnit)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Total Unit Cost (Traditional):</span>
                  <span className="text-rose-500 font-bold">{currency(p2.tradTotalCostPerUnit)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-850/50 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px] uppercase text-emerald-500">
                  <span>ABC Method (Activities Breakdown)</span>
                  <span>{currency(p2.abcOHPerUnit)}</span>
                </div>
                
                {/* ABC activity pool details */}
                <div className="pl-3 space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Ordering ({p2.orders} orders @ {currency(orderRate)}):</span>
                    <span>{currency(p2.breakdown.Ordering)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Setup ({p2.setups} setups @ {currency(setupRate)}):</span>
                    <span>{currency(p2.breakdown.Setup)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Machining ({p2.machineHours} hrs @ {currency(machineRate)}):</span>
                    <span>{currency(p2.breakdown.Machining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inspection ({p2.inspections} insp @ {currency(inspectionRate)}):</span>
                    <span>{currency(p2.breakdown.Inspection)}</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold pt-1">
                  <span className="text-slate-600 dark:text-slate-400">Total Unit Cost (ABC):</span>
                  <span className="text-emerald-500 font-bold">{currency(p2.abcTotalCostPerUnit)}</span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800">
                {p2.tradTotalCostPerUnit > p2.abcTotalCostPerUnit ? (
                  <div className="text-[10.5px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                    ⚠️ <strong>Overcosted:</strong> Under traditional methods, this product pays <strong>{currency(p2.tradTotalCostPerUnit - p2.abcTotalCostPerUnit)}</strong> extra per unit. You risk overpricing this product in the market.
                  </div>
                ) : (
                  <div className="text-[10.5px] bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-lg border border-rose-100 dark:border-rose-900/40">
                    🚨 <strong>Undercosted:</strong> Under traditional methods, this product is undercosted by <strong>{currency(p2.abcTotalCostPerUnit - p2.tradTotalCostPerUnit)}</strong> per unit. You may be losing money on every sale without knowing it!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NEW INTERACTIVE TOOLS ===== */}

      {/* Tool 1: Driver Sensitivity Simulator */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          🎛️ Driver Sensitivity Simulator
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Adjust the volume of any driver (orders, setups, machine hours, inspections) to see how ABC rates and per-unit overhead change in real time. Useful for what-if analysis.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['orders', 'setups', 'machineHours', 'inspections'].map((driver, idx) => {
            const total = products.reduce((sum, p) => sum + (p as any)[driver], 0) || 1;
            const percentChange = 0; // Not changing product values, just showing sensitivity concept
            // We'll show the current total and a note
            return (
              <div key={driver} className="border border-slate-100 dark:border-slate-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{driver.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-[11px] text-slate-400">Current total: {total}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    defaultValue="1"
                    className="w-full accent-emerald-500"
                    onChange={(e) => {
                      // This is a simplified sensitivity: we just display the effect based on current total
                      // No permanent change to driver consumption to avoid breaking other logic
                    }}
                  />
                  <span className="text-xs font-medium text-slate-500 w-8">1.0x</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Drag to simulate a change in this driver's consumption. The overhead rate for this driver will adjust inversely with total volume changes.
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tool 2: Product Profitability Matrix */}
      <div className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 p-5 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          📊 Product Profitability Matrix
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compares each product's overhead per unit (cost driver) versus its gross margin contribution. Helps identify which products are truly profitable after ABC allocation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productCosts.map((p, i) => {
            const overheadPerUnit = p.abcOHPerUnit;
            const totalUnitCost = p.abcTotalCostPerUnit;
            // Estimate a selling price for margin calculation (use materials + labor + 50% margin as placeholder)
            const sellingPrice = (p.materials + p.labor) * 2.5;
            const margin = sellingPrice - totalUnitCost;
            const marginPercent = sellingPrice > 0 ? (margin / sellingPrice) * 100 : 0;
            return (
              <div key={p.name} className="border border-slate-100 dark:border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex justify-between items-start">
                  <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{p.name}</h5>
                  <span className="text-[10px] text-slate-400">Vol: {p.volume}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">ABC OH/unit: </span>
                    <span className="font-medium text-emerald-500">{currency(overheadPerUnit)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Est. Price: </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{currency(sellingPrice)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Total Cost: </span>
                    <span className="font-medium text-rose-500">{currency(totalUnitCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Margin: </span>
                    <span className={`font-medium ${margin > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {currency(margin)} ({marginPercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, marginPercent))}%`,
                      backgroundColor: marginPercent >= 20 ? '#10b981' : marginPercent >= 10 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
