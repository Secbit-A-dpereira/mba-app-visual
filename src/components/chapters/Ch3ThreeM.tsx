'use client';

import { useState } from 'react';

export default function Ch3ThreeM() {
  // Management state
  const [okrScore, setOkrScore]   = useState(50);
  // Marketing state
  const [conversionRate, setConversionRate] = useState(2); // percent
  const [traffic, setTraffic] = useState(1000);
  // Money state
  const [revenue, setRevenue] = useState(50000);
  const [cost, setCost] = useState(30000);

  // derived calculations
  const okrEffectiveness = okrScore; // placeholder
  const leads = Math.round(traffic * conversionRate / 100);
  const profit = revenue - cost;
  const roi = cost > 0 ? ((profit / cost) * 100).toFixed(2) : 0;

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Chapter 3: Os 3 M&apos;s</h2>
      <p className="text-gray-600">
        Explora as frameworks de Gestão (Management), Marketing e Money.
      </p>

      {/* Management card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">📊 Gestão (Management)</h3>
        <p className="text-base text-gray-500 mb-4">
          OKRs (Objectives and Key Results) – framework para alinhar objectivos. 
          Fórmula: Eficácia = % de Key Results atingidos.
        </p>
        <label className="block mb-1 text-base font-medium">
          % de Key Results atingidos: {okrScore}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={okrScore}
          onChange={(e) => setOkrScore(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-3 p-3 bg-blue-50 rounded">
          <span className="font-semibold">Eficácia estimada:</span> {okrEffectiveness}%
        </div>
      </div>

      {/* Marketing card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">📢 Marketing</h3>
        <p className="text-base text-gray-500 mb-4">
          Funil de conversão – AIDA (Atenção, Interesse, Desejo, Acção). 
          Fórmula: Leads = Tráfego × Taxa de Conversão (%).
        </p>
        <label className="block mb-1 text-base font-medium">
          Tráfego mensal: {traffic}
        </label>
        <input
          type="range"
          min="100"
          max="100000"
          step="100"
          value={traffic}
          onChange={(e) => setTraffic(Number(e.target.value))}
          className="w-full"
        />
        <label className="block mt-3 mb-1 text-base font-medium">
          Taxa de conversão: {conversionRate}%
        </label>
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={conversionRate}
          onChange={(e) => setConversionRate(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-3 p-3 bg-green-50 rounded">
          <span className="font-semibold">Leads gerados:</span> {leads}
        </div>
      </div>

      {/* Money card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-2">💰 Money</h3>
        <p className="text-base text-gray-500 mb-4">
          ROI – Retorno sobre Investimento. Fórmula: ROI = (Lucro / Custo) × 100.
        </p>
        <label className="block mb-1 text-base font-medium">
          Receita: ${revenue}
        </label>
        <input
          type="range"
          min="0"
          max="1000000"
          step="1000"
          value={revenue}
          onChange={(e) => setRevenue(Number(e.target.value))}
          className="w-full"
        />
        <label className="block mt-3 mb-1 text-base font-medium">
          Custo: ${cost}
        </label>
        <input
          type="range"
          min="0"
          max="500000"
          step="1000"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-3 p-3 bg-yellow-50 rounded">
          <span className="font-semibold">Lucro:</span> ${profit}
          <br />
          <span className="font-semibold">ROI:</span> {roi}%
        </div>
      </div>
    </div>
  );
}
