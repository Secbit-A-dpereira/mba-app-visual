"use client";
import { useState } from "react";

export default function Ch5BusinessFinance() {
  // NPV state
  const [npvInitialInvestment, setNpvInitialInvestment] = useState(100000);
  const [npvDiscountRate, setNpvDiscountRate] = useState(10);
  const [npvCashFlows, setNpvCashFlows] = useState("30000,40000,50000,60000,70000");
  const npvResult = (() => {
    const flows = npvCashFlows.split(",").map(Number);
    if (flows.some(isNaN)) return null;
    let npv = -npvInitialInvestment;
    const rate = npvDiscountRate / 100;
    flows.forEach((cf, i) => {
      npv += cf / Math.pow(1 + rate, i + 1);
    });
    return npv.toFixed(2);
  })();

  // WACC state
  const [waccEquity, setWaccEquity] = useState(500000);
  const [waccDebt, setWaccDebt] = useState(300000);
  const [waccCostEquity, setWaccCostEquity] = useState(12);
  const [waccCostDebt, setWaccCostDebt] = useState(6);
  const [waccTaxRate, setWaccTaxRate] = useState(21);
  const waccResult = (() => {
    const E = waccEquity;
    const D = waccDebt;
    const V = E + D;
    if (V === 0) return null;
    const Re = waccCostEquity / 100;
    const Rd = waccCostDebt / 100;
    const T = waccTaxRate / 100;
    const wacc = (E / V) * Re + (D / V) * Rd * (1 - T);
    return (wacc * 100).toFixed(2) + "%";
  })();

  // CAPM state
  const [capmRiskFree, setCapmRiskFree] = useState(3);
  const [capmBeta, setCapmBeta] = useState(1.2);
  const [capmMarketReturn, setCapmMarketReturn] = useState(10);
  const capmResult = (() => {
    const Rf = capmRiskFree / 100;
    const B = capmBeta;
    const Rm = capmMarketReturn / 100;
    const Re = Rf + B * (Rm - Rf);
    return (Re * 100).toFixed(2) + "%";
  })();

  // DFL state
  const [dflEBIT, setDflEBIT] = useState(50000);
  const [dflInterest, setDflInterest] = useState(10000);
  const dflResult = (() => {
    const EBIT = dflEBIT;
    const I = dflInterest;
    if (EBIT - I === 0) return "Infinity";
    const dfl = EBIT / (EBIT - I);
    return dfl.toFixed(2);
  })();

  // Breakeven state
  const [beFixedCosts, setBeFixedCosts] = useState(10000);
  const [bePrice, setBePrice] = useState(50);
  const [beVariableCost, setBeVariableCost] = useState(30);
  const beResult = (() => {
    const FC = beFixedCosts;
    const P = bePrice;
    const VC = beVariableCost;
    if (P - VC === 0) return "Price equals variable cost";
    const beQ = FC / (P - VC);
    return beQ.toFixed(0) + " units";
  })();

  const inputClass =
    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Business Finance – Chapter 5</h1>

      {/* NPV Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Net Present Value (NPV)</h2>
        <p className="text-gray-700 mb-2">
          NPV calculates the difference between the present value of cash inflows and outflows.
        </p>
        <p className="text-gray-700 mb-4 font-mono">
          Formula: NPV = &ndash;C₀ + Σ (CFᵢ / (1+r)ⁱ)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Investment (C₀)
            </label>
            <input
              type="number"
              value={npvInitialInvestment}
              onChange={(e) => setNpvInitialInvestment(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount Rate (%)
            </label>
            <input
              type="number"
              value={npvDiscountRate}
              onChange={(e) => setNpvDiscountRate(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cash Flows (comma separated)
            </label>
            <input
              type="text"
              value={npvCashFlows}
              onChange={(e) => setNpvCashFlows(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        {npvResult !== null ? (
          <p className="text-lg font-bold">NPV = ${npvResult}</p>
        ) : (
          <p className="text-red-500">Invalid cash flows</p>
        )}
      </div>

      {/* WACC Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">
          Weighted Average Cost of Capital (WACC)
        </h2>
        <p className="text-gray-700 mb-2">
          WACC represents the average cost of capital from all sources (equity and debt).
        </p>
        <p className="text-gray-700 mb-4 font-mono">
          Formula: WACC = (E/V)×Re + (D/V)×Rd×(1&ndash;Tc)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Market Value of Equity (E)
            </label>
            <input
              type="number"
              value={waccEquity}
              onChange={(e) => setWaccEquity(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Market Value of Debt (D)
            </label>
            <input
              type="number"
              value={waccDebt}
              onChange={(e) => setWaccDebt(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost of Equity (Re) %
            </label>
            <input
              type="number"
              value={waccCostEquity}
              onChange={(e) => setWaccCostEquity(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cost of Debt (Rd) %
            </label>
            <input
              type="number"
              value={waccCostDebt}
              onChange={(e) => setWaccCostDebt(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tax Rate (Tc) %
            </label>
            <input
              type="number"
              value={waccTaxRate}
              onChange={(e) => setWaccTaxRate(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        {waccResult !== null ? (
          <p className="text-lg font-bold">WACC = {waccResult}</p>
        ) : (
          <p className="text-red-500">Total capital cannot be zero</p>
        )}
      </div>

      {/* CAPM Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">
          Capital Asset Pricing Model (CAPM)
        </h2>
        <p className="text-gray-700 mb-2">
          CAPM describes the relationship between systematic risk and expected return.
        </p>
        <p className="text-gray-700 mb-4 font-mono">
          Formula: E(Ri) = Rf + β×(Rm &ndash; Rf)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Risk‑free Rate (Rf) %
            </label>
            <input
              type="number"
              value={capmRiskFree}
              onChange={(e) => setCapmRiskFree(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Beta (β)
            </label>
            <input
              type="number"
              step="0.01"
              value={capmBeta}
              onChange={(e) => setCapmBeta(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Market Return (Rm) %
            </label>
            <input
              type="number"
              value={capmMarketReturn}
              onChange={(e) => setCapmMarketReturn(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-lg font-bold">Expected Return = {capmResult}</p>
      </div>

      {/* DFL Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">
          Degree of Financial Leverage (DFL)
        </h2>
        <p className="text-gray-700 mb-2">
          DFL measures the sensitivity of earnings per share to changes in EBIT.
        </p>
        <p className="text-gray-700 mb-4 font-mono">
          Formula: DFL = EBIT / (EBIT &ndash; Interest)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              EBIT (Earnings before interest and tax)
            </label>
            <input
              type="number"
              value={dflEBIT}
              onChange={(e) => setDflEBIT(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Interest Expense
            </label>
            <input
              type="number"
              value={dflInterest}
              onChange={(e) => setDflInterest(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-lg font-bold">DFL = {dflResult}</p>
      </div>

      {/* Breakeven Analysis Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Breakeven Analysis</h2>
        <p className="text-gray-700 mb-2">
          Breakeven point is the number of units that must be sold to cover total costs.
        </p>
        <p className="text-gray-700 mb-4 font-mono">
          Formula: BE = Fixed Costs / (Price &ndash; Variable Cost per unit)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fixed Costs
            </label>
            <input
              type="number"
              value={beFixedCosts}
              onChange={(e) => setBeFixedCosts(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price per Unit
            </label>
            <input
              type="number"
              value={bePrice}
              onChange={(e) => setBePrice(Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Variable Cost per Unit
            </label>
            <input
              type="number"
              value={beVariableCost}
              onChange={(e) => setBeVariableCost(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-lg font-bold">Breakeven Quantity = {beResult}</p>
      </div>
    </div>
  );
}
