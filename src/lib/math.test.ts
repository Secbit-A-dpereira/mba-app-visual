import { describe, it, expect } from 'vitest';
import { calcCVP } from './math';

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
