import React, { useState } from 'react';

const Ch4CostVolumeProfit: React.FC = () => {
  // --- existing variables (kept from original) ---
  const [fixedCosts, setFixedCosts] = useState(50000);
  const [price, setPrice] = useState(100);
  const [variableCost, setVariableCost] = useState(60);

  const contributionMargin = price - variableCost;
  const breakEvenUnits = fixedCosts / contributionMargin;
  const breakEvenRevenue = breakEvenUnits * price;

  // --- new: Margem de Segurança ---
  const [actualSalesRevenue, setActualSalesRevenue] = useState(100000);
  const safetyMargin = ((actualSalesRevenue - breakEvenRevenue) / actualSalesRevenue) * 100;

  // --- new: Alavancagem Operacional ---
  const [salesUnits, setSalesUnits] = useState(2000);
  const totalContributionMargin = salesUnits * contributionMargin;
  const operatingIncome = totalContributionMargin - fixedCosts;
  const operatingLeverage = totalContributionMargin / operatingIncome;

  // --- new: Mix de Produtos ---
  const [priceA, setPriceA] = useState(80);
  const [varCostA, setVarCostA] = useState(40);
  const [priceB, setPriceB] = useState(120);
  const [varCostB, setVarCostB] = useState(50);
  const [mixA, setMixA] = useState(0.6);

  const cmA = priceA - varCostA;
  const cmB = priceB - varCostB;
  const weightedCM = mixA * cmA + (1 - mixA) * cmB;
  const bepTotalUnits = fixedCosts / weightedCM;
  const bepUnitsA = bepTotalUnits * mixA;
  const bepUnitsB = bepTotalUnits * (1 - mixA);

  // --- NEW: Target Profit (Pre‑tax) ---
  const [targetProfit, setTargetProfit] = useState(0);
  const targetUnits = (fixedCosts + targetProfit) / contributionMargin;
  const targetRevenue = targetUnits * price;

  // --- NEW: Profit Sensitivity Analysis ---
  const [priceChangePct, setPriceChangePct] = useState(0);
  const [varCostChangePct, setVarCostChangePct] = useState(0);
  const [fixedCostChangePct, setFixedCostChangePct] = useState(0);

  const newPrice = price * (1 + priceChangePct / 100);
  const newVarCost = variableCost * (1 + varCostChangePct / 100);
  const newFixedCosts = fixedCosts * (1 + fixedCostChangePct / 100);
  const newCM = newPrice - newVarCost;
  const newProfit = (newCM * salesUnits) - newFixedCosts;
  const profitChange = newProfit - operatingIncome;

  // --- NOVAS FERRAMENTAS (adicionadas por referência dos livros) ---

  // 1. Break‑Even com Impostos
  const [taxRate, setTaxRate] = useState(30); // percentagem
  const breakEvenUnitsAfterTax = fixedCosts / (contributionMargin * (1 - taxRate / 100));
  const breakEvenRevenueAfterTax = breakEvenUnitsAfterTax * price;

  // 2. Lucro Alvo Após Impostos
  const [targetProfitAfterTax, setTargetProfitAfterTax] = useState(20000);
  const preTaxProfitNeeded = targetProfitAfterTax / (1 - taxRate / 100);
  const targetUnitsAfterTax = (fixedCosts + preTaxProfitNeeded) / contributionMargin;
  const targetRevenueAfterTax = targetUnitsAfterTax * price;

  // 3. Análise de Sensibilidade Multi‑fator (What‑if combinado)
  const [sensitivityPriceChange, setSensitivityPriceChange] = useState(0); // %
  const [sensitivityVCChange, setSensitivityVCChange] = useState(0);     // %
  const [sensitivityFCChange, setSensitivityFCChange] = useState(0);     // %
  const [sensitivityVolumeChange, setSensitivityVolumeChange] = useState(0); // %

  const newPriceS = price * (1 + sensitivityPriceChange / 100);
  const newVCS = variableCost * (1 + sensitivityVCChange / 100);
  const newFCS = fixedCosts * (1 + sensitivityFCChange / 100);
  const newVolume = salesUnits * (1 + sensitivityVolumeChange / 100);
  const newCMS = newPriceS - newVCS;
  const newProfitS = (newCMS * newVolume) - newFCS;
  const profitChangeS = newProfitS - operatingIncome;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Capítulo 4: CVP (Cost‑Volume‑Profit)</h1>

      {/* --- existing: Break‑Even --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Ponto de Equilíbrio (Break‑Even)</h2>
        <p className="mb-2">
          O ponto de equilíbrio é o nível de vendas onde a receita cobre todos os custos fixos e
          variáveis, resultando em lucro zero.
        </p>
        <p className="mb-4 font-mono">Fórmula: BEP (unidades) = Custos Fixos / (Preço - Custo Variável)</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium">Custos Fixos (€)</label>
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={fixedCosts}
              onChange={(e) => setFixedCosts(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            max="200000"
            step="1000"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span className="ml-2">{fixedCosts}</span>
          </div>
          <div>
            <label className="block text-base font-medium">Preço Unitário (€)</label>
            <input
              type="range"
              min="1"
              max="500"
              step="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="1"
            max="500"
            step="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span className="ml-2">{price}</span>
          </div>
          <div>
            <label className="block text-base font-medium">Custo Variável Unitário (€)</label>
            <input
              type="range"
              min="0"
              max={price - 1}
              step="1"
              value={variableCost}
              onChange={(e) => setVariableCost(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            step="1"
            value={variableCost}
            onChange={(e) => setVariableCost(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span className="ml-2">{variableCost}</span>
          </div>
        </div>
        <p className="text-lg font-semibold">
          BEP (unidades): <span className="text-blue-600">{breakEvenUnits.toFixed(2)}</span>
        </p>
        <p className="text-lg font-semibold">
          BEP (receita): € <span className="text-blue-600">{breakEvenRevenue.toFixed(2)}</span>
        </p>
      </div>

      {/* --- existing: Margem de Contribuição --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Margem de Contribuição</h2>
        <p className="mb-2">
          A margem de contribuição é a diferença entre o preço e o custo variável unitário.
          Representa quanto cada unidade contribui para cobrir os custos fixos e gerar lucro.
        </p>
        <p className="mb-4 font-mono">Margem de Contribuição Unitária = Preço - Custo Variável</p>
        <p className="text-lg font-semibold">
          MCU: € <span className="text-blue-600">{contributionMargin.toFixed(2)}</span>
        </p>
        <p className="text-lg font-semibold">
          Rácio MC: <span className="text-blue-600">{((contributionMargin / price) * 100).toFixed(2)}%</span>
        </p>
      </div>

      {/* --- existing: Margem de Segurança --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Margem de Segurança</h2>
        <p className="mb-2">
          A margem de segurança mede o quanto as vendas podem cair antes de atingir o ponto de
          equilíbrio. Calcula-se como (Vendas reais - Vendas no BEP) / Vendas reais.
        </p>
        <p className="mb-4 font-mono">
          Fórmula: Margem de Segurança (%) = (Vendas Reais - Vendas BEP) / Vendas Reais × 100
        </p>
        <div>
          <label className="block text-base font-medium">Vendas Reais (€)</label>
          <input
            type="range"
            min="0"
            max="300000"
            step="1000"
            value={actualSalesRevenue}
            onChange={(e) => setActualSalesRevenue(Number(e.target.value))}
            className="w-full md:hidden"
          />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            max="300000"
            step="1000"
            value={actualSalesRevenue}
            onChange={(e) => setActualSalesRevenue(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="ml-2">{actualSalesRevenue}</span>
        </div>
        <p className="text-lg font-semibold mt-2">
          Margem de Segurança:{' '}
          <span className={safetyMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
            {safetyMargin.toFixed(2)}%
          </span>
        </p>
      </div>

      {/* --- existing: Alavancagem Operacional --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Alavancagem Operacional</h2>
        <p className="mb-2">
          A alavancagem operacional mede a sensibilidade do lucro operacional a variações nas
          vendas. É calculada como Margem de Contribuição Total / Lucro Operacional.
        </p>
        <p className="mb-4 font-mono">Fórmula: Grau de Alavancagem = MC Total / Lucro Operacional</p>
        <div>
          <label className="block text-base font-medium">Quantidade Vendida (unidades)</label>
          <input
            type="range"
            min={breakEvenUnits}
            max="5000"
            step="10"
            value={salesUnits}
            onChange={(e) => setSalesUnits(Number(e.target.value))}
            className="w-full md:hidden"
          />
          {/* Desktop input */}
          <input
            type="number"
            max="5000"
            step="10"
            value={salesUnits}
            onChange={(e) => setSalesUnits(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="ml-2">{salesUnits}</span>
        </div>
        <p className="text-lg font-semibold mt-2">
          MC Total: € <span className="text-blue-600">{totalContributionMargin.toFixed(2)}</span>
        </p>
        <p className="text-lg font-semibold">
          Lucro Operacional: €{' '}
          <span className={operatingIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
            {operatingIncome.toFixed(2)}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Alavancagem:{' '}
          <span className="text-blue-600">
            {isFinite(operatingLeverage) ? operatingLeverage.toFixed(2) : '∞'}
          </span>
        </p>
      </div>

      {/* --- existing: Mix de Produtos --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Mix de Produtos (Break‑Even Multi‑produto)</h2>
        <p className="mb-2">
          Quando uma empresa vende vários produtos, o ponto de equilíbrio depende do mix de vendas.
          Usamos a margem de contribuição média ponderada.
        </p>
        <p className="mb-4 font-mono">
          CM Ponderada = (Mix A × CM A) + ((1 - Mix A) × CM B)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Produto A</h3>
            <div>
              <label className="block text-base">Preço (€)</label>
              <input
                type="range"
                min="1"
                max="500"
                value={priceA}
                onChange={(e) => setPriceA(Number(e.target.value))}
                className="w-full md:hidden"
              />
          {/* Desktop input */}
          <input
            type="number"
            min="1"
            max="500"
            value={priceA}
            onChange={(e) => setPriceA(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
              <span>{priceA}</span>
            </div>
            <div>
              <label className="block text-base">Custo Variável (€)</label>
              <input
                type="range"
                min="0"
                max={priceA - 1}
                value={varCostA}
                onChange={(e) => setVarCostA(Number(e.target.value))}
                className="w-full md:hidden"
              />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            value={varCostA}
            onChange={(e) => setVarCostA(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
              <span>{varCostA}</span>
            </div>
            <p>CM A = {cmA}</p>
          </div>
          <div>
            <h3 className="font-medium">Produto B</h3>
            <div>
              <label className="block text-base">Preço (€)</label>
              <input
                type="range"
                min="1"
                max="500"
                value={priceB}
                onChange={(e) => setPriceB(Number(e.target.value))}
                className="w-full md:hidden"
              />
          {/* Desktop input */}
          <input
            type="number"
            min="1"
            max="500"
            value={priceB}
            onChange={(e) => setPriceB(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
              <span>{priceB}</span>
            </div>
            <div>
              <label className="block text-base">Custo Variável (€)</label>
              <input
                type="range"
                min="0"
                max={priceB - 1}
                value={varCostB}
                onChange={(e) => setVarCostB(Number(e.target.value))}
                className="w-full md:hidden"
              />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            value={varCostB}
            onChange={(e) => setVarCostB(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
              <span>{varCostB}</span>
            </div>
            <p>CM B = {cmB}</p>
          </div>
        </div>
        <div className="mt-2">
          <label className="block text-base font-medium">Mix do Produto A (0‑1):</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={mixA}
            onChange={(e) => setMixA(Number(e.target.value))}
            className="w-full md:hidden"
          />
          {/* Desktop input */}
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={mixA}
            onChange={(e) => setMixA(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span>{mixA.toFixed(2)}</span>
        </div>
        <p className="mt-2 text-lg font-semibold">
          CM Ponderada: € <span className="text-blue-600">{weightedCM.toFixed(2)}</span>
        </p>
        <p className="text-lg font-semibold">
          BEP Total (unidades do bundle):{' '}
          <span className="text-blue-600">
            {isFinite(bepTotalUnits) ? bepTotalUnits.toFixed(2) : '∞'}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Unidades A: <span className="text-blue-600">{isFinite(bepUnitsA) ? bepUnitsA.toFixed(2) : '∞'}</span>
        </p>
        <p className="text-lg font-semibold">
          Unidades B: <span className="text-blue-600">{isFinite(bepUnitsB) ? bepUnitsB.toFixed(2) : '∞'}</span>
        </p>
      </div>

      {/* --- existing: Lucro Alvo (Pre‑tax) --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Lucro Alvo (Target Profit)</h2>
        <p className="mb-2">
          Calcule as unidades ou a receita necessárias para atingir um lucro operacional pretendido.
        </p>
        <p className="mb-4 font-mono">
          Unidades Alvo = (Custos Fixos + Lucro Alvo) / Margem de Contribuição Unitária
        </p>
        <div>
          <label className="block text-base font-medium">Lucro Alvo (€)</label>
          <input
            type="number"
            min="0"
            max="200000"
            step="1000"
            value={targetProfit}
            onChange={(e) => setTargetProfit(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <p className="text-lg font-semibold mt-2">
          Unidades necessárias:{' '}
          <span className="text-blue-600">{isFinite(targetUnits) ? targetUnits.toFixed(2) : '∞'}</span>
        </p>
        <p className="text-lg font-semibold">
          Receita necessária: €{' '}
          <span className="text-blue-600">{isFinite(targetRevenue) ? targetRevenue.toFixed(2) : '∞'}</span>
        </p>
      </div>

      {/* --- NOVO: Break‑Even com Impostos --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Break‑Even com Impostos</h2>
        <p className="mb-2">
          Quando há impostos sobre o lucro, o ponto de equilíbrio em termos de lucro líquido é
          diferente. Considera a taxa de imposto para calcular as unidades necessárias para
          alcançar lucro zero após impostos.
        </p>
        <p className="mb-4 font-mono">
          BEP (após impostos, unidades) = Custos Fixos / (MCU × (1 – Taxa de Imposto))
        </p>
        <div>
          <label className="block text-base font-medium">Taxa de Imposto (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>
        <p className="text-lg font-semibold mt-2">
          BEP (unidades, após impostos):{' '}
          <span className="text-blue-600">
            {isFinite(breakEvenUnitsAfterTax) ? breakEvenUnitsAfterTax.toFixed(2) : '∞'}
          </span>
        </p>
        <p className="text-lg font-semibold">
          BEP (receita, após impostos): €{' '}
          <span className="text-blue-600">
            {isFinite(breakEvenRevenueAfterTax) ? breakEvenRevenueAfterTax.toFixed(2) : '∞'}
          </span>
        </p>
      </div>

      {/* --- NOVO: Lucro Alvo Após Impostos --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Lucro Alvo Após Impostos</h2>
        <p className="mb-2">
          Introduza o lucro líquido desejado (após impostos) e a taxa de imposto para obter as
          unidades/receita necessárias.
        </p>
        <p className="mb-4 font-mono">
          Lucro Pré‑Imposto Necessário = Lucro Líquido Alvo / (1 – Taxa)
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-base font-medium">Lucro Líquido Alvo (€)</label>
            <input
              type="number"
              min="0"
              value={targetProfitAfterTax}
              onChange={(e) => setTargetProfitAfterTax(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-base font-medium">Taxa de Imposto (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>
        <p className="text-lg font-semibold">
          Unidades necessárias:{' '}
          <span className="text-blue-600">{isFinite(targetUnitsAfterTax) ? targetUnitsAfterTax.toFixed(2) : '∞'}</span>
        </p>
        <p className="text-lg font-semibold">
          Receita necessária: €{' '}
          <span className="text-blue-600">{isFinite(targetRevenueAfterTax) ? targetRevenueAfterTax.toFixed(2) : '∞'}</span>
        </p>
      </div>

      {/* --- NOVO: Análise de Sensibilidade Multi‑fator (What‑if) --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Análise de Sensibilidade Multi‑fator</h2>
        <p className="mb-2">
          Simule alterações percentuais simultâneas no preço, custo variável, custos fixos e
          volume de vendas para ver o impacto combinado no lucro operacional.
        </p>
        <p className="mb-4 font-mono">
          Novo Lucro = (Novo Preço – Novo CV) × Novo Volume – Novos Custos Fixos
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium">Δ Preço (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={sensitivityPriceChange}
              onChange={(e) => setSensitivityPriceChange(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={sensitivityPriceChange}
            onChange={(e) => setSensitivityPriceChange(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{sensitivityPriceChange}%</span>
          </div>
          <div>
            <label className="block text-base font-medium">Δ Custo Variável (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={sensitivityVCChange}
              onChange={(e) => setSensitivityVCChange(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={sensitivityVCChange}
            onChange={(e) => setSensitivityVCChange(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{sensitivityVCChange}%</span>
          </div>
          <div>
            <label className="block text-base font-medium">Δ Custos Fixos (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={sensitivityFCChange}
              onChange={(e) => setSensitivityFCChange(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={sensitivityFCChange}
            onChange={(e) => setSensitivityFCChange(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{sensitivityFCChange}%</span>
          </div>
          <div>
            <label className="block text-base font-medium">Δ Volume Vendas (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={sensitivityVolumeChange}
              onChange={(e) => setSensitivityVolumeChange(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={sensitivityVolumeChange}
            onChange={(e) => setSensitivityVolumeChange(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{sensitivityVolumeChange}%</span>
          </div>
        </div>
        <p className="text-lg font-semibold mt-2">
          Novo Lucro: €{' '}
          <span className={newProfitS >= 0 ? 'text-green-600' : 'text-red-600'}>
            {newProfitS.toFixed(2)}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Variação do Lucro: €{' '}
          <span className={profitChangeS >= 0 ? 'text-green-600' : 'text-red-600'}>
            {profitChangeS.toFixed(2)}
          </span>
        </p>
      </div>

      {/* --- existing: Análise de Sensibilidade (original) --- */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Análise de Sensibilidade do Lucro (original)</h2>
        <p className="mb-2">
          Veja como alterações percentuais no preço, custo variável e custos fixos afetam o lucro
          operacional.
        </p>
        <p className="mb-4 font-mono">
          Novo Lucro = (Novo Preço - Novo CV) × Quantidade - Novos Custos Fixos
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-base font-medium">Variação Preço (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={priceChangePct}
              onChange={(e) => setPriceChangePct(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={priceChangePct}
            onChange={(e) => setPriceChangePct(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{priceChangePct}%</span>
          </div>
          <div>
            <label className="block text-base font-medium">Variação CV (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={varCostChangePct}
              onChange={(e) => setVarCostChangePct(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={varCostChangePct}
            onChange={(e) => setVarCostChangePct(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{varCostChangePct}%</span>
          </div>
          <div>
            <label className="block text-base font-medium">Variação CF (%)</label>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={fixedCostChangePct}
              onChange={(e) => setFixedCostChangePct(Number(e.target.value))}
              className="w-full md:hidden"
            />
          {/* Desktop input */}
          <input
            type="number"
            min="-50"
            max="50"
            step="1"
            value={fixedCostChangePct}
            onChange={(e) => setFixedCostChangePct(Number(e.target.value))}
            className="hidden md:block w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-base bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
            <span>{fixedCostChangePct}%</span>
          </div>
        </div>
        <p className="text-lg font-semibold mt-2">
          Novo Lucro: €{' '}
          <span className={newProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
            {newProfit.toFixed(2)}
          </span>
        </p>
        <p className="text-lg font-semibold">
          Variação do Lucro: €{' '}
          <span className={profitChange >= 0 ? 'text-green-600' : 'text-red-600'}>
            {profitChange.toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Ch4CostVolumeProfit;
