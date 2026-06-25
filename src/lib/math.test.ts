import { describe, it, expect } from 'vitest';
import { calcCVP, calcFinancialRatios } from './math';

describe('calcCVP', () => {
  it('calculates CVP correctly for normal cases', () => {
    const result = calcCVP({
      sellingPrice: 100,
      variableCost: 60,
      fixedCost: 2000,
    });

    // contributionMargin = 100 - 60 = 40
    // breakEvenUnits = 2000 / 40 = 50
    // breakEvenRevenue = 50 * 100 = 5000
    expect(result.contributionMargin).toBe(40);
    expect(result.breakEvenUnits).toBe(50);
    expect(result.breakEvenRevenue).toBe(5000);
    expect(result.marginOfSafety).toBe(0.25);
  });

  it('handles edge case where sellingPrice equals variableCost', () => {
    const result = calcCVP({
      sellingPrice: 100,
      variableCost: 100,
      fixedCost: 2000,
    });

    // contributionMargin = 100 - 100 = 0
    // breakEvenUnits = 2000 / 0 = Infinity
    // breakEvenRevenue = Infinity * 100 = Infinity
    expect(result.contributionMargin).toBe(0);
    expect(result.breakEvenUnits).toBe(Infinity);
    expect(result.breakEvenRevenue).toBe(Infinity);
    expect(result.marginOfSafety).toBe(0.25);
  });
});

describe('calcFinancialRatios', () => {
  it('should calculate ratios correctly for standard inputs', () => {
    const stmt = {
      revenue: 100000,
      cogs: 40000,
      operatingExpenses: 20000,
      depreciation: 10000,
      interest: 5000,
      taxes: 5000,
      sharesOutstanding: 10000
    };

    const ratios = calcFinancialRatios(stmt);

    expect(ratios.grossMargin).toBe(0.6); // (100000 - 40000) / 100000 = 0.6
    expect(ratios.operatingMargin).toBe(0.3); // (60000 - 20000 - 10000) / 100000 = 0.3
    expect(ratios.netMargin).toBe(0.2); // (30000 - 5000 - 5000) / 100000 = 0.2
    expect(ratios.currentRatio).toBe(2.0); // hardcoded
    expect(ratios.debtToEquity).toBe(0.5); // hardcoded
    expect(ratios.eps).toBe(2); // 20000 / 10000 = 2
    expect(ratios.roe).toBe(0.4); // 20000 / (100000 * 0.5) = 0.4
  });

  it('should handle zero revenue without throwing', () => {
    const stmt = {
      revenue: 0,
      cogs: 0,
      operatingExpenses: 10000,
      depreciation: 5000,
      interest: 2000,
      taxes: 0,
      sharesOutstanding: 10000
    };

    const ratios = calcFinancialRatios(stmt);

    expect(Number.isNaN(ratios.grossMargin)).toBe(true); // 0 / 0 = NaN
    expect(ratios.operatingMargin).toBe(-Infinity); // -15000 / 0 = -Infinity
    expect(ratios.netMargin).toBe(-Infinity); // -17000 / 0 = -Infinity
    expect(ratios.currentRatio).toBe(2.0);
    expect(ratios.debtToEquity).toBe(0.5);
    expect(ratios.eps).toBe(-1.7); // -17000 / 10000 = -1.7
    expect(ratios.roe).toBe(Infinity); // safeDivide returns Infinity if denominator is 0
  });

  it('should handle zero shares outstanding without throwing', () => {
    const stmt = {
      revenue: 100000,
      cogs: 40000,
      operatingExpenses: 20000,
      depreciation: 10000,
      interest: 5000,
      taxes: 5000,
      sharesOutstanding: 0
    };

    const ratios = calcFinancialRatios(stmt);

    expect(ratios.grossMargin).toBe(0.6);
    expect(ratios.eps).toBe(Infinity); // safeDivide returns Infinity if denominator is 0
  });
});
